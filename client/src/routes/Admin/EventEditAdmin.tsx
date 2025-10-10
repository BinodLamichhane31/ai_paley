import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Plus, X } from 'lucide-react'

type Speaker = { name: string; title?: string }
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

export default function EventEditAdmin() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null)

  const { data: event, isLoading } = useQuery({
    queryKey: ['event-admin', id],
    queryFn: async () => {
      const res = await api.get(`/events/${id}`)
      return res.data as Event
    },
    enabled: Boolean(id),
  })

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

  // Populate form when event data loads
  useEffect(() => {
    if (event) {
      form.reset({
        title: event.title,
        description: event.description || '',
        startAt: new Date(event.startAt).toISOString().slice(0, 16),
        endAt: new Date(event.endAt).toISOString().slice(0, 16),
        location: event.location,
        capacity: event.capacity,
        isPublished: event.isPublished,
        category: event.categories?.[0] || '',
        coverImageFile: undefined,
        featured: event.featured || false,
        speakers: event.speakers && event.speakers.length > 0 ? event.speakers : [{ name: '', title: '' }],
        agenda: event.agenda || [],
      })
      // Set cover image preview if it exists
      if (event.coverImageUrl) {
        setCoverImagePreview(event.coverImageUrl)
      }
    }
  }, [event, form])

  const updateEvent = useMutation({
    mutationFn: async (payload: any) => api.patch(`/events/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['events-admin'] })
      qc.invalidateQueries({ queryKey: ['event-admin', id] })
      toast.success('Event updated successfully!')
      navigate(`/admin/events/${id}`)
    },
    onError: () => toast.error('Failed to update event')
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
    
    updateEvent.mutate(payload)
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

  if (isLoading || !event) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-1/3 animate-pulse" />
        </div>
        <div className="h-96 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/admin/events/${id}`)}
            className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Event
          </button>
          <h1 className="text-3xl font-bold">Edit Event</h1>
        </div>
      </div>

      {/* Edit Form */}
      <div className="card p-6">
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
                <p className="text-sm text-red-600 mt-1">{String(form.formState.errors.title?.message || '')}</p>
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
                <p className="text-sm text-red-600 mt-1">{String(form.formState.errors.location?.message || '')}</p>
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
                <p className="text-sm text-red-600 mt-1">{String(form.formState.errors.startAt?.message || '')}</p>
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
                <p className="text-sm text-red-600 mt-1">{String(form.formState.errors.endAt?.message || '')}</p>
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
              <p className="text-sm text-red-600 mt-1">{String(form.formState.errors.description?.message || '')}</p>
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
                <p className="text-sm text-red-600 mt-1">{String(form.formState.errors.capacity?.message || '')}</p>
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
              onClick={() => navigate(`/admin/events/${id}`)}
              className="px-6 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={updateEvent.isPending}
              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {updateEvent.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                'Update Event'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
