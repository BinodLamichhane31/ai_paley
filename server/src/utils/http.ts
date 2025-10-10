export function ok<T>(data: T) {
  return { ok: true as const, ...((data as any) || {}) }
}

export function httpError(code: string, message: string, statusCode = 400) {
  const err: any = new Error(message)
  err.code = code
  err.statusCode = statusCode
  return err
}


