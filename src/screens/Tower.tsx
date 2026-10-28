import { useState } from 'react'
import { Castle, Lock, Check, Skull, Volume2, Swords, BookOpen, Crown, Play } from 'lucide-react'
import { useGame } from '../game/store'
import { MODULES, WORDS, speak } from '../game/data'
import { Bar, Pill, cx } from '../components/ui'

const NODE_POS = [
  { x: 18, y: 82 },
  { x: 62, y: 62 },
  { x: 28, y: 40 },
  { x: 70, y: 16 },
]

export default function Tower() {
  const g = useGame()
  const mod = MODULES.find((m) => m.id === g.towerModule)!
  const cleared = g.pveProgress[mod.id]
  const [sel, setSel] = useState<number | null>(null)
  const stage = sel ?? Math.min(cleared, 3)

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="font-display text-[11px] font-semibold tracking-[0.2em] text-slate-500 uppercase">Dungeon Raid · PvE</div>
        <h1 className="font-display text-2xl font-bold text-white">Tháp Thử Thách & Học Phần</h1>
      </div>

      {/* Module selector */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {MODULES.map((m) => {
          const active = m.id === mod.id
          const p = g.pveProgress[m.id]
          return (
            <button
              key={m.id}
              onClick={() => { g.setTowerModule(m.id); setSel(null) }}
              className={cx('relative overflow-hidden rounded-2xl border bg-surface p-4 text-left transition hover:-translate-y-0.5', active ? 'ring-2' : 'border-line')}
              style={active ? { borderColor: m.color, ['--tw-ring-color' as string]: `${m.color}44` } : undefined}
            >
              <div className="pointer-events-none absolute -top-8 -right-8 h-28 w-28 rounded-full blur-2xl" style={{ background: `${m.color}${active ? '33' : '14'}` }} />
              <div className="relative flex items-center justify-between">
                <span className="font-display text-xs font-bold tracking-widest" style={{ color: m.color }}>TẦNG {m.floor}</span>
                {p >= 4 ? <Pill color="#10B981"><Check size={10} /> Đã chinh phục</Pill> : <span className="font-display text-[11px] text-slate-500">{p}/4</span>}
              </div>
              <div className="relative mt-2 min-h-10 text-sm leading-snug font-semibold text-white">{m.name}</div>
              <div className="relative mt-1 text-[11px] text-slate-400">{m.level}</div>
              <Bar value={p} max={4} color={m.color} height={4} className="relative mt-3" glow={false} />
            </button>
          )
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        {/* Node map */}
        <section className="card relative overflow-hidden p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-white">
              <Castle size={18} style={{ color: mod.color }} /> Bản đồ Tầng {mod.floor}
            </div>
            <span className="text-xs text-slate-500">3 ải thường + 1 Boss</span>
          </div>
          <div className="relative mx-auto mt-4 aspect-square max-h-[440px] w-full max-w-[440px]">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
              <defs>
                <radialGradient id="fog">
                  <stop offset="0" stopColor={mod.color} stopOpacity="0.18" />
                  <stop offset="1" stopColor={mod.color} stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="70" cy="16" r="30" fill="url(#fog)" />
              {NODE_POS.slice(0, -1).map((p, i) => {
                const n = NODE_POS[i + 1]
                const done = i < cleared
                return (
                  <path
                    key={i}
                    d={`M${p.x} ${p.y} Q ${(p.x + n.x) / 2 + (i % 2 ? -14 : 14)} ${(p.y + n.y) / 2} ${n.x} ${n.y}`}
                    fill="none"
                    stroke={done ? mod.color : '#334155'}
                    strokeWidth="1.2"
                    strokeDasharray={done ? undefined : '2 2'}
                    vectorEffect="non-scaling-stroke"
                    style={{ strokeWidth: 3 }}
                  />
                )
              })}
            </svg>
            {NODE_POS.map((p, i) => {
              const boss = i === 3
              const done = i < cleared
              const current = i === cleared
              const locked = i > cleared
              const isSel = stage === i
              const Icon = done ? Check : locked ? Lock : boss ? Crown : Swords
              const size = boss ? 76 : 58
              return (
                <button
                  key={i}
                  onClick={() => !locked && setSel(i)}
                  disabled={locked}
                  className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                >
                  <span className="relative flex items-center justify-center">
                    {current && <span className="absolute inset-0 animate-pulse-ring rounded-full" style={{ background: mod.color }} />}
                    <span
                      className={cx('relative flex items-center justify-center rounded-full border-2 transition', isSel && 'scale-110')}
                      style={{
                        width: size,
                        height: size,
                        borderColor: locked ? '#334155' : mod.color,
                        background: done ? mod.color : locked ? '#0f172a' : `radial-gradient(circle, ${mod.color}55, #0f172a)`,
                        boxShadow: isSel ? `0 0 0 4px #0f172a, 0 0 0 6px ${mod.color}` : undefined,
                      }}
                    >
                      <Icon size={boss ? 30 : 22} className={done ? 'text-slate-950' : locked ? 'text-slate-600' : 'text-white'} />
                    </span>
                  </span>
                  <span className={cx('mt-1.5 max-w-28 text-center text-[11px] leading-tight font-semibold', locked ? 'text-slate-600' : 'text-slate-200')}>
                    {boss ? mod.boss : mod.stages[i]}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        {/* Preview */}
        <section className="card flex flex-col p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                {stage === 3 ? 'Floor Boss' : `Ải ${stage + 1}`} · Xem trước kiến thức
              </div>
              <div className="font-display text-lg font-bold text-white">{stage === 3 ? mod.boss : mod.stages[stage]}</div>
            </div>
            {stage === 3 && <Pill color="#F43F5E"><Skull size={11} /> HP 600 · Phần thưởng x2</Pill>}
          </div>

          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {mod.vocab.map((k) => {
              const w = WORDS[k]
              return (
                <div key={k} className="group rounded-xl border border-line bg-slate-950/40 p-3 transition hover:border-slate-500">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-display font-bold text-white">{w.word}</div>
                      <div className="font-display text-[11px] text-slate-500">{w.ipa} · {w.pos}</div>
                    </div>
                    <button onClick={() => speak(w.word)} className="rounded-lg bg-cyan/10 p-2 text-cyan transition hover:bg-cyan/20" aria-label={`Nghe phát âm ${w.word}`}>
                      <Volume2 size={15} />
                    </button>
                  </div>
                  <div className="mt-1.5 text-sm font-medium" style={{ color: mod.color }}>{w.vi}</div>
                  <div className="mt-1 text-[11px] text-slate-400 italic">"{w.example}"</div>
                </div>
              )
            })}
          </div>

          <div className="mt-3 rounded-xl border border-emerald/40 bg-emerald/5 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald">
              <BookOpen size={15} /> Ngữ pháp trọng tâm: {mod.grammar.title}
            </div>
            <p className="mt-1 text-xs text-slate-300">{mod.grammar.rule}</p>
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-400 italic">
              "{mod.grammar.example}"
              <button onClick={() => speak(mod.grammar.example)} className="text-cyan" aria-label="Nghe câu ví dụ">
                <Volume2 size={13} />
              </button>
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 pt-5">
            <span className="text-xs text-slate-500">{stage < cleared ? 'Đã vượt qua — có thể luyện lại' : 'Thắng để mở khóa ải tiếp theo'}</span>
            <button
              onClick={() => g.startBattle({ mode: 'pve', setId: mod.id, stage })}
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 font-display font-bold text-slate-950 transition hover:-translate-y-0.5"
              style={{ background: mod.color, boxShadow: `0 8px 30px -8px ${mod.color}` }}
            >
              <Play size={16} className="fill-current" /> Vào Trận
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
