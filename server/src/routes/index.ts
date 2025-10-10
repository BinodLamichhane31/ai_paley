import { Router } from 'express'
import authRoutes from './auth.routes'
import demoRoutes from './demo.routes'
import eventsRoutes from './events.routes'
import reviewsRoutes from './reviews.routes'
import exportRoutes from './export.routes'
import chatRoutes from './chat.routes'
import adminRoutes from './admin.routes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/demos', demoRoutes)
router.use('/events', eventsRoutes)
router.use('/reviews', reviewsRoutes)
router.use('/export', exportRoutes)
router.use('/chat', chatRoutes)
router.use('/admin', adminRoutes)

export default router


