import { useMemo, useState } from 'react'
import { Backpack, Hammer, Skull, Volume2, Gem, Sparkles, Check, X, RotateCcw, ArrowRight, Anvil, ShieldCheck } from 'lucide-react'
import { useGame } from '../game/store'
import { CLASSES, RARITY, SLOT_LABEL, WORDS, itemStats, speak, type Item, type Slot, type Stats } from '../game/data'
import { HeroAvatar, ItemIcon, Pill, StatPanel, cx, statLine } from '../components/ui'

export default function Inventory() {
  const g = useGame()
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="font-display text-[11px] font-semibold tracking-[0.2em] text-slate-500 uppercase">Kho Đồ & Lò Rèn Phục Thù</div>
          <h1 className="font-display text-2xl font-bold text-white">{g.invTab === 'gear' ? 'Trang Bị & Nội Tại Ngôn Ngữ' : 'Lò Rèn Từ Vựng — Học Từ Sai Để Đập Đồ'}</h1>
        </div>
        <div className="flex rounded-xl border border-line bg-surface p-1">
          {(
            [
              { id: 'gear', label: 'Trang Bị', icon: Backpack },
              { id: 'forge', label: 'Lò Rèn (SRS)', icon: Hammer },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => g.setInvTab(t.id)}
              className={cx('flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition', g.invTab === t.id ? 'bg-indigo text-white' : 'text-slate-400 hover:text-white')}
            >
              <t.icon size={16} /> {t.label}
              {t.id === 'forge' && g.runes.length > 0 && <span className="rounded-full bg-violet px-1.5 text-[10px] text-white">{g.runes.length}</span>}
            </button>
          ))}
        </div>
      </div>
      {g.invTab === 'gear' ? <Gear /> : <Forge />}
    </div>
  )
}

const FILTERS: (Slot | 'all')[] = ['all', 'weapon', 'armor', 'accessory', 'pet']

function Gear() {
  const g = useGame()
  const [filter, setFilter] = useState<Slot | 'all'>('all')
  const [focus, setFocus] = useState<string>(g.equipped.weapon)
  const cls = CLASSES.find((c) => c.id === g.cls)!
  const list = g.items.filter((i) => filter === 'all' || i.slot === filter)
  const focused = g.items.find((i) => i.id === focus)!

  const onClick = (it: Item) => {
    setFocus(it.id)
    if (g.equipped[it.slot] === it.id) return
    g.equip(it.id)
    g.toast(`Đã trang bị ${it.name} vào ô ${SLOT_LABEL[it.slot]}`, 'good')
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
      <aside className="card h-fit p-5 lg:sticky lg:top-20">
        <div className="flex items-center gap-4">
          <HeroAvatar cls={g.cls} size={64} />
          <div>
            <div className="font-display font-bold text-white">@LexiHero</div>
            <div className="text-xs" style={{ color: cls.color }}>{cls.name} · {cls.vi}</div>
          </div>
        </div>
        <div className="mt-5">
          <StatPanel stats={g.stats} compact />
        </div>
        <div className="mt-5 border-t border-line pt-4">
          <div className="mb-2 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">Đang trang bị</div>
          <div className="flex gap-2">
            {(['weapon', 'armor', 'accessory', 'pet'] as Slot[]).map((s) => (
              <button key={s} onClick={() => setFocus(g.equipped[s])} title={SLOT_LABEL[s]}>
                <ItemIcon item={g.items.find((i) => i.id === g.equipped[s])!} size={48} />
              </button>
            ))}
          </div>
        </div>
      </aside>

      <section className="flex flex-col gap-4">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cx('shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition', filter === f ? 'border-cyan bg-cyan/15 text-cyan' : 'border-line text-slate-400 hover:text-white')}
            >
              {f === 'all' ? 'Tất cả' : SLOT_LABEL[f]}
            </button>
          ))}
          <div className="ml-auto hidden items-center gap-3 pl-3 text-[11px] text-slate-500 md:flex">
            {Object.values(RARITY).map((r) => (
              <span key={r.label} className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-sm" style={{ background: r.color }} /> {r.label}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {list.map((it) => {
            const r = RARITY[it.rarity]
            const eq = g.equipped[it.slot] === it.id
            return (
              <button
                key={it.id}
                onClick={() => onClick(it)}
                onMouseEnter={() => setFocus(it.id)}
                className={cx(
                  'group relative flex flex-col items-center rounded-2xl border bg-surface p-4 text-center transition hover:-translate-y-0.5',
                  eq ? 'ring-2' : 'border-line hover:border-slate-500',
                )}
                style={eq ? { borderColor: r.color, ['--tw-ring-color' as string]: `${r.color}55` } : undefined}
              >
                {eq && (
                  <span className="absolute top-2 right-2 flex items-center gap-0.5 rounded-md bg-emerald px-1.5 py-0.5 text-[9px] font-bold text-slate-950">
                    <Check size={10} /> ĐANG DÙNG
                  </span>
                )}
                <ItemIcon item={it} size={64} />
                <div className="mt-3 text-sm leading-tight font-semibold text-slate-100">
                  {it.name} {it.level > 0 && <span style={{ color: r.color }}>(+{it.level})</span>}
                </div>
                <div className="mt-0.5 text-[10px] font-semibold tracking-wider uppercase" style={{ color: r.color }}>
                  {r.label} · {SLOT_LABEL[it.slot]}
                </div>
                <div className="mt-2 font-display text-xs font-semibold text-amber-200/90">{statLine(it)}</div>
              </button>
            )
          })}
        </div>

        {focused && <ItemDetail item={focused} />}
      </section>
    </div>
  )
}

