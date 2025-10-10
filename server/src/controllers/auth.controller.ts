import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { AdminUserModel } from '../models/AdminUser'
import { signJwt } from '../utils/jwt'

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as { email: string; password: string }
  const user = await AdminUserModel.findOne({ email })
  if (!user) return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' } })
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' } })

  const token = signJwt({ id: String(user._id), email: user.email, role: 'admin' })

  const isProd = process.env.NODE_ENV === 'production'
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24,
  })
  res.json({ user: { email: user.email } })
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie('token')
  res.json({ ok: true })
}

export async function me(req: Request, res: Response) {
  const token = req.cookies?.token
  if (!token) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } })
  try {
    const jwt = await import('jsonwebtoken')
    const { loadEnv } = await import('../config/env')
    const env = loadEnv()
    const payload = jwt.verify(token, env.JWT_SECRET) as { id: string; email: string; role: 'admin' }
    const user = await AdminUserModel.findById(payload.id).lean()
    if (!user) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid session' } })
    res.json({ user: { email: user.email } })
  } catch {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid session' } })
  }
}


