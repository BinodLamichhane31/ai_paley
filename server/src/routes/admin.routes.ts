import { Router } from 'express'
import { requireAuth } from '../middleware/auth'
import { stats, StatsQuery, adminSearch, AdminSearchQuery, smtpTest, SmtpTestBody } from '../controllers/admin.controller'
import { validate } from '../middleware/validate'

const router = Router()

router.get('/stats', requireAuth, validate(StatsQuery), stats)
router.get('/search', requireAuth, validate(AdminSearchQuery), adminSearch)
router.post('/smtp-test', requireAuth, validate(SmtpTestBody), smtpTest)

export default router


