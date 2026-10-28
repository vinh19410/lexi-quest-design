import { useCallback, useEffect, useRef, useState } from 'react'
import { Swords, Shield, Zap, Flame, Timer, Radar, Trophy, Coins, Skull, Hammer, RotateCcw, Home as HomeIcon, Brain, CheckCircle2, XCircle, Bird, Users, Castle } from 'lucide-react'
import { useGame, type BattleMode } from '../game/store'
import { CLASSES, MODULES, QUESTION_SETS, ROUND_META, WORDS, rankLabel, type ClassId, type SetId } from '../game/data'
import { Bar, HeroAvatar, Modal, Pill, cx } from '../components/ui'
import { GrammarPanel, ListeningPanel, UltimatePanel, VocabPanel } from './battle/RoundPanels'

type Phase = 'lobby' | 'searching' | 'matched' | 'intro' | 'question' | 'resolve' | 'result'

interface Fighter {
  hp: number
  maxHp: number
  shield: number
  mana: number
  combo: number
}

interface Fx {
  id: number
  side: 'me' | 'opp'
  text: string
  color: string
  big?: boolean
}

interface Config {
  mode: BattleMode
  setId: SetId
  opponent: string
  oppCls: ClassId
  oppTitle: string
  stage?: number
  oppHp: number
  oppAccuracy: number
}

const BASE_TIME = 10
const ULT_TIME = 16

function buildConfig(mode: BattleMode, setId: SetId, opponent?: string, stage?: number): Config {
  if (mode === 'pve') {
    const m = MODULES.find((x) => x.id === setId)!
    const boss = stage === 3
    return {
      mode,
      setId,
      stage,
      opponent: boss ? m.boss : m.stages[stage ?? 0],
      oppTitle: boss ? `Boss Tầng ${m.floor}` : `Tầng ${m.floor} · Ải ${(stage ?? 0) + 1}`,
      oppCls: 'grammarian',
      oppHp: boss ? 600 : 420,
      oppAccuracy: boss ? 0.75 : 0.55,
    }
  }
  if (mode === 'friend') {
    return { mode, setId, opponent: opponent ?? 'BanThan_Lan', oppTitle: 'Phòng 4829 · Giao hữu', oppCls: 'arcane', oppHp: 500, oppAccuracy: 0.65 }
  }
  return { mode, setId, opponent: 'MinhTuan_99', oppTitle: 'Shadow Ghost · Gold II', oppCls: 'wordsmith', oppHp: 500, oppAccuracy: 0.7 }
}

