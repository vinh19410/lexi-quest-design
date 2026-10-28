import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Ghost, X, Heart, Swords, Shield, Zap, Timer } from 'lucide-react'
import { CLASSES, RARITY, itemStats, type ClassId, type Item, type Stats } from '../game/data'

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(' ')
}

export function HeroAvatar({
  cls,
  size = 96,
  ghost,
  color: colorOverride,
  className,
}: {
  cls: ClassId
  size?: number
  ghost?: boolean
  color?: string
  className?: string
}) {
  const c = CLASSES.find((x) => x.id === cls)!
  const color = colorOverride ?? c.color
  const Icon = ghost ? Ghost : c.icon
  return (
    <div
      className={cx('relative shrink-0', className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <div
        className="absolute inset-0 rotate-45 rounded-[22%] border"
        style={{
          borderColor: `${color}88`,
          background: `radial-gradient(circle at 30% 25%, ${color}55, #0f172a 70%)`,
          boxShadow: `0 0 ${size / 3}px ${color}33, inset 0 0 ${size / 5}px ${color}33`,
        }}
      />
      <div className="absolute inset-[14%] rotate-45 rounded-[22%] border border-white/10" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon size={size * 0.42} strokeWidth={1.6} style={{ color, filter: `drop-shadow(0 0 8px ${color})` }} />
      </div>
    </div>
  )
}

export function Bar({
  value,
  max,
  color,
  className,
  height = 10,
  glow = true,
}: {
  value: number
  max: number
  color: string
  className?: string
  height?: number
  glow?: boolean
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className={cx('relative overflow-hidden rounded-full bg-slate-950/70 ring-1 ring-white/5', className)} style={{ height }}>
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-500 ease-out"
        style={{
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}cc, ${color})`,
          boxShadow: glow ? `0 0 12px ${color}88` : undefined,
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),transparent_55%)]" />
    </div>
  )
}

export function Pill({ children, color = '#6366F1', className }: { children: ReactNode; color?: string; className?: string }) {
  return (
    <span
      className={cx('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap', className)}
      style={{ color, borderColor: `${color}55`, background: `${color}14` }}
    >
      {children}
    </span>
  )
}

export function ItemIcon({ item, size = 56, showLevel = true }: { item: Item; size?: number; showLevel?: boolean }) {
  const r = RARITY[item.rarity]
  const Icon = item.icon
  return (
    <div
      className="relative flex shrink-0 items-center justify-center rounded-xl border-2"
      style={{
        width: size,
        height: size,
        borderColor: r.color,
        background: `radial-gradient(circle at 50% 30%, ${r.color}40, #0b1222 75%)`,
        boxShadow: item.rarity === 'legendary' ? `0 0 16px ${r.color}55` : item.rarity === 'epic' ? `0 0 10px ${r.color}40` : undefined,
      }}
    >
      <Icon size={size * 0.48} strokeWidth={1.7} style={{ color: r.color }} />
      {showLevel && item.level > 0 && (
        <span
          className="absolute -right-1.5 -bottom-1.5 rounded-md px-1 font-display text-[11px] leading-4 font-bold text-slate-950"
          style={{ background: r.color }}
        >
          +{item.level}
        </span>
      )}
    </div>
  )
}

export function statLine(item: Item) {
  const s = itemStats(item)
  const parts: string[] = []
  if (s.hp) parts.push(`+${s.hp} HP`)
  if (s.atk) parts.push(`+${s.atk} ATK`)
  if (s.def) parts.push(`+${s.def} DEF`)
  if (s.crit) parts.push(`+${s.crit}% CRIT`)
  if (s.time) parts.push(`+${s.time}s`)
  return parts.join(', ')
}

export function Modal({
  open,
  onClose,
  children,
  className,
  dismissable = true,
}: {
  open: boolean
  onClose?: () => void
  children: ReactNode
  className?: string
  dismissable?: boolean
}) {
  useEffect(() => {
    if (!open || !dismissable) return
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose, dismissable])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-fade-up" onClick={dismissable ? onClose : undefined} />
      <div role="dialog" aria-modal className={cx('card relative w-full max-w-md animate-pop p-6 shadow-2xl shadow-black/60', className)}>
        {dismissable && onClose && (
          <button onClick={onClose} className="absolute top-3 right-3 rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white" aria-label="Đóng">
            <X size={18} />
          </button>
        )}
        {children}
      </div>
    </div>
  )
}

const STAT_ROWS: { key: keyof Stats; label: string; sub: string; color: string; max: number; icon: typeof Heart; unit?: string }[] = [
  { key: 'hp', label: 'HP', sub: 'Máu', color: '#F43F5E', max: 700, icon: Heart },
  { key: 'atk', label: 'ATK', sub: 'Công Từ Vựng', color: '#F59E0B', max: 220, icon: Swords },
  { key: 'def', label: 'DEF', sub: 'Giáp Ngữ Pháp', color: '#10B981', max: 150, icon: Shield },
  { key: 'crit', label: 'CRIT', sub: 'Chí Mạng Tốc Độ', color: '#8B5CF6', max: 50, icon: Zap, unit: '%' },
  { key: 'time', label: 'TIME BONUS', sub: '+Giây Suy Nghĩ', color: '#06B6D4', max: 4, icon: Timer, unit: 's' },
]

/** Stat bars that flash the delta whenever the value changes. */
export function StatPanel({ stats, compact }: { stats: Stats; compact?: boolean }) {
  const prev = useRef(stats)
  const [delta, setDelta] = useState<Partial<Record<keyof Stats, number>>>({})
  useEffect(() => {
    const d: Partial<Record<keyof Stats, number>> = {}
    ;(Object.keys(stats) as (keyof Stats)[]).forEach((k) => {
      const diff = Math.round((stats[k] - prev.current[k]) * 100) / 100
      if (diff) d[k] = diff
    })
    prev.current = stats
    if (Object.keys(d).length) {
      setDelta(d)
      const t = setTimeout(() => setDelta({}), 1800)
      return () => clearTimeout(t)
    }
  }, [stats])

  return (
    <div className={cx('flex flex-col', compact ? 'gap-2.5' : 'gap-3.5')}>
      {STAT_ROWS.map((r) => {
        const d = delta[r.key]
        const Icon = r.icon
        return (
          <div key={r.key}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5">
                <Icon size={13} style={{ color: r.color }} />
                <span className="font-display font-bold tracking-wide text-slate-100">{r.label}</span>
                <span className="text-slate-500">{r.sub}</span>
              </span>
              <span className="flex items-center gap-2 font-display font-semibold tabular-nums">
                {d !== undefined && (
                  <span key={`${r.key}${d}`} className={cx('animate-pop text-[11px]', d > 0 ? 'text-emerald' : 'text-coral')}>
                    {d > 0 ? '+' : ''}
                    {d}
                    {r.unit}
                  </span>
                )}
                <span className="text-slate-100">
                  {r.key === 'time' ? `+${stats[r.key]}` : stats[r.key]}
                  {r.unit}
                </span>
              </span>
            </div>
            <Bar value={stats[r.key]} max={r.max} color={r.color} height={compact ? 6 : 8} />
          </div>
        )
      })}
    </div>
  )
}

export function SectionTitle({ eyebrow, title, right }: { eyebrow?: string; title: string; right?: ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        {eyebrow && <div className="font-display text-[11px] font-semibold tracking-[0.2em] text-slate-500 uppercase">{eyebrow}</div>}
        <h2 className="font-display text-xl font-bold text-white">{title}</h2>
      </div>
      {right}
    </div>
  )
}
