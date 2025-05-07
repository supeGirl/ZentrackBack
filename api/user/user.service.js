import fs from 'fs'
import {utilService} from '../../services/util.service.js'

const users = utilService.readJsonFile('data/user.json')

export const userService = {
  query,
  getById,
  getByUsername,
  remove,
  update,
  add,
}

function query(filterBy = {}) {
  let filteredUsers = users

  if (filterBy.txt) {
    const regExp = new RegExp(filterBy.txt, 'i')
    filteredUsers = filteredUsers.filter((user) => regExp.test(user.username) || regExp.test(user.fullname))
  }

  return Promise.resolve(filteredUsers)
}

function getById(userId) {
  const user = users.find((user) => user._id === userId)
  if (!user) {
    return Promise.reject('Cannot find user - ' + userId)
  }
  const userCopy = {...user}
  delete userCopy.password
  return Promise.resolve(userCopy)
}

function getByUsername(username) {
  const user = users.find((user) => user.username === username)
  if (!user) return Promise.reject('Cannot find user - ' + username)
  return Promise.resolve(user)
}

function remove(userId) {
  const userIdx = users.findIndex((user) => user._id === userId)
  if (userIdx < 0) return Promise.reject('Cannot find user - ' + userId)
  users.splice(userIdx, 1)
  return _saveUsersToFile()
}

function update(user) {
  const userIdx = users.findIndex((currUser) => currUser._id === user._id)
  if (userIdx < 0) return Promise.reject('Cannot find user - ' + user._id)

  const userToSave = {
    ...users[userIdx],
    username: user.username,
    fullname: user.fullname,
  }

  users[userIdx] = userToSave

  return _saveUsersToFile().then(() => userToSave)
}

function add(user) {
  const existUser = users.find((u) => u.username === user.username)
  if (existUser) return Promise.reject(new Error('Username taken'))

  const userToAdd = {
    _id: utilService.makeId(),
    username: user.username,
    password: user.password,
    fullname: user.fullname,
    isAdmin: false,
  }

  users.unshift(userToAdd)

  return _saveUsersToFile().then(() => {
    const userCopy = {...userToAdd}
    delete userCopy.password
    return userCopy
  })
}

function _saveUsersToFile() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(users, null, 4)
    fs.writeFile('data/user.json', data, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}
