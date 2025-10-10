import type { Request, Response } from 'express'
import { z } from 'zod'
import { EventModel } from '../models/Event'
import { EventRegistrationModel } from '../models/EventRegistration'
import { ok } from '../utils/http'

export const EventCreateSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(120),
    description: z.string().max(5000),
    startAt: z.coerce.date(),
    endAt: z.coerce.date(),
    location: z.string().min(2).max(120),
    capacity: z.coerce.number().min(0).optional(),
    categories: z.array(z.string()).optional(),
    coverImageUrl: z.string().url().optional(),
    featured: z.boolean().optional(),
    speakers: z.array(z.object({ name: z.string(), title: z.string().optional(), avatarUrl: z.string().url().optional() })).optional(),
    agenda: z.array(z.object({ time: z.string(), topic: z.string() })).optional(),
    isPublished: z.boolean().default(false),
  }).refine((d) => d.endAt > d.startAt, { message: 'endAt must be after startAt', path: ['endAt'] })
})

export const EventUpdateSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: EventCreateSchema.shape.body.partial(),
})

export const EventListQuery = z.object({
  query: z.object({
    published: z.coerce.number().optional(),
    q: z.string().optional(),
    month: z.string().optional(),
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
  })
})

export async function listEvents(req: Request, res: Response) {
  const { published, q, month, from, to } = ((req as any).validated?.query ?? req.query) as z.infer<typeof EventListQuery>['query']
  const filter: any = {}
  if (typeof published !== 'undefined') filter.isPublished = Boolean(published)
  if (from || to) filter.startAt = { ...(from ? { $gte: new Date(from) } : {}), ...(to ? { $lte: new Date(to) } : {}) }
  if (month && /^\d{4}-\d{2}$/.test(month)) {
    const [yStr, mStr] = month.split('-')
    const y = Number(yStr)
    const m = Number(mStr)
    if (!Number.isNaN(y) && !Number.isNaN(m) && m >= 1 && m <= 12) {
      const start = new Date(y, m - 1, 1)
      const end = new Date(y, m, 0, 23, 59, 59, 999)
      filter.startAt = { $gte: start, $lte: end }
    }
  }
  const query = q ? { ...filter, $or: [{ title: new RegExp(q, 'i') }, { description: new RegExp(q, 'i') }] } : filter
  const items = await EventModel.find(query).sort({ startAt: 1 }).lean()
  // Derive seatsLeft if capacity
  // Note: for full accuracy, use aggregation to count registrations; simplified here.
  res.json(items)
}

export async function getEvent(req: Request, res: Response) {
  const { id } = req.params
  const ev = await EventModel.findById(id).lean()
  if (!ev) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Event not found' } })
  res.json(ev)
}

export async function createEvent(req: Request, res: Response) {
  const body = ((req as any).validated?.body ?? req.body) as z.infer<typeof EventCreateSchema>['body']
  const ev = await EventModel.create(body)
  res.status(201).json(ok({ id: String(ev._id) }))
}

export async function updateEvent(req: Request, res: Response) {
  const { id } = req.params
  const body = ((req as any).validated?.body ?? req.body) as z.infer<typeof EventUpdateSchema>['body']
  if (body.startAt && body.endAt && body.endAt <= body.startAt) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'endAt must be after startAt' } })
  }
  const ev = await EventModel.findByIdAndUpdate(id, body, { new: true }).lean()
  if (!ev) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Event not found' } })
  res.json(ok({}))
}

export async function deleteEvent(req: Request, res: Response) {
  const { id } = req.params
  await EventModel.findByIdAndDelete(id)
  res.json(ok({}))
}

export const RegistrationSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({ name: z.string().min(2).max(80), email: z.string().email(), phone: z.string().optional(), company: z.string().optional() })
})

export async function registerForEvent(req: Request, res: Response) {
  const { id } = ((req as any).validated?.params ?? req.params) as z.infer<typeof RegistrationSchema>['params']
  const body = ((req as any).validated?.body ?? req.body) as z.infer<typeof RegistrationSchema>['body']
  try {
    await EventRegistrationModel.create({ eventId: id, ...body })
    res.status(201).json(ok({}))
  } catch (e: any) {
    if (e?.code === 11000) {
      return res.status(409).json({ error: { code: 'DUPLICATE', message: "You've already registered with this email." } })
    }
    throw e
  }
}

export const RegistrationsListSchema = z.object({ params: z.object({ id: z.string().min(1) }) })

export async function listRegistrationsByEvent(req: Request, res: Response) {
  const { id } = ((req as any).validated?.params ?? req.params) as z.infer<typeof RegistrationsListSchema>['params']
  const regs = await EventRegistrationModel.find({ eventId: id }).sort({ createdAt: -1 }).lean()
  res.json(regs)
}


