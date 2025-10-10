import { Routes, Route } from 'react-router-dom'
import Home from '@/routes/Home'
import ScheduleDemo from '@/routes/ScheduleDemo'
import Solutions from '@/routes/Solutions'
import Events from '@/routes/Events'
import EventDetail from '@/routes/EventDetail'
import Reviews from '@/routes/Reviews'
import ChatbotPage from '@/routes/ChatbotPage'
import AdminLogin from '@/routes/Admin/Login'
import AdminDashboard from '@/routes/Admin/Dashboard'
import RequireAuth from '@/routes/Admin/RequireAuth'
import Submissions from '@/routes/Admin/Submissions'
import EventsAdmin from '@/routes/Admin/EventsAdmin'
import EventDetailAdmin from '@/routes/Admin/EventDetailAdmin'
import EventEditAdmin from '@/routes/Admin/EventEditAdmin'
import ReviewsAdmin from '@/routes/Admin/ReviewsAdmin'
import Analytics from '@/routes/Admin/Analytics'
import AdminLayout from '@/routes/Admin/Layout'
import Gallery from '@/routes/Gallery'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth'

export default function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth)
  
  useEffect(() => {
    checkAuth()
  }, [checkAuth])
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/schedule-demo" element={<ScheduleDemo />} />
      <Route path="/solutions" element={<Solutions />} />
      <Route path="/events" element={<Events />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/events/:id" element={<EventDetail />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/chat" element={<ChatbotPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<RequireAuth />}>
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="submissions" element={<Submissions />} />
          <Route path="events" element={<EventsAdmin />} />
          <Route path="events/:id" element={<EventDetailAdmin />} />
          <Route path="events/:id/edit" element={<EventEditAdmin />} />
          <Route path="reviews" element={<ReviewsAdmin />} />
        </Route>
      </Route>
    </Routes>
  )
}
