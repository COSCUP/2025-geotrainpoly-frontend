export interface Medal {
  id: number
  icon: string
  name: string
  unlocked?: boolean
}

export const achievements: Medal[] = [
  { id: 1, icon: 'mdi:door-open', name: '只是路過', unlocked: false }, // 聊天室發 1 則留言
  { id: 2, icon: 'mdi:account-group', name: '開始融入', unlocked: false }, // 聊天室發 8 則留言
  { id: 3, icon: 'mdi:forum', name: '意見領袖', unlocked: false }, // 聊天室發 20 則留言

  { id: 10, icon: 'mingcute:sunrise-fill', name: '早起的鳥兒有蟲吃', unlocked: false }, // 參與第一天的開幕
  { id: 11, icon: 'mdi:flag-checkered', name: '最後一哩路', unlocked: false }, // 參與第一天的閉幕
  { id: 12, icon: 'mdi:infinity', name: '有始有終', unlocked: false }, // 參與第二天的開幕
  // 贊助攤位 12 個社群攤位 32 個共 44 個，教室 25 間，共 69 個板塊
  { id: 13, icon: 'mdi:foot-print', name: '第一哩路', unlocked: false }, // 獲得 1 個板塊
  { id: 14, icon: 'mdi:map-marker-multiple', name: '攻城掠地', unlocked: false }, // 獲得 20 個板塊
  { id: 15, icon: 'mdi:city-variant', name: '開疆闢土', unlocked: false }, // 獲得 60 個板塊

  { id: 16, icon: 'mdi:sign-direction-plus', name: '領域訪客', unlocked: false }, // 有去 TR
  { id: 17, icon: 'mdi:telescope', name: '邊境探索', unlocked: false }, // 有去 RB
  { id: 18, icon: 'mdi:map-legend', name: '秘境巡禮', unlocked: false }, // 有去 AU

]
