import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE_NAME } from '@/lib/auth-cookie'
import { getSupabaseClientForUser } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = getSupabaseClientForUser(token)
    const { data: authData, error: authError } = await supabase.auth.getUser(token)

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: branches, error } = await supabase
      .from('branches')
      .select('id, name, monthly_revenue, open_inquiries, staff_count, performance_score, created_at, updated_at')
      .order('name', { ascending: true })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch branches' },
        { status: 500 }
      )
    }

    return NextResponse.json(branches, { status: 200 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
