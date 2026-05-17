import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type Params = { params: Promise<{ id: string }> }

// GET /api/games/:id
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { data: game, error } = await supabase
    .from('games')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !game) {
    return NextResponse.json({ success: false, error: 'Game not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true, data: game })
}

// PATCH /api/games/:id
export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }

  if (body.title !== undefined) updates.title = body.title
  if (body.description !== undefined) updates.description = body.description
  if (body.content !== undefined) updates.content = body.content
  if (body.is_published !== undefined) updates.is_published = body.is_published

  const { data: game, error } = await supabase
    .from('games')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error || !game) {
    return NextResponse.json({ success: false, error: 'Failed to update game' }, { status: 500 })
  }

  return NextResponse.json({ success: true, data: game })
}

// DELETE /api/games/:id
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase
    .from('games')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete game' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
