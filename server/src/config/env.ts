import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const EnvSchema = z.object({
  PORT: z
    .string()
    .default('4000')
    .transform((v) => Number(v))
    .pipe(z.number().int().positive()),
  MONGO_URI: z.string().default('mongodb://localhost:27017/ai_solutions'),
  JWT_SECRET: z.string().default('dev_secret'),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
  GEMINI_API_KEY: z.string().optional(),
  SMTP_HOST: z.string().optional().or(z.literal('')),
  SMTP_PORT: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : undefined))
    .optional(),
  SMTP_SECURE: z
    .string()
    .optional()
    .transform((v) => (v ? v === 'true' : undefined))
    .optional(),
  SMTP_USER: z.string().optional().or(z.literal('')),
  SMTP_PASS: z.string().optional().or(z.literal('')),
  FROM_EMAIL: z.string().optional().or(z.literal('')),
  ADMIN_EMAIL: z.string().email().default('admin@gmail.com'),
  ADMIN_PASSWORD: z.string().min(6).default('Admin@123'),
})

export type Env = z.infer<typeof EnvSchema>

let cachedEnv: Env | null = null

export function loadEnv(): Env {
  if (cachedEnv) return cachedEnv
  const parsed = EnvSchema.safeParse(process.env)
  if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors)
    throw new Error('Invalid environment variables')
  }
  cachedEnv = parsed.data
  return cachedEnv
}


