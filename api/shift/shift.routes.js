import express from 'express'

import {requireAuth, requireAdmin} from '../../middlewares/requireAuth.middleware.js'
import {log} from '../../middlewares/logger.middleware.js'
import {getShifts, getShiftById, addShift, updateShift, removeShift, startShift, stopShift} from './shift.controller.js'

const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.post('/start/:userId', requireAuth, startShift)
router.post('/stop', requireAuth, stopShift)
router.post('/add', requireAuth, addShift)

router.get('/:id', getShiftById)
router.get('/by-user/:userId', log, getShifts)
router.put('/:id', requireAuth, requireAdmin, updateShift)
router.delete('/:id', requireAuth, requireAdmin, removeShift)

export const shiftRoutes = router
