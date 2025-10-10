import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { loadEnv } from '../config/env'
import { AdminUserModel } from '../models/AdminUser'

export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: 'admin' }
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.token
  if (!token) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } })
  try {
    const env = loadEnv()
    const payload = jwt.verify(token, env.JWT_SECRET) as { id: string; email: string; role: 'admin' }
    req.user = payload
    next()
  } catch {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid session' } })
  }
}

export async function getUserFromToken(token?: string) {
  if (!token) return null
  try {
    const env = loadEnv()
    const payload = jwt.verify(token, env.JWT_SECRET) as { id: string; email: string; role: 'admin' }
    const user = await AdminUserModel.findById(payload.id).lean()
    if (!user) return null
    return { id: String(user._id), email: user.email, role: 'admin' as const }
  } catch {
    return null
  }
}


