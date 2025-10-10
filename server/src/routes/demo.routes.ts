import { Router } from 'express'
import { validate } from '../middleware/validate'
import { createDemo, deleteDemo, listDemos, updateDemo, DemoRequestSchema, ListDemosQuery, UpdateDemoSchema, IdParamSchema } from '../controllers/demo.controller'
import { requireAuth } from '../middleware/auth'
import { publicPostLimiter } from '../config/security'

const router = Router()

router.post('/', publicPostLimiter, validate(DemoRequestSchema), createDemo)
router.get('/', requireAuth, validate(ListDemosQuery), listDemos)
router.patch('/:id', requireAuth, validate(UpdateDemoSchema), updateDemo)
router.delete('/:id', requireAuth, validate(IdParamSchema), deleteDemo)

export default router


