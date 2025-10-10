import mongoose, { Schema } from 'mongoose'
import type { InferSchemaType } from 'mongoose'

const AdminUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String },
    role: { type: String, enum: ['admin'], default: 'admin' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

export type AdminUser = InferSchemaType<typeof AdminUserSchema>
export const AdminUserModel = mongoose.model('AdminUser', AdminUserSchema)