export default function Battle() {
  const g = useGame()
  const req = g.battleRequest
  const [phase, setPhase] = useState<Phase>('lobby')
  const [cfg, setCfg] = useState<Config>(() => buildConfig('ranked', 'ranked'))
  const [round, setRound] = useState(0)
  const [me, setMe] = useState<Fighter>({ hp: g.stats.hp, maxHp: g.stats.hp, shield: 0, mana: 0, combo: 0 })
  const [opp, setOpp] = useState<Fighter>({ hp: 500, maxHp: 500, shield: 0, mana: 0, combo: 0 })
  const [elapsed, setElapsed] = useState(0)
  const [chosen, setChosen] = useState<number | null>(null)
  const [oppStatus, setOppStatus] = useState<{ state: 'idle' | 'thinking' | 'answered' | 'timeout'; time?: number }>({ state: 'idle' })
  const [fx, setFx] = useState<Fx[]>([])
  const [hit, setHit] = useState<{ side: 'me' | 'opp'; slash: boolean; n: number } | null>(null)
  const [eliminated, setEliminated] = useState<number[]>([])
  const [log, setLog] = useState<{ round: number; ok: boolean; text: string }[]>([])
  const [result, setResult] = useState<{ win: boolean; rp: number; gold: number; xp: number; missed: string[] } | null>(null)
  const [searchT, setSearchT] = useState(0)

  const meRef = useRef(me)
  const oppRef = useRef(opp)
  const startRef = useRef(0)
  const limitRef = useRef(BASE_TIME * 1000)
  const answeredRef = useRef(false)
  const oppPlan = useRef({ time: 4000, correct: true })
  const missedRef = useRef<string[]>([])
  const maxComboRef = useRef(0)
  const comboSavedRef = useRef(false)
  const timers = useRef<number[]>([])
  const fxId = useRef(0)

  const questions = QUESTION_SETS[cfg.setId]
  const q = questions[round]
  const meta = ROUND_META[q.type]
  const clsInfo = CLASSES.find((c) => c.id === g.cls)!

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }
  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }
  useEffect(() => clearTimers, [])

  const updMe = (fn: (f: Fighter) => Fighter) => {
    meRef.current = fn(meRef.current)
    setMe(meRef.current)
  }
  const updOpp = (fn: (f: Fighter) => Fighter) => {
    oppRef.current = fn(oppRef.current)
    setOpp(oppRef.current)
  }
  const pushFx = (side: 'me' | 'opp', text: string, color: string, big = false) => {
    const id = ++fxId.current
    setFx((f) => [...f, { id, side, text, color, big }])
    later(() => setFx((f) => f.filter((x) => x.id !== id)), 1400)
  }
  const doHit = (side: 'me' | 'opp', slash = false) => setHit({ side, slash, n: Date.now() })

  // ---------- Flow ----------

  const resetFighters = (c: Config) => {
    const s = g.stats
    const startMana = g.equipped.accessory === 'ring-ipa' ? 20 : 0
    meRef.current = { hp: s.hp, maxHp: s.hp, shield: 0, mana: startMana, combo: 0 }
    oppRef.current = { hp: c.oppHp, maxHp: c.oppHp, shield: 0, mana: 0, combo: 0 }
    setMe(meRef.current)
    setOpp(oppRef.current)
    missedRef.current = []
    maxComboRef.current = 0
    comboSavedRef.current = false
    setLog([])
    setResult(null)
    setRound(0)
    setFx([])
    setOppStatus({ state: 'idle' })
  }

  const launch = useCallback(
    (mode: BattleMode, setId: SetId, opponent?: string, stage?: number) => {
      clearTimers()
      const c = buildConfig(mode, setId, opponent, stage)
      setCfg(c)
      resetFighters(c)
      setSearchT(0)
      if (mode === 'pve') {
        setPhase('matched')
        later(() => beginRound(0, c), 1800)
      } else {
        setPhase('searching')
        later(() => setPhase('matched'), mode === 'friend' ? 1500 : 2200)
        later(() => beginRound(0, c), mode === 'friend' ? 3200 : 4200)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [g.stats, g.equipped],
  )

  // Start whenever a new battle request arrives (from Home, Tower, or room modal).
  useEffect(() => {
    if (req) {
      launch(req.mode, req.setId, req.opponent, req.stage)
      g.clearBattleRequest()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [req?.nonce])

  // Searching radar counter
  useEffect(() => {
    if (phase !== 'searching') return
    const t0 = Date.now()
    const i = setInterval(() => setSearchT((Date.now() - t0) / 1000), 100)
    return () => clearInterval(i)
  }, [phase])

  const beginRound = (i: number, c: Config = cfg) => {
    const qq = QUESTION_SETS[c.setId][i]
    setRound(i)
    setChosen(null)
    setEliminated([])
    answeredRef.current = false
    setPhase('intro')
    if (qq.type === 'ultimate') updMe((f) => ({ ...f, mana: 100 }))
    later(() => {
      let limit = (qq.type === 'ultimate' ? ULT_TIME : BASE_TIME) + g.stats.time
      if (qq.type === 'grammar' && g.equipped.accessory === 'hourglass-scholar') limit += 1.5
      limitRef.current = limit * 1000
      const lowHp = meRef.current.hp / meRef.current.maxHp < 0.3
      if (lowHp && g.equipped.pet === 'pet-owl' && qq.options) {
        const wrong = qq.options.map((_, k) => k).filter((k) => k !== qq.answer)
        setEliminated(wrong.sort(() => Math.random() - 0.5).slice(0, 2))
        pushFx('me', 'Cú Tinh Anh: 50/50!', '#F59E0B')
      }
      oppPlan.current = {
        time: 1800 + Math.random() * (qq.type === 'ultimate' ? 9000 : 6000),
        correct: Math.random() < c.oppAccuracy,
      }
      setOppStatus({ state: 'thinking' })
      startRef.current = Date.now()
      setElapsed(0)
      setPhase('question')
    }, 1500)
  }

  const submitRef = useRef<(r: { correct: boolean; choice?: number; quality?: number; method?: string }) => void>(() => {})

  // Countdown + simulated opponent
  useEffect(() => {
    if (phase !== 'question') return
    const i = setInterval(() => {
      const el = Date.now() - startRef.current
      setElapsed(el)
      if (el >= oppPlan.current.time) setOppStatus((s) => (s.state === 'thinking' ? { state: 'answered', time: oppPlan.current.time } : s))
      if (el >= limitRef.current) submitRef.current({ correct: false })
    }, 50)
    return () => clearInterval(i)
  }, [phase])

  submitRef.current = ({ correct, choice, quality = 1, method }) => {
    if (answeredRef.current) return
    answeredRef.current = true
    const el = Math.min(Date.now() - startRef.current, limitRef.current)
    const remaining = Math.max(0, 1 - el / limitRef.current)
    const speedMult = 1 + 0.3 * remaining
    const s = g.stats
    const qq = q
    if (choice !== undefined) setChosen(choice)
    setPhase('resolve')
    setElapsed(el)

    const secs = (el / 1000).toFixed(1)
    const timedOut = el >= limitRef.current
    const slow = el > (qq.type === 'ultimate' ? 11000 : 6000)
    if ((!correct || slow) && !missedRef.current.includes(qq.wordKey)) missedRef.current.push(qq.wordKey)

    // --- Player effect ---
    if (correct) {
      const combo = meRef.current.combo + 1
      maxComboRef.current = Math.max(maxComboRef.current, combo)
      let manaGain = 30
      if (qq.type === 'listening' && g.cls === 'arcane') manaGain = Math.round(manaGain * 1.35)
      updMe((f) => ({ ...f, combo, mana: Math.min(100, f.mana + manaGain) }))

      if (qq.type === 'vocab' || qq.type === 'listening' || qq.type === 'ultimate') {
        const fast = el < 3000
        let dmg = 0
        let label = ''
        let crit = false
        if (qq.type === 'vocab') {
          crit = fast || Math.random() * 100 < s.crit
          dmg = (40 + s.atk * 0.5) * speedMult
          if (g.cls === 'wordsmith' && fast) dmg *= 1.2
          if (crit) dmg *= 1.25
          if (qq.phrasal && g.equipped.weapon === 'sword-phrasal') dmg *= 1.25
          dmg *= 0.92 // opponent armor
          label = crit ? `CRIT DAMAGE -${Math.round(dmg)} HP!` : `-${Math.round(dmg)} HP`
        } else if (qq.type === 'listening') {
          dmg = (70 + s.atk * 0.45) * speedMult
          if (g.equipped.weapon === 'bow-collocation') dmg *= 1.2
          label = `XUYÊN GIÁP -${Math.round(dmg)} HP!`
        } else {
          dmg = (175 + s.atk * 0.38) * quality
          label = `ULTIMATE -${Math.round(dmg)} HP!`
        }
        dmg = Math.round(dmg)
        later(() => {
          updOpp((f) => ({ ...f, hp: Math.max(0, f.hp - dmg) }))
          doHit('opp', true)
          pushFx('opp', label, qq.type === 'ultimate' ? '#8B5CF6' : qq.type === 'listening' ? '#06B6D4' : '#F43F5E', crit || qq.type === 'ultimate')
        }, 150)
        setLog((l) => [...l, { round: round + 1, ok: true, text: `${method === 'mic' ? `Niệm chú ${Math.round(quality * 100)}%` : `Đúng trong ${secs}s`} → gây ${dmg} sát thương${crit ? ' (CRIT)' : ''}` }])
      } else {
        let shield = Math.round(80 + s.def * 0.3)
        if (g.equipped.armor === 'plate-conditional') shield = Math.round(shield * 1.25)
        let counter = Math.round(30 + s.def * 0.4)
        if (g.equipped.weapon === 'staff-perfect') counter += 30
        updMe((f) => ({ ...f, shield: f.shield + shield }))
        pushFx('me', `+${shield} Shield`, '#10B981', true)
        later(() => {
          updOpp((f) => ({ ...f, hp: Math.max(0, f.hp - counter) }))
          doHit('opp')
          pushFx('opp', `Phản đòn -${counter}`, '#10B981')
        }, 350)
        setLog((l) => [...l, { round: round + 1, ok: true, text: `Đúng trong ${secs}s → +${shield} Khiên, phản đòn ${counter}` }])
      }
      if (g.cls === 'grammarian' && combo === 3) {
        later(() => {
          updMe((f) => ({ ...f, shield: f.shield + 60 }))
          pushFx('me', 'Kết Giới +60 Shield', '#10B981')
        }, 500)
      }
    } else {
      const keep = g.equipped.armor === 'shield-steadfast' && !comboSavedRef.current && meRef.current.combo > 0
      if (keep) {
        comboSavedRef.current = true
        pushFx('me', 'Khiên Bất Khuất giữ Combo!', '#F59E0B')
      }
      updMe((f) => ({ ...f, combo: keep ? f.combo : 0, mana: Math.min(100, f.mana + 10) }))
      pushFx('me', timedOut ? 'HẾT GIỜ!' : 'TRƯỢT!', '#94A3B8')
      setLog((l) => [...l, { round: round + 1, ok: false, text: `${timedOut ? 'Hết giờ' : 'Sai'} — "${WORDS[qq.wordKey].word}" thành Cổ Ngữ Bị Nguyền` }])
    }

    // --- Opponent effect ---
    later(() => {
      const plan = oppPlan.current
      const oppTimedOut = plan.time > limitRef.current
      setOppStatus(oppTimedOut ? { state: 'timeout' } : { state: 'answered', time: plan.time })
      if (oppRef.current.hp <= 0) return
      if (plan.correct && !oppTimedOut) {
        let dmg = Math.round(qq.type === 'ultimate' ? 130 + Math.random() * 40 : 80 + Math.random() * 45)
        dmg = Math.round(dmg * (1 - Math.min(0.25, s.def / 600)))
        const absorbed = Math.min(meRef.current.shield, dmg)
        const through = dmg - absorbed
        updMe((f) => ({ ...f, shield: f.shield - absorbed, hp: Math.max(0, f.hp - through) }))
        if (through > 0) doHit('me', qq.type === 'ultimate')
        pushFx('me', absorbed > 0 ? (through === 0 ? `CHẶN ${absorbed}!` : `-${through} HP (chặn ${absorbed})`) : `-${through} HP`, absorbed > 0 && through === 0 ? '#10B981' : '#F43F5E', true)
        updOpp((f) => ({ ...f, combo: f.combo + 1 }))
      } else {
        pushFx('opp', oppTimedOut ? 'Đối thủ hết giờ' : 'Đối thủ trả lời sai!', '#94A3B8')
        updOpp((f) => ({ ...f, combo: 0 }))
      }
    }, 1100)

    // --- Next ---
    later(() => {
      const over = meRef.current.hp <= 0 || oppRef.current.hp <= 0 || round >= questions.length - 1
      if (over) finish()
      else beginRound(round + 1)
    }, 2900)
  }

  const finish = () => {
    const m = meRef.current
    const o = oppRef.current
    const win = o.hp <= 0 ? true : m.hp <= 0 ? false : m.hp / m.maxHp >= o.hp / o.maxHp
    const rp = cfg.mode === 'ranked' ? (win ? 28 : -14) : 0
    const gold = win ? (cfg.mode === 'pve' && cfg.stage === 3 ? 250 : 120) : 40
    const xp = win ? 180 : 60
    const missed = [...missedRef.current]
    setResult({ win, rp, gold, xp, missed })
    setPhase('result')
    setOppStatus({ state: 'idle' })
    g.finishBattle({ win, mode: cfg.mode, setId: cfg.setId, stage: cfg.stage, rp, gold, xp, missed, maxCombo: maxComboRef.current })
  }

  const answerChoice = useCallback((i: number) => submitRef.current({ correct: i === q.answer, choice: i }), [q])

  // ---------- Render ----------

  const inFight = phase === 'intro' || phase === 'question' || phase === 'resolve' || phase === 'result'
  const limit = limitRef.current
  const timeLeft = phase === 'question' || phase === 'resolve' ? Math.max(0, limit - elapsed) : phase === 'intro' ? limit : 0
  const speedMult = phase === 'question' ? 1 + 0.3 * (timeLeft / limit) : 1
  const rank = rankLabel(g.rp)

  if (phase === 'lobby') return <Lobby onRanked={() => g.startBattle({ mode: 'ranked', setId: 'ranked' })} />

  return (
    <div className="flex flex-col gap-4">
      {/* Arena split view */}
      <section className="card relative overflow-hidden p-4 sm:p-5">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent_60%)]" />
        <div className="relative grid grid-cols-[1fr_auto_1fr] items-start gap-3 sm:gap-6">
          <FighterCard
            side="me"
            name="@LexiHero"
            title={`${clsInfo.name} · ${rank.label}`}
            cls={g.cls}
            f={me}
            fx={fx}
            hit={hit}
            showMana
          />

          {/* Center HUD */}
          <div className="flex w-24 flex-col items-center gap-2 pt-2 sm:w-44">
            <div className="font-display text-[11px] font-semibold tracking-[0.2em] text-slate-500 uppercase">
              Hiệp {round + 1}/{questions.length}
            </div>
            <div className="flex gap-1">
              {questions.map((qq, i) => (
                <span
                  key={i}
                  className={cx('h-1.5 w-4 rounded-full sm:w-7', i < round || (i === round && phase === 'result') ? 'opacity-90' : i === round ? 'animate-pulse' : 'opacity-20')}
                  style={{ background: ROUND_META[qq.type].color }}
                />
              ))}
            </div>
            <div className={cx('font-display text-3xl font-bold tabular-nums sm:text-4xl', timeLeft < 3000 && phase === 'question' ? 'text-coral' : 'text-white')}>
              {(timeLeft / 1000).toFixed(1)}
              <span className="text-base text-slate-500">s</span>
            </div>
            <Bar value={timeLeft} max={limit} color={timeLeft < 3000 ? '#F43F5E' : '#06B6D4'} height={6} className="w-full" />
            <div className="flex items-center gap-1 rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 font-display text-[11px] font-bold text-gold">
              <Zap size={11} /> x{speedMult.toFixed(2)} <span className="hidden sm:inline">TỐC ĐỘ</span>
            </div>
            <div className="font-display text-xl font-bold text-slate-600 sm:text-2xl">VS</div>
          </div>

          <FighterCard
            side="opp"
            name={phase === 'searching' ? '???' : `@${cfg.opponent}`}
            title={phase === 'searching' ? 'Đang dò tìm...' : cfg.oppTitle}
            cls={cfg.oppCls}
            ghost={cfg.mode === 'ranked'}
            color={cfg.mode === 'pve' ? MODULES.find((m) => m.id === cfg.setId)?.color : undefined}
            f={opp}
            fx={fx}
            hit={hit}
            status={oppStatus}
          />
        </div>
      </section>

      {/* Question area */}
      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <section className="card relative min-h-[320px] overflow-hidden p-5 sm:p-6" style={{ borderColor: inFight ? `${meta.color}55` : undefined }}>
          {inFight && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Pill color={meta.color}>
                {q.type === 'vocab' ? <Swords size={11} /> : q.type === 'grammar' ? <Shield size={11} /> : q.type === 'listening' ? <Zap size={11} /> : <Flame size={11} />}
                Hiệp {round + 1} · {meta.tag}
              </Pill>
              <span className="font-display text-sm font-bold text-white">{meta.title}</span>
              <span className="text-xs text-slate-500">({meta.en})</span>
            </div>
          )}

          {phase === 'intro' && (
            <div className="flex h-56 flex-col items-center justify-center text-center">
              <div className="animate-pop font-display text-sm font-semibold tracking-[0.3em] text-slate-500 uppercase">Hiệp {round + 1}</div>
              <div className="animate-pop font-display text-3xl font-bold sm:text-4xl" style={{ color: meta.color }}>{meta.title}</div>
              {q.type === 'ultimate' && <div className="mt-3 animate-fade-up text-sm font-semibold text-violet">Mana đạt 100%! Chiêu cuối đã sẵn sàng</div>}
            </div>
          )}

          {(phase === 'question' || phase === 'resolve' || phase === 'result') && (
            <div key={round} className="animate-fade-up">
              {q.type === 'vocab' && <VocabPanel q={q} locked={phase !== 'question'} chosen={chosen} eliminated={eliminated} showHint={g.equipped.accessory === 'charm-latin'} onAnswer={answerChoice} />}
              {q.type === 'grammar' && <GrammarPanel q={q} locked={phase !== 'question'} chosen={chosen} eliminated={eliminated} showHint={false} onAnswer={answerChoice} />}
              {q.type === 'listening' && <ListeningPanel q={q} locked={phase !== 'question'} chosen={chosen} eliminated={eliminated} showHint={false} onAnswer={answerChoice} />}
              {q.type === 'ultimate' && (
                <UltimatePanel q={q} locked={phase !== 'question'} prefill={g.equipped.pet === 'pet-cat'} onDone={(quality, method) => submitRef.current({ correct: true, quality, method })} />
              )}
              {phase === 'resolve' && q.type !== 'grammar' && (
                <div className="mt-4 animate-fade-up rounded-xl border border-line bg-slate-950/40 px-4 py-2.5 text-xs text-slate-400">
                  <span className="font-semibold text-slate-200">{WORDS[q.wordKey].word}</span> {WORDS[q.wordKey].ipa} — {q.explain}
                </div>
              )}
            </div>
          )}

          {(phase === 'searching' || phase === 'matched') && <Matchmaking phase={phase} cfg={cfg} t={searchT} rank={rank.label} />}
        </section>

        <aside className="card flex flex-col p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Nhật ký trận đấu</span>
            {me.combo >= 2 && (
              <span key={me.combo} className="animate-pop rounded-md bg-gold px-2 py-0.5 font-display text-xs font-bold text-slate-950">x{me.combo} COMBO!</span>
            )}
          </div>
          <ul className="flex flex-1 flex-col gap-2">
            {log.length === 0 && <li className="text-xs text-slate-600">Chưa có diễn biến. Trả lời càng nhanh, sát thương càng lớn!</li>}
            {log.map((l, i) => (
              <li key={i} className="flex animate-fade-up gap-2 text-xs">
                {l.ok ? <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald" /> : <XCircle size={14} className="mt-0.5 shrink-0 text-coral" />}
                <span className="text-slate-300">
                  <span className="font-display font-semibold text-slate-500">H{l.round} </span>
                  {l.text}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1.5 border-t border-line pt-3 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5"><Brain size={12} className="text-violet" /> Nội tại: {clsInfo.passive}</div>
            {g.equipped.pet === 'pet-owl' && <div className="flex items-center gap-1.5"><Bird size={12} className="text-gold" /> Cú Tinh Anh sẵn sàng (khi HP &lt; 30%)</div>}
          </div>
        </aside>
      </div>

      <ResultModal
        result={result}
        mode={cfg.mode}
        onForge={() => { g.setInvTab('forge'); g.go('inventory') }}
        onAgain={() => (cfg.mode === 'pve' ? g.go('tower') : g.startBattle({ mode: cfg.mode, setId: cfg.setId, opponent: cfg.mode === 'friend' ? cfg.opponent : undefined }))}
        onHome={() => g.go('home')}
      />
    </div>
  )
}

function FighterCard({
  side,
  name,
  title,
  cls,
  f,
  fx,
  hit,
  ghost,
  color,
  showMana,
  status,
}: {
  side: 'me' | 'opp'
  name: string
  title: string
  cls: ClassId
  f: Fighter
  fx: Fx[]
  hit: { side: 'me' | 'opp'; slash: boolean; n: number } | null
  ghost?: boolean
  color?: string
  showMana?: boolean
  status?: { state: string; time?: number }
}) {
  const isHit = hit?.side === side
  const right = side === 'opp'
  return (
    <div className={cx('flex min-w-0 flex-col gap-3', right && 'items-end text-right')}>
      <div className={cx('flex w-full flex-col gap-3 sm:flex-row sm:items-center', right ? 'items-end sm:flex-row-reverse' : 'items-start')}>
        <div key={isHit ? hit!.n : 'idle'} className={cx('relative', isHit && 'animate-shake')}>
          <HeroAvatar cls={cls} ghost={ghost} color={color} size={72} className={cx(ghost && 'opacity-80')} />
          {isHit && hit!.slash && (
            <svg viewBox="0 0 100 100" className="pointer-events-none absolute -inset-4 animate-slash">
              <path d="M10 85 L90 15" stroke="white" strokeWidth="5" strokeLinecap="round" />
              <path d="M18 92 L95 25" stroke="#F43F5E" strokeWidth="3" strokeLinecap="round" />
            </svg>
          )}
          {f.shield > 0 && <div className="pointer-events-none absolute -inset-2 rounded-full border-2 border-emerald/70 shadow-[0_0_20px_rgba(16,185,129,0.5)]" />}
          {fx
            .filter((x) => x.side === side)
            .map((x, i) => (
              <div
                key={x.id}
                className={cx('pointer-events-none absolute left-1/2 z-10 animate-rise font-display font-bold whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]', x.big ? 'text-lg sm:text-xl' : 'text-sm')}
                style={{ color: x.color, top: -8 - i * 22 }}
              >
                {x.text}
              </div>
            ))}
        </div>
        <div className="w-full min-w-0 sm:w-auto">
          <div className="truncate font-display text-sm font-bold text-white sm:text-base">{name}</div>
          <div className="truncate text-[11px] text-slate-400">{title}</div>
          {side === 'me' && f.combo >= 2 && (
            <span key={f.combo} className="mt-1 inline-block animate-pop rounded bg-gold/20 px-1.5 font-display text-[11px] font-bold text-gold">x{f.combo} COMBO!</span>
          )}
        </div>
      </div>

      <div className="w-full space-y-1.5">
        <div className={cx('flex items-center justify-between font-display text-[11px] font-semibold', right && 'flex-row-reverse')}>
          <span className="text-coral">HP</span>
          <span className="text-slate-200 tabular-nums">{f.hp}/{f.maxHp}</span>
        </div>
        <Bar value={f.hp} max={f.maxHp} color={f.hp / f.maxHp < 0.3 ? '#F43F5E' : f.hp / f.maxHp < 0.6 ? '#F59E0B' : '#10B981'} height={12} className={right ? '[&>div:first-child]:right-0 [&>div:first-child]:left-auto' : ''} />
        {f.shield > 0 && (
          <div className={cx('flex items-center gap-2', right && 'flex-row-reverse')}>
            <Shield size={11} className="text-emerald" />
            <Bar value={f.shield} max={200} color="#10B981" height={5} className="flex-1" />
            <span className="font-display text-[10px] text-emerald tabular-nums">{f.shield}</span>
          </div>
        )}
        {showMana && (
          <div className="flex items-center gap-2">
            <span className="font-display text-[10px] font-semibold text-violet">MANA</span>
            <Bar value={f.mana} max={100} color="#8B5CF6" height={5} className="flex-1" />
            <span className="font-display text-[10px] text-violet tabular-nums">{f.mana}/100</span>
          </div>
        )}
        {status && (
          <div className="flex min-h-5 flex-wrap items-center justify-end gap-1.5 text-right text-[11px]">
            {status.state === 'thinking' && (
              <>
                <span className="flex gap-0.5">
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: `${d * 0.15}s` }} />
                  ))}
                </span>
                <span className="text-slate-400">Đối thủ đang suy nghĩ...</span>
              </>
            )}
            {status.state === 'answered' && <span className="animate-pop font-semibold text-cyan">Đối thủ đã chọn đáp án ({((status.time ?? 0) / 1000).toFixed(1)}s)!</span>}
            {status.state === 'timeout' && <span className="text-slate-500">Đối thủ hết giờ</span>}
          </div>
        )}
      </div>
    </div>
  )
}

