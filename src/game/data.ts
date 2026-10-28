import type { LucideIcon } from 'lucide-react'
import {
  Swords,
  BookOpen,
  AudioLines,
  Sword,
  Wand,
  Crosshair,
  Shield,
  Shirt,
  ShieldHalf,
  Hourglass,
  Gem,
  ScrollText,
  Bird,
  Cat,
  Flame,
} from 'lucide-react'

export type ClassId = 'wordsmith' | 'grammarian' | 'arcane'
export type Slot = 'weapon' | 'armor' | 'accessory' | 'pet'
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary'
export type ScreenId = 'home' | 'battle' | 'inventory' | 'tower' | 'league'

export interface Stats {
  hp: number
  atk: number
  def: number
  crit: number
  time: number
}

export interface HeroClass {
  id: ClassId
  name: string
  vi: string
  icon: LucideIcon
  color: string
  passiveName: string
  passive: string
  base: Stats
}

export const CLASSES: HeroClass[] = [
  {
    id: 'wordsmith',
    name: 'Wordsmith',
    vi: 'Chiến Binh Từ Vựng',
    icon: Swords,
    color: '#F43F5E',
    passiveName: 'Lưỡi Kiếm Tốc Ngôn',
    passive: '+20% sát thương khi trả lời dưới 3 giây.',
    base: { hp: 380, atk: 80, def: 30, crit: 12, time: 0 },
  },
  {
    id: 'grammarian',
    name: 'Grammarian',
    vi: 'Pháp Sư Ngữ Pháp',
    icon: BookOpen,
    color: '#10B981',
    passiveName: 'Kết Giới Cú Pháp',
    passive: 'Tạo Khiên chắn +60 khi đạt chuỗi 3 câu đúng liên tiếp.',
    base: { hp: 420, atk: 62, def: 55, crit: 6, time: 1 },
  },
  {
    id: 'arcane',
    name: 'Arcane Speaker',
    vi: 'Thi Nhân Âm Ngữ',
    icon: AudioLines,
    color: '#8B5CF6',
    passiveName: 'Cộng Hưởng Âm Vị',
    passive: 'Tăng 35% tốc độ sạc Mana khi qua câu hỏi Nghe/Phát âm.',
    base: { hp: 360, atk: 72, def: 38, crit: 9, time: 0.5 },
  },
]

export const SLOT_LABEL: Record<Slot, string> = {
  weapon: 'Vũ Khí',
  armor: 'Giáp',
  accessory: 'Phụ Kiện',
  pet: 'Thú Cưng Học Thuật',
}

export const RARITY: Record<Rarity, { label: string; color: string }> = {
  common: { label: 'Thường', color: '#94A3B8' },
  rare: { label: 'Hiếm', color: '#06B6D4' },
  epic: { label: 'Sử Thi', color: '#8B5CF6' },
  legendary: { label: 'Huyền Thoại', color: '#F59E0B' },
}

export interface Item {
  id: string
  name: string
  slot: Slot
  rarity: Rarity
  level: number
  icon: LucideIcon
  /** Stats at +0; each level adds `perLevel`. */
  stats: Partial<Stats>
  perLevel: Partial<Stats>
  passive: string
}

