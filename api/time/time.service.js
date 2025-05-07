export async function fetchBerlinTime() {
  const sources = [
    {url: 'https://timeapi.io/api/Time/current/zone?timeZone=Europe/Berlin', field: 'dateTime'},
    {url: 'https://worldtimeapi.org/api/timezone/Europe/Berlin', field: 'datetime'},
  ]

  try {
    for (let {url, field} of sources) {
      const response = await fetchWithRetries(url, 3, field)
      
      if (response) return {datetime: response, source: url}
    }
  } catch (err) {
    console.error('Failed to fetch time from sources:', err)
  }

  const fallbackTime = _getBerlinTimeISO()
  return {
    datetime: fallbackTime,
    source: 'mock-local',
    status: 200,
  }
}

async function fetchWithRetries(url, retries, field) {
  if (retries === 0) throw new Error('Retries exhausted')

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 20000)

    const res = await fetch(url, {signal: controller.signal})
    clearTimeout(timeout)
    if (!res.ok) throw new Error(`HTTP status ${res.status}`)

    const data = await res.json()
    if (!(field in data)) {
      throw new Error(`Missing expected field "${field}" in response`)
    }

    const datetime = data[field]
    
    return {datetime, source: url}
  } catch (error) {
    console.error(`Error fetching from ${url}: ${error.message}`)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return fetchWithRetries(url, retries - 1, field)
  }
}
function _getBerlinTimeISO() {
  const now = new Date()

  const berlinTimeStr = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Berlin',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(now)

  const [month, day, year] = berlinTimeStr.split(',')[0].split('/')
  const time = berlinTimeStr.split(',')[1].trim()

  const berlinDateTime = new Date(`${year}-${month}-${day}T${time}`)
  return berlinDateTime.toISOString()
}

