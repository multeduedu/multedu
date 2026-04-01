import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/atividades')) {
    const authCookies = req.cookies.getAll().filter(cookie => 
      cookie.name.includes('auth') || cookie.name.includes('session')
    )
    
    if (authCookies.length === 0) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/atividades/:path*']
}