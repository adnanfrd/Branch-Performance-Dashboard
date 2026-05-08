import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE_NAME } from '@/lib/auth-cookie'

export function proxy(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
  const pathname = request.nextUrl.pathname

  const publicRoutes = ['/login', '/api/auth/login', '/icon.png']
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  if (isPublicRoute) {
    if (pathname.startsWith('/login') && token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.png).*)'],
}
