import { api } from './api'

export async function loginApi(email: string, password: string) {
  const res = await api.post('/auth/login', { email, password })
  return res.data as { user: { email: string } }
}

export async function logoutApi() {
  await api.post('/auth/logout')
}

export async function meApi() {
  const res = await api.get('/auth/me')
  return res.data as { user: { email: string } }
}


