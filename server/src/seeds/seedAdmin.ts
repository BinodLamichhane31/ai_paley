import bcrypt from 'bcrypt'
import { connectToDatabase } from '../config/db'
import { loadEnv } from '../config/env'
import { AdminUserModel } from '../models/AdminUser'

async function run() {
  const env = loadEnv()
  await connectToDatabase()
  const existing = await AdminUserModel.findOne({ email: env.ADMIN_EMAIL })
  if (existing) {
    console.log('Admin already exists:', env.ADMIN_EMAIL)
    return
  }
  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 10)
  await AdminUserModel.create({ email: env.ADMIN_EMAIL, passwordHash, role: 'admin' })
  console.log('Seeded admin:', env.ADMIN_EMAIL)
}

run().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })


