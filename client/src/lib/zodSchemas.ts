import { z } from 'zod'

export const DemoRequestSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name must be less than 80 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z.string()
    .optional()
    .refine((val) => !val || /^[\+]?[1-9][\d]{0,15}$/.test(val.replace(/[\s\-\(\)]/g, '')), 
      'Please enter a valid phone number'),
  company: z.string()
    .min(2, 'Company name must be at least 2 characters')
    .max(120, 'Company name must be less than 120 characters'),
  country: z.string()
    .min(1, 'Please select a country'),
  interestArea: z.enum(['AI Assistant', 'Automation', 'Analytics', 'Other']).refine(
    (val) => ['AI Assistant', 'Automation', 'Analytics', 'Other'].includes(val),
    { message: 'Please select an area of interest' }
  ),
  message: z.string()
    .max(1000, 'Message must be less than 1000 characters')
    .optional(),
})

export type DemoRequestInput = z.infer<typeof DemoRequestSchema>


