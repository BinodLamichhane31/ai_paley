import { create } from 'zustand'

type Theme = 'light' | 'dark'

type ThemeState = {
  theme: Theme
  setTheme: (v: Theme) => void
  toggle: () => void
  initialize: () => void
}

const storageKey = 'aisolutions_theme'

// Get system preference or default to dark
function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  
  const stored = localStorage.getItem(storageKey) as Theme
  if (stored && (stored === 'light' || stored === 'dark')) {
    return stored
  }
  
  // Check system preference
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return systemPrefersDark ? 'dark' : 'light'
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: getInitialTheme(),
  setTheme: (v) => {
    localStorage.setItem(storageKey, v)
    set({ theme: v })
    document.documentElement.classList.toggle('dark', v === 'dark')
  },
  toggle: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark'
    get().setTheme(next)
  },
  initialize: () => {
    const theme = getInitialTheme()
    document.documentElement.classList.toggle('dark', theme === 'dark')
    set({ theme })
  },
}))