function Matchmaking({ phase, cfg, t, rank }: { phase: Phase; cfg: Config; t: number; rank: string }) {
  const Icon = cfg.mode === 'friend' ? Users : cfg.mode === 'pve' ? Castle : Radar
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
      {phase === 'searching' ? (
        <>
          <div className="relative h-36 w-36">
            {[0, 1, 2].map((i) => (
              <div key={i} className="absolute rounded-full border border-cyan/30" style={{ inset: i * 18 }} />
            ))}
            <div className="absolute inset-0 animate-radar rounded-full bg-[conic-gradient(from_0deg,rgba(6,182,212,0.5),transparent_30%)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon size={28} className="text-cyan" />
            </div>
            <span className="absolute top-6 right-8 h-2 w-2 animate-ping rounded-full bg-gold" />
          </div>
          <div className="mt-5 font-display text-lg font-bold text-white">
            {cfg.mode === 'friend' ? 'Đang chờ bạn bè vào phòng 4829...' : `Đang tìm đối thủ cùng bậc B1 / ${rank}...`}
          </div>
          <div className="mt-1 font-display text-sm text-slate-500 tabular-nums">{t.toFixed(1)}s</div>
        </>
      ) : (
        <div className="animate-pop">
          <Pill color={cfg.mode === 'pve' ? '#F59E0B' : '#06B6D4'} className="!px-3 !py-1 !text-xs">
            {cfg.mode === 'ranked' && <>Đã ghép với Shadow Ghost của @MinhTuan_99 (Gold II)</>}
            {cfg.mode === 'friend' && <>@{cfg.opponent} đã vào phòng!</>}
            {cfg.mode === 'pve' && <>{cfg.oppTitle}: {cfg.opponent}</>}
          </Pill>
          <div className="mt-6 font-display text-5xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo via-cyan to-coral">VS</div>
          <div className="mt-3 text-sm text-slate-400">
            {cfg.mode === 'ranked' ? 'Không có người chơi trực tuyến — đấu với bản ghi chiến thuật (Shadow Ghost).' : 'Chuẩn bị bước vào Hiệp 1...'}
          </div>
        </div>
      )}
    </div>
  )
}

