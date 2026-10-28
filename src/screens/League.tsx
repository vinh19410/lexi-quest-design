import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Trophy, Clock, TrendingUp, TrendingDown, Flame, BookCheck, Medal, Gift } from 'lucide-react'
import { useGame } from '../game/store'
import { CLASSES, LEAGUE_PLAYERS, RARITY, TIERS, type ClassId, type Rarity } from '../game/data'
import { cx } from '../components/ui'

interface Row {
  id: string
  name: string
  cls: ClassId
  weapon: string
  rarity: Rarity
  winRate: number
  rp: number
  mastered: number
  streak: number
  me?: boolean
}

function useCountdown() {
  const [end] = useState(() => Date.now() + (2 * 24 + 14) * 3600_000 + 23 * 60_000)
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(i)
  }, [])
  const s = Math.max(0, Math.floor((end - now) / 1000))
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 }
}

export default function League() {
  const g = useGame()
  const [tab, setTab] = useState<'pvp' | 'study'>('pvp')
  const cd = useCountdown()
  const myWeapon = g.items.find((i) => i.id === g.equipped.weapon)!
  const masteredBase = 1180

  const rows: Row[] = useMemo(() => {
    const me: Row = {
      id: 'me',
      name: 'LexiHero (Bạn)',
      cls: g.cls,
      weapon: `${myWeapon.name} +${myWeapon.level}`,
      rarity: myWeapon.rarity,
      winRate: 68,
      rp: g.rp,
      mastered: masteredBase + g.quests.find((q) => q.id === 'forge')!.progress * 3,
      streak: g.streak,
      me: true,
    }
    const all = [...LEAGUE_PLAYERS, me]
    return tab === 'pvp' ? all.sort((a, b) => b.rp - a.rp) : all.sort((a, b) => b.mastered - a.mastered || b.streak - a.streak)
  }, [g.cls, g.rp, g.streak, g.quests, myWeapon, tab])

  const n = rows.length
  const myRank = rows.findIndex((r) => r.me) + 1

  return (
    <div className="flex flex-col gap-5">
      {/* Tier header */}
      <section className="card relative overflow-hidden p-5 sm:p-6">
        <div className="pointer-events-none absolute -top-20 left-1/3 h-56 w-96 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-display text-[11px] font-semibold tracking-[0.2em] text-slate-500 uppercase">Bảng Xếp Hạng Giải Đấu Tuần</div>
            <h1 className="font-display text-xl font-bold text-white sm:text-2xl">
              Giải Đấu Bậc Vàng <span className="text-gold">(Gold League - Nhóm #14)</span>
            </h1>
            <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
              <Clock size={14} /> Còn{' '}
              <span className="font-display font-semibold text-white tabular-nums">
                {cd.d} ngày {cd.h} giờ {String(cd.m).padStart(2, '0')}:{String(cd.s).padStart(2, '0')}
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-line bg-slate-950/50 px-4 py-2.5 text-center">
            <div className="text-[11px] text-slate-500">Hạng của bạn</div>
            <div className="font-display text-2xl font-bold text-white">#{myRank}<span className="text-sm text-slate-500">/{n}</span></div>
          </div>
        </div>

        <div className="relative mt-6 flex items-center justify-between gap-1 overflow-x-auto pb-1 no-scrollbar">
          {TIERS.map((t, i) => {
            const current = t.name === 'Gold'
            const passed = i < 2
            return (
              <div key={t.name} className="flex flex-1 items-center">
                <div className={cx('flex flex-col items-center gap-1.5', !current && !passed && 'opacity-50')}>
                  <div
                    className={cx('relative flex items-center justify-center', current ? 'h-16 w-16' : 'h-11 w-11')}
                  >
                    <div
                      className="absolute inset-0 rotate-45 rounded-xl border-2"
                      style={{ borderColor: t.color, background: `radial-gradient(circle, ${t.color}55, #0f172a)`, boxShadow: current ? `0 0 24px ${t.color}88` : undefined }}
                    />
                    <Trophy size={current ? 26 : 18} className="relative" style={{ color: t.color }} />
                  </div>
                  <div className={cx('font-display text-[11px] font-bold whitespace-nowrap', current ? 'text-gold' : 'text-slate-400')}>{t.name}</div>
                </div>
                {i < TIERS.length - 1 && <div className="mx-1 h-0.5 min-w-4 flex-1 rounded" style={{ background: passed ? TIERS[i + 1].color : '#334155' }} />}
              </div>
            )
          })}
        </div>
      </section>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-xl border border-line bg-surface p-1">
          <button onClick={() => setTab('pvp')} className={cx('flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition', tab === 'pvp' ? 'bg-indigo text-white' : 'text-slate-400 hover:text-white')}>
            <Medal size={16} /> Đấu Trường Danh Vọng
          </button>
          <button onClick={() => setTab('study')} className={cx('flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition', tab === 'study' ? 'bg-emerald text-slate-950' : 'text-slate-400 hover:text-white')}>
            <BookCheck size={16} /> Bảng Chăm Chỉ Học Thuật
          </button>
        </div>
        <div className="flex flex-wrap gap-3 text-[11px]">
          <span className="flex items-center gap-1.5 text-emerald"><span className="h-2.5 w-2.5 rounded-sm bg-emerald" /> Top 5 thăng hạng Kim Cương + Rương Trang Bị Tím</span>
          <span className="flex items-center gap-1.5 text-coral"><span className="h-2.5 w-2.5 rounded-sm bg-coral" /> Bottom 3 xuống hạng</span>
        </div>
      </div>

      <section className="card overflow-hidden">
        <div className="hidden grid-cols-[56px_1fr_200px_90px_110px] gap-3 border-b border-line px-5 py-3 text-[11px] font-semibold tracking-wider text-slate-500 uppercase md:grid">
          <span>Hạng</span>
          <span>Người chơi</span>
          <span>{tab === 'pvp' ? 'Vũ khí' : 'Chuỗi ngày'}</span>
          <span className="text-right">{tab === 'pvp' ? 'Tỉ lệ thắng' : 'Lớp'}</span>
          <span className="text-right">{tab === 'pvp' ? 'RP' : 'Từ đã thuộc'}</span>
        </div>
        <ul>
          {rows.map((r, i) => {
            const rank = i + 1
            const promo = rank <= 5
            const demote = rank > n - 3
            const cls = CLASSES.find((c) => c.id === r.cls)!
            const Icon = cls.icon
            return (
              <li key={r.id}>
                {rank === 6 && <ZoneDivider color="#10B981" text="Vùng Thăng Hạng" icon={<TrendingUp size={12} />} />}
                {rank === n - 2 && <ZoneDivider color="#F43F5E" text="Vùng Xuống Hạng" icon={<TrendingDown size={12} />} />}
                <div
                  className={cx(
                    'grid grid-cols-[40px_1fr_auto] items-center gap-3 border-l-4 px-4 py-3 md:grid-cols-[56px_1fr_200px_90px_110px] md:px-5',
                    promo ? 'border-l-emerald bg-emerald/[0.06]' : demote ? 'border-l-coral bg-coral/[0.06]' : 'border-l-transparent',
                    r.me && 'bg-indigo/15 ring-1 ring-indigo/60 ring-inset',
                  )}
                >
                  <span className={cx('font-display text-lg font-bold', rank === 1 ? 'text-gold' : rank === 2 ? 'text-slate-300' : rank === 3 ? 'text-amber-600' : 'text-slate-500')}>
                    {rank}
                  </span>
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display font-bold text-white" style={{ background: `linear-gradient(135deg, ${cls.color}, #1e293b)` }}>
                      {r.name[0].toUpperCase()}
                      <span className="absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-md border border-line bg-bg" title={cls.name}>
                        <Icon size={11} style={{ color: cls.color }} />
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className={cx('truncate font-semibold', r.me ? 'text-indigo-200' : 'text-slate-100')}>@{r.name}</div>
                      <div className="truncate text-[11px] text-slate-500 md:hidden">
                        {tab === 'pvp' ? `${r.winRate}% thắng · ${r.weapon}` : `${r.streak} ngày · ${cls.name}`}
                      </div>
                      {promo && rank <= 5 && tab === 'pvp' && rank === 1 && (
                        <div className="hidden items-center gap-1 text-[10px] text-violet md:flex"><Gift size={10} /> Rương Trang Bị Tím</div>
                      )}
                    </div>
                  </div>
                  <div className="hidden md:block">
                    {tab === 'pvp' ? (
                      <span className="inline-block max-w-full truncate rounded-md border px-2 py-0.5 text-[11px] font-semibold" style={{ color: RARITY[r.rarity].color, borderColor: `${RARITY[r.rarity].color}55`, background: `${RARITY[r.rarity].color}12` }}>
                        {r.weapon}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 font-display text-sm font-semibold text-gold"><Flame size={14} /> {r.streak} ngày</span>
                    )}
                  </div>
                  <div className="hidden text-right font-display text-sm md:block">
                    {tab === 'pvp' ? <span className={r.winRate >= 60 ? 'text-emerald' : 'text-slate-300'}>{r.winRate}%</span> : <span className="text-xs text-slate-400">{cls.name}</span>}
                  </div>
                  <div className="text-right font-display font-bold text-white tabular-nums">
                    {tab === 'pvp' ? r.rp.toLocaleString('en-US') : r.mastered.toLocaleString('en-US')}
                    <span className="ml-1 text-[10px] font-medium text-slate-500">{tab === 'pvp' ? 'RP' : 'từ'}</span>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}

function ZoneDivider({ color, text, icon }: { color: string; text: string; icon: ReactNode }) {
  return (
    <div className="flex items-center gap-2 px-5 py-1.5 text-[10px] font-bold tracking-wider uppercase" style={{ color }}>
      <span className="h-px flex-1" style={{ background: `${color}55` }} />
      {icon} {text}
      <span className="h-px flex-1" style={{ background: `${color}55` }} />
    </div>
  )
}
