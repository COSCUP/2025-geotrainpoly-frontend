import { GameData } from '../data/GameData.ts'

const API_BASE_URL = GameData.apiBaseUrl

export async function get_booths() {
    const res = await fetch(`${API_BASE_URL}/booths`)
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    const data = await res.json()

    return data
}

export async function get_booths_images() {
    const res = await fetch(`${API_BASE_URL}/booths`)
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    const data = await res.json()
    const boothsImages: string[] = [...new Set<string>(data.map((s: any) => s.logo))]
    return boothsImages
}
