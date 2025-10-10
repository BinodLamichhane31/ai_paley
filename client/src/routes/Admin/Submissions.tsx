import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useEffect, useMemo, useState } from 'react'
import { downloadCsv } from '@/lib/csv'
import ConfirmationDialog from '@/components/ui/ConfirmationDialog'
import { Search, Filter, Download, Eye, Trash2, Calendar, Building, MapPin, Tag, User, Mail } from 'lucide-react'

type Demo = {
  _id: string
  name: string
  email: string
  company: string
  country: string
  interestArea: string
  status: 'new' | 'in_progress' | 'closed'
  createdAt: string
  note?: string
}

export default function Submissions() {
  const qc = useQueryClient()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [debouncedQ, setDebouncedQ] = useState('')
  const [deleteDemoId, setDeleteDemoId] = useState<string | null>(null)
  const [selectedDemo, setSelectedDemo] = useState<Demo | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 400)
    return () => clearTimeout(t)
  }, [q])

  const params = useMemo(() => ({ q: debouncedQ || undefined, status: status || undefined, page, limit: 10, from: from || undefined, to: to || undefined }), [debouncedQ, status, page, from, to])

  const { data, isLoading } = useQuery({
    queryKey: ['demos', params],
    queryFn: async () => {
      const res = await api.get('/demos', { params })
      return res.data as { items: Demo[]; page: number; limit: number; total: number }
    },
  })

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Demo['status'] }) => {
      await api.patch(`/demos/${id}`, { status })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['demos'] }),
  })

  const removeDemo = useMutation({
    mutationFn: async (id: string) => api.delete(`/demos/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['demos'] })
      setDeleteDemoId(null)
    },
  })

  async function exportCsv() {
    const base = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'
    const url = new URL(base + '/export')
    url.searchParams.set('type', 'demos')
    if (from) url.searchParams.set('from', new Date(from).toISOString())
    if (to) url.searchParams.set('to', new Date(to).toISOString())
    const name = `demos_${from || 'all'}_${to || 'all'}.csv`
    await downloadCsv(url.toString(), name)
  }

  const getStatusColor = (status: Demo['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'closed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Demo Submissions</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage and track demo requests from potential clients</p>
        </div>
        <button 
          onClick={() => void exportCsv()} 
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                value={q} 
                onChange={(e) => setQ(e.target.value)} 
                className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" 
                placeholder="Search by name, email, company, or interest..."
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <select 
              value={status} 
              onChange={(e) => { setStatus(e.target.value); setPage(1) }} 
              className="px-3 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
            <input 
              type="date" 
              value={from} 
              onChange={(e) => setFrom(e.target.value)} 
              className="px-3 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" 
            />
            <input 
              type="date" 
              value={to} 
              onChange={(e) => setTo(e.target.value)} 
              className="px-3 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" 
            />
          </div>
        </div>
      </div>

      {/* Submissions Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : data && data.items.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.items.map((demo) => (
              <div key={demo._id} className="card p-6 hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => setSelectedDemo(demo)}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{demo.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{demo.email}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(demo.status)}`}>
                    {demo.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Building className="w-4 h-4" />
                    <span>{demo.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <MapPin className="w-4 h-4" />
                    <span>{demo.country}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Tag className="w-4 h-4" />
                    <span>{demo.interestArea}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(demo.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <select 
                    value={demo.status} 
                    onChange={(e) => updateStatus.mutate({ id: demo._id, status: e.target.value as Demo['status'] })}
                    className="flex-1 text-sm border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 bg-white dark:bg-slate-800"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="new">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedDemo(demo)
                    }}
                    className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeleteDemoId(demo._id)
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
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No submissions found</h3>
          <p className="text-slate-600 dark:text-slate-400">Try adjusting your search criteria or filters.</p>
        </div>
      )}

      {/* Detail Dialog */}
      {selectedDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Demo Submission Details</h2>
                <button 
                  onClick={() => setSelectedDemo(null)}
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
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Name</label>
                      <p className="text-slate-900 dark:text-white">{selectedDemo.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Email</label>
                      <p className="text-slate-900 dark:text-white">{selectedDemo.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Company</label>
                      <p className="text-slate-900 dark:text-white">{selectedDemo.company}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Country</label>
                      <p className="text-slate-900 dark:text-white">{selectedDemo.country}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Interest Area</label>
                      <p className="text-slate-900 dark:text-white">{selectedDemo.interestArea}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Status</label>
                      <select 
                        value={selectedDemo.status} 
                        onChange={(e) => updateStatus.mutate({ id: selectedDemo._id, status: e.target.value as Demo['status'] })}
                        className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        <option value="new">New</option>
                        <option value="in_progress">In Progress</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Submitted</label>
                      <p className="text-slate-900 dark:text-white">{new Date(selectedDemo.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {selectedDemo.note && (
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Notes</label>
                    <p className="text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">{selectedDemo.note}</p>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <button 
                    onClick={() => setSelectedDemo(null)}
                    className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => {
                      setDeleteDemoId(selectedDemo._id)
                      setSelectedDemo(null)
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
        isOpen={!!deleteDemoId}
        onClose={() => setDeleteDemoId(null)}
        onConfirm={() => deleteDemoId && removeDemo.mutate(deleteDemoId)}
        title="Delete Demo Submission"
        message="Are you sure you want to delete this demo submission? This action cannot be undone."
        confirmText="Delete Submission"
        variant="danger"
        isLoading={removeDemo.isPending}
      />
    </div>
  )
}


