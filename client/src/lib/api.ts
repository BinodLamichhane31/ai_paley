import axios from 'axios'
import { toast } from 'sonner'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:4000/api',
  withCredentials: true,
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status
    const url: string = err?.config?.url || ''
    // Avoid noisy toasts for expected unauthenticated checks
    if (status === 401 && url.includes('/auth/me')) {
      return Promise.reject(err)
    }
    const message = err?.response?.data?.error?.message || err.message || 'Request failed'
    toast.error(message)
    return Promise.reject(err)
  }
)

export type ApiError = { error: { code: string; message: string; details?: unknown } }


export default api
