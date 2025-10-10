import jwt from 'jsonwebtoken'
import { loadEnv } from '../config/env'

export function signJwt(payload: object, expiresIn: string = '1d') {
  const env = loadEnv()
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn })
}


