import express from 'express'

import {requireAuth, requireAdmin} from '../../middlewares/requireAuth.middleware.js'
import {log} from '../../middlewares/logger.middleware.js'
import {getShifts, getShiftById, addShift, updateShift, removeShift} from './shift.controller.js'

const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getShifts)
router.get('/:id', getShiftById)
router.post('/', requireAuth, requireAdmin, addShift)
router.put('/:id', requireAuth, requireAdmin, updateShift)
router.delete('/:id', requireAuth, requireAdmin, removeShift)

export const shiftRoutes = router
