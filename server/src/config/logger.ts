import { createLogger, format, transports } from 'winston'

const redact = format((info) => {
  const redactFields = ['email', 'phone']
  for (const field of redactFields) {
    if (info[field]) info[field] = '[REDACTED]'
  }
  return info
})

export const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    redact(),
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [new transports.Console()],
})


