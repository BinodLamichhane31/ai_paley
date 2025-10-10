import type { Request, Response } from 'express'
import { z } from 'zod'
import { ReviewModel } from '../models/Review'
import { ok } from '../utils/http'

export const ReviewSchema = z.object({
  body: z.object({
    rating: z.coerce.number().int().min(1).max(5),
    comment: z.string().min(5).max(1500),
    name: z.string(),
    email: z.string().email(),
  })
})

export const ReviewListQuery = z.object({
  query: z.object({ eventId: z.string().optional(), page: z.coerce.number().int().positive().default(1), limit: z.coerce.number().int().positive().max(100).default(10) })
})

export async function createReview(req: Request, res: Response) {
  const body = ((req as any).validated?.body ?? req.body) as z.infer<typeof ReviewSchema>['body']
  const doc = await ReviewModel.create(body)
  res.status(201).json(ok({ id: String(doc._id) }))
}

export async function listReviews(req: Request, res: Response) {
  const { page, limit } = ((req as any).validated?.query ?? req.query) as z.infer<typeof ReviewListQuery>['query']
  const filter: any = {}
  const total = await ReviewModel.countDocuments(filter)
  const items = await ReviewModel.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean()
  res.json({ items, page, limit, total })
}

export const DeleteReviewSchema = z.object({ params: z.object({ id: z.string().min(1) }) })

export async function deleteReview(req: Request, res: Response) {
  const { id } = ((req as any).validated?.params ?? req.params) as z.infer<typeof DeleteReviewSchema>['params']
  await ReviewModel.findByIdAndDelete(id)
  res.json(ok({}))
}


