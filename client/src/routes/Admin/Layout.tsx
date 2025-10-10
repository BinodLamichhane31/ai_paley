import { Outlet, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { useAuthStore } from '@/store/auth'
import ConfirmationDialog from '@/components/ui/ConfirmationDialog'
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  Star, 
  LogOut, 
  ExternalLink, 
  Menu,
  X,
  Settings
} from 'lucide-react'

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/submissions', label: 'Submissions', icon: FileText },
  { to: '/admin/events', label: 'Events', icon: Calendar },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
]

export default function AdminLayout() {
  const [open, setOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const logout = useAuthStore((s) => s.logout)
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <aside className={`lg:static fixed inset-y-0 left-0 z-40 w-72 lg:w-auto bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 flex flex-col h-full lg:h-screen ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Sidebar Header */}
        <div className="sticky top-0 flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-slate-800 bg-inherit">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700">
              <span className="text-sm font-bold text-white">A</span>
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white">Admin Panel</span>
              <div className="text-xs text-slate-500 dark:text-slate-400">Content Management</div>
            </div>
          </div>
          <button 
            className="p-2 transition-colors rounded-md lg:hidden hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setOpen(false)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `group flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
                onClick={() => setOpen(false)}
              >
                <Icon className={`w-5 h-5 ${link.to === '/admin/dashboard' ? 'text-white' : ''}`} />
                <span>{link.label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-inherit">
          <div className="space-y-2">
            <a 
              href="/" 
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View Site</span>
            </a>
            <button 
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center w-full gap-3 px-3 py-2 text-sm font-medium text-red-600 transition-all duration-200 rounded-lg dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Content */}
      <div className="flex flex-col h-screen min-w-0 overflow-hidden lg:h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between flex-shrink-0 h-16 px-6 border-b backdrop-blur bg-white/80 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <button 
              className="p-2 transition-colors rounded-lg lg:hidden hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setOpen((v) => !v)} 
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden lg:block">
              <div className="text-sm text-slate-500 dark:text-slate-400">Content Management System</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Live</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <Settings className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          </div>
        </div>
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile backdrop */}
      {open && <div className="fixed inset-0 z-30 bg-black/20 md:hidden" onClick={() => setOpen(false)} aria-hidden />}

      {/* Logout Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={() => {
          logout()
          setShowLogoutConfirm(false)
        }}
        title="Sign Out"
        message="Are you sure you want to sign out? You will need to log in again to access the admin panel."
        confirmText="Sign Out"
        cancelText="Stay Logged In"
        variant="warning"
      />
    </div>
  )
}


