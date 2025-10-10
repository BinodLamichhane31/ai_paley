import { Router } from 'express'
import { validate } from '../middleware/validate'
import { createReview, deleteReview, listReviews, ReviewSchema, ReviewListQuery, DeleteReviewSchema } from '../controllers/reviews.controller'
import { requireAuth } from '../middleware/auth'
import { publicPostLimiter } from '../config/security'

const router = Router()

router.post('/', publicPostLimiter, validate(ReviewSchema), createReview)
router.get('/', validate(ReviewListQuery), listReviews)
router.delete('/:id', requireAuth, validate(DeleteReviewSchema), deleteReview)

export default router


