import type { NextFunction, Request, Response } from 'express'
import { z, ZodError } from 'zod'

export function validate(schema: z.ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      })
      ;(req as any).validated = parsed
      next()
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: e.flatten() } })
      }
      next(e)
    }
  }
}


