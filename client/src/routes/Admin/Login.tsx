import PageShell from '@/components/layout/PageShell'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginApi } from '@/lib/auth'
import { useAuthStore } from '@/store/auth'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useEffect } from 'react'

const Schema = z.object({ 
  email: z.string().email('Please enter a valid email address'), 
  password: z.string().min(6, 'Password must be at least 6 characters') 
})
type Input = z.infer<typeof Schema>

export default function AdminLogin() {
  const { setUser, setLoading, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const form = useForm<Input>({ 
    resolver: zodResolver(Schema),
    defaultValues: {
      email: '',
      password: ''
    }
  })
  const submitting = form.formState.isSubmitting

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  async function onSubmit(values: Input) {
    setLoading(true)
    try {
      const res = await loginApi(values.email, values.password)
      setUser(res.user)
      toast.success('Login successful')
      navigate('/admin/dashboard', { replace: true })
    } catch (e: any) {
      const errorMessage = e?.response?.data?.message || 'Invalid credentials'
      toast.error(errorMessage)
      form.setError('root', { message: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageShell>
      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-xl bg-primary-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">AI</span>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-slate-900 dark:text-slate-100">
              Admin Portal
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Sign in to your admin account
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...form.register('email')}
                  className="w-full px-3 py-3 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-800 dark:text-slate-100"
                  placeholder="Enter your email"
                />
                {form.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-600">{form.formState.errors.email.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...form.register('password')}
                  className="w-full px-3 py-3 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-800 dark:text-slate-100"
                  placeholder="Enter your password"
                />
                {form.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-600">{form.formState.errors.password.message}</p>
                )}
              </div>
            </div>

            {form.formState.errors.root && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {form.formState.errors.root.message}
                </p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={submitting || !form.formState.isValid}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {submitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageShell>
  )
}


