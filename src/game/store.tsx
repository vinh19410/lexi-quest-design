import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  type ClassId,
  type Item,
  type ScreenId,
  type SetId,
  type Slot,
  type Stats,
  INITIAL_EQUIPPED,
  INITIAL_ITEMS,
  INITIAL_RUNES,
  heroStats,
} from './data'

export type BattleMode = 'ranked' | 'friend' | 'pve'

export interface BattleRequest {
  mode: BattleMode
  setId: SetId
  opponent?: string
  stage?: number
  nonce: number
}

export interface BattleOutcome {
  win: boolean
  mode: BattleMode
  setId: SetId
  stage?: number
  rp: number
  gold: number
  xp: number
  missed: string[]
  maxCombo: number
}

export interface Quest {
  id: string
  label: string
  goal: number
  progress: number
  reward: number
  claimed: boolean
}

export interface Toast {
  id: number
  text: string
  tone: 'info' | 'good' | 'bad' | 'gold'
}

interface GameCtx {
  screen: ScreenId
  go: (s: ScreenId) => void
  cls: ClassId
  setCls: (c: ClassId) => void
  items: Item[]
  equipped: Record<Slot, string>
  equip: (id: string) => void
  stats: Stats
  gold: number
  rp: number
  xp: number
  level: number
  streak: number
  runes: string[]
  stones: number
  quests: Quest[]
  claimQuest: (id: string) => void
  pveProgress: Record<SetId, number>
  battleRequest: BattleRequest | null
  startBattle: (r: Omit<BattleRequest, 'nonce'>) => void
  clearBattleRequest: () => void
  finishBattle: (o: BattleOutcome) => void
  forge: (itemId: string, purified: string[]) => void
  toasts: Toast[]
  toast: (text: string, tone?: Toast['tone']) => void
  towerModule: SetId
  setTowerModule: (s: SetId) => void
  invTab: 'gear' | 'forge'
  setInvTab: (t: 'gear' | 'forge') => void
}

const Ctx = createContext<GameCtx | null>(null)

export const XP_PER_LEVEL = 1000

export function GameProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<ScreenId>('home')
  const [cls, setCls] = useState<ClassId>('wordsmith')
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS)
  const [equipped, setEquipped] = useState<Record<Slot, string>>(INITIAL_EQUIPPED)
  const [gold, setGold] = useState(2450)
  const [rp, setRp] = useState(1420)
  const [xp, setXp] = useState(27 * XP_PER_LEVEL + 640)
  const [streak] = useState(14)
  const [runes, setRunes] = useState<string[]>(INITIAL_RUNES)
  const [stones, setStones] = useState(0)
  const [pveProgress, setPveProgress] = useState<Record<SetId, number>>({ ranked: 0, daily: 2, toeic: 1, ielts: 0, it: 0 })
  const [battleRequest, setBattleRequest] = useState<BattleRequest | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [towerModule, setTowerModule] = useState<SetId>('daily')
  const [invTab, setInvTab] = useState<'gear' | 'forge'>('gear')
  const [quests, setQuests] = useState<Quest[]>([
    { id: 'pvp', label: 'Thắng 2 trận PvP', goal: 2, progress: 1, reward: 150, claimed: false },
    { id: 'forge', label: 'Rèn 5 từ vựng bị sai trong Lò Rèn', goal: 5, progress: 2, reward: 120, claimed: false },
    { id: 'combo', label: 'Đạt chuỗi x3 COMBO trong một trận', goal: 1, progress: 0, reward: 80, claimed: false },
    { id: 'tower', label: 'Vượt 1 tầng Tháp Thử Thách', goal: 1, progress: 0, reward: 100, claimed: false },
  ])
  const toastId = useRef(0)

  const toast = useCallback((text: string, tone: Toast['tone'] = 'info') => {
    const id = ++toastId.current
    setToasts((t) => [...t.slice(-2), { id, text, tone }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800)
  }, [])

  const bumpQuest = useCallback((id: string, by: number) => {
    setQuests((qs) => qs.map((q) => (q.id === id ? { ...q, progress: Math.min(q.goal, q.progress + by) } : q)))
  }, [])

  const go = useCallback((s: ScreenId) => {
    setScreen(s)
    window.scrollTo({ top: 0 })
  }, [])

  const equip = useCallback(
    (id: string) => {
      const it = items.find((i) => i.id === id)
      if (!it) return
      setEquipped((e) => ({ ...e, [it.slot]: id }))
    },
    [items],
  )

  const stats = useMemo(() => heroStats(cls, items, equipped), [cls, items, equipped])

  const startBattle = useCallback((r: Omit<BattleRequest, 'nonce'>) => {
    setBattleRequest({ ...r, nonce: Date.now() })
    setScreen('battle')
    window.scrollTo({ top: 0 })
  }, [])

  const clearBattleRequest = useCallback(() => setBattleRequest(null), [])

  const finishBattle = useCallback(
    (o: BattleOutcome) => {
      setRp((v) => Math.max(0, v + o.rp))
      setGold((v) => v + o.gold)
      setXp((v) => v + o.xp)
      if (o.missed.length) setRunes((r) => [...r, ...o.missed.filter((m) => !r.includes(m))])
      if (o.win && o.mode !== 'pve') bumpQuest('pvp', 1)
      if (o.maxCombo >= 3) bumpQuest('combo', 1)
      if (o.win && o.mode === 'pve' && o.stage !== undefined) {
        setPveProgress((p) => {
          const cleared = Math.max(p[o.setId], o.stage! + 1)
          if (cleared >= 4 && p[o.setId] < 4) bumpQuest('tower', 1)
          return { ...p, [o.setId]: cleared }
        })
      }
    },
    [bumpQuest],
  )

  const forge = useCallback(
    (itemId: string, purified: string[]) => {
      setRunes((r) => r.filter((k) => !purified.includes(k)))
      setStones((s) => s + 1)
      bumpQuest('forge', purified.length)
      // The fresh Upgrade Stone is consumed immediately by the anvil.
      setTimeout(() => {
        setStones((s) => s - 1)
        setItems((its) => its.map((i) => (i.id === itemId ? { ...i, level: i.level + 1 } : i)))
      }, 900)
    },
    [bumpQuest],
  )

  const claimQuest = useCallback(
    (id: string) => {
      const q = quests.find((x) => x.id === id)
      if (!q || q.claimed || q.progress < q.goal) return
      setQuests((qs) => qs.map((x) => (x.id === id ? { ...x, claimed: true } : x)))
      setGold((g) => g + q.reward)
      toast(`Nhận +${q.reward} Vàng từ nhiệm vụ "${q.label}"`, 'gold')
    },
    [quests, toast],
  )

  const level = Math.floor(xp / XP_PER_LEVEL)

  const value: GameCtx = {
    screen,
    go,
    cls,
    setCls,
    items,
    equipped,
    equip,
    stats,
    gold,
    rp,
    xp,
    level,
    streak,
    runes,
    stones,
    quests,
    claimQuest,
    pveProgress,
    battleRequest,
    startBattle,
    clearBattleRequest,
    finishBattle,
    forge,
    toasts,
    toast,
    towerModule,
    setTowerModule,
    invTab,
    setInvTab,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useGame() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useGame must be used within GameProvider')
  return c
}
