import type { Request, Response } from 'express'
import { z } from 'zod'
import { DemoRequestModel } from '../models/DemoRequest'
import { EventRegistrationModel } from '../models/EventRegistration'
import { streamCsv } from '../utils/csv'

export const ExportQuery = z.object({
  query: z.object({ type: z.enum(['demos', 'registrations']), from: z.string().datetime().optional(), to: z.string().datetime().optional(), eventId: z.string().optional() })
})

export async function exportCsv(req: Request, res: Response) {
  const { type, from, to, eventId } = (req as any).query as z.infer<typeof ExportQuery>['query']
  const fromISO = from ? new Date(from).toISOString().slice(0, 10) : 'all'
  const toISO = to ? new Date(to).toISOString().slice(0, 10) : 'all'
  const filename = type === 'demos' ? `demos_${fromISO}_${toISO}.csv` : eventId ? `event_${eventId}_registrations.csv` : `registrations_${fromISO}_${toISO}.csv`

  if (type === 'demos') {
    const filter: any = {}
    if (from || to) filter.createdAt = { ...(from ? { $gte: new Date(from) } : {}), ...(to ? { $lte: new Date(to) } : {}) }
    const cursor = DemoRequestModel.find(filter).sort({ createdAt: 1 }).cursor({ batchSize: 100 })
    const header = ['name', 'email', 'company', 'country', 'interestArea', 'status', 'createdAt']
    async function* rows() {
      for await (const d of cursor) {
        yield [d.name, d.email, d.company, d.country, d.interestArea, d.status, d.createdAt.toISOString()]
      }
    }
    return streamCsv(res, filename, header, rows())
  } else {
    const filter: any = {}
    if (eventId) filter.eventId = eventId
    if (from || to) filter.createdAt = { ...(from ? { $gte: new Date(from) } : {}), ...(to ? { $lte: new Date(to) } : {}) }
    const cursor = EventRegistrationModel.find(filter).sort({ createdAt: 1 }).cursor({ batchSize: 100 })
    const header = ['eventId', 'name', 'email', 'company', 'createdAt']
    async function* rows() {
      for await (const r of cursor) {
        yield [String(r.eventId), r.name, r.email, r.company ?? '', r.createdAt.toISOString()]
      }
    }
    return streamCsv(res, filename, header, rows())
  }
}


