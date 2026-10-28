import { useState } from 'react'
import { Swords, Users, Castle, Copy, Check, ChevronRight, Target, Gift, Radio, LogIn, Sparkles } from 'lucide-react'
import { useGame } from '../game/store'
import { CLASSES, MODULES, SLOT_LABEL, type Slot } from '../game/data'
import { HeroAvatar, ItemIcon, Modal, Pill, StatPanel, Bar, cx, statLine } from '../components/ui'

const SLOTS: Slot[] = ['weapon', 'armor', 'accessory', 'pet']

export default function Home() {
  const g = useGame()
  const cls = CLASSES.find((c) => c.id === g.cls)!
  const [roomOpen, setRoomOpen] = useState(false)

  return (
    <div className="grid gap-5 xl:grid-cols-[1.15fr_1fr]">
      {/* HERO SHOWCASE */}
      <section className="card relative overflow-hidden p-5 sm:p-6">
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl transition-colors duration-700" style={{ background: `${cls.color}22` }} />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="font-display text-[11px] font-semibold tracking-[0.2em] text-slate-500 uppercase">Nhân vật của bạn</div>
            <h1 className="font-display text-2xl font-bold text-white">@LexiHero</h1>
          </div>
          <div className="flex rounded-xl border border-line bg-slate-950/50 p-1" role="tablist">
            {CLASSES.map((c) => {
              const Icon = c.icon
              const active = c.id === g.cls
              return (
                <button
                  key={c.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => g.setCls(c.id)}
                  className={cx('flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition', active ? 'text-white' : 'text-slate-400 hover:text-slate-200')}
                  style={active ? { background: `${c.color}26`, boxShadow: `inset 0 0 0 1px ${c.color}66` } : undefined}
                >
                  <Icon size={14} style={{ color: active ? c.color : undefined }} />
                  <span className="hidden sm:inline">{c.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="relative mt-6 grid gap-6 md:grid-cols-[220px_1fr]">
          <div className="flex flex-col items-center text-center">
            <div className="relative flex h-52 w-52 items-center justify-center">
              <div className="absolute inset-4 rounded-full border border-dashed opacity-40 animate-[radar_20s_linear_infinite]" style={{ borderColor: cls.color }} />
              <div className="absolute bottom-3 h-4 w-32 rounded-[50%] blur-md" style={{ background: `${cls.color}55` }} />
              <HeroAvatar key={cls.id} cls={cls.id} size={140} className="animate-float" />
            </div>
            <div className="font-display text-lg font-bold" style={{ color: cls.color }}>{cls.name}</div>
            <div className="text-sm text-slate-400">{cls.vi}</div>
            <div className="mt-3 rounded-xl border p-3 text-left text-xs leading-relaxed" style={{ borderColor: `${cls.color}44`, background: `${cls.color}0d` }}>
              <div className="mb-0.5 flex items-center gap-1 font-semibold" style={{ color: cls.color }}>
                <Sparkles size={12} /> Nội tại: {cls.passiveName}
              </div>
              <span className="text-slate-300">{cls.passive}</span>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <StatPanel stats={g.stats} />
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Trang bị đang dùng</span>
                <button onClick={() => { g.setInvTab('gear'); g.go('inventory') }} className="flex items-center text-xs font-medium text-cyan hover:underline">
                  Thay đổi <ChevronRight size={14} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {SLOTS.map((s) => {
                  const it = g.items.find((i) => i.id === g.equipped[s])!
                  return (
                    <button
                      key={s}
                      onClick={() => { g.setInvTab('gear'); g.go('inventory') }}
                      className="group flex items-center gap-3 rounded-xl border border-line bg-slate-950/40 p-2.5 text-left transition hover:border-slate-500"
                      title={it.passive}
                    >
                      <ItemIcon item={it} size={44} />
                      <div className="min-w-0">
                        <div className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">{SLOT_LABEL[s]}</div>
                        <div className="truncate text-sm font-semibold text-slate-100">{it.name}</div>
                        <div className="truncate text-[11px] text-slate-400">{statLine(it)}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODES */}
      <section className="flex flex-col gap-5">
        <button
          onClick={() => g.startBattle({ mode: 'ranked', setId: 'ranked' })}
          className="group relative overflow-hidden rounded-2xl border border-indigo/60 bg-gradient-to-br from-indigo via-indigo/90 to-cyan p-6 text-left shadow-[0_10px_40px_-10px_rgba(99,102,241,0.7)] transition hover:-translate-y-0.5"
        >
          <div className="absolute -top-10 -right-6 opacity-20 transition group-hover:rotate-12 group-hover:opacity-30">
            <Swords size={180} />
          </div>
          <div className="relative">
            <Pill color="#fff" className="!bg-white/15">
              <Radio size={11} className="animate-pulse" /> 1,284 người đang tìm trận
            </Pill>
            <div className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">Đấu Xếp Hạng 1v1</div>
            <div className="font-display text-sm font-semibold text-white/70">Ranked PvP · B1 / Gold II</div>
            <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-display text-sm font-bold text-indigo">
              <Swords size={16} /> Tìm Trận Ngay
            </div>
          </div>
        </button>

        <button onClick={() => setRoomOpen(true)} className="card flex items-center gap-4 p-4 text-left transition hover:border-slate-500">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet/15 text-violet">
            <Users size={22} />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-white">Tạo Phòng Đấu Bạn Bè</div>
            <div className="text-xs text-slate-400">
              Room Code: <span className="font-display font-bold tracking-widest text-violet">4829</span>
            </div>
          </div>
          <ChevronRight className="text-slate-500" />
        </button>

        <div className="card p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-gold">
              <Castle size={22} />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-white">Tháp Thử Thách</div>
              <div className="text-xs text-slate-400">Dungeon Raid · Chọn học phần để leo tháp</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[MODULES[2], MODULES[1], MODULES[3], MODULES[0]].map((m) => (
              <button
                key={m.id}
                onClick={() => { g.setTowerModule(m.id); g.go('tower') }}
                className="group rounded-xl border border-line bg-slate-950/40 p-3 text-left transition hover:border-[var(--c)]"
                style={{ ['--c' as string]: m.color }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-100">{m.short}</span>
                  <ChevronRight size={14} className="text-slate-600 transition group-hover:translate-x-0.5" style={{ color: m.color }} />
                </div>
                <div className="mt-1 text-[11px] text-slate-500">Tầng {m.floor} · {m.level}</div>
                <Bar value={g.pveProgress[m.id]} max={4} color={m.color} height={4} className="mt-2" glow={false} />
              </button>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-white">
              <Target size={18} className="text-coral" /> Nhiệm Vụ Hằng Ngày
            </div>
            <span className="text-xs text-slate-500">Làm mới sau 9 giờ</span>
          </div>
          <ul className="flex flex-col gap-3">
            {g.quests.map((q) => {
              const done = q.progress >= q.goal
              return (
                <li key={q.id} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className={cx('text-sm', q.claimed ? 'text-slate-500 line-through' : 'text-slate-200')}>{q.label}</div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <Bar value={q.progress} max={q.goal} color={done ? '#10B981' : '#6366F1'} height={5} className="flex-1" glow={false} />
                      <span className="font-display text-[11px] text-slate-400 tabular-nums">{q.progress}/{q.goal}</span>
                    </div>
                  </div>
                  <button
                    disabled={!done || q.claimed}
                    onClick={() => g.claimQuest(q.id)}
                    className={cx(
                      'flex w-20 items-center justify-center gap-1 rounded-lg border px-2 py-1.5 font-display text-xs font-bold',
                      q.claimed ? 'border-line text-slate-600' : done ? 'animate-pulse border-gold bg-gold/20 text-gold' : 'border-line text-slate-400',
                    )}
                  >
                    {q.claimed ? <Check size={13} /> : <Gift size={13} />}
                    {q.claimed ? 'Đã nhận' : `+${q.reward}`}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <RoomModal open={roomOpen} onClose={() => setRoomOpen(false)} />
    </div>
  )
}

function RoomModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const g = useGame()
  const [copied, setCopied] = useState(false)
  const [code, setCode] = useState('')
  const link = 'https://lexiquest.vn/room/4829'

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link)
    } catch {
      /* clipboard may be blocked in iframes; the UI still confirms */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  const join = () => {
    if (code.length !== 4) return
    onClose()
    g.startBattle({ mode: 'friend', setId: 'ranked', opponent: code === '4829' ? 'BanThan_Lan' : `Phòng_${code}` })
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet/15 text-violet">
          <Users size={20} />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-white">Phòng Đấu Bạn Bè</h3>
          <p className="text-xs text-slate-400">Mời bạn bè hoặc nhập mã phòng 4 chữ số</p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-violet/40 bg-violet/10 p-4 text-center">
        <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Mã phòng của bạn</div>
        <div className="mt-1 font-display text-4xl font-bold tracking-[0.4em] text-white">4829</div>
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-line bg-slate-950/60 p-1.5 pl-3">
          <span className="flex-1 truncate text-left text-xs text-slate-400">{link}</span>
          <button onClick={copy} className="flex items-center gap-1 rounded-md bg-violet px-3 py-1.5 text-xs font-semibold text-white">
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Đã sao chép' : 'Sao chép'}
          </button>
        </div>
      </div>

      <div className="my-5 flex items-center gap-3 text-[11px] text-slate-500">
        <div className="h-px flex-1 bg-line" /> HOẶC VÀO PHÒNG <div className="h-px flex-1 bg-line" />
      </div>

      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
          onKeyDown={(e) => e.key === 'Enter' && join()}
          inputMode="numeric"
          placeholder="_ _ _ _"
          aria-label="Nhập mã phòng"
          className="w-full rounded-xl border border-line bg-slate-950/60 px-4 py-3 text-center font-display text-xl tracking-[0.5em] text-white outline-none focus:border-violet"
        />
        <button
          onClick={join}
          disabled={code.length !== 4}
          className="flex items-center gap-1.5 rounded-xl bg-indigo px-4 font-semibold text-white disabled:opacity-40"
        >
          <LogIn size={16} /> Vào
        </button>
      </div>
    </Modal>
  )
}
