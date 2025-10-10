import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { loadEnv } from './env'

export function buildCors() {
  const env = loadEnv()
  return cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  })
}

export const helmetMiddleware = helmet()

export const publicPostLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
})


