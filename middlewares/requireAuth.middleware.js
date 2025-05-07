import {userService} from '../api/user/user.service.js'
import {asyncLocalStorage} from '../services/als.service.js'

export function requireAuth(req, res, next) {
  const {loggedinUser} = asyncLocalStorage.getStore()

  req.loggedinUser = loggedinUser

  // if (config.isGuestMode && !loggedinUser) {
  //   req.loggedinUser = { _id: '', fullname: 'Guest' };
  //   return next();
  // }

  if (!loggedinUser) return res.status(401).send('Not Authenticated')

  userService
    .getById(loggedinUser._id)
    .then((user) => {
      req.loggedinUser = user
      next()
    })
    .catch((err) => res.status(401).send('User not found in local data'))
}

export function requireAdmin(req, res, next) {
  const {loggedinUser} = asyncLocalStorage.getStore()

  if (!loggedinUser) return res.status(401).send('Not Authenticated')

  userService
    .getById(loggedinUser._id)
    .then((user) => {
      if (!user.isAdmin) {
        logger.warn(`${loggedinUser.fullname} attempted to perform an admin action`)
        return res.status(403).send('Not Authorized')
      }
      next()
    })
    .catch((err) => res.status(401).send('User not found in local data'))
}
