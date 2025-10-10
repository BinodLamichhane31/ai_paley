import { Router } from 'express'
import { validate } from '../middleware/validate'
import { ChatSchema, chat } from '../controllers/chat.controller'
import { publicPostLimiter } from '../config/security'

const router = Router()

router.post('/', publicPostLimiter, validate(ChatSchema), chat)

export default router


