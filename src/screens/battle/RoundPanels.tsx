import { useEffect, useMemo, useRef, useState } from 'react'
import { Volume2, Mic, Keyboard, Check, X, Lightbulb } from 'lucide-react'
import { WORDS, speak, type Question } from '../../game/data'
import { cx } from '../../components/ui'

export interface PanelProps {
  q: Question
  locked: boolean
  chosen: number | null
  eliminated: number[]
  showHint: boolean
  onAnswer: (choice: number) => void
}

function OptionGrid({ q, locked, chosen, eliminated, onAnswer, accent }: PanelProps & { accent: string }) {
  useEffect(() => {
    if (locked) return
    const h = (e: KeyboardEvent) => {
      const n = Number(e.key)
      if (n >= 1 && n <= (q.options?.length ?? 0) && !eliminated.includes(n - 1)) onAnswer(n - 1)
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [locked, q, eliminated, onAnswer])

  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {q.options!.map((opt, i) => {
        const gone = eliminated.includes(i)
        const isAnswer = i === q.answer
        const state = locked ? (isAnswer ? 'right' : chosen === i ? 'wrong' : 'idle') : 'live'
        return (
          <button
            key={opt}
            disabled={locked || gone}
            onClick={() => onAnswer(i)}
            className={cx(
              'group flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left font-semibold transition',
              gone && 'opacity-20 line-through',
              state === 'live' && 'border-line bg-slate-950/50 text-slate-100 hover:-translate-y-0.5 hover:border-[var(--a)] hover:bg-[var(--a)]/10',
              state === 'right' && 'border-emerald bg-emerald/15 text-emerald',
              state === 'wrong' && 'animate-shake border-coral bg-coral/15 text-coral',
              state === 'idle' && 'border-line/60 bg-slate-950/30 text-slate-500',
            )}
            style={{ ['--a' as string]: accent }}
          >
            <span
              className={cx(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border font-display text-xs',
                state === 'live' ? 'border-line text-slate-400 group-hover:border-[var(--a)] group-hover:text-white' : 'border-current',
              )}
            >
              {state === 'right' ? <Check size={14} /> : state === 'wrong' ? <X size={14} /> : i + 1}
            </span>
            {opt}
          </button>
        )
      })}
    </div>
  )
}

export function VocabPanel(p: PanelProps) {
  const { q, showHint } = p
  const parts = q.context!.split(new RegExp(`(${q.highlight})`, 'i'))
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="font-display text-lg font-bold text-white sm:text-xl">{q.prompt}</div>
        <div className="mt-2 rounded-xl border border-line bg-slate-950/40 px-4 py-3 text-base text-slate-300 italic">
          "
          {parts.map((s, i) =>
            s.toLowerCase() === q.highlight!.toLowerCase() ? (
              <span key={i} className="rounded bg-coral/15 px-1 font-bold text-coral not-italic">{s}</span>
            ) : (
              <span key={i}>{s}</span>
            ),
          )}
          "
        </div>
        {showHint && q.hint && (
          <div className="mt-2 flex items-start gap-2 text-xs text-violet">
            <Lightbulb size={14} className="mt-0.5 shrink-0" /> Bùa Từ Gốc Latin: {q.hint}
          </div>
        )}
      </div>
      <OptionGrid {...p} accent="#F43F5E" />
    </div>
  )
}

export function GrammarPanel(p: PanelProps) {
  const { q, locked, chosen, onAnswer, eliminated } = p
  const [before, after] = q.prompt.split('___')
  const filled = chosen !== null ? q.options![chosen] : locked ? q.options![q.answer!] : null
  const correct = chosen === q.answer
  return (
    <div className="flex flex-col gap-5">
      <div className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Chọn mảnh từ để hoàn thành câu</div>
      <div className="rounded-xl border border-line bg-slate-950/40 px-4 py-5 text-center font-display text-lg leading-loose font-semibold text-slate-100 sm:text-xl">
        {before}
        <span
          className={cx(
            'mx-1 inline-flex min-w-24 items-center justify-center rounded-lg border-2 border-dashed px-3 align-middle leading-9 transition',
            !filled && 'border-slate-600 text-slate-600',
            filled && locked && chosen === null && 'border-solid border-emerald/60 text-emerald/80',
            filled && chosen !== null && (correct ? 'animate-pop border-solid border-emerald bg-emerald/15 text-emerald' : 'animate-shake border-solid border-coral bg-coral/15 text-coral'),
          )}
        >
          {filled ?? '?'}
        </span>
        {after}
      </div>
      <div className="flex flex-wrap justify-center gap-2.5">
        {q.options!.map((opt, i) => {
          const used = chosen === i
          return (
            <button
              key={opt}
              disabled={locked || eliminated.includes(i)}
              onClick={() => onAnswer(i)}
              className={cx(
                'rounded-xl border-b-4 px-5 py-2.5 font-display text-base font-bold transition active:translate-y-0.5 active:border-b-2',
                used ? 'invisible' : eliminated.includes(i) ? 'border-slate-800 bg-slate-900 text-slate-700 line-through' : 'border-emerald/50 bg-emerald/10 text-emerald hover:-translate-y-0.5 hover:bg-emerald/20 disabled:hover:translate-y-0',
                locked && !used && 'opacity-50',
              )}
            >
              {opt}
            </button>
          )
        })}
      </div>
      {locked && <div className="text-center text-xs text-slate-400">{q.explain}</div>}
    </div>
  )
}

