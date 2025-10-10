import nodemailer from 'nodemailer'
import { loadEnv } from '../config/env'

let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  const env = loadEnv()
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) return null
  if (transporter) return transporter
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT || 587,
    secure: !!env.SMTP_SECURE,
    auth: { user: env.SMTP_USER!, pass: env.SMTP_PASS! },
  })
  return transporter
}

export async function sendOptionalConfirmation(to: string, subject: string, text: string): Promise<boolean> {
  const env = loadEnv()
  const tx = getTransporter()
  if (!tx || !env.FROM_EMAIL) return false
  try {
    await tx.sendMail({ from: env.FROM_EMAIL, to, subject, text })
    return true
  } catch {
    return false
  }
}


