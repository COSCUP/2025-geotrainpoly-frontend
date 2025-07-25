export async function get_booths() {
    const res = await fetch('https://test.mirumo.cc/api/booths')
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    const data = await res.json()
    const booths = data.reduce(
        (acc: any, item: any) => {
            acc[item.booth_id] = item
            return acc
        }, {}
    )
    return booths
}

export async function get_booths_images() {
    const res = await fetch('https://test.mirumo.cc/api/booths')
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    const data = await res.json()
    const boothsImages: string[] = [...new Set<string>(data.map((s: any) => s.logo))]
    return boothsImages
}