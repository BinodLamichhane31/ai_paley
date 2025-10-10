import { useEffect } from 'react'
import { useThemeStore } from '@/store/theme'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const { theme, toggle, initialize } = useThemeStore()
  
  useEffect(() => {
    initialize()
  }, [initialize])
  
  return (
    <button 
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      onClick={toggle} 
      className="flex items-center gap-2 px-3 py-1.5 rounded-md border focus-ring hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
    >
      {theme === 'dark' ? (
        <>
          <Sun className="w-4 h-4" />
          <span className="hidden sm:inline">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4" />
          <span className="hidden sm:inline">Dark</span>
        </>
      )}
    </button>
  )
}