function ItemDetail({ item }: { item: Item }) {
  const g = useGame()
  const r = RARITY[item.rarity]
  const currentId = g.equipped[item.slot]
  const current = g.items.find((i) => i.id === currentId)!
  const a = itemStats(item)
  const b = itemStats(current)
  const keys: { k: keyof Stats; l: string }[] = [
    { k: 'hp', l: 'HP' },
    { k: 'atk', l: 'ATK' },
    { k: 'def', l: 'DEF' },
    { k: 'crit', l: 'CRIT' },
    { k: 'time', l: 'TIME' },
  ]
  return (
    <div key={item.id} className="card flex animate-fade-up flex-col gap-4 p-5 sm:flex-row" style={{ borderColor: `${r.color}55` }}>
      <ItemIcon item={item} size={80} />
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-display text-lg font-bold text-white">{item.name} (+{item.level})</span>
          <Pill color={r.color}>{r.label}</Pill>
        </div>
        <div className="mt-1 text-sm text-slate-300">
          <span className="font-semibold text-violet">Nội tại ngôn ngữ:</span> {item.passive}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {keys
            .filter(({ k }) => a[k] || b[k])
            .map(({ k, l }) => {
              const d = Math.round((a[k] - b[k]) * 100) / 100
              return (
                <span key={k} className="rounded-lg border border-line bg-slate-950/50 px-2.5 py-1 font-display text-xs">
                  <span className="text-slate-400">{l}</span> <span className="font-bold text-white">{a[k]}</span>
                  {item.id !== currentId && d !== 0 && <span className={cx('ml-1', d > 0 ? 'text-emerald' : 'text-coral')}>({d > 0 ? '+' : ''}{d})</span>}
                </span>
              )
            })}
        </div>
      </div>
      <div className="self-center">
        {item.id === currentId ? (
          <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald"><ShieldCheck size={16} /> Đang trang bị</span>
        ) : (
          <button onClick={() => { g.equip(item.id); g.toast(`Đã trang bị ${item.name}`, 'good') }} className="rounded-xl bg-indigo px-4 py-2.5 text-sm font-semibold text-white">
            Trang bị
          </button>
        )}
      </div>
    </div>
  )
}

// ---------------- Blacksmith ----------------

interface Card {
  key: string
  options: string[]
  answer: number
  reverse: boolean
}

