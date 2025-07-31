export interface Medal {
  id: number
  icon: string
  name: string
  unlocked?: boolean
}

export const achievements: Medal[] = [
  { id: 1, icon: 'mdi:door-open', name: '只是路過', unlocked: false }, // 聊天室發 1 則留言
  { id: 2, icon: 'mdi:account-group', name: '開始融入', unlocked: false }, // 聊天室發 10 則留言
  { id: 3, icon: 'mdi:forum', name: '意見領袖', unlocked: false }, // 聊天室發 30 則留言

  { id: 4, icon: 'mdi:account-heart', name: '有人理我', unlocked: false }, // 聊天室留言獲得 1 個愛心
  { id: 5, icon: 'mdi:sparkles', name: '人氣新星', unlocked: false }, // 聊天室留言獲得 30 個愛心
  { id: 6, icon: 'mdi:fire', name: '魅力無法擋', unlocked: false }, // 聊天室留言獲得 100 個愛心

  { id: 7, icon: 'mdi:hand-heart', name: '給你一顆愛心', unlocked: false }, // 按別人留言愛心 1 次
  { id: 8, icon: 'mingcute:user-heart-fill', name: '暖心使者', unlocked: false }, // 按別人留言愛心 10 次
  { id: 9, icon: 'mdi:cards-heart', name: '真心不騙', unlocked: false }, // 按別人留言愛心 30 次

  { id: 10, icon: 'mingcute:sunrise-fill', name: '早起的鳥兒有蟲吃', unlocked: false }, // 參與第一天或第二天的開幕
  { id: 11, icon: 'mdi:flag-checkered', name: '最後一哩路', unlocked: false }, // 參與第一天的閉幕
  { id: 12, icon: 'mdi:infinity', name: '有始有終', unlocked: false }, // 參與開幕與閉幕
  // 贊助攤位 12 個社群攤位 33 個共 45 個，教室 25 間
  { id: 13, icon: 'mdi:foot-print', name: '第一哩路', unlocked: false }, // 獲得 1 個板塊
  { id: 14, icon: 'mdi:map-marker-multiple', name: '攻城掠地', unlocked: false }, // 獲得 20 個板塊
  { id: 15, icon: 'mdi:city-variant', name: '開疆闢土', unlocked: false }, // 獲得 60 個板塊

  { id: 16, icon: 'mdi:sign-direction-plus', name: '領域訪客', unlocked: false }, // 有去 TR
  { id: 17, icon: 'mdi:telescope', name: '邊境探索', unlocked: false }, // 有去 RB
  { id: 18, icon: 'mdi:map-legend', name: '秘境巡禮', unlocked: false }, // 有去 AU

]