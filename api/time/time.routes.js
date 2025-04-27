import express from 'express'
import { getTime } from './time.service.js'

const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/current-time', getTime)


export const timeRoutes = router