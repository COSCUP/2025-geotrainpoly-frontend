import { GameData } from "../data/GameData"

const API_TOKEN = GameData.apiToken
const API_BASE_URL = GameData.apiBaseUrl

export async function post_msg(booth_id: string, content: string) {
    const res = await fetch(`${API_BASE_URL}/msg`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            booth_id: booth_id,
            content: content
        }),
    })
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
}