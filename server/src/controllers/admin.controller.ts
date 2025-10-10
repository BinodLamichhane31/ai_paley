import type { Request, Response } from 'express'
import { z } from 'zod'
import { DemoRequestModel } from '../models/DemoRequest'
import { EventModel } from '../models/Event'
import { EventRegistrationModel } from '../models/EventRegistration'
import { ReviewModel } from '../models/Review'

export const StatsQuery = z.object({ query: z.object({ from: z.string().datetime().optional(), to: z.string().datetime().optional() }) })

export async function stats(req: Request, res: Response) {
  const { from, to } = (req as any).query as z.infer<typeof StatsQuery>['query']
  const range: any = {}
  if (from || to) range.createdAt = { ...(from ? { $gte: new Date(from) } : {}), ...(to ? { $lte: new Date(to) } : {}) }

  const [demoRequestsTotal, eventRegistrationsTotal, eventsTotal, reviewsTotal] = await Promise.all([
    DemoRequestModel.countDocuments(range),
    EventRegistrationModel.countDocuments(range),
    EventModel.countDocuments({}),
    ReviewModel.countDocuments(range),
  ])

  // Weekly trend simple aggregation (last 8 weeks)
  const since = new Date()
  since.setDate(since.getDate() - 7 * 8)
  const weeklyDemo = await DemoRequestModel.aggregate([
    { $match: { createdAt: { $gte: since } } },
    { $group: { _id: { $dateTrunc: { date: '$createdAt', unit: 'week', binSize: 1 } }, count: { $sum: 1 } } },
    { $project: { weekStartISO: '$_id', demoCount: '$count', _id: 0 } },
  ])
  const weeklyReg = await EventRegistrationModel.aggregate([
    { $match: { createdAt: { $gte: since } } },
    { $group: { _id: { $dateTrunc: { date: '$createdAt', unit: 'week', binSize: 1 } }, count: { $sum: 1 } } },
    { $project: { weekStartISO: '$_id', regCount: '$count', _id: 0 } },
  ])

  const weeklyMap: Record<string, { weekStartISO: string; demoCount: number; regCount: number }> = {}
  for (const w of weeklyDemo) {
    const k = new Date(w.weekStartISO).toISOString()
    weeklyMap[k] = { weekStartISO: k, demoCount: w.demoCount, regCount: 0 }
  }
  for (const w of weeklyReg) {
    const k = new Date(w.weekStartISO).toISOString()
    weeklyMap[k] = weeklyMap[k] || { weekStartISO: k, demoCount: 0, regCount: 0 }
    weeklyMap[k].regCount = w.regCount
  }

  const weekly = Object.values(weeklyMap).sort((a, b) => a.weekStartISO.localeCompare(b.weekStartISO))

  const topInterests = await DemoRequestModel.aggregate([
    { $group: { _id: '$interestArea', count: { $sum: 1 } } },
    { $project: { _id: 0, label: '$_id', count: 1 } },
    { $sort: { count: -1 } },
  ])

  const topEvents = await EventRegistrationModel.aggregate([
    { $group: { _id: '$eventId', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
    { $lookup: { from: 'events', localField: '_id', foreignField: '_id', as: 'event' } },
    { $unwind: '$event' },
    { $project: { _id: 0, eventId: '$_id', title: '$event.title', count: 1 } },
  ])

  res.json({
    totals: { demoRequestsTotal, eventRegistrationsTotal, eventsTotal, reviewsTotal },
    weekly,
    topInterests,
    topEvents,
  })
}

export const AdminSearchQuery = z.object({ query: z.object({ q: z.string().min(1) }) })

export async function adminSearch(req: Request, res: Response) {
  const { q } = (req as any).query as z.infer<typeof AdminSearchQuery>['query']
  const demos = await DemoRequestModel.find({ $text: { $search: q } }).limit(5).lean()
  const registrations = await EventRegistrationModel.find({ email: new RegExp(q, 'i') }).limit(5).lean()
  res.json({ demos, registrations })
}

export const SmtpTestBody = z.object({ body: z.object({ toEmail: z.string().email() }) })

export async function smtpTest(req: Request, res: Response) {
  const { sendOptionalConfirmation } = await import('../services/mail.service')
  const { toEmail } = ((req as any).validated?.body ?? req.body) as { toEmail: string }
  const ok = await sendOptionalConfirmation(toEmail, 'SMTP Test', 'This is a test email from AI-Solutions.')
  res.json({ delivered: ok })
}


