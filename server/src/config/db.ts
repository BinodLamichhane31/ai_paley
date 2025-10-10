import mongoose from 'mongoose'
import { loadEnv } from './env'

export async function connectToDatabase(): Promise<void> {
  const env = loadEnv()
  mongoose.set('strictQuery', true)
  await mongoose.connect(env.MONGO_URI)
}


