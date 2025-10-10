import ThemeToggle from '@/components/widgets/ThemeToggle'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth'
import { Menu, X, User, LogOut } from 'lucide-react'
import ConfirmationDialog from '@/components/ui/ConfirmationDialog'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const { user, isAuthenticated, logout } = useAuthStore()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    setOpen(false)
    setShowLogoutConfirm(false)
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/50 dark:border-slate-800/50 shadow-lg' 
        : 'bg-white/60 dark:bg-slate-950/60 border-b border-slate-200/30 dark:border-slate-800/30'
    }`}>
      <div className="px-4 mx-auto max-w-7xl md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex items-center justify-center shadow-lg size-8 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700">
                <span className="text-sm font-bold text-white">AI</span>
              </div>
              <div className="absolute rounded-full -top-1 -right-1 size-3 bg-accent-500 animate-pulse"></div>
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">AI-Solutions</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="items-center hidden gap-8 lg:flex">
            <a 
              className="relative font-medium transition-colors duration-200 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 group" 
              href="/"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <a 
              className="relative font-medium transition-colors duration-200 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 group" 
              href="/solutions"
            >
              Solutions
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <a 
              className="relative font-medium transition-colors duration-200 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 group" 
              href="/events"
            >
              Events
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <a 
              className="relative font-medium transition-colors duration-200 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 group" 
              href="/gallery"
            >
              Gallery
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <a 
              className="relative font-medium transition-colors duration-200 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 group" 
              href="/reviews"
            >
              Reviews
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-200 group-hover:w-full"></span>
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="items-center hidden gap-4 lg:flex">
            <ThemeToggle />
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <User className="size-4 text-slate-600 dark:text-slate-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{user?.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-ghost text-slate-600 dark:text-slate-400 hover:text-danger-600 dark:hover:text-danger-400"
                >
                  <LogOut className="size-4" />
                </button>
              </div>
            ) : (
              <a 
                className="btn-primary text-sm px-6 py-2.5" 
                href="/schedule-demo"
              >
                Schedule Demo
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 lg:hidden">
            <ThemeToggle />
            <button 
              className="p-2 transition-colors duration-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" 
              aria-label="Open menu" 
              onClick={() => setOpen(true)}
            >
              <Menu className="size-5 text-slate-600 dark:text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setOpen(false)} 
            aria-hidden 
          />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-l border-slate-200/50 dark:border-slate-800/50 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-8 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700">
                  <span className="text-sm font-bold text-white">AI</span>
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-slate-100">AI-Solutions</span>
              </div>
              <button 
                className="p-2 transition-colors duration-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" 
                onClick={() => setOpen(false)} 
                aria-label="Close menu"
              >
                <X className="size-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
            
            <nav className="flex flex-col gap-2 mb-8">
              <a 
                className="px-4 py-3 font-medium transition-colors duration-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" 
                href="/" 
                onClick={() => setOpen(false)}
              >
                Home
              </a>
              <a 
                className="px-4 py-3 font-medium transition-colors duration-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" 
                href="/solutions" 
                onClick={() => setOpen(false)}
              >
                Solutions
              </a>
              <a 
                className="px-4 py-3 font-medium transition-colors duration-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" 
                href="/events" 
                onClick={() => setOpen(false)}
              >
                Events
              </a>
              <a 
                className="px-4 py-3 font-medium transition-colors duration-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" 
                href="/reviews" 
                onClick={() => setOpen(false)}
              >
                Reviews
              </a>
            </nav>

            <div className="mt-auto space-y-4">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                    <div className="flex items-center gap-3">
                      <User className="size-4 text-slate-600 dark:text-slate-400" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{user?.email}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="flex items-center w-full gap-3 px-4 py-3 font-medium transition-colors duration-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    <LogOut className="size-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <a 
                  className="w-full text-center btn-primary" 
                  href="/schedule-demo"
                  onClick={() => setOpen(false)}
                >
                  Schedule Demo
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        message="Are you sure you want to sign out? You will need to log in again to access admin features."
        confirmText="Sign Out"
        cancelText="Stay Logged In"
        variant="warning"
      />
    </header>
  )
}


