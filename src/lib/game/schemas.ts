import { z } from 'zod'

// User validation
export const UserSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email(),
  name: z.string().optional(),
  image: z.string().url().optional(),
  password: z.string().min(8).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export type UserInput = z.infer<typeof UserSchema>

// Game validation
export const GameSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  userId: z.string().uuid(),
  content: z.record(z.string(), z.unknown()),
  thumbnail: z.string().url().optional(),
  isPublished: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export type GameInput = z.infer<typeof GameSchema>

// Export validation
export const ExportSchema = z.object({
  id: z.string().uuid().optional(),
  gameId: z.string().uuid(),
  format: z.enum(['web', 'pdf', 'apk', 'ipa', 'link']),
  status: z.enum(['pending', 'processing', 'completed', 'failed']).default('pending'),
  url: z.string().url().optional(),
  error: z.string().optional(),
  createdAt: z.date().optional(),
  completedAt: z.date().optional(),
})

export type ExportInput = z.infer<typeof ExportSchema>

// Payment validation
export const PaymentSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid(),
  gameId: z.string().uuid().optional(),
  amount: z.number().positive(),
  currency: z.string().length(3).default('USD'),
  status: z.enum(['pending', 'completed', 'failed']).default('pending'),
  stripePaymentId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export type PaymentInput = z.infer<typeof PaymentSchema>
