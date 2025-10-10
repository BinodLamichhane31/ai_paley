import PageShell from '@/components/layout/PageShell'
import ReviewForm from '@/components/forms/ReviewForm'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Edit, X } from 'lucide-react'

type Review = { _id: string; eventId: string; rating: number; comment: string; name?: string; createdAt: string }

export default function Reviews() {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false) // State to control modal visibility

  const { data, isLoading } = useQuery({
    queryKey: ['reviews', { page }],
    queryFn: async () => {
      const res = await api.get('/reviews', { params: { page, limit: 10 } })
      return res.data as { items: Review[]; page: number; limit: number; total: number }
    },
    // Keep data fresh but don't show loading spinners on background refetches
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: false,
  })

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFormOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])


  return (
    <PageShell>
      {/* Page Header */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Customer Reviews
        </h1>
        <button 
          onClick={() => setIsFormOpen(true)} 
          className="w-full btn-primary group sm:w-auto"
        >
          <Edit className="size-4 mr-2 group-hover:rotate-[-5deg] transition-transform" />
          Write a Review
        </button>
      </div>

      {/* Reviews List */}
      {isLoading && !data ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-24 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)}
        </div>
      ) : data && data.items.length > 0 ? (
        <div className="space-y-4">
          {data.items.map((r) => (
            <div key={r._id} className="p-4 card-premium sm:p-6">
              <div className="flex items-center gap-1 text-amber-400" aria-label={`${r.rating} stars`}>
                {Array.from({length: 5}).map((_, i) => (
                    <svg key={i} className={`size-5 ${i < r.rating ? 'fill-current' : 'text-slate-300 dark:text-slate-600'}`} viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                ))}
              </div>
              <p className="mt-3 text-slate-700 dark:text-slate-200">{r.comment}</p>
              <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                {r.name || 'Anonymous'}
                <span className="font-normal opacity-70"> • {new Date(r.createdAt).toLocaleDateString()}</span>
              </p>
            </div>
          ))}
          
          {/* Pagination */}
          <div className="flex items-center justify-between pt-4">
            <button className="text-sm btn-outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Previous
            </button>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Page {data.page} of {Math.ceil(data.total / data.limit)}
            </div>
            <button className="text-sm btn-outline" disabled={data.page * data.limit >= data.total} onClick={() => setPage((p) => p + 1)}>
              Next
            </button>
          </div>
        </div>
      ) : (
        <div className="py-16 text-center card-premium">
            <p className="text-lg text-slate-600 dark:text-slate-300">No reviews yet.</p>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Be the first to share your experience!</p>
        </div>
      )}

      {/* Review Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFormOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-white shadow-xl dark:bg-slate-900 rounded-2xl card-premium"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Share Your Experience</h2>
                  <button 
                    onClick={() => setIsFormOpen(false)} 
                    className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    aria-label="Close"
                  >
                    <X className="size-5" />
                  </button>
                </div>
                <ReviewForm 
                  onSubmitted={() => {
                    void qc.invalidateQueries({ queryKey: ['reviews'] });
                    setIsFormOpen(false);
                  }} 
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </PageShell>
  )
}