function Lobby({ onRanked }: { onRanked: () => void }) {
  const g = useGame()
  return (
    <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
      <section className="card relative overflow-hidden p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-10 -bottom-10 opacity-10"><Swords size={260} /></div>
        <div className="font-display text-[11px] font-semibold tracking-[0.2em] text-slate-500 uppercase">Đấu Trường 1v1</div>
        <h1 className="mt-1 font-display text-3xl font-bold text-white">Sẵn sàng giao chiến?</h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-400">
          4 hiệp — mỗi hiệp một dạng câu hỏi. Trả lời đúng và nhanh để gây sát thương, dựng khiên, xuyên giáp và tung chiêu cuối. Từ sai hoặc chậm sẽ trở thành Cổ Ngữ Bị Nguyền.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(['vocab', 'grammar', 'listening', 'ultimate'] as const).map((t, i) => (
            <div key={t} className="rounded-xl border p-3" style={{ borderColor: `${ROUND_META[t].color}44`, background: `${ROUND_META[t].color}0d` }}>
              <div className="font-display text-[10px] font-bold" style={{ color: ROUND_META[t].color }}>HIỆP {i + 1} · {ROUND_META[t].tag}</div>
              <div className="mt-1 text-xs font-semibold text-slate-200">{ROUND_META[t].title}</div>
            </div>
          ))}
        </div>
        <button onClick={onRanked} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo to-cyan px-6 py-3.5 font-display text-base font-bold text-white shadow-[0_8px_30px_-8px_rgba(99,102,241,0.8)] transition hover:-translate-y-0.5">
          <Swords size={18} /> Tìm Trận
        </button>
      </section>
      <section className="card p-6">
        <div className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Chỉ số mang vào trận</div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {[
            { l: 'HP', v: g.stats.hp, c: '#F43F5E', i: Flame },
            { l: 'ATK', v: g.stats.atk, c: '#F59E0B', i: Swords },
            { l: 'DEF', v: g.stats.def, c: '#10B981', i: Shield },
            { l: 'Thời gian', v: `${BASE_TIME + g.stats.time}s`, c: '#06B6D4', i: Timer },
          ].map((s) => (
            <div key={s.l} className="rounded-xl border border-line bg-slate-950/40 p-3">
              <s.i size={16} style={{ color: s.c }} />
              <div className="mt-2 font-display text-2xl font-bold text-white">{s.v}</div>
              <div className="text-[11px] text-slate-500">{s.l}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function ResultModal({
  result,
  mode,
  onForge,
  onAgain,
  onHome,
}: {
  result: { win: boolean; rp: number; gold: number; xp: number; missed: string[] } | null
  mode: BattleMode
  onForge: () => void
  onAgain: () => void
  onHome: () => void
}) {
  if (!result) return null
  const color = result.win ? '#F59E0B' : '#F43F5E'
  return (
    <Modal open dismissable={false} className="max-w-lg overflow-hidden text-center">
      <div className="pointer-events-none absolute inset-x-0 -top-20 h-48 blur-3xl" style={{ background: `${color}33` }} />
      <div className="relative">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: `${color}22`, color }}>
          {result.win ? <Trophy size={32} /> : <Skull size={32} />}
        </div>
        <div className="mt-3 font-display text-sm font-bold tracking-[0.3em]" style={{ color }}>{result.win ? 'VICTORY' : 'DEFEAT'}</div>
        <h2 className="font-display text-4xl font-bold text-white">{result.win ? 'CHIẾN THẮNG!' : 'THẤT BẠI'}</h2>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-line bg-slate-950/50 p-3">
            <Trophy size={16} className="mx-auto text-cyan" />
            <div className={cx('mt-1 font-display text-xl font-bold', result.rp >= 0 ? 'text-cyan' : 'text-coral')}>
              {mode === 'ranked' ? `${result.rp > 0 ? '+' : ''}${result.rp}` : '—'}
            </div>
            <div className="text-[10px] text-slate-500">RP (Elo)</div>
          </div>
          <div className="rounded-xl border border-line bg-slate-950/50 p-3">
            <Coins size={16} className="mx-auto text-gold" />
            <div className="mt-1 font-display text-xl font-bold text-gold">+{result.gold}</div>
            <div className="text-[10px] text-slate-500">Vàng</div>
          </div>
          <div className="rounded-xl border border-line bg-slate-950/50 p-3">
            <Zap size={16} className="mx-auto text-indigo" />
            <div className="mt-1 font-display text-xl font-bold text-indigo">+{result.xp}</div>
            <div className="text-[10px] text-slate-500">XP</div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-violet/40 bg-violet/10 p-4 text-left">
          <div className="flex items-center gap-2 text-sm font-semibold text-violet">
            <Skull size={15} /> Cổ Ngữ Bị Nguyền thu được ({result.missed.length})
          </div>
          {result.missed.length ? (
            <>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {result.missed.map((k) => (
                  <span key={k} className="rounded-lg border border-violet/50 bg-slate-950/60 px-2 py-1 text-xs font-semibold text-slate-200">
                    {WORDS[k].word} <span className="font-normal text-slate-500">· {WORDS[k].vi}</span>
                  </span>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-slate-400">Từ trả lời sai hoặc chậm. Thanh tẩy chúng tại Lò Rèn để nhận Đá Cường Hóa.</p>
            </>
          ) : (
            <p className="mt-1 text-xs text-slate-400">Hoàn hảo! Không có từ nào bị nguyền trong trận này.</p>
          )}
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          {result.missed.length > 0 && (
            <button onClick={onForge} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet px-4 py-3 font-semibold text-white">
              <Hammer size={16} /> Đến Lò Rèn
            </button>
          )}
          <button onClick={onAgain} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo px-4 py-3 font-semibold text-white">
            <RotateCcw size={16} /> {mode === 'pve' ? 'Về Tháp' : 'Đấu tiếp'}
          </button>
          <button onClick={onHome} className="flex items-center justify-center gap-2 rounded-xl border border-line px-4 py-3 font-semibold text-slate-300 hover:bg-white/5">
            <HomeIcon size={16} /> Sảnh
          </button>
        </div>
      </div>
    </Modal>
  )
}
