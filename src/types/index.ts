/**
 * Type definitions for Kids Play Store application
 */

export type User = {
  id: string
  email: string
  name: string | null
  image: string | null
  createdAt: Date
  updatedAt: Date
}

// Matches Supabase column names exactly
export type Game = {
  id: string
  title: string
  description: string | null
  user_id: string
  template_type: string
  content: Record<string, unknown>
  thumbnail_url: string | null
  is_published: boolean
  play_count: number
  created_at: string
  updated_at: string
}

export type GameContent = {
  width: number
  height: number
  backgroundColor: string
  scenes: Scene[]
  physics?: PhysicsConfig
  audio?: AudioAsset[]
}

export type Scene = {
  id: string
  name: string
  type: 'menu' | 'game' | 'level' | 'end'
  sprites: Sprite[]
  audio: string[]
  settings: SceneSettings
}

export type Sprite = {
  id: string
  type: 'image' | 'text' | 'shape' | 'button'
  x: number
  y: number
  width: number
  height: number
  rotation: number
  alpha: number
  properties: Record<string, unknown>
  physics?: PhysicsBody
}

export type SceneSettings = {
  autoStart: boolean
  physics?: boolean
  backgroundColor: string
}

export type PhysicsBody = {
  type: 'static' | 'dynamic'
  mass: number
  friction: number
  restitution: number
}

export type PhysicsConfig = {
  enabled: boolean
  type: 'arcade' | 'matter'
  debug: boolean
  gravity: { x: number; y: number }
}

export type AudioAsset = {
  id: string
  url: string
  name: string
  type: 'bg' | 'sfx'
}

export type ExportFormat = 'web' | 'pdf' | 'apk' | 'ipa' | 'link'

export type Export = {
  id: string
  gameId: string
  format: ExportFormat
  status: 'pending' | 'processing' | 'completed' | 'failed'
  url: string | null
  error: string | null
  createdAt: Date
  completedAt: Date | null
}

export type Payment = {
  id: string
  userId: string
  gameId: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed'
  stripePaymentId: string
  createdAt: Date
  updatedAt: Date
}

export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}
