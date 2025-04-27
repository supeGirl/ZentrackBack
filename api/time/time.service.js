export async function getTime() {
  try {
    const res = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=Europe/Berlin')
    if (!res.ok) throw new Error(`Failed to fetch time: ${res.statusText}`)

    const data = await res.json()
    return data
  } catch (err) {
    console.error('getBerlinTime failed', err)
    throw err
  }
}
