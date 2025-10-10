import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useState } from 'react'
import { toast } from 'sonner'
import { downloadCsv } from '@/lib/csv'
import { ArrowLeft, Edit, Download, Users, Calendar, MapPin, Clock } from 'lucide-react'

type Speaker = { name: string; title?: string; avatarUrl?: string }
type AgendaItem = { time: string; topic: string }
type Event = { 
  _id: string; 
  title: string; 
  description: string; 
  startAt: string; 
  endAt: string; 
  location: string; 
  isPublished: boolean; 
  updatedAt: string; 
  capacity?: number; 
  categories?: string[]; 
  coverImageUrl?: string; 
  featured?: boolean; 
  speakers?: Speaker[]; 
  agenda?: AgendaItem[] 
}
type Reg = { _id: string; name: string; email: string; company?: string; createdAt: string }

export default function EventDetailAdmin() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [tab, setTab] = useState<'details' | 'registrations'>('details')

  const { data: event, isLoading } = useQuery({
    queryKey: ['event-admin', id],
    queryFn: async () => {
      const res = await api.get(`/events/${id}`)
      return res.data as Event
    },
    enabled: Boolean(id),
  })

  const { data: registrations, isLoading: regsLoading } = useQuery({
    queryKey: ['registrations', id],
    queryFn: async () => {
      const res = await api.get(`/events/${id}/registrations`)
      return res.data as Reg[]
    },
    enabled: Boolean(id),
  })

  const togglePublish = useMutation({
    mutationFn: async ({ id, isPublished }: { id: string; isPublished: boolean }) => 
      api.patch(`/events/${id}`, { isPublished }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['event-admin', id] })
      qc.invalidateQueries({ queryKey: ['events-admin'] })
      toast.success('Event status updated!')
    },
  })

  const handleEdit = () => {
    navigate(`/admin/events/${id}/edit`)
  }

  const handleExportCsv = async () => {
    if (!id) return
    const base = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'
    const url = new URL(base + '/export')
    url.searchParams.set('type', 'registrations')
    url.searchParams.set('eventId', id)
    await downloadCsv(url.toString(), `event_${id}_registrations.csv`)
  }

  if (isLoading || !event) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-1/3 animate-pulse" />
        </div>
        <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        <div className="space-y-4">
          <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-1/2 animate-pulse" />
          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4 animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/events')}
            className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-3xl font-bold">{event.title}</h1>
          {event.featured && (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              Featured
            </span>
          )}
          {event.isPublished ? (
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Published
            </span>
          ) : (
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
              Draft
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative h-64 md:h-80 rounded-xl overflow-hidden">
        {event.coverImageUrl ? (
          <img 
            src={event.coverImageUrl} 
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-6xl font-bold">{event.title.charAt(0)}</div>
              <div className="text-lg opacity-80">Event</div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 ${tab === 'details' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-slate-600'}`}
            onClick={() => setTab('details')}
          >
            Event Details
          </button>
          <button
            className={`px-4 py-2 ${tab === 'registrations' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-slate-600'}`}
            onClick={() => setTab('registrations')}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Registrations ({registrations?.length || 0})
            </div>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {tab === 'details' ? (
        <div className="space-y-8">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-slate-500" />
                <div>
                  <div className="font-medium">Start Date</div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    {new Date(event.startAt).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-slate-500" />
                <div>
                  <div className="font-medium">End Date</div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    {new Date(event.endAt).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-slate-500" />
                <div>
                  <div className="font-medium">Location</div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">{event.location}</div>
                </div>
              </div>
              {event.capacity && (
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-slate-500" />
                  <div>
                    <div className="font-medium">Capacity</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      {event.capacity} attendees
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="font-medium mb-2">Description</div>
                <div className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                  {event.description}
                </div>
              </div>
              {event.categories && event.categories.length > 0 && (
                <div>
                  <div className="font-medium mb-2">Categories</div>
                  <div className="flex flex-wrap gap-2">
                    {event.categories.map((category, index) => (
                      <span key={index} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Speakers */}
          {event.speakers && event.speakers.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Speakers</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {event.speakers.map((speaker, index) => (
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
            </div>
          )}

          {/* Agenda */}
          {event.agenda && event.agenda.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Agenda</h3>
              <div className="space-y-3">
                {event.agenda.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="w-20 text-sm font-medium text-slate-600 dark:text-slate-300 flex-shrink-0">
                      {item.time}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.topic}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Publish Toggle */}
          <div className="card p-4">
            <h3 className="font-semibold mb-3">Event Status</h3>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={event.isPublished}
                onChange={(e) => togglePublish.mutate({ id: event._id, isPublished: e.target.checked })}
                className="rounded"
              />
              <span className={event.isPublished ? 'text-green-600' : 'text-slate-500'}>
                {event.isPublished ? 'Published (Visible to public)' : 'Draft (Not visible to public)'}
              </span>
            </label>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-semibold mb-4">Event Registrations</h3>
          {regsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
              ))}
            </div>
          ) : registrations && registrations.length > 0 ? (
            <div className="card overflow-hidden">
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800">
                    <tr className="text-left">
                      <th className="p-3">Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Company</th>
                      <th className="p-3">Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((reg) => (
                      <tr key={reg._id} className="border-t border-slate-100 dark:border-slate-800">
                        <td className="p-3 font-medium">{reg.name}</td>
                        <td className="p-3">{reg.email}</td>
                        <td className="p-3">{reg.company || '-'}</td>
                        <td className="p-3">{new Date(reg.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <div className="text-slate-500 mb-2">No registrations yet</div>
              <div className="text-sm text-slate-400">Registrations will appear here once people sign up for this event.</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
