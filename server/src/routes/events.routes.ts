import { Router } from 'express'
import { validate } from '../middleware/validate'
import { createEvent, deleteEvent, getEvent, listEvents, registerForEvent, updateEvent, EventCreateSchema, EventUpdateSchema, EventListQuery, RegistrationSchema, listRegistrationsByEvent, RegistrationsListSchema } from '../controllers/events.controller'
import { requireAuth } from '../middleware/auth'
import { publicPostLimiter } from '../config/security'

const router = Router()

router.get('/', validate(EventListQuery), listEvents)
router.get('/:id', getEvent)
router.post('/', requireAuth, validate(EventCreateSchema), createEvent)
router.patch('/:id', requireAuth, validate(EventUpdateSchema), updateEvent)
router.delete('/:id', requireAuth, deleteEvent)
router.post('/:id/register', publicPostLimiter, validate(RegistrationSchema), registerForEvent)
router.get('/:id/registrations', requireAuth, validate(RegistrationsListSchema), listRegistrationsByEvent)

export default router


