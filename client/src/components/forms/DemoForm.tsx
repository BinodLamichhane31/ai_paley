import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DemoRequestSchema, type DemoRequestInput } from '@/lib/zodSchemas'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { useState } from 'react'

const countries = ['US', 'UK', 'CA', 'AU', 'Other']
const interests = ['AI Assistant', 'Automation', 'Analytics', 'Other'] as const

export default function DemoForm({ onSuccess }: { onSuccess?: (emailSent: boolean) => void }) {
  const form = useForm<DemoRequestInput>({ 
    resolver: zodResolver(DemoRequestSchema),
    mode: 'onChange', // Enable live validation
    reValidateMode: 'onChange'
  })
  const [emailNote, setEmailNote] = useState(false)
  const submitting = form.formState.isSubmitting

  // Helper function to get field state classes
  const getFieldClasses = (fieldName: keyof DemoRequestInput, hasError: boolean) => {
    const baseClasses = "w-full border rounded-md p-2 focus-ring transition-colors"
    const errorClasses = hasError 
      ? "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20" 
      : "border-gray-300 dark:border-gray-600"
    const validClasses = !hasError && form.getValues(fieldName) 
      ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20" 
      : ""
    
    return `${baseClasses} ${errorClasses} ${validClasses}`
  }

  async function onSubmit(values: DemoRequestInput) {
    try {
      const res = await api.post('/demos', values)
      toast.success("Request received! We'll be in touch.")
      form.reset()
      setEmailNote(Boolean(res.data?.emailSent))
      onSuccess?.(Boolean(res.data?.emailSent))
    } catch {}
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1 font-medium">
            Name <span className="text-red-500">*</span>
          </label>
          <input 
            {...form.register('name')} 
            className={getFieldClasses('name', !!form.formState.errors.name)}
            placeholder="Jane Doe" 
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
              <span className="text-red-500">⚠</span>
              {form.formState.errors.name.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm mb-1 font-medium">
            Email <span className="text-red-500">*</span>
          </label>
          <input 
            type="email" 
            {...form.register('email')} 
            className={getFieldClasses('email', !!form.formState.errors.email)}
            placeholder="jane@example.com" 
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
              <span className="text-red-500">⚠</span>
              {form.formState.errors.email.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm mb-1 font-medium">Phone</label>
          <input 
            {...form.register('phone')} 
            className={getFieldClasses('phone', !!form.formState.errors.phone)}
            placeholder="+1 555..." 
          />
          {form.formState.errors.phone && (
            <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
              <span className="text-red-500">⚠</span>
              {form.formState.errors.phone.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm mb-1 font-medium">
            Company <span className="text-red-500">*</span>
          </label>
          <input 
            {...form.register('company')} 
            className={getFieldClasses('company', !!form.formState.errors.company)}
            placeholder="Acme Inc" 
          />
          {form.formState.errors.company && (
            <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
              <span className="text-red-500">⚠</span>
              {form.formState.errors.company.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm mb-1 font-medium">
            Country <span className="text-red-500">*</span>
          </label>
          <select 
            {...form.register('country')} 
            className={getFieldClasses('country', !!form.formState.errors.country)}
          >
            <option value="">Select a country</option>
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {form.formState.errors.country && (
            <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
              <span className="text-red-500">⚠</span>
              {form.formState.errors.country.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm mb-1 font-medium">
            Area of Interest <span className="text-red-500">*</span>
          </label>
          <select 
            {...form.register('interestArea')} 
            className={getFieldClasses('interestArea', !!form.formState.errors.interestArea)}
          >
            <option value="">Select an area</option>
            {interests.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {form.formState.errors.interestArea && (
            <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
              <span className="text-red-500">⚠</span>
              {form.formState.errors.interestArea.message}
            </p>
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm mb-1 font-medium">Message (optional)</label>
        <textarea 
          {...form.register('message')} 
          className={getFieldClasses('message', !!form.formState.errors.message) + ' h-28 resize-none'} 
          placeholder="Tell us more about your needs..." 
        />
        <div className="flex justify-between items-center mt-1">
          {form.formState.errors.message && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <span className="text-red-500">⚠</span>
              {form.formState.errors.message.message}
            </p>
          )}
          <span className="text-xs text-gray-500 ml-auto">
            {form.watch('message')?.length || 0}/1000 characters
          </span>
        </div>
      </div>
      {emailNote && (
        <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
          ✓ Email confirmation sent
        </div>
      )}
      
      {/* Form validation summary */}
      {Object.keys(form.formState.errors).length > 0 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/20 dark:border-red-800">
          <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
            Please fix the following errors:
          </p>
          <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
            {Object.entries(form.formState.errors).map(([field, error]) => (
              <li key={field} className="flex items-center gap-2">
                <span className="text-red-500">•</span>
                {error?.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <span className="text-red-500">*</span> Required fields
        </div>
        <button 
          type="submit"
          disabled={submitting || !form.formState.isValid} 
          className="px-6 py-2 rounded-md bg-primary-600 text-white focus-ring disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-primary-700 disabled:hover:bg-primary-600"
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Submitting…
            </span>
          ) : (
            'Submit Request'
          )}
        </button>
      </div>
    </form>
  )
}