export const INITIAL_ITEMS: Item[] = [
  {
    id: 'sword-phrasal',
    name: 'Kiếm Phrasal Verb',
    slot: 'weapon',
    rarity: 'epic',
    level: 4,
    icon: Sword,
    stats: { atk: 20 },
    perLevel: { atk: 5 },
    passive: 'Tăng 25% sát thương khi gặp câu hỏi Cụm động từ.',
  },
  {
    id: 'staff-perfect',
    name: 'Trượng Thì Hoàn Thành',
    slot: 'weapon',
    rarity: 'rare',
    level: 2,
    icon: Wand,
    stats: { atk: 18, def: 8 },
    perLevel: { atk: 4, def: 2 },
    passive: 'Câu Ngữ pháp đúng gây thêm 30 sát thương phản đòn.',
  },
  {
    id: 'bow-collocation',
    name: 'Cung Collocation',
    slot: 'weapon',
    rarity: 'legendary',
    level: 1,
    icon: Crosshair,
    stats: { atk: 38, crit: 6 },
    perLevel: { atk: 6, crit: 1 },
    passive: 'Đòn Nghe xuyên giáp gây thêm 20% sát thương.',
  },
  {
    id: 'dagger-idiom',
    name: 'Dao Găm Thành Ngữ',
    slot: 'weapon',
    rarity: 'common',
    level: 0,
    icon: Flame,
    stats: { atk: 16 },
    perLevel: { atk: 3 },
    passive: 'Không có nội tại. Đơn giản là sắc bén.',
  },
  {
    id: 'shield-steadfast',
    name: 'Khiên Bất Khuất',
    slot: 'armor',
    rarity: 'epic',
    level: 3,
    icon: Shield,
    stats: { hp: 90, def: 18 },
    perLevel: { hp: 10, def: 4 },
    passive: 'Giữ nguyên chuỗi Combo 1 lần mỗi trận khi trả lời sai.',
  },
  {
    id: 'cloak-article',
    name: 'Áo Choàng Mạo Từ',
    slot: 'armor',
    rarity: 'common',
    level: 1,
    icon: Shirt,
    stats: { hp: 60, def: 8 },
    perLevel: { hp: 8, def: 2 },
    passive: 'Nhẹ nhàng: +0.5 giây suy nghĩ mỗi câu.',
  },
  {
    id: 'plate-conditional',
    name: 'Giáp Câu Điều Kiện',
    slot: 'armor',
    rarity: 'rare',
    level: 2,
    icon: ShieldHalf,
    stats: { hp: 80, def: 22 },
    perLevel: { hp: 10, def: 3 },
    passive: 'Khiên chắn từ Ngữ pháp tăng thêm 25%.',
  },
  {
    id: 'hourglass-scholar',
    name: 'Đồng Hồ Cát Học Giả',
    slot: 'accessory',
    rarity: 'legendary',
    level: 4,
    icon: Hourglass,
    stats: { crit: 7 },
    perLevel: { crit: 2 },
    passive: 'Cộng thêm +1.5 giây thời gian suy nghĩ cho câu Ngữ pháp.',
  },
  {
    id: 'ring-ipa',
    name: 'Nhẫn Phát Âm IPA',
    slot: 'accessory',
    rarity: 'rare',
    level: 1,
    icon: Gem,
    stats: { crit: 4, time: 0.5 },
    perLevel: { crit: 1 },
    passive: 'Mana khởi đầu trận +20.',
  },
  {
    id: 'charm-latin',
    name: 'Bùa Từ Gốc Latin',
    slot: 'accessory',
    rarity: 'epic',
    level: 2,
    icon: ScrollText,
    stats: { atk: 10, time: 0.5 },
    perLevel: { atk: 3, time: 0.25 },
    passive: 'Hiển thị gợi ý gốc từ (prefix/suffix) trong câu Từ vựng.',
  },
  {
    id: 'pet-owl',
    name: 'Cú Tinh Anh',
    slot: 'pet',
    rarity: 'legendary',
    level: 2,
    icon: Bird,
    stats: { hp: 30, def: 5 },
    perLevel: { hp: 5, def: 1 },
    passive: 'Trợ chiến: Loại bỏ 2 đáp án sai (50/50) khi máu dưới 30%.',
  },
  {
    id: 'pet-cat',
    name: 'Mèo Chính Tả',
    slot: 'pet',
    rarity: 'rare',
    level: 1,
    icon: Cat,
    stats: { crit: 3, hp: 20 },
    perLevel: { crit: 1 },
    passive: 'Tự động điền chữ cái đầu tiên trong Chiêu Cuối đánh vần.',
  },
]

export const INITIAL_EQUIPPED: Record<Slot, string> = {
  weapon: 'sword-phrasal',
  armor: 'shield-steadfast',
  accessory: 'hourglass-scholar',
  pet: 'pet-owl',
}

export function itemStats(item: Item): Stats {
  const s: Stats = { hp: 0, atk: 0, def: 0, crit: 0, time: 0 }
  ;(Object.keys(s) as (keyof Stats)[]).forEach((k) => {
    s[k] = (item.stats[k] ?? 0) + (item.perLevel[k] ?? 0) * item.level
  })
  return s
}