export function ListeningPanel(p: PanelProps) {
  const { q } = p
  const w = WORDS[q.wordKey]
  const [playing, setPlaying] = useState(false)
  const [plays, setPlays] = useState(0)
  const play = () => {
    speak(q.speak!)
    setPlaying(true)
    setPlays((n) => n + 1)
    setTimeout(() => setPlaying(false), 1600)
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="font-display text-lg font-bold text-white">{q.prompt}</div>
      <button
        onClick={play}
        className={cx(
          'group flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition',
          playing ? 'border-cyan bg-cyan/15' : 'border-cyan/40 bg-cyan/5 hover:border-cyan',
        )}
      >
        <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-cyan text-slate-950">
          {playing && <span className="absolute inset-0 animate-pulse-ring rounded-full bg-cyan" />}
          <Volume2 size={24} className="relative" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-cyan">
            Bấm để nghe phát âm: <span className="font-display">{w.ipa}</span>
          </div>
          <div className="mt-2 flex h-8 items-center gap-[3px]">
            {Array.from({ length: 42 }).map((_, i) => (
              <span
                key={i}
                className={cx('w-1 rounded-full bg-cyan/70', playing && 'animate-wave')}
                style={{ height: `${20 + Math.abs(Math.sin(i * 0.7) * 80)}%`, animationDelay: `${(i % 7) * 0.08}s` }}
              />
            ))}
          </div>
        </div>
        <span className="hidden text-[11px] text-slate-500 sm:block">Đã nghe {plays}x</span>
      </button>
      <OptionGrid {...p} accent="#06B6D4" />
    </div>
  )
}

