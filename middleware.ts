import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Cache para evitar múltiplas verificações simultâneas
const authCache = new Map<string, { result: boolean; timestamp: number }>()
const CACHE_DURATION = 30000 // 30 segundos

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const cacheKey = `${pathname}-${req.cookies.get('sb-hqwrwiekyckihjokbrmz-auth-token')?.value || 'none'}`
  
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  // Verificar cache primeiro para rotas protegidas
  const now = Date.now()
  const cached = authCache.get(cacheKey)
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    if (!cached.result && (pathname.startsWith('/dashboard') || pathname.startsWith('/atividades'))) {
      const loginUrl = new URL('/login', req.url)
      return NextResponse.redirect(loginUrl)
    }
    if (cached.result && pathname === '/login') {
      const dashboardUrl = new URL('/dashboard', req.url)
      return NextResponse.redirect(dashboardUrl)
    }
    return response
  }

  // Criar cliente Supabase para middleware com timeout aumentado
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet: any) {
          cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options?: any }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Verificar autenticação para rotas protegidas
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/atividades')) {
    try {
      const { data: { user }, error } = await Promise.race([
        supabase.auth.getUser(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout na verificação de auth')), 10000)
        )
      ]) as any
      
      const isAuthenticated = !error && !!user
      
      // Atualizar cache
      authCache.set(cacheKey, { result: isAuthenticated, timestamp: now })
      
      if (!isAuthenticated) {
        console.warn('Usuário não autenticado, redirecionando para login')
        const loginUrl = new URL('/login', req.url)
        return NextResponse.redirect(loginUrl)
      }
    } catch (error) {
      console.error('Erro no middleware de autenticação:', error)
      
      // Se for erro de LockManager, não redirecionar imediatamente
      const errorMessage = (error as Error).message
      if (errorMessage.includes('Navigator LockManager lock') || 
          errorMessage.includes('timed out waiting') ||
          errorMessage.includes('Timeout na verificação')) {
        console.warn('Timeout/LockManager error no middleware, permitindo acesso')
        // Permitir acesso mas não fazer cache do resultado
        return response
      }
      
      const loginUrl = new URL('/login', req.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Redirecionar usuários autenticados da página de login
  if (pathname === '/login') {
    try {
      const { data: { user } } = await Promise.race([
        supabase.auth.getUser(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout na verificação de login')), 8000)
        )
      ]) as any
      
      const isAuthenticated = !!user
      
      // Atualizar cache
      authCache.set(cacheKey, { result: isAuthenticated, timestamp: now })
      
      if (isAuthenticated) {
        const dashboardUrl = new URL('/dashboard', req.url)
        return NextResponse.redirect(dashboardUrl)
      }
    } catch (error) {
      // Se houver erro na verificação, permite acesso ao login
      console.warn('Erro ao verificar usuário logado no middleware:', error)
    }
  }
  
  // Limpar cache periodicamente (a cada 5 minutos)
  if (Math.random() < 0.01) { // 1% de chance a cada request
    const expiredKeys = Array.from(authCache.entries())
      .filter(([_, value]) => (now - value.timestamp) > CACHE_DURATION * 10)
      .map(([key]) => key)
    
    expiredKeys.forEach(key => authCache.delete(key))
  }
  
  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/atividades/:path*',
    '/login'
  ]
}