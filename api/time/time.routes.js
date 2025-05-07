import express from 'express'
import { getTime } from './time.controller.js'

const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getTime)


export const timeRoutes = router