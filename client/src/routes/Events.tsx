import PageShell from '@/components/layout/PageShell'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'

type Event = { _id: string; title: string; description: string; startAt: string; endAt: string; location: string; isPublished: boolean; coverImageUrl?: string; featured?: boolean; speakers?: Array<{ name: string; title?: string; avatarUrl?: string }>; agenda?: Array<{ time: string; topic: string }> }

export default function Events() {
  const [q, setQ] = useState('')
  const [month, setMonth] = useState('') // YYYY-MM
  const [view, setView] = useState<'grid'|'calendar'>('grid')

  const { data, isLoading } = useQuery({
    queryKey: ['events', { q, month }],
    queryFn: async () => {
      const params: any = { published: 1 } // Always show only published events
      if (q) params.q = q
      if (month) params.month = month
      const res = await api.get('/events', { params })
      return res.data as Event[]
    },
  })

  const monthDate = useMemo(() => {
    if (!month || !/^\d{4}-\d{2}$/.test(month)) return new Date()
    const [y, m] = month.split('-').map(Number)
    return new Date(y, m - 1, 1)
  }, [month])

  return (
    <PageShell>
      <h1 className="text-3xl font-bold mb-4">Events</h1>

       {/* Sticky Filters */}
       <div className="sticky top-16 z-10 bg-white/80 dark:bg-slate-950/80 backdrop-blur border-b border-slate-200 dark:border-slate-800 mb-4">
         <div className="py-3 flex flex-wrap gap-3 items-end">
           <div>
             <label className="block text-sm mb-1">Search</label>
             <input value={q} onChange={(e) => setQ(e.target.value)} className="border rounded-md p-2 focus-ring" placeholder="Title or description" />
           </div>
           <div>
             <label className="block text-sm mb-1">Month</label>
             <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="border rounded-md p-2 focus-ring" />
           </div>
           <div className="hidden md:block">
             <label className="block text-sm mb-1">Quick filters</label>
             <div className="flex gap-2">
               {['Webinar','Workshop','Conference'].map((c) => (
                 <button key={c} className="px-3 py-1.5 rounded-md border focus-ring text-sm" onClick={() => setQ(c)}>{c}</button>
               ))}
             </div>
           </div>
           <div className="ml-auto flex gap-2">
             <button className={`px-3 py-1.5 rounded-md border ${view==='grid'?'bg-primary-600 text-white border-primary-600':''}`} onClick={() => setView('grid')}>Grid</button>
             <button className={`px-3 py-1.5 rounded-md border ${view==='calendar'?'bg-primary-600 text-white border-primary-600':''}`} onClick={() => setView('calendar')}>Calendar</button>
           </div>
         </div>
       </div>

      {isLoading ? (
        <div className="grid md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : data && data.length > 0 ? (
        <>
          {view === 'grid' ? (
            <>
              {/* Featured Event */}
              <FeaturedEvent events={data} />
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                {data.map((ev) => (
                  <Link key={ev._id} to={`/events/${ev._id}`} className="card overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-105">
                    {/* Cover Image */}
                    <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                      {ev.coverImageUrl ? (
                        <img 
                          src={ev.coverImageUrl} 
                          alt={ev.title}
                          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <div className="text-white text-center">
                            <div className="text-2xl font-bold">{ev.title.charAt(0)}</div>
                            <div className="text-xs opacity-80">Event</div>
                          </div>
                        </div>
                      )}
                      {ev.featured && (
                        <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          Featured
                        </div>
                      )}
                    </div>
                    
                    {/* Event Details */}
                    <div className="p-4 flex flex-col justify-between h-full">
                      <div>
                        <div className="font-semibold mb-1 line-clamp-1">{ev.title}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-2">{ev.description}</div>
                        <div className="text-xs text-slate-500">{new Date(ev.startAt).toLocaleDateString()} – {new Date(ev.endAt).toLocaleDateString()}</div>
                        <div className="text-xs text-slate-500">{ev.location}</div>
                        {ev.speakers && ev.speakers.length > 0 && (
                          <div className="text-xs text-slate-500 mt-1">
                            {ev.speakers.length} speaker{ev.speakers.length > 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="badge">Seats left: —</span>
                        <span className="px-3 py-1.5 rounded-md border focus-ring inline-block ml-auto text-sm">View details</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <MonthCalendar monthDate={monthDate} events={data} />
          )}

          {/* Speakers Highlight */}
          <section className="mt-10">
            <h2 className="text-h3 font-semibold mb-3">Speakers</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {['Alex Rivera','Sam Patel','Lee Chen','Priya Kumar','Diego Lopez'].map((n) => (
                <div key={n} className="min-w-[200px] card p-4 text-sm">
                  <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800 mb-2" aria-label="Avatar" />
                  <div className="font-medium">{n}</div>
                  <div className="text-slate-500">Guest speaker</div>
                </div>
              ))}
            </div>
          </section>

          {/* Past & On-Demand */}
          <section className="mt-10">
            <h2 className="text-h3 font-semibold mb-3">Past & On‑Demand</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {data.filter((e) => new Date(e.startAt) < new Date()).slice(0, 8).map((ev) => (
                <Link key={ev._id} to={`/events/${ev._id}`} className="min-w-[260px] card p-4">
                  <div className="font-semibold line-clamp-1">{ev.title}</div>
                  <div className="text-xs text-slate-500 mb-1">{new Date(ev.startAt).toLocaleDateString()}</div>
                  <div className="text-xs text-primary-600">Watch recording</div>
                </Link>
              ))}
            </div>
          </section>

          {/* Newsletter Signup */}
          <section className="mt-10 card p-4">
            <div className="font-semibold mb-2">Get event alerts</div>
            <form className="flex flex-col sm:flex-row gap-2">
              <input className="border rounded-md p-2 flex-1 focus-ring" placeholder="you@company.com" />
              <button type="button" className="px-4 py-2 rounded-md bg-primary-600 text-white focus-ring">Subscribe</button>
            </form>
          </section>

          {/* Help & FAQs */}
          <section className="mt-10">
            <h2 className="text-h3 font-semibold mb-2">Need help?</h2>
            <div className="text-sm text-slate-600 dark:text-slate-300">Check our FAQs or <a className="text-primary-600 hover:underline" href="#">contact us</a> for group bookings.</div>
          </section>
        </>
      ) : (
        <div className="text-slate-600 dark:text-slate-300">
          No events yet—check back soon. <a className="underline" href="/schedule-demo">Request a Demo</a>
        </div>
      )}
    </PageShell>
  )
}

function FeaturedEvent({ events }: { events: Event[] }) {
  const now = new Date()
  const upcoming = [...events].filter((e) => new Date(e.startAt) > now).sort((a, b) => +new Date(a.startAt) - +new Date(b.startAt))
  if (upcoming.length === 0) return null
  const ev = upcoming[0]
  return (
    <div className="card-md overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Cover Image */}
        <div className="md:w-1/3 h-48 md:h-auto bg-gradient-to-br from-blue-500 to-purple-600 relative">
          {ev.coverImageUrl ? (
            <img 
              src={ev.coverImageUrl} 
              alt={ev.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-4xl font-bold">{ev.title.charAt(0)}</div>
                <div className="text-sm opacity-80">Featured Event</div>
              </div>
            </div>
          )}
          <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            Featured
          </div>
        </div>
        
        {/* Event Details */}
        <div className="md:w-2/3 p-6 flex flex-col justify-between">
          <div>
            <div className="text-sm text-slate-500 mb-1">Upcoming Event</div>
            <div className="font-semibold text-xl mb-2">{ev.title}</div>
            <div className="text-sm text-slate-600 dark:text-slate-300 mb-2">{ev.description}</div>
            <div className="text-sm text-slate-600 dark:text-slate-300">{new Date(ev.startAt).toLocaleString()} • {ev.location}</div>
            {ev.speakers && ev.speakers.length > 0 && (
              <div className="text-sm text-slate-500 mt-2">
                {ev.speakers.length} speaker{ev.speakers.length > 1 ? 's' : ''}
              </div>
            )}
          </div>
          <div className="mt-4 flex gap-3">
            <Link to={`/events/${ev._id}`} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">View Details</Link>
            <Link to={`/events/${ev._id}`} className="px-4 py-2 border rounded-md hover:bg-gray-50">Add to Calendar</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function MonthCalendar({ monthDate, events }: { monthDate: Date; events: Event[] }) {
  const start = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)
  const end = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0)
  const startWeekday = start.getDay()
  const daysInMonth = end.getDate()
  const cells = [] as Array<{ date: Date; inMonth: boolean }>
  // leading blanks
  for (let i = 0; i < startWeekday; i++) cells.push({ date: new Date(start.getFullYear(), start.getMonth(), i - startWeekday + 1), inMonth: false })
  // month days
  for (let d = 1; d <= daysInMonth; d++) cells.push({ date: new Date(start.getFullYear(), start.getMonth(), d), inMonth: true })
  // trailing to fill 6*7
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1].date
    cells.push({ date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1), inMonth: false })
  }

  function dayEvents(day: Date) {
    return events.filter((e) => {
      const s = new Date(e.startAt)
      return s.getFullYear() === day.getFullYear() && s.getMonth() === day.getMonth() && s.getDate() === day.getDate()
    })
  }

  return (
    <div className="grid grid-cols-7 gap-2">
      {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
        <div key={d} className="text-xs text-slate-500 px-2">{d}</div>
      ))}
      {cells.map((c, i) => (
        <div key={i} className={`min-h-[90px] p-2 rounded-xl border ${c.inMonth? 'border-slate-200 dark:border-slate-800':'border-transparent opacity-50'}`}>
          <div className="text-xs text-slate-500">{c.date.getDate()}</div>
          <div className="mt-1 space-y-1">
            {dayEvents(c.date).map((ev) => (
              <Link key={ev._id} to={`/events/${ev._id}`} className="block text-xs px-2 py-1 rounded bg-primary-600/10 text-primary-700 dark:text-primary-300 truncate">
                {ev.title}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

