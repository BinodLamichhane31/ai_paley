import mongoose, { Schema } from 'mongoose'
import type { InferSchemaType } from 'mongoose'

const DemoRequestSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: { type: String },
    company: { type: String, required: true },
    country: { type: String, required: true },
    interestArea: { type: String, enum: ['AI Assistant', 'Automation', 'Analytics', 'Other'], required: true },
    message: { type: String },
    status: { type: String, enum: ['new', 'in_progress', 'closed'], default: 'new', index: true },
    note: { type: String },
  },
  { timestamps: true }
)

DemoRequestSchema.index({ createdAt: -1 })
DemoRequestSchema.index({ name: 'text', email: 'text', company: 'text', interestArea: 'text' })

export type DemoRequest = InferSchemaType<typeof DemoRequestSchema>
export const DemoRequestModel = mongoose.model('DemoRequest', DemoRequestSchema)


