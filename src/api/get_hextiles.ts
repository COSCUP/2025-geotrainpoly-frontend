export async function get_hextiles() {
    const res = await fetch('https://test.mirumo.cc/api/hextiles')
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    const data = await res.json()
    return data
}