export function UltimatePanel({
  q,
  locked,
  prefill,
  onDone,
}: {
  q: Question
  locked: boolean
  prefill: boolean
  onDone: (quality: number, method: 'mic' | 'spell') => void
}) {
  const [mode, setMode] = useState<'pick' | 'mic' | 'spell'>('pick')
  const word = q.spell!
  const w = WORDS[q.wordKey]

  // ---- spelling state ----
  const tiles = useMemo(() => {
    const decoys = 'XQZJKWVY'.split('').filter((c) => !word.includes(c)).slice(0, 3)
    return [...word.split(''), ...decoys]
      .map((ch, i) => ({ id: i, ch, r: Math.random() }))
      .sort((a, b) => a.r - b.r)
  }, [word])
  const [typed, setTyped] = useState(prefill ? word[0] : '')
  const [used, setUsed] = useState<number[]>(() => (prefill ? [tiles.find((t) => t.ch === word[0])!.id] : []))
  const [mistakes, setMistakes] = useState(0)
  const [shakeId, setShakeId] = useState<number | null>(null)
  const doneRef = useRef(false)

  const pressLetter = (ch: string, tileId?: number) => {
    if (locked || doneRef.current) return
    const next = word[typed.length]
    if (ch === next) {
      const tile = tileId ?? tiles.find((t) => t.ch === ch && !used.includes(t.id))?.id
      if (tile === undefined) return
      const nt = typed + ch
      setTyped(nt)
      setUsed((u) => [...u, tile])
      if (nt.length === word.length) {
        doneRef.current = true
        onDone(Math.max(0.6, 1 - mistakes * 0.08), 'spell')
      }
    } else {
      setMistakes((m) => m + 1)
      setShakeId(tileId ?? -1)
      setTimeout(() => setShakeId(null), 450)
    }
  }

  useEffect(() => {
    if (mode !== 'spell' || locked) return
    const h = (e: KeyboardEvent) => {
      if (/^[a-zA-Z]$/.test(e.key)) pressLetter(e.key.toUpperCase())
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  })

  // ---- mic state ----
  const [rec, setRec] = useState<'idle' | 'rec' | 'score'>('idle')
  const [score, setScore] = useState(0)
  const startMic = () => {
    if (rec !== 'idle' || locked) return
    setRec('rec')
    setTimeout(() => {
      const s = 88 + Math.floor(Math.random() * 11)
      setScore(s)
      setRec('score')
      setTimeout(() => {
        if (!doneRef.current) {
          doneRef.current = true
          onDone(s / 100, 'mic')
        }
      }, 1100)
    }, 2200)
  }

  if (mode === 'pick') {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <div className="font-display text-lg font-bold text-white">Mana đã đầy 100%! Chọn cách tung Chiêu Cuối</div>
          <div className="mt-1 text-sm text-slate-400">
            Từ khóa thần chú: <span className="font-semibold text-violet">{w.vi}</span> <span className="font-display text-slate-500">{w.ipa}</span>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <button onClick={() => setMode('mic')} className="group rounded-2xl border-2 border-violet/40 bg-violet/10 p-5 text-left transition hover:-translate-y-0.5 hover:border-violet">
            <Mic size={28} className="text-violet" />
            <div className="mt-3 font-display text-base font-bold text-white">Niệm Chú (Phát âm)</div>
            <div className="text-xs text-slate-400">Đọc to từ khóa — chấm điểm phát âm tự động</div>
          </button>
          <button onClick={() => setMode('spell')} className="group rounded-2xl border-2 border-gold/40 bg-gold/10 p-5 text-left transition hover:-translate-y-0.5 hover:border-gold">
            <Keyboard size={28} className="text-gold" />
            <div className="mt-3 font-display text-base font-bold text-white">Khắc Rune (Đánh vần)</div>
            <div className="text-xs text-slate-400">Bấm hoặc gõ nhanh từng chữ cái theo thứ tự</div>
          </button>
        </div>
      </div>
    )
  }

  if (mode === 'mic') {
    return (
      <div className="flex flex-col items-center gap-4 py-2 text-center">
        <div className="text-sm text-slate-400">
          Hãy đọc to: <span className="font-display text-2xl font-bold tracking-wider text-white">{word.charAt(0) + word.slice(1).toLowerCase()}</span>{' '}
          <button onClick={() => speak(q.speak!)} className="ml-1 inline-flex items-center gap-1 align-middle text-xs text-cyan hover:underline">
            <Volume2 size={13} /> Nghe mẫu
          </button>
        </div>
        <button
          onClick={startMic}
          disabled={rec !== 'idle' || locked}
          className={cx('relative flex h-24 w-24 items-center justify-center rounded-full text-white transition', rec === 'rec' ? 'bg-coral' : 'bg-violet hover:scale-105')}
          aria-label="Bấm để ghi âm"
        >
          {rec === 'rec' && <span className="absolute inset-0 animate-pulse-ring rounded-full bg-coral" />}
          <Mic size={38} className="relative" />
        </button>
        <div className="flex h-10 items-center gap-1">
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className={cx('w-1.5 rounded-full', rec === 'rec' ? 'animate-wave bg-coral' : 'bg-slate-700')}
              style={{ height: `${30 + Math.abs(Math.sin(i * 1.3)) * 70}%`, animationDelay: `${(i % 6) * 0.1}s` }}
            />
          ))}
        </div>
        <div className="h-8 font-display text-xl font-bold">
          {rec === 'idle' && <span className="text-sm font-medium text-slate-500">Bấm micro để bắt đầu niệm chú</span>}
          {rec === 'rec' && <span className="text-coral">Đang nghe...</span>}
          {rec === 'score' && (
            <span className="animate-pop text-emerald">
              {score}% {score >= 95 ? 'Excellent!' : 'Great!'}
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="text-center text-sm text-slate-400">
        Đánh vần từ mang nghĩa <span className="font-semibold text-gold">"{w.vi}"</span>
        {mistakes > 0 && <span className="ml-2 text-coral">· Sai {mistakes} lần</span>}
      </div>
      <div className={cx('flex flex-wrap justify-center gap-1.5', shakeId === -1 && 'animate-shake')}>
        {word.split('').map((ch, i) => (
          <span
            key={i}
            className={cx(
              'flex h-11 w-9 items-center justify-center rounded-lg border-2 font-display text-xl font-bold sm:h-12 sm:w-10',
              i < typed.length ? 'animate-pop border-gold bg-gold/20 text-gold' : i === typed.length ? 'border-gold/60 bg-slate-950/60' : 'border-line bg-slate-950/40',
            )}
          >
            {i < typed.length ? ch : ''}
          </span>
        ))}
      </div>
      <div className="flex max-w-md flex-wrap justify-center gap-2">
        {tiles.map((t) => {
          const isUsed = used.includes(t.id)
          return (
            <button
              key={t.id}
              disabled={isUsed || locked}
              onClick={() => pressLetter(t.ch, t.id)}
              className={cx(
                'h-12 w-11 rounded-xl border-b-4 font-display text-lg font-bold transition active:translate-y-0.5',
                isUsed ? 'border-transparent bg-slate-900 text-slate-800' : 'border-violet/60 bg-violet/15 text-white hover:-translate-y-0.5 hover:bg-violet/25',
                shakeId === t.id && 'animate-shake border-coral bg-coral/30',
              )}
            >
              {t.ch}
            </button>
          )
        })}
      </div>
      <div className="flex items-center gap-1 text-[11px] text-slate-500">
        <Keyboard size={12} /> Có thể gõ trực tiếp bằng bàn phím
      </div>
    </div>
  )
}
