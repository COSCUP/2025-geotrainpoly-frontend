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