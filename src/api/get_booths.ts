import { GameData } from '../data/GameData.ts'

const API_BASE_URL = GameData.apiBaseUrl

export async function get_booths() {
    const res = await fetch(`${API_BASE_URL}/booths`)
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    const data = await res.json()
    const booths = data.reduce(
        (acc: any, item: any) => {
            if (item.type !== 'BOOTHS') return acc

            acc[item.name] = item
            return acc
        }, {}
    )
    return booths
}

export async function get_booths_images() {
    const res = await fetch(`${API_BASE_URL}/booths`)
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    const data = await res.json()
    const boothsImages = data.reduce((acc: Record<string, string>, booth: any) => {
        if (booth.type !== 'BOOTHS') return acc

        if (booth.name && booth.logo) {
            acc[booth.name] = booth.logo
        }
        return acc
    }, {})
    return boothsImages
}
