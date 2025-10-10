import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useState } from 'react'
import { Calendar, Users, MessageSquare, FileText, TrendingUp, Eye, Star, BarChart3 } from 'lucide-react'

type Stats = {
  totals: { demoRequestsTotal: number; eventRegistrationsTotal: number; eventsTotal: number; reviewsTotal: number }
  weekly: { weekStartISO: string; demoCount: number; regCount: number }[]
  topInterests: { label: string; count: number }[]
  topEvents: { eventId: string; title: string; count: number }[]
}

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('7d')
  
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats', selectedPeriod],
    queryFn: async () => {
      const res = await api.get('/admin/stats', { params: { period: selectedPeriod } })
      return res.data as Stats
    },
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Welcome back! Here's what's happening with your platform.</p>
        </div>
        
        {/* Period Selector */}
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          {(['7d', '30d', '90d'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                selectedPeriod === period
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {period === '7d' ? '7 Days' : period === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {isLoading || !data ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCard 
              title="Demo Requests" 
              value={data.totals.demoRequestsTotal}
              icon={<FileText className="w-5 h-5" />}
              trend={12}
              color="blue"
            />
            <KpiCard 
              title="Event Registrations" 
              value={data.totals.eventRegistrationsTotal}
              icon={<Users className="w-5 h-5" />}
              trend={8}
              color="green"
            />
            <KpiCard 
              title="Total Events" 
              value={data.totals.eventsTotal}
              icon={<Calendar className="w-5 h-5" />}
              trend={5}
              color="purple"
            />
            <KpiCard 
              title="Reviews" 
              value={data.totals.reviewsTotal}
              icon={<Star className="w-5 h-5" />}
              trend={15}
              color="orange"
            />
          </div>

          {/* Charts and Analytics */}
          <div className="grid lg:grid-cols-2 gap-6">
            <ChartCard 
              title="Weekly Activity Trend" 
              icon={<TrendingUp className="w-5 h-5" />}
              subtitle="Demo requests and registrations over time"
            >
              <WeeklyTrendChart data={data.weekly} />
            </ChartCard>
            
            <ChartCard 
              title="Top Interest Areas" 
              icon={<BarChart3 className="w-5 h-5" />}
              subtitle="Most popular interest categories"
            >
              <InterestChart data={data.topInterests} />
            </ChartCard>
          </div>

          {/* Recent Activity */}
          <div className="grid lg:grid-cols-2 gap-6">
            <ChartCard 
              title="Popular Events" 
              icon={<Eye className="w-5 h-5" />}
              subtitle="Events with highest registration counts"
            >
              <TopEventsList data={data.topEvents} />
            </ChartCard>
            
            <ChartCard 
              title="Quick Actions" 
              icon={<MessageSquare className="w-5 h-5" />}
              subtitle="Common admin tasks"
            >
              <QuickActions />
            </ChartCard>
          </div>
        </>
      )}
    </div>
  )
}

function KpiCard({ title, value, icon, trend, color }: { 
  title: string; 
  value: number; 
  icon: React.ReactNode; 
  trend: number; 
  color: 'blue' | 'green' | 'purple' | 'orange' 
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
  }

  return (
    <div className="card p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value.toLocaleString()}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
          <div className="text-xs text-slate-500">vs last period</div>
        </div>
      </div>
    </div>
  )
}

function ChartCard({ title, icon, subtitle, children }: { 
  title: string; 
  icon: React.ReactNode; 
  subtitle: string; 
  children: React.ReactNode 
}) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

function WeeklyTrendChart({ data }: { data: Stats['weekly'] }) {
  if (!data.length) {
    return <div className="h-48 flex items-center justify-center text-slate-500">No data available</div>
  }

  const maxValue = Math.max(...data.map(d => Math.max(d.demoCount, d.regCount)))
  
  return (
    <div className="h-48">
      <div className="flex items-end justify-between h-full gap-2">
        {data.slice(-7).map((week, index) => {
          const demoHeight = (week.demoCount / maxValue) * 100
          const regHeight = (week.regCount / maxValue) * 100
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col items-center gap-1 h-32">
                <div 
                  className="w-full bg-blue-500 rounded-t"
                  style={{ height: `${demoHeight}%` }}
                  title={`Demo: ${week.demoCount}`}
                />
                <div 
                  className="w-full bg-green-500 rounded-b"
                  style={{ height: `${regHeight}%` }}
                  title={`Registrations: ${week.regCount}`}
                />
              </div>
              <div className="text-xs text-slate-500">
                {new Date(week.weekStartISO).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex gap-4 mt-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-slate-600 dark:text-slate-400">Demo Requests</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-slate-600 dark:text-slate-400">Registrations</span>
        </div>
      </div>
    </div>
  )
}

function InterestChart({ data }: { data: Stats['topInterests'] }) {
  if (!data.length) {
    return <div className="h-48 flex items-center justify-center text-slate-500">No data available</div>
  }

  const maxValue = Math.max(...data.map(d => d.count))
  
  return (
    <div className="space-y-3">
      {data.slice(0, 5).map((interest) => {
        const percentage = (interest.count / maxValue) * 100
        return (
          <div key={interest.label} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-slate-900 dark:text-white">{interest.label}</span>
              <span className="text-slate-600 dark:text-slate-400">{interest.count}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function TopEventsList({ data }: { data: Stats['topEvents'] }) {
  if (!data.length) {
    return <div className="h-48 flex items-center justify-center text-slate-500">No events yet</div>
  }

  return (
    <div className="space-y-3">
      {data.slice(0, 5).map((event, index) => (
        <div key={event.eventId} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
              {index + 1}
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white text-sm">{event.title}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">Event ID: {event.eventId}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-slate-900 dark:text-white">{event.count}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">registrations</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <a 
        href="/admin/events" 
        className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
      >
        <div className="text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
          <Calendar className="w-6 h-6 mb-2" />
        </div>
        <p className="font-medium text-slate-900 dark:text-white text-sm">Manage Events</p>
        <p className="text-xs text-slate-600 dark:text-slate-400">Create and edit events</p>
      </a>
      
      <a 
        href="/admin/submissions" 
        className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group"
      >
        <div className="text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300">
          <FileText className="w-6 h-6 mb-2" />
        </div>
        <p className="font-medium text-slate-900 dark:text-white text-sm">View Submissions</p>
        <p className="text-xs text-slate-600 dark:text-slate-400">Demo requests & forms</p>
      </a>
      
      <a 
        href="/admin/reviews" 
        className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group"
      >
        <div className="text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300">
          <Star className="w-6 h-6 mb-2" />
        </div>
        <p className="font-medium text-slate-900 dark:text-white text-sm">Reviews</p>
        <p className="text-xs text-slate-600 dark:text-slate-400">Manage testimonials</p>
      </a>
      
      <a 
        href="/admin/analytics" 
        className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors group"
      >
        <div className="text-orange-600 dark:text-orange-400 group-hover:text-orange-700 dark:group-hover:text-orange-300">
          <BarChart3 className="w-6 h-6 mb-2" />
        </div>
        <p className="font-medium text-slate-900 dark:text-white text-sm">Analytics</p>
        <p className="text-xs text-slate-600 dark:text-slate-400">Detailed insights</p>
      </a>
    </div>
  )
}