function makeCards(runes: string[]): Card[] {
  const pool = Object.keys(WORDS).filter((k) => WORDS[k].pos !== 'grammar')
  const chosen = [...runes].slice(0, 3)
  while (chosen.length < 3) {
    const k = pool[Math.floor(Math.random() * pool.length)]
    if (!chosen.includes(k)) chosen.push(k)
  }
  return chosen.map((key, i) => {
    const reverse = i === 1 // mix in one Vietnamese → English card
    const distract = pool.filter((k) => k !== key).sort(() => Math.random() - 0.5).slice(0, 3)
    const all = [key, ...distract].sort(() => Math.random() - 0.5)
    return { key, reverse, options: all.map((k) => (reverse ? WORDS[k].word : WORDS[k].vi)), answer: all.indexOf(key) }
  })
}

function Forge() {
  const g = useGame()
  const upgradable = g.items.filter((i) => Object.values(g.equipped).includes(i.id))
  const [target, setTarget] = useState(g.equipped.weapon)
  const [stage, setStage] = useState<'idle' | 'quiz' | 'fail' | 'forging' | 'done'>('idle')
  const [cards, setCards] = useState<Card[]>([])
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [lastLevel, setLastLevel] = useState(0)
  const item = g.items.find((i) => i.id === target)!
  const r = RARITY[item.rarity]

  const nextPreview = useMemo(() => itemStats({ ...item, level: item.level + 1 }), [item])
  const nowStats = itemStats(item)

  const start = () => {
    setCards(makeCards(g.runes))
    setIdx(0)
    setPicked(null)
    setStage('quiz')
  }

  const pick = (i: number) => {
    if (picked !== null) return
    setPicked(i)
    const ok = i === cards[idx].answer
    setTimeout(() => {
      if (!ok) return setStage('fail')
      if (idx < 2) {
        setIdx(idx + 1)
        setPicked(null)
      } else {
        setStage('forging')
        setLastLevel(item.level + 1)
        g.forge(item.id, cards.map((c) => c.key).filter((k) => g.runes.includes(k)))
        setTimeout(() => {
          setStage('done')
          g.toast(`${item.name} đã được cường hóa lên +${item.level + 1}!`, 'gold')
        }, 1400)
      }
    }, 750)
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
      {/* Runes */}
      <section className="card p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-white">
            <Skull size={18} className="text-violet" /> Mảnh Cổ Ngữ Bị Nguyền
            <span className="rounded-full bg-violet/20 px-2 text-xs text-violet">{g.runes.length}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-cyan/40 bg-cyan/10 px-2.5 py-1 text-xs font-semibold text-cyan">
            <Gem size={13} /> Đá Cường Hóa: {g.stones}
          </div>
        </div>
        <p className="mt-1 text-xs text-slate-400">Từ bạn đã trả lời sai hoặc chậm trong các trận gần đây. Ôn lại để thanh tẩy chúng.</p>
        {g.runes.length === 0 ? (
          <div className="mt-6 flex flex-col items-center rounded-xl border border-dashed border-line py-10 text-center">
            <Sparkles className="text-emerald" />
            <div className="mt-2 text-sm font-semibold text-slate-200">Mọi cổ ngữ đã được thanh tẩy!</div>
            <div className="text-xs text-slate-500">Bạn vẫn có thể cường hóa bằng thẻ ôn tập ngẫu nhiên.</div>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {g.runes.map((k, i) => {
              const w = WORDS[k]
              const queued = i < 3
              return (
                <div
                  key={k}
                  className={cx('relative overflow-hidden rounded-xl border p-3', queued ? 'border-violet/60 bg-violet/10' : 'border-line bg-slate-950/40')}
                  style={queued ? { boxShadow: 'inset 0 0 24px rgba(139,92,246,0.18)' } : undefined}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-display text-base font-bold text-white">{w.word}</div>
                      <div className="font-display text-[11px] text-slate-500">{w.ipa} · {w.pos}</div>
                    </div>
                    <button onClick={() => speak(w.word)} className="rounded-lg p-1.5 text-cyan hover:bg-cyan/10" aria-label={`Nghe ${w.word}`}>
                      <Volume2 size={15} />
                    </button>
                  </div>
                  <div className="mt-1.5 text-[11px] text-slate-500 blur-[3px] transition hover:blur-none" title="Di chuột để xem nghĩa">{w.vi}</div>
                  {queued && <span className="absolute right-2 bottom-2 font-display text-[9px] font-bold tracking-wider text-violet">SẴN SÀNG RÈN</span>}
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Anvil */}
      <section className="card relative overflow-hidden p-5">
        <div className="pointer-events-none absolute -top-24 right-0 h-60 w-60 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative flex items-center gap-2 font-semibold text-white">
          <Anvil size={18} className="text-gold" /> Thanh Tẩy & Cường Hóa
        </div>

        {/* Target selector */}
        <div className="relative mt-4 flex gap-2">
          {upgradable.map((it) => (
            <button
              key={it.id}
              disabled={stage === 'quiz' || stage === 'forging'}
              onClick={() => { setTarget(it.id); setStage('idle') }}
              className={cx('rounded-xl p-1 transition', target === it.id ? 'bg-white/10 ring-2 ring-gold' : 'opacity-60 hover:opacity-100')}
              title={it.name}
            >
              <ItemIcon item={it} size={48} />
            </button>
          ))}
        </div>

        <div className="relative mt-5 flex items-center justify-center gap-5 rounded-2xl border border-line bg-slate-950/50 p-5">
          <div className="relative">
            <ItemIcon item={item} size={84} />
            {stage === 'forging' && <Sparks />}
          </div>
          <div className="text-center">
            <div className="font-display text-sm font-bold text-white">{item.name}</div>
            <div className="mt-1 flex items-center justify-center gap-2 font-display text-2xl font-bold">
              <span style={{ color: r.color }}>+{stage === 'done' ? lastLevel - 1 : item.level}</span>
              <ArrowRight size={18} className="text-slate-500" />
              <span className="text-gold">+{stage === 'done' ? lastLevel : item.level + 1}</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              {stage === 'done' ? statLine(item) : `${statLine(item) || '—'} → `}
              {stage !== 'done' && (
                <span className="text-emerald">
                  {(Object.keys(nextPreview) as (keyof Stats)[])
                    .filter((k) => nextPreview[k] !== nowStats[k])
                    .map((k) => `${k.toUpperCase()} ${nextPreview[k]}`)
                    .join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="relative mt-5 min-h-[220px]">
          {stage === 'idle' && (
            <div className="flex flex-col items-center text-center">
              <p className="text-sm text-slate-300">
                Trả lời đúng <span className="font-bold text-gold">3 thẻ ôn tập</span> từ Cổ Ngữ của bạn để tạo <span className="font-semibold text-cyan">Đá Cường Hóa</span> và nâng cấp trang bị.
              </p>
              <div className="mt-3 flex gap-1.5">
                {makePreview(g.runes).map((k) => (
                  <Pill key={k} color="#8B5CF6">{WORDS[k].word}</Pill>
                ))}
              </div>
              <button onClick={start} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold to-amber-500 px-6 py-3 font-display font-bold text-slate-950 shadow-[0_8px_30px_-8px_rgba(245,158,11,0.8)] transition hover:-translate-y-0.5">
                <Hammer size={18} /> Bắt Đầu Thanh Tẩy
              </button>
            </div>
          )}

          {stage === 'quiz' && cards[idx] && (
            <div key={idx} className="animate-fade-up">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Thẻ ôn tập {idx + 1}/3</span>
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className={cx('h-1.5 w-8 rounded-full', i < idx ? 'bg-emerald' : i === idx ? 'bg-gold' : 'bg-slate-700')} />
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-violet/40 bg-violet/10 p-4 text-center">
                {cards[idx].reverse ? (
                  <>
                    <div className="text-xs text-slate-400">Từ tiếng Anh nào mang nghĩa:</div>
                    <div className="mt-1 font-display text-xl font-bold text-white">{WORDS[cards[idx].key].vi}</div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-display text-2xl font-bold text-white">{WORDS[cards[idx].key].word}</span>
                      <button onClick={() => speak(WORDS[cards[idx].key].word)} className="rounded-lg p-1 text-cyan hover:bg-cyan/10" aria-label="Nghe">
                        <Volume2 size={18} />
                      </button>
                    </div>
                    <div className="font-display text-xs text-slate-400">{WORDS[cards[idx].key].ipa}</div>
                    <div className="mt-2 text-xs text-slate-300 italic">"{WORDS[cards[idx].key].example}"</div>
                  </>
                )}
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {cards[idx].options.map((o, i) => {
                  const st = picked === null ? 'live' : i === cards[idx].answer ? 'right' : picked === i ? 'wrong' : 'idle'
                  return (
                    <button
                      key={o}
                      onClick={() => pick(i)}
                      disabled={picked !== null}
                      className={cx(
                        'rounded-xl border-2 px-3 py-2.5 text-left text-sm font-semibold transition',
                        st === 'live' && 'border-line bg-slate-950/50 text-slate-100 hover:border-gold',
                        st === 'right' && 'border-emerald bg-emerald/15 text-emerald',
                        st === 'wrong' && 'animate-shake border-coral bg-coral/15 text-coral',
                        st === 'idle' && 'border-line/50 text-slate-600',
                      )}
                    >
                      {o}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {stage === 'fail' && (
            <div className="flex animate-pop flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-coral/15 text-coral"><X /></div>
              <div className="mt-2 font-display text-lg font-bold text-white">Cổ ngữ phản phệ!</div>
              <p className="text-sm text-slate-400">
                "{WORDS[cards[idx].key].word}" nghĩa là <span className="text-slate-200">{WORDS[cards[idx].key].vi}</span>. Rune vẫn còn bị nguyền.
              </p>
              <button onClick={start} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo px-5 py-2.5 font-semibold text-white">
                <RotateCcw size={16} /> Thử lại
              </button>
            </div>
          )}

          {stage === 'forging' && (
            <div className="flex flex-col items-center py-6 text-center">
              <Hammer size={44} className="animate-bounce text-gold" />
              <div className="mt-3 font-display text-lg font-bold text-gold">Đang rèn trên đe...</div>
              <div className="text-xs text-slate-400">Cổ ngữ được thanh tẩy thành Đá Cường Hóa</div>
            </div>
          )}

          {stage === 'done' && (
            <div className="flex animate-pop flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/20 text-gold"><Sparkles /></div>
              <div className="mt-2 font-display text-xl font-bold text-white">Cường hóa thành công!</div>
              <p className="text-sm text-slate-400">
                {item.name} đã đạt <span className="font-bold text-gold">+{item.level}</span>. Chỉ số anh hùng đã được cập nhật.
              </p>
              <button onClick={start} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-gold/50 px-5 py-2.5 font-semibold text-gold hover:bg-gold/10">
                <Hammer size={16} /> Rèn tiếp
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function makePreview(runes: string[]) {
  return runes.length ? runes.slice(0, 3) : []
}

function Sparks() {
  const sparks = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => {
        const a = (i / 18) * Math.PI * 2
        const d = 50 + Math.random() * 40
        return { sx: `${Math.cos(a) * d}px`, sy: `${Math.sin(a) * d}px`, delay: Math.random() * 0.4, c: i % 3 ? '#F59E0B' : '#FDE68A' }
      }),
    [],
  )
  return (
    <div className="pointer-events-none absolute top-1/2 left-1/2">
      {sparks.map((s, i) => (
        <span
          key={i}
          className="absolute h-1.5 w-1.5 animate-spark rounded-full"
          style={{ ['--sx' as string]: s.sx, ['--sy' as string]: s.sy, background: s.c, boxShadow: `0 0 6px ${s.c}`, animationDelay: `${s.delay}s`, animationIterationCount: 2 }}
        />
      ))}
    </div>
  )
}
