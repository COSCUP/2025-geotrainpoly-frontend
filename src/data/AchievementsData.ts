export interface Medal {
  id: number
  icon: string
  label: string
  unlocked?: boolean
}

export const achievements: Medal[] = [
  { id: 1, icon: 'mdi:door-open', label: '只是路過', unlocked: false }, // 聊天室發 1 則留言
  { id: 2, icon: 'mdi:account-group', label: '開始融入', unlocked: false }, // 聊天室發 10 則留言
  { id: 3, icon: 'mdi:forum', label: '意見領袖', unlocked: false }, // 聊天室發 30 則留言

  { id: 4, icon: 'mdi:account-heart', label: '有人理我', unlocked: false }, // 聊天室留言獲得 1 個愛心
  { id: 5, icon: 'mdi:sparkles', label: '人氣新星', unlocked: false }, // 聊天室留言獲得 30 個愛心
  { id: 6, icon: 'mdi:fire', label: '魅力無法擋', unlocked: false }, // 聊天室留言獲得 100 個愛心

  { id: 7, icon: 'mdi:hand-heart', label: '給你一顆愛心', unlocked: false }, // 按別人留言愛心 1 次
  { id: 8, icon: 'streamline-ultimate:pasta-bowl-warm-bold', label: '暖心使者', unlocked: false }, // 按別人留言愛心 10 次
  { id: 9, icon: 'mdi:cards-heart', label: '真心不騙', unlocked: false }, // 按別人留言愛心 30 次

  { id: 10, icon: 'mingcute:sunrise-fill', label: '早起的鳥兒有蟲吃', unlocked: false }, // 參與第一天或第二天的開幕
  { id: 11, icon: 'mdi:flag-checkered', label: '最後一哩路', unlocked: false }, // 參與第一天的閉幕
  { id: 12, icon: 'mdi:infinity', label: '有始有終', unlocked: false }, // 參與開幕與閉幕
  // 贊助攤位 12 個社群攤位 33 個共 45 個，教室 25 間
  { id: 13, icon: 'mdi:foot-print', label: '第一哩路', unlocked: false }, // 獲得 1 個板塊
  { id: 14, icon: 'mdi:map-marker-multiple', label: '開疆闢土', unlocked: false }, // 獲得 20 個板塊
  { id: 15, icon: 'mdi:city-variant', label: '坐擁一方', unlocked: false }, // 獲得 60 個板塊

  { id: 16, icon: 'mdi:sign-direction-plus', label: '領域訪客', unlocked: false }, // 有去 TR
  { id: 17, icon: 'mdi:telescope', label: '邊境探索', unlocked: false }, // 有去 RB
  { id: 18, icon: 'mdi:map-legend', label: '秘境巡禮', unlocked: false }, // 有去 AU

]