export function heroStats(cls: ClassId, items: Item[], equipped: Record<Slot, string>): Stats {
  const base = { ...CLASSES.find((c) => c.id === cls)!.base }
  Object.values(equipped).forEach((id) => {
    const it = items.find((i) => i.id === id)
    if (!it) return
    const s = itemStats(it)
    base.hp += s.hp
    base.atk += s.atk
    base.def += s.def
    base.crit += s.crit
    base.time += s.time
  })
  if (equipped.armor === 'cloak-article') base.time += 0.5
  base.time = Math.round(base.time * 100) / 100
  return base
}

// ---------- Vocabulary bank (used for runes, flashcards, previews) ----------

export interface Word {
  word: string
  ipa: string
  vi: string
  pos: string
  example: string
}

export const WORDS: Record<string, Word> = {
  meticulous: { word: 'Meticulous', ipa: '/məˈtɪk.jə.ləs/', vi: 'Tỉ mỉ, kỹ lưỡng', pos: 'adj', example: 'She is meticulous about code quality.' },
  ubiquitous: { word: 'Ubiquitous', ipa: '/juːˈbɪk.wɪ.təs/', vi: 'Phổ biến khắp nơi', pos: 'adj', example: 'Smartphones are ubiquitous today.' },
  pragmatic: { word: 'Pragmatic', ipa: '/præɡˈmæt.ɪk/', vi: 'Thực dụng, thực tế', pos: 'adj', example: 'We need a pragmatic solution, not a perfect one.' },
  mitigate: { word: 'Mitigate', ipa: '/ˈmɪt.ɪ.ɡeɪt/', vi: 'Giảm nhẹ, làm dịu', pos: 'v', example: 'Backups mitigate the risk of data loss.' },
  bottleneck: { word: 'Bottleneck', ipa: '/ˈbɒt.əl.nek/', vi: 'Điểm nghẽn', pos: 'n', example: 'The database is the main bottleneck.' },
  resilience: { word: 'Resilience', ipa: '/rɪˈzɪl.i.əns/', vi: 'Sự kiên cường, khả năng phục hồi', pos: 'n', example: 'Her resilience after failure inspired the team.' },
  hardly: { word: 'Hardly ... when', ipa: '/ˈhɑːd.li/', vi: 'Vừa mới ... thì (đảo ngữ)', pos: 'grammar', example: 'Hardly had I arrived when it rained.' },
  putoff: { word: 'Put off', ipa: '/pʊt ɒf/', vi: 'Hoãn lại', pos: 'phrasal v', example: 'We had to put off the meeting.' },
  lookforward: { word: 'Look forward to + V-ing', ipa: '/lʊk ˈfɔː.wəd tuː/', vi: 'Mong đợi điều gì', pos: 'grammar', example: "I'm looking forward to seeing you." },
  procrastinate: { word: 'Procrastinate', ipa: '/prəˈkræs.tɪ.neɪt/', vi: 'Trì hoãn, chần chừ', pos: 'v', example: 'Stop procrastinating and start studying.' },
  grateful: { word: 'Grateful', ipa: '/ˈɡreɪt.fəl/', vi: 'Biết ơn', pos: 'adj', example: "I'm grateful for your help." },
  expire: { word: 'Expire', ipa: '/ɪkˈspaɪər/', vi: 'Hết hạn', pos: 'v', example: 'The contract will expire next month.' },
  by: { word: 'By (deadline)', ipa: '/baɪ/', vi: 'Trước/chậm nhất là (hạn chót)', pos: 'grammar', example: 'Submit the report by Friday.' },
  reimbursement: { word: 'Reimbursement', ipa: '/ˌriː.ɪmˈbɜːs.mənt/', vi: 'Sự hoàn tiền, bồi hoàn', pos: 'n', example: 'Keep receipts for reimbursement.' },
  invoice: { word: 'Invoice', ipa: '/ˈɪn.vɔɪs/', vi: 'Hóa đơn', pos: 'n', example: 'Please send the invoice by email.' },
  notonly: { word: 'Not only ... but also', ipa: '/nɒt ˈəʊn.li/', vi: 'Không những ... mà còn (đảo ngữ)', pos: 'grammar', example: 'Not only does it work, but it also scales.' },
  unprecedented: { word: 'Unprecedented', ipa: '/ʌnˈpres.ɪ.den.tɪd/', vi: 'Chưa từng có tiền lệ', pos: 'adj', example: 'The pandemic caused unprecedented change.' },
  sustainable: { word: 'Sustainable', ipa: '/səˈsteɪ.nə.bəl/', vi: 'Bền vững', pos: 'adj', example: 'We need sustainable energy sources.' },
  deprecated: { word: 'Deprecated', ipa: '/ˈdep.rə.keɪ.tɪd/', vi: 'Không còn được khuyến dùng', pos: 'adj', example: 'This API is deprecated in v3.' },
  pastperfectpassive: { word: 'Had been + V3', ipa: '/hæd biːn/', vi: 'Quá khứ hoàn thành bị động', pos: 'grammar', example: 'The bug had been fixed before release.' },
  refactor: { word: 'Refactor', ipa: '/ˌriːˈfæk.tər/', vi: 'Tái cấu trúc mã nguồn', pos: 'v', example: 'Let us refactor this module.' },
  leverage: { word: 'Leverage', ipa: '/ˈliː.vər.ɪdʒ/', vi: 'Tận dụng, đòn bẩy', pos: 'v', example: 'Leverage existing tools.' },
  ambiguous: { word: 'Ambiguous', ipa: '/æmˈbɪɡ.ju.əs/', vi: 'Mơ hồ, không rõ ràng', pos: 'adj', example: 'The requirement is ambiguous.' },
  scrutinize: { word: 'Scrutinize', ipa: '/ˈskruː.tɪ.naɪz/', vi: 'Xem xét kỹ lưỡng', pos: 'v', example: 'Reviewers scrutinize every pull request.' },
  stakeholder: { word: 'Stakeholder', ipa: '/ˈsteɪkˌhəʊl.dər/', vi: 'Bên liên quan', pos: 'n', example: 'Update all stakeholders weekly.' },
  latency: { word: 'Latency', ipa: '/ˈleɪ.tən.si/', vi: 'Độ trễ', pos: 'n', example: 'We reduced latency by 40%.' },
  figureout: { word: 'Figure out', ipa: '/ˈfɪɡ.ər aʊt/', vi: 'Tìm ra, hiểu ra', pos: 'phrasal v', example: "I can't figure out this bug." },
  negotiate: { word: 'Negotiate', ipa: '/nəˈɡəʊ.ʃi.eɪt/', vi: 'Đàm phán', pos: 'v', example: 'They negotiated a better price.' },
  coherent: { word: 'Coherent', ipa: '/kəʊˈhɪə.rənt/', vi: 'Mạch lạc', pos: 'adj', example: 'Write a coherent essay.' },
}

