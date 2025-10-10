import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type User = { 
  email: string
  id?: string
  name?: string
  role?: string
  lastLogin?: string
}

type AuthState = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (u: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const storageKey = 'aisolutions_admin_user'

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      
      setUser: (user) => {
        set({ 
          user, 
          isAuthenticated: !!user,
          isLoading: false 
        })
      },
      
      setLoading: (isLoading) => {
        set({ isLoading })
      },
      
      logout: async () => {
        set({ isLoading: true })
        try {
          const { logoutApi } = await import('@/lib/auth')
          await logoutApi()
        } catch (error) {
          console.warn('Logout API call failed:', error)
        }
        
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false 
        })
        
        // Redirect to login if on admin pages
        if (location.pathname.startsWith('/admin')) {
          location.href = '/admin/login'
        }
      },
      
      checkAuth: async () => {
        const { user } = get()
        if (user) {
          set({ isAuthenticated: true })
          return
        }
        
        set({ isLoading: true })
        try {
          const { meApi } = await import('@/lib/auth')
          const res = await meApi()
          set({ 
            user: res.user, 
            isAuthenticated: true, 
            isLoading: false 
          })
        } catch (error) {
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          })
        }
      }
    }),
    {
      name: storageKey,
      partialize: (state) => ({ user: state.user }),
    }
  )
)


