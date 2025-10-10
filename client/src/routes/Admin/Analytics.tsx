// import PageShell from '@/components/layout/PageShell'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

type Stats = {
  totals: { demoRequestsTotal: number; eventRegistrationsTotal: number; eventsTotal: number; reviewsTotal: number }
  weekly: { weekStartISO: string; demoCount: number; regCount: number }[]
  topInterests: { label: string; count: number }[]
  topEvents: { eventId: string; title: string; count: number }[]
}

export default function Analytics() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats-full'],
    queryFn: async () => {
      const res = await api.get('/admin/stats')
      return res.data as Stats
    },
  })

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>
      {isLoading || !data ? (
        <div className="h-24 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card p-4">
            <div className="font-semibold mb-2">Weekly Trend</div>
            <div className="text-sm text-slate-500">{data.weekly.length} weeks, demos vs registrations</div>
          </div>
          <div className="card p-4">
            <div className="font-semibold mb-2">Top Interests</div>
            <ul className="text-sm">
              {data.topInterests.map((x) => <li key={x.label}>{x.label}: {x.count}</li>)}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}


