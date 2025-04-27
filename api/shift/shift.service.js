import { asyncLocalStorage } from '../../services/als.service.js'
import {loggerService} from '../../services/logger.service.js'
import {utilService} from '../../services/util.service.js'
import fs from 'fs'

const shifts = utilService.readJsonFile('data/shifts.json')

export const shiftService = {
  query,
  getById,
  remove,
  save,
}

function query() {
  try {
    return Promise.resolve(shifts)
  } catch (err) {
    loggerService.error(`Error in query: ${err}`)
    return Promise.reject(err)
  }
}

function getById(shiftId) {
    console.log('shifts', shifts)
    
  try {
    const shift = shifts.find((shift) => shift._id === shiftId)
    if (!shift) return Promise.reject('Cannot find shift - ' + shiftId)
    return Promise.resolve(shift)
  } catch (err) {
    loggerService.error(`Error in getById: ${err}`)
    return Promise.reject(err)
  }
}

async function remove(shiftId) {
  const {loggedinUser} = asyncLocalStorage.getStore()
  const {_id: userId, isAdmin} = loggedinUser

  try {
    const shiftIndex = shifts.findIndex((shift) => shift._id === shiftId)
    if (shiftIndex === -1) throw `Shift not found: ${shiftId}`

    if (!isAdmin && shifts[shiftIndex].owner._id !== userId) {
      throw 'Not your shift'
    }

    shifts.splice(shiftIndex, 1)

    await _saveShiftsToFile()

    return shiftId
  } catch (err) {
    loggerService.error(`Cannot remove shift ${shiftId}: ${err}`)
    throw err
  }
}

async function save(shiftToSave) {
  try {

    if (shiftToSave._id) {
      const shiftIdx = shifts.findIndex((shift) => shift._id === shiftToSave._id)
      shifts[shiftIdx] = shiftToSave
    } else {
      shiftToSave._id = utilService.makeId()
      shifts.unshift(shiftToSave)
    }

    await _saveShiftsToFile()
    return shiftToSave
  } catch (err) {
    loggerService.error(`connot add/update shift ${err}`)

    throw err
  }
}

function _saveShiftsToFile() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(shifts, null, 4)
    fs.writeFile('data/shift.json', data, (err) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}
