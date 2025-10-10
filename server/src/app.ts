import express from 'express'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import compression from 'compression'
import { buildCors, helmetMiddleware } from './config/security'
import apiRoutes from './routes/index'

const app = express()

app.set('trust proxy', 1)

app.use(helmetMiddleware)
app.use(buildCors())
app.use(compression())
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.use('/api', apiRoutes)

// Global error handler minimal
import { errorHandler } from './middleware/errorHandler'

app.use(errorHandler)

// DB connection moved to server.ts

export default app


