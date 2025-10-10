import mongoose, { Schema } from 'mongoose'
import type { InferSchemaType } from 'mongoose'

const ReviewSchema = new Schema(
  {
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    name: { type: String },
    email: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

ReviewSchema.index({createdAt: -1 })

export type Review = InferSchemaType<typeof ReviewSchema>
export const ReviewModel = mongoose.model('Review', ReviewSchema)


