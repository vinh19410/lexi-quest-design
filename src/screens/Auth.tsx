import { useEffect, useState, type ButtonHTMLAttributes, type FormEvent, type InputHTMLAttributes, type ReactNode } from 'react'
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Swords, Sparkles, Check, Ghost, ScrollText, Gift, Users, BookOpen, Trophy, LoaderCircle } from 'lucide-react'
import { useGame, CEFR_LABEL, type Cefr } from '../game/store'
import { CLASSES, MODULES, TIERS, type ClassId, type SetId } from '../game/data'
import { HeroAvatar, Bar, cx } from '../components/ui'
import { Logo } from '../components/Shell'

type Mode = 'signin' | 'signup'

export default function Auth() {
  const [mode, setMode] = useState<Mode>('signin')
  const [portal, setPortal] = useState<{ name: string; cls: ClassId; text: string } | null>(null)

  return (
    <div className="grid-bg relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-indigo/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 -bottom-40 h-[480px] w-[480px] rounded-full bg-violet/15 blur-[120px]" />

      <div className="relative mx-auto grid min-h-screen max-w-[1300px] items-center gap-10 px-4 py-8 lg:grid-cols-[1.1fr_1fr] lg:px-8">
        <Showcase />
        <div className="mx-auto w-full max-w-md">
          <div className="mb-6 flex justify-center lg:hidden">
            <Logo />
          </div>
          <div className="card relative overflow-hidden p-6 shadow-2xl shadow-black/50 sm:p-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo via-cyan to-violet" />
            <div className="mb-6 grid grid-cols-2 rounded-xl border border-line bg-slate-950/60 p-1" role="tablist">
              {(
                [
                  { id: 'signin', label: 'Đăng Nhập' },
                  { id: 'signup', label: 'Đăng Ký' },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={mode === t.id}
                  onClick={() => setMode(t.id)}
                  className={cx('rounded-lg py-2.5 font-display text-sm font-bold transition', mode === t.id ? 'bg-indigo text-white shadow-[0_4px_20px_-4px_rgba(99,102,241,0.8)]' : 'text-slate-400 hover:text-white')}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div key={mode} className="animate-fade-up">
              {mode === 'signin' ? <SignIn onPortal={setPortal} onSwitch={() => setMode('signup')} /> : <SignUp onPortal={setPortal} onSwitch={() => setMode('signin')} />}
            </div>
          </div>
          <p className="mt-4 text-center text-[11px] text-slate-600">Bản prototype — tài khoản chỉ được giả lập, không lưu khi tải lại trang.</p>
        </div>
      </div>

      {portal && <Portal {...portal} />}
    </div>
  )
}

// ---------------- Showcase ----------------

function Showcase() {
  return (
    <section className="hidden flex-col lg:flex">
      <Logo />
      <h1 className="mt-10 font-display text-5xl leading-[1.05] font-bold text-white xl:text-6xl">
        Học tiếng Anh.
        <br />
        <span className="bg-gradient-to-r from-indigo via-cyan to-violet bg-clip-text text-transparent">Chinh phục đấu trường.</span>
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-slate-400">
        Mỗi từ vựng là một nhát kiếm, mỗi cấu trúc ngữ pháp là một tấm khiên. Đấu 1v1 thời gian thực, rèn từ sai thành trang bị và leo hạng mỗi tuần.
      </p>

      <div className="relative mt-10 h-64">
        {/* Mini battle card */}
        <div className="card absolute top-6 left-36 w-72 animate-float p-4 shadow-2xl shadow-black/40 xl:left-44">
          <div className="flex items-center justify-between font-display text-[10px] font-bold tracking-wider">
            <span className="text-coral">HIỆP 1 · ATK</span>
            <span className="text-slate-400">2.1s</span>
          </div>
          <div className="mt-2 text-sm font-semibold text-white">
            Closest meaning to <span className="text-coral">'METICULOUS'</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-1.5 text-xs font-semibold">
            <span className="rounded-lg border-2 border-emerald bg-emerald/15 px-2 py-1.5 text-emerald">Tỉ mỉ</span>
            <span className="rounded-lg border border-line px-2 py-1.5 text-slate-500">Cẩu thả</span>
            <span className="rounded-lg border border-line px-2 py-1.5 text-slate-500">Nhanh chóng</span>
            <span className="rounded-lg border border-line px-2 py-1.5 text-slate-500">Bảo thủ</span>
          </div>
          <div className="absolute -top-4 -right-4 rotate-6 rounded-lg bg-coral px-2.5 py-1 font-display text-sm font-bold text-white shadow-lg shadow-coral/40">CRIT -145 HP!</div>
        </div>
        {/* Class avatars */}
        {CLASSES.map((c, i) => (
          <div key={c.id} className="absolute flex items-center gap-3" style={{ left: i * 18, top: i * 78 }}>
            <HeroAvatar cls={c.id} size={58} className="animate-float" />
            <div className="hidden xl:block" style={{ animationDelay: `${i * 0.4}s` }}>
              <div className="font-display text-xs font-bold" style={{ color: c.color }}>{c.name}</div>
              <div className="text-[11px] text-slate-500">{c.vi}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
        {[
          { v: '1,284', l: 'Đang trực tuyến', i: Users, c: '#10B981' },
          { v: '12,000+', l: 'Từ vựng & mẫu câu', i: BookOpen, c: '#06B6D4' },
          { v: '5 bậc', l: 'Giải đấu hằng tuần', i: Trophy, c: '#F59E0B' },
        ].map((s) => (
          <div key={s.l} className="rounded-xl border border-line bg-surface/70 p-3 backdrop-blur">
            <s.i size={16} style={{ color: s.c }} />
            <div className="mt-1.5 font-display text-lg font-bold text-white">{s.v}</div>
            <div className="text-[11px] text-slate-500">{s.l}</div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-2">
        {TIERS.map((t) => (
          <span key={t.name} className="flex items-center gap-1 rounded-full border px-2 py-0.5 font-display text-[10px] font-bold" style={{ color: t.color, borderColor: `${t.color}55` }}>
            <Trophy size={10} /> {t.name}
          </span>
        ))}
      </div>
    </section>
  )
}

// ---------------- Shared inputs ----------------

function Field({
  label,
  icon,
  error,
  right,
  ...props
}: {
  label: string
  icon: ReactNode
  error?: string
  right?: ReactNode
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-300">{label}</span>
      <span
        className={cx(
          'flex items-center gap-2.5 rounded-xl border bg-slate-950/60 px-3.5 transition focus-within:ring-2',
          error ? 'border-coral focus-within:ring-coral/30' : 'border-line focus-within:border-indigo focus-within:ring-indigo/30',
        )}
      >
        <span className={error ? 'text-coral' : 'text-slate-500'}>{icon}</span>
        <input {...props} className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-slate-600" />
        {right}
      </span>
      {error && <span className="mt-1 block animate-fade-up text-[11px] text-coral">{error}</span>}
    </label>
  )
}

function PasswordToggle({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} className="text-slate-500 hover:text-slate-300" aria-label={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>
      {show ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  )
}

function PrimaryButton({ children, loading, ...props }: { children: ReactNode; loading?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={cx(
        'flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo to-cyan px-4 py-3.5 font-display text-base font-bold text-white shadow-[0_8px_30px_-8px_rgba(99,102,241,0.8)] transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60',
        props.className,
      )}
    >
      {loading ? <LoaderCircle size={18} className="animate-spin" /> : null}
      {children}
    </button>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" width="18" height="18" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  )
}

type PortalFn = (p: { name: string; cls: ClassId; text: string }) => void

// ---------------- Sign in ----------------

function SignIn({ onPortal, onSwitch }: { onPortal: PortalFn; onSwitch: () => void }) {
  const g = useGame()
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')
  const [show, setShow] = useState(false)
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState<{ id?: string; pw?: string }>({})
  const [loading, setLoading] = useState(false)
  const [forgot, setForgot] = useState<'idle' | 'sent'>('idle')

  const enter = (name: string, email: string, guest = false) => {
    onPortal({ name, cls: g.cls, text: guest ? 'Đang mở cổng Khách...' : 'Đang mở cổng dịch chuyển...' })
    setTimeout(() => g.signIn({ name, email, cefr: 'B1', guest }), 1500)
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs: typeof errors = {}
    if (!id.trim()) errs.id = 'Hãy nhập tên anh hùng hoặc email.'
    if (pw.length < 6) errs.pw = 'Mật khẩu cần ít nhất 6 ký tự.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      const name = id.includes('@') ? id.split('@')[0] : id.trim()
      enter(name, id.includes('@') ? id : `${name}@lexiquest.vn`)
    }, 700)
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">Chào mừng trở lại!</h2>
        <p className="mt-1 text-sm text-slate-400">
          Chuỗi <span className="font-semibold text-gold">14 ngày</span> của bạn đang chờ được nối dài.
        </p>
      </div>

      <Field label="Tên anh hùng hoặc Email" icon={<User size={16} />} value={id} onChange={(e) => setId(e.target.value)} placeholder="lexihero hoặc ban@email.com" autoComplete="username" error={errors.id} />
      <Field
        label="Mật khẩu"
        icon={<Lock size={16} />}
        type={show ? 'text' : 'password'}
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        placeholder="••••••••"
        autoComplete="current-password"
        error={errors.pw}
        right={<PasswordToggle show={show} onToggle={() => setShow(!show)} />}
      />

      <div className="flex items-center justify-between text-xs">
        <label className="flex cursor-pointer items-center gap-2 text-slate-400">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 accent-indigo-500" />
          Ghi nhớ đăng nhập
        </label>
        <button
          type="button"
          onClick={() => (id.trim() ? setForgot('sent') : setErrors({ id: 'Nhập email để nhận cuộn giấy khôi phục.' }))}
          className="font-semibold text-cyan hover:underline"
        >
          Quên mật khẩu?
        </button>
      </div>

      {forgot === 'sent' && (
        <div className="flex animate-fade-up items-start gap-2 rounded-xl border border-cyan/40 bg-cyan/10 p-3 text-xs text-cyan">
          <ScrollText size={14} className="mt-0.5 shrink-0" />
          Đã gửi Cuộn Giấy Khôi Phục tới hộp thư của "{id}". Kiểm tra email để đặt lại mật khẩu.
        </div>
      )}

      <PrimaryButton type="submit" loading={loading}>
        {!loading && <Swords size={18} />} {loading ? 'Đang xác thực...' : 'Vào Đấu Trường'}
      </PrimaryButton>

      <button
        type="button"
        onClick={() => { setId('lexihero'); setPw('quest123'); setErrors({}) }}
        className="-mt-1 text-center text-[11px] text-slate-500 hover:text-slate-300"
      >
        Tài khoản demo: <span className="font-display font-semibold text-slate-300">lexihero / quest123</span> · <span className="text-cyan">Điền nhanh</span>
      </button>

      <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600">
        <div className="h-px flex-1 bg-line" /> HOẶC <div className="h-px flex-1 bg-line" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={() => enter('lexi.google', 'lexi@gmail.com')} className="flex items-center justify-center gap-2 rounded-xl border border-line bg-slate-950/40 py-2.5 text-sm font-semibold text-slate-200 hover:border-slate-500">
          <GoogleIcon /> Google
        </button>
        <button type="button" onClick={() => enter(`Khach_${Math.floor(1000 + Math.random() * 9000)}`, '', true)} className="flex items-center justify-center gap-2 rounded-xl border border-line bg-slate-950/40 py-2.5 text-sm font-semibold text-slate-200 hover:border-slate-500">
          <Ghost size={16} className="text-violet" /> Chơi thử
        </button>
      </div>

      <p className="text-center text-sm text-slate-400">
        Chưa có nhân vật?{' '}
        <button type="button" onClick={onSwitch} className="font-semibold text-cyan hover:underline">
          Tạo tài khoản mới
        </button>
      </p>
    </form>
  )
}

// ---------------- Sign up ----------------

const STEPS = ['Tạo Tài Khoản', 'Chọn Lớp Nhân Vật', 'Xếp Bậc CEFR']

const ARMOR = [
  { label: 'Giáp Giấy', color: '#F43F5E' },
  { label: 'Giáp Gỗ', color: '#F59E0B' },
  { label: 'Giáp Sắt', color: '#06B6D4' },
  { label: 'Giáp Huyền Thoại', color: '#10B981' },
]

function strength(pw: string) {
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++
  if (/\d/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 12) s++
  return pw ? Math.max(1, s) : 0
}

const CEFR_DESC: Record<Cefr, string> = {
  A2: 'Hiểu câu đơn giản, giao tiếp cơ bản hằng ngày.',
  B1: 'Xử lý tình huống quen thuộc, đọc hiểu văn bản rõ ràng.',
  B2: 'Thảo luận chủ đề chuyên môn, viết luận mạch lạc.',
  C1: 'Dùng ngôn ngữ linh hoạt trong học thuật & công việc.',
}

function SignUp({ onPortal, onSwitch }: { onPortal: PortalFn; onSwitch: () => void }) {
  const g = useGame()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [show, setShow] = useState(false)
  const [agree, setAgree] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [cls, setCls] = useState<ClassId>('wordsmith')
  const [cefr, setCefr] = useState<Cefr>('B1')
  const [goal, setGoal] = useState<SetId>('ielts')
  const st = strength(pw)

  const validate1 = () => {
    const e: Record<string, string> = {}
    if (!/^[A-Za-z0-9_.]{3,16}$/.test(name)) e.name = '3–16 ký tự: chữ không dấu, số, dấu _ hoặc .'
    else if (['lexihero', 'minhtuan_99'].includes(name.toLowerCase())) e.name = 'Tên anh hùng này đã có người sở hữu.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Email không hợp lệ.'
    if (pw.length < 8) e.pw = 'Mật khẩu cần ít nhất 8 ký tự.'
    if (pw2 !== pw || !pw2) e.pw2 = 'Mật khẩu xác nhận không khớp.'
    if (!agree) e.agree = 'Bạn cần đồng ý với Luật Đấu Trường.'
    setErrors(e)
    return !Object.keys(e).length
  }

  const next = (ev?: FormEvent) => {
    ev?.preventDefault()
    if (step === 0 && !validate1()) return
    if (step < 2) return setStep(step + 1)
    onPortal({ name, cls, text: `Đang triệu hồi @${name}...` })
    setTimeout(() => {
      g.signIn({ name, email, cefr }, cls)
      g.setTowerModule(goal)
      g.toast(`Chào mừng @${name}! Quà tân thủ đã được gửi vào Kho Đồ.`, 'gold')
    }, 1700)
  }

  return (
    <form onSubmit={next} noValidate className="flex flex-col gap-4">
      <div>
        <div className="flex items-center justify-between">
          <span className="font-display text-[11px] font-semibold tracking-[0.2em] text-slate-500 uppercase">
            Bước {step + 1}/3 · {STEPS[step]}
          </span>
          {step > 0 && (
            <button type="button" onClick={() => setStep(step - 1)} className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white">
              <ArrowLeft size={13} /> Quay lại
            </button>
          )}
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {STEPS.map((s, i) => (
            <span key={s} className={cx('h-1.5 rounded-full transition-colors duration-500', i <= step ? 'bg-gradient-to-r from-indigo to-cyan' : 'bg-slate-800')} />
          ))}
        </div>
      </div>

      <div key={step} className="flex animate-fade-up flex-col gap-4">
        {step === 0 && (
          <>
            <h2 className="font-display text-2xl font-bold text-white">Khởi tạo anh hùng</h2>
            <Field label="Tên anh hùng" icon={<User size={16} />} value={name} onChange={(e) => setName(e.target.value)} placeholder="vd: QuocBao.dev" autoComplete="username" error={errors.name} />
            <Field label="Email" icon={<Mail size={16} />} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ban@email.com" autoComplete="email" error={errors.email} />
            <div>
              <Field
                label="Mật khẩu"
                icon={<Lock size={16} />}
                type={show ? 'text' : 'password'}
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="Ít nhất 8 ký tự"
                autoComplete="new-password"
                error={errors.pw}
                right={<PasswordToggle show={show} onToggle={() => setShow(!show)} />}
              />
              {pw && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="grid flex-1 grid-cols-4 gap-1">
                    {ARMOR.map((a, i) => (
                      <span key={a.label} className="h-1.5 rounded-full transition-colors" style={{ background: i < st ? ARMOR[st - 1].color : '#1e293b' }} />
                    ))}
                  </div>
                  <span className="font-display text-[11px] font-bold" style={{ color: ARMOR[st - 1].color }}>{ARMOR[st - 1].label}</span>
                </div>
              )}
            </div>
            <Field label="Xác nhận mật khẩu" icon={<Lock size={16} />} type={show ? 'text' : 'password'} value={pw2} onChange={(e) => setPw2(e.target.value)} placeholder="Nhập lại mật khẩu" autoComplete="new-password" error={errors.pw2} />
            <label className="flex cursor-pointer items-start gap-2 text-xs text-slate-400">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 accent-indigo-500" />
              <span>
                Tôi đồng ý với <span className="font-semibold text-cyan">Luật Đấu Trường</span> và <span className="font-semibold text-cyan">Chính sách bảo mật</span>.
                {errors.agree && <span className="block text-coral">{errors.agree}</span>}
              </span>
            </label>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="font-display text-2xl font-bold text-white">Chọn lớp nhân vật</h2>
            <p className="-mt-2 text-sm text-slate-400">Có thể đổi lớp bất cứ lúc nào tại Sảnh Chính.</p>
            <div className="flex flex-col gap-2.5">
              {CLASSES.map((c) => {
                const active = cls === c.id
                return (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setCls(c.id)}
                    className={cx('flex items-center gap-4 rounded-2xl border-2 p-3 text-left transition', active ? '' : 'border-line bg-slate-950/40 hover:border-slate-500')}
                    style={active ? { borderColor: c.color, background: `${c.color}12` } : undefined}
                  >
                    <HeroAvatar cls={c.id} size={56} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-white">{c.name}</span>
                        <span className="text-xs text-slate-400">{c.vi}</span>
                      </div>
                      <div className="mt-0.5 text-xs leading-snug text-slate-400">{c.passive}</div>
                      <div className="mt-1.5 flex gap-3 font-display text-[10px] text-slate-500">
                        <span>HP {c.base.hp}</span>
                        <span>ATK {c.base.atk}</span>
                        <span>DEF {c.base.def}</span>
                      </div>
                    </div>
                    <span className={cx('flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2', active ? 'text-slate-950' : 'border-line')} style={active ? { background: c.color, borderColor: c.color } : undefined}>
                      {active && <Check size={14} />}
                    </span>
                  </button>
                )
              })}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="font-display text-2xl font-bold text-white">Xếp bậc trình độ</h2>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(CEFR_LABEL) as Cefr[]).map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setCefr(c)}
                  className={cx('rounded-xl border-2 p-3 text-left transition', cefr === c ? 'border-indigo bg-indigo/15' : 'border-line bg-slate-950/40 hover:border-slate-500')}
                >
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display text-lg font-bold text-white">{c}</span>
                    <span className="text-[11px] text-slate-400">{CEFR_LABEL[c]}</span>
                  </div>
                  <div className="mt-0.5 text-[11px] leading-snug text-slate-500">{CEFR_DESC[c]}</div>
                </button>
              ))}
            </div>
            <div>
              <div className="mb-2 text-xs font-semibold text-slate-300">Mục tiêu học tập (mở sẵn tầng tháp tương ứng)</div>
              <div className="flex flex-wrap gap-2">
                {MODULES.map((m) => (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setGoal(m.id)}
                    className={cx('rounded-full border px-3 py-1.5 text-xs font-semibold transition', goal === m.id ? '' : 'border-line text-slate-400 hover:text-white')}
                    style={goal === m.id ? { color: m.color, borderColor: m.color, background: `${m.color}18` } : undefined}
                  >
                    {m.short}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-gold/40 bg-gold/10 p-3">
              <Gift size={20} className="shrink-0 text-gold" />
              <div className="text-xs text-slate-300">
                <span className="font-semibold text-gold">Quà tân thủ:</span> Kiếm Phrasal Verb +4, Cú Tinh Anh, 2,450 Vàng và 5 Mảnh Cổ Ngữ để thử Lò Rèn.
              </div>
            </div>
          </>
        )}
      </div>

      <PrimaryButton type="submit">
        {step < 2 ? (
          <>
            Tiếp tục <ArrowRight size={18} />
          </>
        ) : (
          <>
            <Sparkles size={18} /> Bắt Đầu Hành Trình
          </>
        )}
      </PrimaryButton>

      {step === 0 && (
        <p className="text-center text-sm text-slate-400">
          Đã có tài khoản?{' '}
          <button type="button" onClick={onSwitch} className="font-semibold text-cyan hover:underline">
            Đăng nhập
          </button>
        </p>
      )}
    </form>
  )
}

// ---------------- Portal transition ----------------

function Portal({ name, cls, text }: { name: string; cls: ClassId; text: string }) {
  const [p, setP] = useState(0)
  useEffect(() => {
    const t0 = Date.now()
    const i = setInterval(() => {
      const v = Math.min(100, ((Date.now() - t0) / 1400) * 100)
      setP(v)
      if (v >= 100) clearInterval(i)
    }, 30)
    return () => clearInterval(i)
  }, [])
  const c = CLASSES.find((x) => x.id === cls)!
  return (
    <div className="fixed inset-0 z-50 flex animate-fade-up flex-col items-center justify-center bg-bg/95 backdrop-blur">
      <div className="relative flex h-56 w-56 items-center justify-center">
        {[0, 0.5, 1].map((d) => (
          <span key={d} className="absolute inset-8 animate-pulse-ring rounded-full border-2" style={{ borderColor: c.color, animationDelay: `${d}s` }} />
        ))}
        <div className="absolute inset-4 animate-radar rounded-full bg-[conic-gradient(from_0deg,transparent,rgba(99,102,241,0.45),transparent_40%)]" />
        <HeroAvatar cls={cls} size={110} className="animate-float" />
      </div>
      <div className="mt-4 font-display text-xl font-bold text-white">{text}</div>
      <div className="mt-1 text-sm text-slate-400">
        @{name} · <span style={{ color: c.color }}>{c.name}</span>
      </div>
      <Bar value={p} max={100} color={c.color} height={6} className="mt-5 w-64" />
    </div>
  )
}