export const INITIAL_RUNES = ['meticulous', 'ubiquitous', 'pragmatic', 'mitigate', 'bottleneck']

// ---------- Battle questions ----------

export type QType = 'vocab' | 'grammar' | 'listening' | 'ultimate'

export interface Question {
  type: QType
  wordKey: string
  prompt: string
  context?: string
  highlight?: string
  options?: string[]
  answer?: number
  speak?: string
  spell?: string
  hint?: string
  phrasal?: boolean
  explain: string
}

export const ROUND_META: Record<QType, { title: string; en: string; color: string; tag: string }> = {
  vocab: { title: 'Đòn Tấn Công Từ Vựng', en: 'Vocabulary Strike', color: '#F43F5E', tag: 'ATK' },
  grammar: { title: 'Khiên Chắn Ngữ Pháp', en: 'Grammar Shield', color: '#10B981', tag: 'DEF' },
  listening: { title: 'Đòn Xuyên Giáp Luyện Nghe', en: 'Listening Echo', color: '#06B6D4', tag: 'PIERCE' },
  ultimate: { title: 'Chiêu Cuối Thần Chú', en: 'Ultimate Burst', color: '#8B5CF6', tag: 'ULT' },
}

export type SetId = 'ranked' | 'daily' | 'toeic' | 'ielts' | 'it'

