import mongoose, { Schema } from 'mongoose'
import type { InferSchemaType } from 'mongoose'

const EventSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    location: { type: String, required: true },
    capacity: { type: Number },
    categories: [{ type: String }],
    coverImageUrl: { type: String },
    featured: { type: Boolean, default: false },
    speakers: [{
      name: { type: String },
      title: { type: String },
      avatarUrl: { type: String },
    }],
    agenda: [{
      time: { type: String },
      topic: { type: String },
    }],
    isPublished: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
)

export type Event = InferSchemaType<typeof EventSchema>
export const EventModel = mongoose.model('Event', EventSchema)


