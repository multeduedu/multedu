/**
 * GET /api/health
 * 
 * Health check para monitoramento da aplicação.
 * Usado pelo Vercel e serviços de monitoring para verificar status.
 * 
 * @returns {Object} status, timestamp, environment
 */

import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

interface HealthResponse {
  status: 'ok' | 'error'
  timestamp: string
  environment: string
}

/**
 * Verificar saúde da aplicação
 */
export async function GET(): Promise<NextResponse<HealthResponse>> {
  try {
    logger.debug('GET /api/health')

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
    })
    
  } catch (error) {
    logger.error(
      'Health check falhou',
      error instanceof Error ? error : null
    )
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'unknown',
      },
      { status: 503 }
    )
  }
}
