import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import path from 'path'

import {loggerService} from './services/logger.service.js'

const app = express()

// App Configuration
app.use(cookieParser()) // for res.cookies
app.use(express.json()) // for req.body

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public'))
} else {
  const corsOptions = {
    origin: ['http://127.0.0.1:3000', 'http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  }
  app.use(cors(corsOptions))
}

import {authRoutes} from './api/auth/auth.routes.js'
import {shiftRoutes} from './api/shift/shift.routes.js'
import {userRoutes} from './api/user/user.routes.js'
import {setupAsyncLocalStorage} from './middlewares/setupAls.middleware.js'
import {timeRoutes} from './api/time/time.routes.js'

app.all('*', setupAsyncLocalStorage)

app.use('/api/shift', shiftRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/time', timeRoutes)

app.get('/**', (req, res) => {
  res.sendFile(path.resolve('public/index.html'))
})



const port = process.env.PORT || 3030
app.listen(port, () => {
  loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
})
