import PageShell from '@/components/layout/PageShell'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import EventRegistrationForm from '@/components/forms/EventRegistrationForm'
import { useMemo, useState } from 'react'

type Event = { _id: string; title: string; description: string; startAt: string; endAt: string; location: string; isPublished: boolean; coverImageUrl?: string; featured?: boolean; speakers?: Array<{ name: string; title?: string; avatarUrl?: string }>; agenda?: Array<{ time: string; topic: string }>; categories?: string[]; capacity?: number }

export default function EventDetail() {
  const { id = '' } = useParams()
  const [tab, setTab] = useState<'overview' | 'register'>('overview')
  const { data, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const res = await api.get(`/events/${id}`)
      return res.data as Event
    },
    enabled: Boolean(id),
  })

  const googleUrl = useMemo(() => {
    if (!data) return '#'
    const start = new Date(data.startAt)
    const end = new Date(data.endAt)
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: data.title,
      details: data.description,
      location: data.location,
      dates: `${fmt(start)}/${fmt(end)}`,
    })
    return `https://www.google.com/calendar/render?${params.toString()}`
  }, [data])

  const icsHref = useMemo(() => {
    if (!data) return '#'
    const dt = (s: string) => new Date(s).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${data.title}\nDESCRIPTION:${data.description}\nDTSTART:${dt(data.startAt)}\nDTEND:${dt(data.endAt)}\nLOCATION:${data.location}\nEND:VEVENT\nEND:VCALENDAR`
    return 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics)
  }, [data])

  const related = useQuery({
    queryKey: ['related-events', id],
    queryFn: async () => {
      const res = await api.get('/events', { params: { published: 1 } })
      return (res.data as Event[]).filter((e) => e._id !== id).slice(0, 3)
    },
    enabled: !!data,
  })

  return (
    <PageShell>
      {isLoading || !data ? (
        <div className="space-y-4">
          <div className="h-64 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          <div className="h-8 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse w-1/3" />
          <div className="h-4 rounded bg-slate-100 dark:bg-slate-800 animate-pulse w-1/2" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Cover Image */}
          <div className="relative h-64 md:h-80 rounded-xl overflow-hidden">
            {data.coverImageUrl ? (
              <img 
                src={data.coverImageUrl} 
                alt={data.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-6xl font-bold">{data.title.charAt(0)}</div>
                  <div className="text-lg opacity-80">Event</div>
                </div>
              </div>
            )}
            {data.featured && (
              <div className="absolute top-4 left-4 bg-yellow-500 text-white text-sm px-3 py-1 rounded-full font-medium">
                Featured Event
              </div>
            )}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <a className="px-4 py-2 bg-white/90 hover:bg-white text-gray-900 rounded-md transition-colors" href={googleUrl} target="_blank" rel="noreferrer">Add to Google</a>
              <a className="px-4 py-2 bg-white/90 hover:bg-white text-gray-900 rounded-md transition-colors" href={icsHref} download={`${data.title}.ics`}>Download ICS</a>
              <button className="px-4 py-2 bg-white/90 hover:bg-white text-gray-900 rounded-md transition-colors" onClick={() => void navigator.clipboard.writeText(location.href)}>Share</button>
            </div>
          </div>

          <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{data.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300 mb-4">
                <span>{new Date(data.startAt).toLocaleString()}</span>
                <span>•</span>
                <span>{data.location}</span>
                {data.capacity && (
                  <>
                    <span>•</span>
                    <span>Capacity: {data.capacity}</span>
                  </>
                )}
              </div>
              {data.categories && data.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {data.categories.map((category, index) => (
                    <span key={index} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </header>
          <div className="border-b border-slate-200 dark:border-slate-800 flex gap-4">
            <button className={`px-3 py-2 ${tab === 'overview' ? 'border-b-2 border-primary-600' : ''}`} onClick={() => setTab('overview')}>Overview</button>
            <button className={`px-3 py-2 ${tab === 'register' ? 'border-b-2 border-primary-600' : ''}`} onClick={() => setTab('register')}>Register</button>
          </div>
          {tab === 'overview' ? (
            <div className="space-y-8">
              <section className="prose dark:prose-invert max-w-none">
                <p>{data.description}</p>
              </section>
              {/* Dynamic Agenda Section */}
              {data.agenda && data.agenda.length > 0 && (
                <section>
                  <h2 className="text-h3 font-semibold mb-2">Agenda</h2>
                  <div className="space-y-3">
                    {data.agenda.map((item, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="w-16 text-sm font-medium text-slate-600 dark:text-slate-300 flex-shrink-0">
                          {item.time}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.topic}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Dynamic Speakers Section */}
              {data.speakers && data.speakers.length > 0 && (
                <section>
                  <h2 className="text-h3 font-semibold mb-2">Speakers</h2>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {data.speakers.map((speaker, index) => (
                      <div key={index} className="card p-4 text-center">
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
                          {speaker.avatarUrl ? (
                            <img 
                              src={speaker.avatarUrl} 
                              alt={speaker.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none'
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">
                              {speaker.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="font-medium">{speaker.name}</div>
                        {speaker.title && (
                          <div className="text-sm text-slate-500">{speaker.title}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
              <section className="grid md:grid-cols-2 gap-4">
                <div className="card p-4">
                  <h3 className="font-semibold mb-2">Who should attend</h3>
                  <ul className="text-sm space-y-1">
                    <li>• IT & HR leaders</li>
                    <li>• Operations managers</li>
                    <li>• Employee experience teams</li>
                  </ul>
                </div>
                <div className="card p-4">
                  <h3 className="font-semibold mb-2">Key takeaways</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Where assistants deliver ROI</li>
                    <li>• How to deploy with guardrails</li>
                    <li>• What to measure and improve</li>
                  </ul>
                </div>
              </section>
              <section className="card p-4">
                <h3 className="font-semibold mb-2">Logistics</h3>
                <div className="text-sm text-slate-600 dark:text-slate-300">{data.location === 'Online' ? 'Join link sent after registration. Times shown in your local timezone.' : 'Venue map below. Please arrive 10 minutes early.'}</div>
                {data.location !== 'Online' && <div className="h-40 rounded bg-slate-100 dark:bg-slate-800 mt-3" aria-label="Map placeholder" />}
              </section>
              {related.data && related.data.length > 0 && (
                <section>
                  <h2 className="text-h3 font-semibold mb-3">Related Events</h2>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {related.data.map((ev) => (
                      <div key={ev._id} className="card p-4">
                        <div className="font-semibold mb-1 line-clamp-1">{ev.title}</div>
                        <div className="text-xs text-slate-500 mb-2">{new Date(ev.startAt).toLocaleString()} • {ev.location}</div>
                        <Link to={`/events/${ev._id}`} className="btn-outline">View</Link>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="max-w-lg">
              <EventRegistrationForm eventId={data._id} />
            </div>
          )}
        </div>
      )}
    </PageShell>
  )
}


