/**
 * POST /api/users/xp
 * 
 * Adiciona XP (experiência) à conta do usuário quando completa uma atividade.
 * Valida dados usando Zod e registra em audit log.
 * 
 * @body {AddXPInput} Contém xpGain, activity, e metadata opcional
 * @returns {Object} success, newXP, xpGain
 * @throws {400} Se dados inválidos
 * @throws {401} Se não autenticado
 * @throws {500} Se erro ao atualizar
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { AddXPSchema } from '@/lib/validations'

interface XPResponse {
  success: boolean
  newXP: number
  xpGain: number
}

/**
 * Adicionar XP ao usuário
 */
export async function POST(request: NextRequest): Promise<NextResponse<XPResponse | { error: string; details?: Record<string, string[]> }>> {
  try {
    const body = await request.json()
    logger.debug('POST /api/users/xp - dados recebidos')

    // ✅ VALIDAR USANDO ZOD
    const validation = AddXPSchema.safeParse(body)
    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors as Record<string, string[]>
      logger.warn('Dados de XP inválidos', { errors })
      return NextResponse.json(
        { error: 'Dados inválidos', details: errors },
        { status: 400 }
      )
    }

    const { xpGain, activity, metadata } = validation.data
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
              // Ignorar erro
            }
          },
        },
      }
    )

    // ✅ VERIFICAR AUTENTICAÇÃO
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      logger.warn('Usuário não autenticado ao tentar adicionar XP')
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    logger.setContext({ userId: user.id })

    // ✅ BUSCAR XP ATUAL
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('xp, id')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      logger.error('Erro ao buscar perfil para atualizar XP', profileError, { userId: user.id })
      return NextResponse.json(
        { error: 'Perfil não encontrado' },
        { status: 404 }
      )
    }

    const oldXP = profile.xp || 0
    const newXP = oldXP + xpGain

    // ✅ ATUALIZAR XP
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ xp: newXP })
      .eq('id', user.id)

    if (updateError) {
      logger.error('Erro ao atualizar XP', updateError, { userId: user.id })
      return NextResponse.json(
        { error: 'Erro ao atualizar XP' },
        { status: 500 }
      )
    }

    logger.info('XP adicionado com sucesso', {
      xpGain,
      activity,
      oldXP,
      newXP,
      metadata,
    })

    // ✅ REGISTRAR ATIVIDADE (LOG DE AUDITORIA) - não-bloqueante
    try {
      await supabase.from('activity_log').insert([
        {
          user_id: user.id,
          activity_type: activity,
          xp_gained: xpGain,
          metadata: metadata || {},
          created_at: new Date().toISOString(),
        },
      ])
      logger.debug('Atividade registrada em audit log')
    } catch (auditError) {
      logger.warn('Erro ao registrar em activity_log', { activity, userId: user.id })
    }

    return NextResponse.json({
      success: true,
      newXP,
      xpGain,
    })
    
  } catch (error) {
    logger.error(
      'Erro não tratado em POST /api/users/xp',
      error instanceof Error ? error : null
    )
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
