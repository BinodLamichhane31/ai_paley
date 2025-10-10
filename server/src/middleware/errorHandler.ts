import type { Request, Response, NextFunction } from 'express'

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  // eslint-disable-next-line no-console
  console.error(err)
  const status = err.statusCode || 500
  res.status(status).json({ error: { code: err.code || 'INTERNAL_ERROR', message: err.message || 'Unexpected server error' } })
}


