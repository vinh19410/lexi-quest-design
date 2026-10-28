import type { ReactNode } from 'react'
import { Coins, Flame, Skull, Home, Swords, Hammer, Castle, Trophy, Sparkles, GraduationCap } from 'lucide-react'
import { useGame, XP_PER_LEVEL } from '../game/store'
import { rankLabel, type ScreenId } from '../game/data'
import { cx } from './ui'

const NAV: { id: ScreenId; label: string; short: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Sảnh Chính & Nhân Vật', short: 'Sảnh', icon: Home },
  { id: 'battle', label: 'Đấu Trường 1v1', short: 'Đấu', icon: Swords },
  { id: 'inventory', label: 'Kho Đồ & Lò Rèn', short: 'Lò Rèn', icon: Hammer },
  { id: 'tower', label: 'Tháp Thử Thách', short: 'Tháp', icon: Castle },
  { id: 'league', label: 'Bảng Xếp Hạng', short: 'Xếp Hạng', icon: Trophy },
]

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex h-9 w-9 items-center justify-center">
        <div className="absolute inset-0 rotate-45 rounded-lg bg-gradient-to-br from-indigo to-cyan" />
        <Sparkles size={18} className="relative text-white" />
      </div>
      <div className="leading-none">
        <div className="font-display text-lg font-bold tracking-wide text-white">
          Lexi<span className="text-cyan">Quest</span>
        </div>
        <div className="text-[10px] font-medium tracking-wider text-slate-500">ĐẤU TRƯỜNG ANH NGỮ</div>
      </div>
    </div>
  )
}

function TopBar() {
  const { level, xp, gold, runes, streak, rp, go, setInvTab } = useGame()
  const pct = ((xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100
  const rank = rankLabel(rp)
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
        <div className="lg:hidden">
          <Logo />
        </div>
        <div className="no-scrollbar ml-auto flex items-center gap-2 overflow-x-auto lg:ml-0 lg:w-full">
          {/* Level ring */}
          <div className="flex shrink-0 items-center gap-2 rounded-xl border border-line bg-surface px-2 py-1.5" title={`${xp % XP_PER_LEVEL}/${XP_PER_LEVEL} XP`}>
            <div className="relative h-8 w-8">
              <svg viewBox="0 0 36 36" className="h-8 w-8 -rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#334155" strokeWidth="3" />
                <circle cx="18" cy="18" r="15" fill="none" stroke="url(#xpg)" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${pct * 0.942} 100`} className="transition-all duration-700" />
                <defs>
                  <linearGradient id="xpg">
                    <stop offset="0" stopColor="#6366F1" />
                    <stop offset="1" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-display text-xs font-bold text-white">{level}</span>
            </div>
            <div className="hidden pr-1 leading-tight sm:block">
              <div className="text-[10px] text-slate-500">Cấp độ</div>
              <div className="font-display text-xs font-semibold text-slate-200">Lv. {level}</div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 rounded-xl border border-indigo/40 bg-indigo/10 px-2.5 py-2 text-xs font-semibold text-indigo-300">
            <GraduationCap size={15} />
            <span className="font-display">B1</span>
            <span className="hidden text-indigo-300/70 xl:inline">- Intermediate</span>
          </div>

          <div className="flex-1 max-lg:hidden" />

          <Stat icon={<Coins size={15} />} color="#F59E0B" value={gold.toLocaleString('vi-VN')} label="Vàng" />
          <button onClick={() => { setInvTab('forge'); go('inventory') }} className="shrink-0" title="Cổ Ngữ Bị Nguyền — bấm để mở Lò Rèn">
            <Stat icon={<Skull size={15} />} color="#8B5CF6" value={String(runes.length)} label="Cổ Ngữ" />
          </button>
          <Stat icon={<Flame size={15} className="fill-gold/30" />} color="#F59E0B" value={`${streak} ngày`} label="Chuỗi" />
          <div
            className="flex shrink-0 items-center gap-2 rounded-xl border px-2.5 py-1.5"
            style={{ borderColor: `${rank.tier.color}66`, background: `linear-gradient(90deg, ${rank.tier.color}22, transparent)` }}
          >
            <Trophy size={16} style={{ color: rank.tier.color }} />
            <div className="leading-tight">
              <div className="font-display text-xs font-bold" style={{ color: rank.tier.color }}>{rank.label}</div>
              <div className="font-display text-[10px] text-slate-400 tabular-nums">{rp.toLocaleString('en-US')} RP</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

function Stat({ icon, color, value, label }: { icon: ReactNode; color: string; value: string; label: string }) {
  return (
    <div className="flex shrink-0 items-center gap-1.5 rounded-xl border border-line bg-surface px-2.5 py-2" title={label}>
      <span style={{ color }}>{icon}</span>
      <span className="font-display text-sm font-semibold text-slate-100 tabular-nums">{value}</span>
    </div>
  )
}

function SideNav() {
  const { screen, go, runes } = useGame()
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-line bg-[#0c1324] lg:flex">
      <div className="flex h-16 items-center border-b border-line px-5">
        <Logo />
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV.map((n) => {
          const active = screen === n.id
          const Icon = n.icon
          return (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              className={cx(
                'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition',
                active ? 'bg-indigo/15 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200',
              )}
            >
              {active && <span className="absolute top-2 bottom-2 left-0 w-1 rounded-r bg-gradient-to-b from-indigo to-cyan" />}
              <Icon size={19} className={active ? 'text-cyan' : ''} />
              {n.label}
              {n.id === 'inventory' && runes.length > 0 && (
                <span className="ml-auto rounded-full bg-violet/20 px-1.5 text-[11px] font-bold text-violet">{runes.length}</span>
              )}
            </button>
          )
        })}
      </nav>
      <div className="m-3 rounded-xl border border-line bg-surface p-4">
        <div className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">Mẹo hôm nay</div>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
          Từ trả lời sai hoặc chậm sẽ thành <span className="text-violet">Cổ Ngữ Bị Nguyền</span>. Ôn lại trong Lò Rèn để nhận Đá Cường Hóa!
        </p>
      </div>
    </aside>
  )
}

function BottomNav() {
  const { screen, go } = useGame()
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-line bg-[#0c1324]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      {NAV.map((n) => {
        const active = screen === n.id
        const Icon = n.icon
        return (
          <button key={n.id} onClick={() => go(n.id)} className={cx('flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium', active ? 'text-cyan' : 'text-slate-500')}>
            <Icon size={20} />
            {n.short}
          </button>
        )
      })}
    </nav>
  )
}

function Toasts() {
  const { toasts } = useGame()
  const tone = { info: '#6366F1', good: '#10B981', bad: '#F43F5E', gold: '#F59E0B' }
  return (
    <div className="pointer-events-none fixed top-20 right-4 z-[60] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className="card animate-fade-up border-l-4 px-4 py-3 text-sm text-slate-100 shadow-xl shadow-black/40" style={{ borderLeftColor: tone[t.tone] }}>
          {t.text}
        </div>
      ))}
    </div>
  )
}

export default function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid-bg">
      <SideNav />
      <div className="lg:pl-64">
        <TopBar />
        <main className="mx-auto max-w-[1400px] px-4 pt-5 pb-28 lg:px-6 lg:pb-10">{children}</main>
      </div>
      <BottomNav />
      <Toasts />
    </div>
  )
}
