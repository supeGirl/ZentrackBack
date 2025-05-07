import {fetchBerlinTime} from './time.service.js'

export async function getTime(req, res) {
  try {
    const result = await fetchBerlinTime()
    
    res.json(result)
  } catch (err) {
    res.status(500).json({error: 'Failed to get time'})
  }
}
