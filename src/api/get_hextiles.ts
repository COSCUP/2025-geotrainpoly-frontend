import { GameData } from '../data/GameData.ts'

const API_TOKEN = GameData.apiToken;
const API_BASE_URL = GameData.apiBaseUrl

export async function get_hextiles() {
  const res = await fetch(`${API_BASE_URL}/hextiles`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`
      },
    }
  )
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
  const data = await res.json()
  return data
}
