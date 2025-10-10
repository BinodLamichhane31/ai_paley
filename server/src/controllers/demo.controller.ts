import type { Request, Response } from 'express'
import { z } from 'zod'
import { DemoRequestModel } from '../models/DemoRequest'
import { ok } from '../utils/http'
import { sendOptionalConfirmation } from '../services/mail.service'

export const DemoRequestSchema = z.object({
  body: z.object({
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
    interestArea: z.enum(['AI Assistant', 'Automation', 'Analytics', 'Other'], {
      errorMap: () => ({ message: 'Please select an area of interest' })
    }),
    message: z.string()
      .max(1000, 'Message must be less than 1000 characters')
      .optional(),
  })
})

export async function createDemo(req: Request, res: Response) {
  const body = ((req as any).validated?.body ?? req.body) as z.infer<typeof DemoRequestSchema>['body']
  const doc = await DemoRequestModel.create(body)
  const emailSent = await sendOptionalConfirmation(body.email, 'Demo request received', 'We will be in touch soon.').catch(() => false)
  return res.status(201).json(ok({ id: String(doc._id), emailSent }))
}

export const ListDemosQuery = z.object({
  query: z.object({
    q: z.string().optional(),
    status: z.enum(['new', 'in_progress', 'closed']).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
  })
})

export async function listDemos(req: Request, res: Response) {
  const { q, status, page, limit, from, to } = ((req as any).validated?.query ?? req.query) as z.infer<typeof ListDemosQuery>['query']
  const filter: any = {}
  if (status) filter.status = status
  if (from || to) filter.createdAt = { ...(from ? { $gte: new Date(from) } : {}), ...(to ? { $lte: new Date(to) } : {}) }
  let query = DemoRequestModel.find(filter).sort({ createdAt: -1 }).lean()
  if (q) query = query.find({ $text: { $search: q } })
  const total = await DemoRequestModel.countDocuments(query.getFilter())
  const items = await query.skip((page - 1) * limit).limit(limit)
  res.json({ items, page, limit, total })
}

export const UpdateDemoSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({ status: z.enum(['new', 'in_progress', 'closed']).optional(), note: z.string().optional() })
})

export async function updateDemo(req: Request, res: Response) {
  const { id } = ((req as any).validated?.params ?? req.params) as z.infer<typeof UpdateDemoSchema>['params']
  const body = ((req as any).validated?.body ?? req.body) as z.infer<typeof UpdateDemoSchema>['body']
  const updated = await DemoRequestModel.findByIdAndUpdate(id, body, { new: true }).lean()
  if (!updated) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Demo request not found' } })
  res.json(ok({ item: updated }))
}

export const IdParamSchema = z.object({ params: z.object({ id: z.string().min(1) }) })

export async function deleteDemo(req: Request, res: Response) {
  const { id } = ((req as any).validated?.params ?? req.params) as z.infer<typeof IdParamSchema>['params']
  const deleted = await DemoRequestModel.findByIdAndDelete(id).lean()
  if (!deleted) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Demo request not found' } })
  res.json(ok({}))
}


