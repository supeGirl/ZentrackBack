import {shiftService} from './shift.service.js'
import {loggerService} from '../../services/logger.service.js'

export async function getShifts(req, res) {
    
  try {
    // const filterBy = {
    //   txt: txt || '',
    //   sortBy: sortBy || { type: '', sortDir: 1 },
    // }
    const shifts = await shiftService.query()
    res.send(shifts)
  } catch (err) {
    loggerService.error('Error fetching shifts:', err)
    res.status(500).send({err: `Cannot get shifts`})
  }
}

export async function getShiftById(req, res) {
  try {
    const {id: shiftId} = req.params
    
    const shift = await shiftService.getById(shiftId)
    res.send(shift)
  } catch (err) {
    loggerService.error(`Faild to get shift, ${err}`)
    res.status(500).send({err: `Faild to get shift`})
  }
}

export async function addShift(req, res) {
  const {loggedinUser, body: shift} = req
  try {
    shift.owner = loggedinUser
    const addedShift = await shiftService.add(shift)
    res.send(addedShift)
  } catch (err) {
    loggerService.error(`Faild to add shift, ${err}`)
    res.status(500).send({err: `Faild to add shift`})
  }
}

export async function updateShift(req, res) {
  const {loggedinUser, body: shift} = req
  const {_id: userId, isAdmin} = loggedinUser

  if (!isAdmin && shift.owner._id !== userId) {
    res.status(403).send('Not your shift...')
    return
  }

  try {
    const updatedShift = await shiftService.update(shift)
    res.send(updatedShift)
  } catch (err) {
    loggerService.error(`Faild to update shift, ${err}`)
    res.status(500).send({err: `Faild to update shift`})
  }
}

export async function removeShift(req, res) {
  try {
    const shiftId = req.params.id
    
    await shiftService.remove(shiftId)
    res.send()
  } catch (err) {
    loggerService.error(`Faild to delete shift, ${err}`)
    res.status(500).send({err: `Faild to delete shift`})
  }
}
