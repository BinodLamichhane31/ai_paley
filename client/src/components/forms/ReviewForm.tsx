import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { useState } from 'react'
import { Star, User, AtSign, MessageSquare, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

const MAX_COMMENT_LENGTH = 1500;

// Schema is unchanged, it's already solid.
const Schema = z.object({
  eventId: z.string().optional(),
  name: z.string().max(100).optional().or(z.literal('')),
  email: z.string().email('Please enter a valid email').max(100).optional().or(z.literal('')),
  rating: z.number().int().min(1, 'Please select a rating').max(5),
  comment: z.string()
    .min(10, 'Comment must be at least 10 characters')
    .max(MAX_COMMENT_LENGTH, `Comment must not exceed ${MAX_COMMENT_LENGTH} characters`)
    .trim(),
})

type Input = z.infer<typeof Schema>

// The modal containing this form should have the `popover` class.
// Example: <div className="p-6 popover sm:p-8">... <ReviewForm /> ... </div>
export default function ReviewForm({ eventId, onSubmitted }: { eventId?: string; onSubmitted?: () => void }) {
  const { 
    register, 
    control, 
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid, touchedFields } 
  } = useForm<Input>({
    resolver: zodResolver(Schema),
    defaultValues: {
      eventId: eventId || '',
      name: '',
      email: '',
      comment: '',
      rating: 0,
    },
    mode: 'onChange',
  })

  const commentValue = watch('comment', '');

  async function onSubmit(values: Input) {
    // ... submission logic remains the same
    try {
      const payload = { ...values };
      if (!payload.name) delete payload.name;
      if (!payload.email) delete payload.email;

      await api.post('/reviews', payload)
      toast.success('Thank you for your review!', {
        description: 'Your feedback helps us improve.',
      })
      onSubmitted?.()
    } catch (error) {
      toast.error('Submission Failed', {
        description: 'An unexpected error occurred. Please try again.',
      })
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {/* --- Star Rating Section --- */}
      <div className="text-center">
        <label className="block mb-3 form-label">Your overall rating</label>
        <Controller
          name="rating"
          control={control}
          render={({ field: { onChange, value } }) => (
            <StarRatingInput value={value} onChange={onChange} />
          )}
        />
        {errors.rating && <p className="text-center form-error-message">{errors.rating.message}</p>}
      </div>
      
      {/* --- Comment Section --- */}
      <div>
        <label htmlFor="comment" className="form-label">Share your experience</label>
        <div className="relative">
          <MessageSquare className="input-icon" aria-hidden="true" />
          <textarea
            id="comment"
            rows={5}
            {...register('comment')}
            className={clsx('input input-with-icon', {
              'input-error': errors.comment,
              'input-success': touchedFields.comment && !errors.comment
            })}
            placeholder="What made the experience great? What could be improved?"
          />
        </div>
        <div className="flex justify-between items-center mt-1.5">
          {errors.comment ? 
            <p className="form-error-message">{errors.comment.message}</p> : 
            <div /> // Placeholder for alignment
          }
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {commentValue.length} / {MAX_COMMENT_LENGTH}
          </p>
        </div>
      </div>

      {/* --- Optional Details Section --- */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="form-label">Name</label>
          <div className="relative">
            <User className="input-icon" aria-hidden="true" />
            <input
              id="name"
              {...register('name')}
              className={clsx('input', 'input-with-icon', {
                 'input-error': errors.name,
                 'input-success': touchedFields.name && !errors.name
              })}
              placeholder="Your display name"
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="form-label">Email (Never shown)</label>
          <div className="relative">
            <AtSign className="input-icon" aria-hidden="true" />
            <input
              id="email"
              type="email"
              {...register('email')}
              className={clsx('input', 'input-with-icon', {
                'input-error': errors.email,
                'input-success': touchedFields.email && !errors.email
              })}
              placeholder="you@example.com"
            />
          </div>
        </div>
      </div>
      
      {/* --- Submission --- */}
      <button
        type="submit"
        disabled={isSubmitting || !isValid}
        className="btn-primary w-full !mt-8 text-base"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 size-5 animate-spin" /> Submitting...
          </>
        ) : (
          'Post Review'
        )}
      </button>
    </form>
  )
}


// Enhanced Star Rating Component - now more aligned with your theme
const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent']

function StarRatingInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const [hoverValue, setHoverValue] = useState(0)

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="flex items-center gap-2"
        onMouseLeave={() => setHoverValue(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            type="button"
            whileHover={{ scale: 1.1, y: -4 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            onMouseEnter={() => setHoverValue(star)}
            onClick={() => onChange(star)}
            className="p-1 rounded-full focus-ring"
            aria-label={`Rate ${star} stars`}
          >
            <Star
              className={`size-9 transition-all duration-200 ease-in-out ${
                (hoverValue || value) >= star
                  ? 'text-amber-400 fill-amber-400 drop-shadow-[0_2px_4px_rgba(251,191,36,0.4)]'
                  : 'text-slate-300 dark:text-slate-600'
              }`}
            />
          </motion.button>
        ))}
      </div>
      <p className="h-5 text-sm font-semibold transition-opacity duration-200 text-slate-600 dark:text-slate-300">
        {ratingLabels[hoverValue || value] || ''}
      </p>
    </div>
  )
}