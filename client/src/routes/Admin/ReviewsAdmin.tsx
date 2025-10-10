import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useState } from 'react'
import ConfirmationDialog from '@/components/ui/ConfirmationDialog'
import { Search, Star, MessageSquare, Calendar, Trash2, Eye } from 'lucide-react'

type Review = { _id: string; eventId: string; rating: number; comment: string; name?: string; createdAt: string }

export default function ReviewsAdmin() {
  const qc = useQueryClient()
  const [eventId, setEventId] = useState('')
  const [rating, setRating] = useState<number | ''>('')
  const [page, setPage] = useState(1)
  const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const { data, isLoading } = useQuery({
    queryKey: ['reviews-admin', { eventId, page }],
    queryFn: async () => {
      const params: any = { page, limit: 10 }
      if (eventId) params.eventId = eventId
      const res = await api.get('/reviews', { params })
      return res.data as { items: Review[]; page: number; limit: number; total: number }
    },
  })

  const del = useMutation({
    mutationFn: async (id: string) => api.delete(`/reviews/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews-admin'] })
      setDeleteReviewId(null)
    },
  })

  const filtered = !data ? [] : (rating ? data.items.filter((r) => r.rating === rating) : data.items)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Event Reviews</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage and monitor customer feedback and ratings</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                value={eventId} 
                onChange={(e) => { setEventId(e.target.value); setPage(1) }} 
                className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" 
                placeholder="Search by event ID..."
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select 
              value={rating} 
              onChange={(e) => setRating(e.target.value ? Number(e.target.value) : '')} 
              className="px-3 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            >
              <option value="">All Ratings</option>
              {[1,2,3,4,5].map((r) => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((review) => (
              <div key={review._id} className="card p-6 hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => setSelectedReview(review)}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{review.name || 'Anonymous'}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Event: {review.eventId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3">
                    {review.comment}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedReview(review)
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeleteReviewId(review._id)
                    }}
                    className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {data && (
            <div className="flex items-center justify-center gap-4">
              <button 
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={page <= 1} 
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Page {data.page} of {Math.ceil(data.total / data.limit)}
              </span>
              <button 
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={data.page * data.limit >= data.total} 
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No reviews found</h3>
          <p className="text-slate-600 dark:text-slate-400">Try adjusting your search criteria or filters.</p>
        </div>
      )}

      {/* Detail Dialog */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Review Details</h2>
                <button 
                  onClick={() => setSelectedReview(null)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Reviewer Name</label>
                      <p className="text-slate-900 dark:text-white">{selectedReview.name || 'Anonymous'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Event ID</label>
                      <p className="text-slate-900 dark:text-white">{selectedReview.eventId}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Rating</label>
                      <div className="flex items-center gap-1">
                        {renderStars(selectedReview.rating)}
                        <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">({selectedReview.rating}/5)</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Submitted</label>
                      <p className="text-slate-900 dark:text-white">{new Date(selectedReview.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Comment</label>
                  <p className="text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 p-4 rounded-lg whitespace-pre-wrap">{selectedReview.comment}</p>
                </div>

                <div className="flex items-center gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <button 
                    onClick={() => setSelectedReview(null)}
                    className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => {
                      setDeleteReviewId(selectedReview._id)
                      setSelectedReview(null)
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!deleteReviewId}
        onClose={() => setDeleteReviewId(null)}
        onConfirm={() => deleteReviewId && del.mutate(deleteReviewId)}
        title="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete Review"
        variant="danger"
        isLoading={del.isPending}
      />
    </div>
  )
}