export const QUESTION_SETS: Record<SetId, Question[]> = {
  ranked: [
    {
      type: 'vocab',
      wordKey: 'meticulous',
      prompt: "Choose the closest meaning to 'METICULOUS'",
      context: 'She is meticulous about code quality.',
      highlight: 'meticulous',
      options: ['Tỉ mỉ', 'Cẩu thả', 'Nhanh chóng', 'Bảo thủ'],
      answer: 0,
      hint: 'Gốc Latin "metus" = sự e sợ → cẩn trọng từng chi tiết.',
      explain: 'Meticulous = cực kỳ cẩn thận, chú ý từng chi tiết.',
    },
    {
      type: 'grammar',
      wordKey: 'hardly',
      prompt: 'Hardly ___ the deployment finished when the server crashed.',
      options: ['had', 'did', 'was', 'have'],
      answer: 0,
      explain: 'Đảo ngữ "Hardly + had + S + V3 ... when + S + V2" diễn tả hai hành động nối tiếp trong quá khứ.',
    },
    {
      type: 'listening',
      wordKey: 'ubiquitous',
      prompt: 'Nghe phát âm và chọn từ + nghĩa chính xác',
      speak: 'ubiquitous',
      options: ['Ubiquitous - Phổ biến khắp nơi', 'Iniquitous - Bất công, tội lỗi', 'Ambiguous - Mơ hồ', 'Obsequious - Khúm núm'],
      answer: 0,
      explain: 'Ubiquitous /juːˈbɪk.wɪ.təs/ = có mặt ở khắp mọi nơi.',
    },
    {
      type: 'ultimate',
      wordKey: 'resilience',
      prompt: 'Đánh vần hoặc phát âm để tung Chiêu Cuối',
      spell: 'RESILIENCE',
      speak: 'resilience',
      explain: 'Resilience = khả năng phục hồi, sự kiên cường.',
    },
  ],
  daily: [
    {
      type: 'vocab',
      wordKey: 'putoff',
      prompt: "Choose the closest meaning to 'PUT OFF'",
      context: 'We had to put off the meeting until Friday.',
      highlight: 'put off',
      options: ['Hoãn lại', 'Dập tắt', 'Mặc vào', 'Chịu đựng'],
      answer: 0,
      phrasal: true,
      hint: '"off" thường mang nghĩa rời xa/đẩy ra → đẩy lùi thời gian.',
      explain: 'Put off = postpone = hoãn lại.',
    },
    {
      type: 'grammar',
      wordKey: 'lookforward',
      prompt: "I'm looking forward ___ you at the party.",
      options: ['to seeing', 'to see', 'seeing', 'see'],
      answer: 0,
      explain: '"Look forward to" — "to" là giới từ nên theo sau là V-ing.',
    },
    {
      type: 'listening',
      wordKey: 'procrastinate',
      prompt: 'Nghe phát âm và chọn từ + nghĩa chính xác',
      speak: 'procrastinate',
      options: ['Procrastinate - Trì hoãn', 'Proliferate - Sinh sôi nảy nở', 'Propagate - Lan truyền', 'Precipitate - Gây ra đột ngột'],
      answer: 0,
      explain: 'Procrastinate /prəˈkræs.tɪ.neɪt/ = chần chừ, trì hoãn.',
    },
    { type: 'ultimate', wordKey: 'grateful', prompt: 'Đánh vần hoặc phát âm để tung Chiêu Cuối', spell: 'GRATEFUL', speak: 'grateful', explain: 'Grateful = biết ơn.' },
  ],
  toeic: [
    {
      type: 'vocab',
      wordKey: 'expire',
      prompt: "Choose the closest meaning to 'EXPIRE'",
      context: 'The service contract will expire at the end of the month.',
      highlight: 'expire',
      options: ['Hết hạn', 'Gia hạn', 'Ký kết', 'Đàm phán'],
      answer: 0,
      hint: 'Tiền tố "ex-" = ra ngoài, kết thúc.',
      explain: 'Expire = hết hiệu lực, hết hạn.',
    },
    {
      type: 'grammar',
      wordKey: 'by',
      prompt: 'All employees must submit their expense reports ___ Friday.',
      options: ['by', 'until', 'at', 'since'],
      answer: 0,
      explain: '"By + thời điểm" = chậm nhất là, dùng với hành động hoàn tất trước hạn chót.',
    },
    {
      type: 'listening',
      wordKey: 'reimbursement',
      prompt: 'Nghe phát âm và chọn từ + nghĩa chính xác',
      speak: 'reimbursement',
      options: ['Reimbursement - Sự hoàn tiền', 'Recruitment - Sự tuyển dụng', 'Requirement - Yêu cầu', 'Refurbishment - Sự tân trang'],
      answer: 0,
      explain: 'Reimbursement /ˌriː.ɪmˈbɜːs.mənt/ = khoản bồi hoàn chi phí.',
    },
    { type: 'ultimate', wordKey: 'invoice', prompt: 'Đánh vần hoặc phát âm để tung Chiêu Cuối', spell: 'INVOICE', speak: 'invoice', explain: 'Invoice = hóa đơn.' },
  ],
  ielts: [
    {
      type: 'vocab',
      wordKey: 'mitigate',
      prompt: "Choose the closest meaning to 'MITIGATE'",
      context: 'Governments must mitigate the effects of climate change.',
      highlight: 'mitigate',
      options: ['Giảm nhẹ', 'Làm trầm trọng', 'Phớt lờ', 'Đo lường'],
      answer: 0,
      hint: 'Gốc Latin "mitis" = mềm, dịu.',
      explain: 'Mitigate = làm giảm mức độ nghiêm trọng.',
    },
    {
      type: 'grammar',
      wordKey: 'notonly',
      prompt: 'Not only ___ the policy reduce emissions, but it also creates jobs.',
      options: ['does', 'is', 'has', 'do'],
      answer: 0,
      explain: 'Đảo ngữ "Not only + trợ động từ + S + V". Chủ ngữ số ít, thì hiện tại → does.',
    },
    {
      type: 'listening',
      wordKey: 'unprecedented',
      prompt: 'Nghe phát âm và chọn từ + nghĩa chính xác',
      speak: 'unprecedented',
      options: ['Unprecedented - Chưa từng có', 'Unpredictable - Khó đoán trước', 'Unrepresented - Không được đại diện', 'Underestimated - Bị đánh giá thấp'],
      answer: 0,
      explain: 'Unprecedented /ʌnˈpres.ɪ.den.tɪd/ = chưa từng có tiền lệ.',
    },
    { type: 'ultimate', wordKey: 'sustainable', prompt: 'Đánh vần hoặc phát âm để tung Chiêu Cuối', spell: 'SUSTAINABLE', speak: 'sustainable', explain: 'Sustainable = bền vững.' },
  ],
  it: [
    {
      type: 'vocab',
      wordKey: 'deprecated',
      prompt: "Choose the closest meaning to 'DEPRECATED'",
      context: 'This endpoint is deprecated and will be removed in v3.',
      highlight: 'deprecated',
      options: ['Không còn được khuyến dùng', 'Mới phát hành', 'Đã được tối ưu', 'Được bảo mật'],
      answer: 0,
      hint: 'Tiền tố "de-" = đi xuống, giảm giá trị.',
      explain: 'Deprecated = vẫn tồn tại nhưng không nên dùng nữa.',
    },
    {
      type: 'grammar',
      wordKey: 'pastperfectpassive',
      prompt: 'The critical bug ___ by the time the release went live.',
      options: ['had been fixed', 'has fixed', 'was fixing', 'fixes'],
      answer: 0,
      explain: '"By the time + quá khứ đơn" → mệnh đề chính dùng quá khứ hoàn thành; bug bị sửa → bị động.',
    },
    {
      type: 'listening',
      wordKey: 'bottleneck',
      prompt: 'Nghe phát âm và chọn từ + nghĩa chính xác',
      speak: 'bottleneck',
      options: ['Bottleneck - Điểm nghẽn', 'Bootstrap - Khởi tạo', 'Backlog - Việc tồn đọng', 'Breakpoint - Điểm dừng'],
      answer: 0,
      explain: 'Bottleneck /ˈbɒt.əl.nek/ = điểm nghẽn làm chậm cả hệ thống.',
    },
    { type: 'ultimate', wordKey: 'refactor', prompt: 'Đánh vần hoặc phát âm để tung Chiêu Cuối', spell: 'REFACTOR', speak: 'refactor', explain: 'Refactor = tái cấu trúc mã nguồn.' },
  ],
}

