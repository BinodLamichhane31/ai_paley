import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/lib/api'
import { toast } from 'sonner'

const Schema = z.object({ name: z.string().min(2).max(80), email: z.string().email(), phone: z.string().optional(), company: z.string().optional() })
type Input = z.infer<typeof Schema>

export default function EventRegistrationForm({ eventId }: { eventId: string }) {
  const form = useForm<Input>({ resolver: zodResolver(Schema) })
  const submitting = form.formState.isSubmitting
  async function onSubmit(values: Input) {
    try {
      await api.post(`/events/${eventId}/register`, values)
      toast.success("You're registered!")
      form.reset()
    } catch (e: any) {
      const code = e?.response?.data?.error?.code
      if (code === 'DUPLICATE') toast.error("You've already registered with this email.")
    }
  }
  return (
    <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
      <div>
        <label className="block text-sm mb-1">Name</label>
        <input {...form.register('name')} className="w-full border rounded-md p-2 focus-ring" />
      </div>
      <div>
        <label className="block text-sm mb-1">Email</label>
        <input type="email" {...form.register('email')} className="w-full border rounded-md p-2 focus-ring" />
      </div>
      <div>
        <label className="block text-sm mb-1">Phone (optional)</label>
        <input {...form.register('phone')} className="w-full border rounded-md p-2 focus-ring" />
      </div>
      <div>
        <label className="block text-sm mb-1">Company (optional)</label>
        <input {...form.register('company')} className="w-full border rounded-md p-2 focus-ring" />
      </div>
      <button disabled={submitting || !form.formState.isValid} className="px-4 py-2 rounded-md bg-primary-600 text-white focus-ring disabled:opacity-50">{submitting ? 'Submitting…' : 'Register'}</button>
    </form>
  )
}


