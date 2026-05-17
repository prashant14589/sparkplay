import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Phase 2+: swap Supabase client for Prisma if needed
// import { prisma } from '@/lib/db/prisma'

// GET /api/games - Get current user's games
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { data: games, error } = await supabase
      .from('games')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error

    return NextResponse.json({ success: true, data: games })
  } catch (error) {
    console.error('Error fetching games:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch games' }, { status: 500 })
  }
}

// POST /api/games - Create a new game
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, template_type, content } = body

    if (!title || !template_type) {
      return NextResponse.json(
        { success: false, error: 'title and template_type are required' },
        { status: 400 }
      )
    }

    const { data: game, error } = await supabase
      .from('games')
      .insert({
        user_id: user.id,
        title,
        description,
        template_type,
        content: content ?? {},
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data: game }, { status: 201 })
  } catch (error) {
    console.error('Error creating game:', error)
    return NextResponse.json({ success: false, error: 'Failed to create game' }, { status: 500 })
  }
}
