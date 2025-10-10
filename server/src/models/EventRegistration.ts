import mongoose, { Schema, Types } from 'mongoose'
import type { InferSchemaType } from 'mongoose'

const EventRegistrationSchema = new Schema(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    company: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

EventRegistrationSchema.index({ eventId: 1, email: 1 }, { unique: true })

export type EventRegistration = InferSchemaType<typeof EventRegistrationSchema> & { eventId: Types.ObjectId }
export const EventRegistrationModel = mongoose.model('EventRegistration', EventRegistrationSchema)


