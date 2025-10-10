import { useAuthStore } from '@/store/auth'
import { Navigate, Outlet } from 'react-router-dom'
import { useEffect } from 'react'

export default function RequireAuth() {
  const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore()
  
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      checkAuth()
    }
  }, [isAuthenticated, isLoading, checkAuth])
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/admin/login" replace />
  }
  
  return <Outlet />
}


