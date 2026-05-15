/**
 * GET /api/activities
 * 
 * Lista todas as atividades educativas disponíveis.
 * Dados são cacheados por 1 hora (dados estáticos).
 * 
 * @returns {Object} success, data (array de atividades), count
 */

import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { activities } from '@/data/activities'

export const revalidate = 3600 // Cache por 1 hora

interface ActivitiesResponse {
  success: boolean
  data: typeof activities
  count: number
}

/**
 * Listar todas as atividades
 */
export async function GET(): Promise<NextResponse<ActivitiesResponse | { error: string }>> {
  try {
    logger.debug('GET /api/activities')

    logger.info('Lista de atividades retornada', {
      count: activities.length,
    })

    return NextResponse.json({
      success: true,
      data: activities,
      count: activities.length,
    })
    
  } catch (error) {
    logger.error(
      'Erro ao buscar atividades',
      error instanceof Error ? error : null
    )
    return NextResponse.json(
      { error: 'Erro ao buscar atividades' },
      { status: 500 }
    )
  }
}