// ---------- PvE modules ----------

export interface Module {
  id: SetId
  floor: number
  name: string
  short: string
  level: string
  color: string
  boss: string
  stages: string[]
  vocab: string[]
  grammar: { title: string; rule: string; example: string }
}

export const MODULES: Module[] = [
  {
    id: 'daily',
    floor: 1,
    name: 'Giao Tiếp & Phrasal Verbs Thông Dụng',
    short: 'Giao Tiếp Phản Xạ',
    level: 'CEFR A2-B1',
    color: '#10B981',
    boss: 'Golem Cụm Động Từ',
    stages: ['Quán Cà Phê Small Talk', 'Chợ Phiên Phrasal', 'Bến Tàu Hẹn Gặp'],
    vocab: ['putoff', 'figureout', 'procrastinate', 'grateful'],
    grammar: { title: 'Look forward to + V-ing', rule: '"to" là giới từ → động từ theo sau thêm -ing.', example: "I'm looking forward to hearing from you." },
  },
  {
    id: 'toeic',
    floor: 2,
    name: 'Đấu Trường TOEIC Business & Công Sở',
    short: 'TOEIC Business',
    level: 'TOEIC 600-850+',
    color: '#06B6D4',
    boss: 'Giám Đốc Hợp Đồng Ma',
    stages: ['Phòng Họp Tầng 12', 'Kho Hóa Đơn', 'Bàn Đàm Phán'],
    vocab: ['expire', 'reimbursement', 'invoice', 'negotiate'],
    grammar: { title: 'By vs. Until', rule: '"By" = hạn chót hoàn thành; "Until" = kéo dài liên tục đến thời điểm.', example: 'Finish it by 5 PM. / Work until 5 PM.' },
  },
  {
    id: 'ielts',
    floor: 3,
    name: 'Hang Động IELTS Academic Vocabulary',
    short: 'IELTS Academic',
    level: 'Band 6.5-8.0',
    color: '#8B5CF6',
    boss: 'Nhân Sư Writing Task 2',
    stages: ['Thư Viện Cổ', 'Hồ Dữ Liệu Biểu Đồ', 'Mê Cung Lập Luận'],
    vocab: ['mitigate', 'unprecedented', 'sustainable', 'coherent'],
    grammar: { title: 'Đảo ngữ Not only', rule: 'Not only + trợ động từ + S + V, but + S + also + V.', example: 'Not only does it save money, but it also saves time.' },
  },
  {
    id: 'it',
    floor: 4,
    name: 'Thung Lũng IT / Software Engineering English',
    short: 'IT & Tech English',
    level: 'Chuyên ngành',
    color: '#F59E0B',
    boss: 'Rồng Legacy Code',
    stages: ['Trạm Code Review', 'Rừng Microservices', 'Pháo Đài CI/CD'],
    vocab: ['deprecated', 'bottleneck', 'refactor', 'latency'],
    grammar: { title: 'Quá khứ hoàn thành bị động', rule: 'S + had been + V3 — hành động bị tác động, xảy ra trước một mốc quá khứ.', example: 'The tests had been run before the deploy.' },
  },
]

