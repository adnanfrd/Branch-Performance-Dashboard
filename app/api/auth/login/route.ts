import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE_NAME, authCookieOptions } from '@/lib/auth-cookie'
import { getSupabaseClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null) as {
      email?: unknown
      password?: unknown
    } | null
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body?.password === 'string' ? body.password : ''

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.user || !data.session) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const response = NextResponse.json({ success: true }, { status: 200 })

    response.cookies.set(AUTH_COOKIE_NAME, data.session.access_token, {
      ...authCookieOptions,
      maxAge: data.session.expires_in,
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
