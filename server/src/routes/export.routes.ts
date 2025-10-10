import { Router } from 'express'
import { validate } from '../middleware/validate'
import { ExportQuery, exportCsv } from '../controllers/export.controller'
import { requireAuth } from '../middleware/auth'

const router = Router()

router.get('/', requireAuth, validate(ExportQuery), exportCsv)

export default router


