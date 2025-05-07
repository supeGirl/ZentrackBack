import {shiftService} from './shift.service.js'
import {loggerService} from '../../services/logger.service.js'
import {userService} from '../user/user.service.js'
import {fetchBerlinTime} from '../time/time.service.js'

export async function getShifts(req, res) {
  try {
    // const filterBy = {
    //   txt: txt || '',
    //   sortBy: sortBy || { type: '', sortDir: 1 },
    // }
    const {userId} = req.params

    const shifts = await shiftService.query()

    const user = await userService.getById(userId)

    res.send(
      shifts.filter((s) => {
        return user.isAdmin ? true : s.userId === userId
      })
    )
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

export async function startShift(req, res) {
  const {loggedinUser} = req


  if (!loggedinUser) return res.status(401).send({error: 'User not authenticated'})

  try {
    const currentTime = await fetchBerlinTime()

    const startTime = currentTime?.datetime || new Date().toISOString()

    return res.json({startTime})
  } catch (err) {
    loggerService.error(`Failed to fetch time, ${err}`)
    res.status(500).send({err: `Faild to get time`})
  }
}

export async function stopShift(req, res) {
  const {loggedinUser} = req

  if (!loggedinUser || !loggedinUser._id) {
    return res.status(401).send({error: 'User not authenticated'})
  }

  try {
    const endTime = await fetchBerlinTime()


    res.clearCookie('token')

    res.send({endTime: endTime})

  } catch (err) {
    res.status(500).send({error: 'Failed to stop shift'})
  }
}

export async function addShift(req, res) {
  const {loggedinUser, body: shift} = req

  if (!loggedinUser) {
    return res.status(400).send({err: 'User not authenticated!'})
  }


  shift.owner = loggedinUser

  try {
    const addedShift = await shiftService.save(shift)
    
    res.send(addedShift)
  } catch (err) {
    loggerService.error(`Failed to add shift, ${err}`)
    res.status(500).send({err: `Failed to add shift`})
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

    const updatedShift = await shiftService.save(shift)    
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