// ---------- League ----------

export interface LeaguePlayer {
  id: string
  name: string
  cls: ClassId
  weapon: string
  rarity: Rarity
  winRate: number
  rp: number
  mastered: number
  streak: number
  hue: number
}

export const LEAGUE_PLAYERS: LeaguePlayer[] = [
  { id: 'p1', name: 'MinhTuan_99', cls: 'wordsmith', weapon: 'Cung Collocation', rarity: 'legendary', winRate: 74, rp: 1612, mastered: 1840, streak: 96, hue: 340 },
  { id: 'p2', name: 'LinhChi.ielts', cls: 'grammarian', weapon: 'Trượng Đảo Ngữ', rarity: 'legendary', winRate: 71, rp: 1588, mastered: 2310, streak: 210, hue: 160 },
  { id: 'p3', name: 'DevHoang', cls: 'arcane', weapon: 'Đàn Hạc IPA', rarity: 'epic', winRate: 69, rp: 1541, mastered: 1210, streak: 33, hue: 260 },
  { id: 'p4', name: 'thao_toeic900', cls: 'grammarian', weapon: 'Giáp Câu Điều Kiện', rarity: 'epic', winRate: 66, rp: 1503, mastered: 2950, streak: 301, hue: 190 },
  { id: 'p5', name: 'QuocBao.dev', cls: 'wordsmith', weapon: 'Kiếm Phrasal Verb', rarity: 'epic', winRate: 68, rp: 1477, mastered: 980, streak: 21, hue: 20 },
  { id: 'p6', name: 'AnhThu_B2', cls: 'arcane', weapon: 'Nhẫn Phát Âm IPA', rarity: 'rare', winRate: 63, rp: 1449, mastered: 1530, streak: 58, hue: 290 },
  { id: 'p7', name: 'KhoaNguyen', cls: 'wordsmith', weapon: 'Dao Găm Thành Ngữ', rarity: 'common', winRate: 61, rp: 1398, mastered: 640, streak: 9, hue: 0 },
  { id: 'p8', name: 'MaiPhuong', cls: 'grammarian', weapon: 'Trượng Thì Hoàn Thành', rarity: 'rare', winRate: 58, rp: 1371, mastered: 3420, streak: 365, hue: 120 },
  { id: 'p9', name: 'ducanh.speak', cls: 'arcane', weapon: 'Sáo Ngữ Điệu', rarity: 'rare', winRate: 57, rp: 1350, mastered: 870, streak: 14, hue: 230 },
  { id: 'p10', name: 'HaVy2006', cls: 'wordsmith', weapon: 'Cung Collocation', rarity: 'legendary', winRate: 54, rp: 1322, mastered: 1120, streak: 40, hue: 320 },
  { id: 'p11', name: 'TrungKien', cls: 'grammarian', weapon: 'Áo Choàng Mạo Từ', rarity: 'common', winRate: 51, rp: 1297, mastered: 410, streak: 4, hue: 100 },
  { id: 'p12', name: 'ngoc.lan', cls: 'arcane', weapon: 'Bùa Từ Gốc Latin', rarity: 'epic', winRate: 49, rp: 1268, mastered: 2040, streak: 120, hue: 280 },
  { id: 'p13', name: 'PhatLe', cls: 'wordsmith', weapon: 'Dao Găm Thành Ngữ', rarity: 'common', winRate: 45, rp: 1231, mastered: 220, streak: 2, hue: 30 },
  { id: 'p14', name: 'yen.nhi', cls: 'grammarian', weapon: 'Khiên Bất Khuất', rarity: 'epic', winRate: 42, rp: 1204, mastered: 760, streak: 17, hue: 150 },
]

export const TIERS = [
  { name: 'Bronze', vi: 'Đồng', color: '#B45309', min: 0 },
  { name: 'Silver', vi: 'Bạc', color: '#94A3B8', min: 1000 },
  { name: 'Gold', vi: 'Vàng', color: '#F59E0B', min: 1300 },
  { name: 'Diamond', vi: 'Kim Cương', color: '#06B6D4', min: 1600 },
  { name: 'Grandmaster', vi: 'Đại Kiện Tướng', color: '#F43F5E', min: 1900 },
]

export function rankLabel(rp: number) {
  const idx = [...TIERS].reverse().findIndex((t) => rp >= t.min)
  const tier = TIERS[TIERS.length - 1 - idx]
  const next = TIERS[TIERS.length - idx]
  const span = (next?.min ?? tier.min + 300) - tier.min
  const div = Math.min(2, Math.floor(((rp - tier.min) / span) * 3))
  return { tier, division: ['III', 'II', 'I'][div], label: `${tier.name} ${['III', 'II', 'I'][div]}` }
}

export function speak(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = 0.85
  window.speechSynthesis.speak(u)
}
