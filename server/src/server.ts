import { createServer } from 'http'
import app from './app'
import { loadEnv } from './config/env'
import { connectToDatabase } from './config/db'

async function main() {
  const env = loadEnv()
  try {
    await connectToDatabase()
    console.log('Connected to MongoDB')
  } catch (e) {
    console.warn('MongoDB connection failed; starting server without DB (some routes will fail).')
  }
  const server = createServer(app)
  server.listen(env.PORT, () => {
    console.log(`Server listening on http://localhost:${env.PORT}`)
  })
}

main().catch((err) => {
  console.error('Fatal error starting server', err)
  process.exit(1)
})


