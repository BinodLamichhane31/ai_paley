import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import ConfirmationDialog from '@/components/ui/ConfirmationDialog'
import { Plus, X, Search, Grid, List } from 'lucide-react'

type Speaker = { name: string; title?: string; avatarUrl?: string }
type AgendaItem = { time: string; topic: string }
type Event = { _id: string; title: string; startAt: string; endAt: string; location: string; isPublished: boolean; updatedAt: string; capacity?: number; categories?: string[]; coverImageUrl?: string; featured?: boolean; speakers?: Speaker[]; agenda?: AgendaItem[] }


export default function EventsAdmin() {
  const qc = useQueryClient()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  const { data, isLoading } = useQuery({
    queryKey: ['events-admin', { searchQuery, statusFilter, categoryFilter }],
    queryFn: async () => {
      const params: any = {}
      if (searchQuery) params.q = searchQuery
      if (statusFilter !== 'all') params.isPublished = statusFilter === 'published'
      if (categoryFilter) params.category = categoryFilter
      
      const res = await api.get('/events', { params })
      return res.data as Event[]
    },
  })
  
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null)
  const [editEventId, setEditEventId] = useState<string | null>(null)
  const [newOpen, setNewOpen] = useState(false)
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null)

  const form = useForm<any>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      startAt: '',
      endAt: '',
      location: '',
      capacity: undefined,
      isPublished: false,
      category: '',
      coverImageFile: undefined,
      featured: false,
      speakers: [{ name: '', title: '' }],
      agenda: [],
    }
  })

  const togglePublish = useMutation({
    mutationFn: async ({ id, isPublished }: { id: string; isPublished: boolean }) => api.patch(`/events/${id}`, { isPublished }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events-admin'] }),
  })
  const removeEvent = useMutation({
    mutationFn: async (id: string) => api.delete(`/events/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['events-admin'] })
      setDeleteEventId(null)
    },
  })
  const createEvent = useMutation({
    mutationFn: async (payload: any) => api.post('/events', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['events-admin'] })
      form.reset()
      setCoverImagePreview(null)
      setNewOpen(false)
      toast.success('Event created successfully!')
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.response?.data?.error?.message || 'Failed to create event'
      toast.error(errorMessage)
    }
  })

  const updateEvent = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => api.patch(`/events/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['events-admin'] })
      form.reset()
      setCoverImagePreview(null)
      setEditEventId(null)
      toast.success('Event updated successfully!')
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.response?.data?.error?.message || 'Failed to update event'
      toast.error(errorMessage)
    }
  })


  const onSubmit = async (data: any) => {
    // Create a clean JSON payload
    const payload: any = {
      title: data.title?.trim(),
      description: data.description?.trim(),
      startAt: new Date(data.startAt).toISOString(),
      endAt: new Date(data.endAt).toISOString(),
      location: data.location?.trim(),
      isPublished: Boolean(data.isPublished),
      featured: Boolean(data.featured),
      category: data.category?.trim(),
    }
    
    // Add optional fields only if they have values
    if (data.capacity && data.capacity > 0) {
      payload.capacity = Number(data.capacity)
    }
    
    // Handle cover image - convert to base64 for now
    if (data.coverImageFile) {
      try {
        const base64 = await fileToBase64(data.coverImageFile)
        payload.coverImageUrl = base64
      } catch (error) {
        console.error('Error converting cover image:', error)
      }
    }
    
    // Add speakers only if there are any with actual data
    if (data.speakers && data.speakers.length > 0) {
      const validSpeakers = data.speakers.filter((speaker: any) => 
        speaker && speaker.name && speaker.name.trim() !== ''
      )
      if (validSpeakers.length > 0) {
        payload.speakers = validSpeakers.map((speaker: any) => ({
          name: speaker.name.trim(),
          title: speaker.title?.trim() || undefined,
        }))
      }
    }
    
    // Add agenda only if there are any with actual data
    if (data.agenda && data.agenda.length > 0) {
      const validAgenda = data.agenda.filter((item: any) => 
        item && item.time && item.topic && 
        item.time.trim() !== '' && item.topic.trim() !== ''
      )
      if (validAgenda.length > 0) {
        payload.agenda = validAgenda.map((item: any) => ({
          time: item.time.trim(),
          topic: item.topic.trim()
        }))
      }
    }
    
    if (editEventId) {
      updateEvent.mutate({ id: editEventId, payload })
    } else {
      createEvent.mutate(payload)
    }
  }

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  const addSpeaker = () => {
    const currentSpeakers = form.getValues('speakers') || []
    form.setValue('speakers', [...currentSpeakers, { name: '', title: '' }])
  }

  const removeSpeaker = (index: number) => {
    const currentSpeakers = form.getValues('speakers') || []
    form.setValue('speakers', currentSpeakers.filter((_: any, i: number) => i !== index))
  }

  const addAgendaItem = () => {
    const currentAgenda = form.getValues('agenda') || []
    form.setValue('agenda', [...currentAgenda, { time: '', topic: '' }])
  }

  const removeAgendaItem = (index: number) => {
    const currentAgenda = form.getValues('agenda') || []
    form.setValue('agenda', currentAgenda.filter((_: any, i: number) => i !== index))
  }

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue('coverImageFile', file)
      const reader = new FileReader()
      reader.onload = (e) => setCoverImagePreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const clearCoverImage = () => {
    form.setValue('coverImageFile', undefined)
    setCoverImagePreview(null)
  }


  const handleEditEvent = (event: Event) => {
    navigate(`/admin/events/${event._id}/edit`)
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Events Management</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Create, manage, and monitor your events</p>
          </div>
          <button 
            onClick={() => setNewOpen(true)}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 font-medium shadow-lg shadow-primary-600/25"
          >
            <Plus className="w-5 h-5" />
            Create Event
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search events by title, location, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
                className="px-3 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                <option value="">All Categories</option>
                <option value="Webinar">Webinar</option>
                <option value="Workshop">Workshop</option>
                <option value="Conference">Conference</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 rounded-md transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 rounded-md transition-all ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {newOpen && (
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editEventId ? 'Edit Event' : 'Create New Event'}
          </h2>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium mb-2">
                  Event Title <span className="text-red-500">*</span>
                </label>
                <input 
                  {...form.register('title')} 
                  className="w-full border rounded-md p-3 focus-ring" 
                  placeholder="Enter event title"
                />
                  {form.formState.errors.title && (
                    <p className="text-sm text-red-600 mt-1">{String(form.formState.errors.title.message)}</p>
                  )}
            </div>
            <div>
                <label className="block text-sm font-medium mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input 
                  {...form.register('location')} 
                  className="w-full border rounded-md p-3 focus-ring" 
                  placeholder="Enter event location"
                />
                  {form.formState.errors.location && (
                    <p className="text-sm text-red-600 mt-1">{String(form.formState.errors.location.message)}</p>
                  )}
            </div>
            <div>
                <label className="block text-sm font-medium mb-2">
                  Start Date & Time <span className="text-red-500">*</span>
                </label>
                <input 
                  type="datetime-local" 
                  {...form.register('startAt')} 
                  className="w-full border rounded-md p-3 focus-ring"
                />
                  {form.formState.errors.startAt && (
                    <p className="text-sm text-red-600 mt-1">{String(form.formState.errors.startAt.message)}</p>
                  )}
            </div>
            <div>
                <label className="block text-sm font-medium mb-2">
                  End Date & Time <span className="text-red-500">*</span>
                </label>
                <input 
                  type="datetime-local" 
                  {...form.register('endAt')} 
                  className="w-full border rounded-md p-3 focus-ring"
                />
                  {form.formState.errors.endAt && (
                    <p className="text-sm text-red-600 mt-1">{String(form.formState.errors.endAt.message)}</p>
                  )}
            </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea 
                {...form.register('description')} 
                className="w-full border rounded-md p-3 h-32 focus-ring resize-none" 
                placeholder="Describe your event..."
              />
                  {form.formState.errors.description && (
                    <p className="text-sm text-red-600 mt-1">{String(form.formState.errors.description.message)}</p>
                  )}
            </div>

            {/* Additional Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Capacity</label>
                <input 
                  type="number" 
                  min={1} 
                  {...form.register('capacity', { valueAsNumber: true })} 
                  className="w-full border rounded-md p-3 focus-ring" 
                  placeholder="Maximum attendees"
                />
                  {form.formState.errors.capacity && (
                    <p className="text-sm text-red-600 mt-1">{String(form.formState.errors.capacity.message)}</p>
                  )}
            </div>
            <div>
                <label className="block text-sm font-medium mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select 
                  {...form.register('category')} 
                  className="w-full border rounded-md p-3 focus-ring"
                >
                  <option value="">Select a category</option>
                  <option value="Webinar">Webinar</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Conference">Conference</option>
                </select>
                  {form.formState.errors.category && (
                    <p className="text-sm text-red-600 mt-1">{String(form.formState.errors.category.message)}</p>
                  )}
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium mb-2">Cover Image (Optional)</label>
              <div className="flex gap-3">
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="flex-1 border rounded-md p-3 focus-ring" 
                />
              </div>
              {form.formState.errors.coverImageFile && (
                <p className="text-sm text-red-600 mt-1">{String(form.formState.errors.coverImageFile.message)}</p>
              )}
              {coverImagePreview && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600 font-medium">Cover image uploaded</span>
                    </div>
                    <button 
                      type="button"
                      onClick={clearCoverImage}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <img 
                      src={coverImagePreview} 
                      alt="Cover preview" 
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Speakers */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium">Speakers (Optional)</label>
                <button 
                  type="button"
                  onClick={addSpeaker}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Speaker
                </button>
              </div>
              {form.watch('speakers')?.map((_: any, index: number) => (
                <div key={index} className="border rounded-md p-4 mb-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Speaker {index + 1}</span>
                    <button 
                      type="button"
                      onClick={() => removeSpeaker(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <input 
                          {...form.register(`speakers.${index}.name`)} 
                          placeholder="Speaker name" 
                          className="border rounded-md p-2 focus-ring w-full"
                        />
                      </div>
                      <div>
                        <input 
                          {...form.register(`speakers.${index}.title`)} 
                          placeholder="Job title (optional)" 
                          className="border rounded-md p-2 focus-ring w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Agenda */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium">Agenda (Optional)</label>
                <button 
                  type="button"
                  onClick={addAgendaItem}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>
              {form.watch('agenda')?.map((_: any, index: number) => (
                <div key={index} className="border rounded-md p-4 mb-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Agenda Item {index + 1}</span>
                    <button 
                      type="button"
                      onClick={() => removeAgendaItem(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <input 
                        {...form.register(`agenda.${index}.time`)} 
                        placeholder="Time (e.g., 10:00 AM)" 
                        className="border rounded-md p-2 focus-ring w-full"
                      />
                    </div>
                    <div>
                      <input 
                        {...form.register(`agenda.${index}.topic`)} 
                        placeholder="Topic" 
                        className="border rounded-md p-2 focus-ring w-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkboxes */}
            <div className="flex gap-6">
            <label className="inline-flex items-center gap-2">
                <input 
                  type="checkbox" 
                  {...form.register('isPublished')} 
                  className="rounded"
                />
                <span className="text-sm font-medium">Publish Event</span>
            </label>
            <label className="inline-flex items-center gap-2">
                <input 
                  type="checkbox" 
                  {...form.register('featured')} 
                  className="rounded"
                />
                <span className="text-sm font-medium">Featured Event</span>
            </label>
          </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button 
                type="button" 
                onClick={() => {
                  setNewOpen(false)
                  setEditEventId(null)
                  form.reset()
                  setCoverImagePreview(null)
                }}
                className="px-6 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={createEvent.isPending || updateEvent.isPending}
                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {(createEvent.isPending || updateEvent.isPending) ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {editEventId ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  editEventId ? 'Update Event' : 'Create Event'
                )}
              </button>
          </div>
          </form>
        </div>
      )}

              {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="h-32 bg-slate-100 dark:bg-slate-800 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-2/3" />
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
              ) : data && data.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((ev) => (
            <Link 
              key={ev._id} 
              to={`/admin/events/${ev._id}`}
              className="card overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
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
                <div className="absolute top-2 right-2 flex gap-1">
                  {ev.isPublished && (
                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Published
                    </div>
                  )}
        </div>
      </div>

              {/* Event Details */}
              <div className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-1">{ev.title}</h3>
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300 mb-4">
                  <div>{new Date(ev.startAt).toLocaleDateString()} - {new Date(ev.endAt).toLocaleDateString()}</div>
                  <div>{ev.location}</div>
                  {ev.categories && ev.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {ev.categories.slice(0, 2).map((category, index) => (
                        <span key={index} className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">
                          {category}
                        </span>
                      ))}
          </div>
                  )}
                  {ev.speakers && ev.speakers.length > 0 && (
                    <div>{ev.speakers.length} speaker{ev.speakers.length > 1 ? 's' : ''}</div>
            )}
          </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <button 
                    className="px-3 py-1.5 text-xs border rounded-md hover:bg-gray-50 text-blue-600"
                    onClick={(e) => {
                      e.preventDefault()
                      handleEditEvent(ev)
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    className="px-3 py-1.5 text-xs border rounded-md hover:bg-gray-50 text-red-600"
                    onClick={(e) => {
                      e.preventDefault()
                      setDeleteEventId(ev._id)
                    }}
                  >
                    Delete
                  </button>
                </div>

                {/* Publish Toggle */}
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <label className="flex items-center gap-2 text-sm">
                    <input 
                      type="checkbox" 
                      checked={ev.isPublished} 
                      onChange={(e) => {
                        e.preventDefault()
                        togglePublish.mutate({ id: ev._id, isPublished: !ev.isPublished })
                      }}
                      className="rounded"
                    />
                    <span className={ev.isPublished ? 'text-green-600' : 'text-slate-500'}>
                      {ev.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </label>
                </div>
              </div>
            </Link>
          ))}
        </div>
        ) : (
          <div className="space-y-4">
            {data.map((ev) => (
              <div key={ev._id} className="card p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center gap-6">
                  {/* Cover Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
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
                          <div className="text-lg font-bold">{ev.title.charAt(0)}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{ev.title}</h3>
                        <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                          <div>{new Date(ev.startAt).toLocaleDateString()} - {new Date(ev.endAt).toLocaleDateString()}</div>
                          <div>{ev.location}</div>
                          {ev.speakers && ev.speakers.length > 0 && (
                            <div>{ev.speakers.length} speaker{ev.speakers.length > 1 ? 's' : ''}</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        {ev.featured && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                            Featured
                          </span>
                        )}
                        {ev.isPublished ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            Published
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                            Draft
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link 
                      to={`/admin/events/${ev._id}`} 
                      className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                      View
                    </Link>
                    <button 
                      className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 text-blue-600 transition-colors"
                      onClick={() => handleEditEvent(ev)}
                    >
                      Edit
                    </button>
                    <button 
                      className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 text-red-600 transition-colors"
                      onClick={() => setDeleteEventId(ev._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <div className="text-slate-500 mb-4">No events found.</div>
          <button 
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            onClick={() => setNewOpen(true)}
          >
            Create your first event
          </button>
        </div>
      )}


      {/* Delete Event Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!deleteEventId}
        onClose={() => setDeleteEventId(null)}
        onConfirm={() => deleteEventId && removeEvent.mutate(deleteEventId)}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone and will also remove all associated registrations."
        confirmText="Delete Event"
        variant="danger"
        isLoading={removeEvent.isPending}
      />
    </>
  )
}


