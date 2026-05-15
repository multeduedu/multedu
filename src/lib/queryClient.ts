/**
 * Configuração do React Query (TanStack Query)
 * 
 * Define estratégia de cache, retry automático,
 * garbage collection e comportamentos padrão para queries e mutations.
 */

import { QueryClient } from '@tanstack/react-query'
import { logger } from './logger'

// ============================================================
// CONSTANTES DE TIMING
// ============================================================

export const QueryTimings = {
  /** Perfil do usuário - cache 5 minutos */
  PROFILE_STALE_TIME: 1000 * 60 * 5,
  
  /** Atividades - cache 1 hora (dados estáticos) */
  ACTIVITIES_STALE_TIME: 1000 * 60 * 60,
  
  /** Garbage collection após 10 minutos */
  DEFAULT_GC_TIME: 1000 * 60 * 10,
} as const

// ============================================================
// CONSTANTES DE RETRY
// ============================================================

export const RetryConfig = {
  /** Retry para queries em case de falha de rede */
  QUERY_RETRY: 2,
  
  /** Retry para mutations em case de falha */
  MUTATION_RETRY: 1,
  
  /** Status HTTP min para client error (4xx) */
  CLIENT_ERROR_MIN: 400,
  
  /** Status HTTP max para client error (4xx) */
  CLIENT_ERROR_MAX: 500,
} as const

// ============================================================
// FACTORY PARA CRIAR QUERY CLIENT
// ============================================================

/**
 * Cria instância de QueryClient com configurações padrão
 */
export const createQueryClient = (): QueryClient => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QueryTimings.PROFILE_STALE_TIME,
        gcTime: QueryTimings.DEFAULT_GC_TIME,
        
        // Estratégia de retry inteligente
        retry: (failureCount: number, error: unknown): boolean => {
          const httpError = error as { status?: number } | null

          // Não retry em erros 4xx (erro do cliente)
          if (
            httpError?.status &&
            httpError.status >= RetryConfig.CLIENT_ERROR_MIN &&
            httpError.status < RetryConfig.CLIENT_ERROR_MAX
          ) {
            return false
          }

          // Retry até QUERY_RETRY vezes para erros 5xx (servidor)
          return failureCount < RetryConfig.QUERY_RETRY
        },

        // Comportamento de refetch
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        
        // Error handling
        throwOnError: (error: unknown): boolean => {
          const httpError = error as { status?: number; message?: string } | null
          logger.error(
            'Query error',
            error instanceof Error ? error : null,
            {
              status: httpError?.status,
              message: httpError?.message,
            }
          )
          return false
        },
      },
      mutations: {
        retry: RetryConfig.MUTATION_RETRY,
      },
    },
  })
}

// Exportar instância singleton
export const queryClient = createQueryClient()
