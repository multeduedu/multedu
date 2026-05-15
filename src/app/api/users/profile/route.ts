/**
 * GET /api/users/profile
 * 
 * Busca o perfil do usuário autenticado.
 * Requer autenticação via Supabase session.
 * 
 * @returns {Object} Perfil do usuário (id, nome, xp, nivel_atual)
 * @throws {401} Se não autenticado
 * @throws {500} Se erro ao buscar no banco
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

interface UserProfile {
  id: string
  nome: string
  xp: number
  nivel_atual: string
  created_at?: string
}

/**
 * Buscar perfil do usuário
 */
export async function GET(): Promise<NextResponse<UserProfile | { error: string }>> {
  try {
    logger.debug('GET /api/users/profile - iniciando')

    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            } catch {
              // Ignorar erro ao set cookies
            }
          },
        },
      }
    )

    // ✅ Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      logger.warn('Usuário não autenticado ao buscar perfil')
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    logger.setContext({ userId: user.id })

    // ✅ Buscar perfil do banco
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, nome, xp, nivel_atual, created_at')
      .eq('id', user.id)
      .single()

    if (profileError) {
      logger.error('Erro ao buscar perfil no banco', profileError, { userId: user.id })
      return NextResponse.json(
        { error: 'Erro ao buscar perfil' },
        { status: 500 }
      )
    }

    logger.info('Perfil buscado com sucesso', { xp: profile?.xp })
    return NextResponse.json(profile)
    
  } catch (error) {
    logger.error(
      'Erro não tratado em GET /api/users/profile',
      error instanceof Error ? error : null
    )
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
