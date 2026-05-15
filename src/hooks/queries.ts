/**
 * Hooks de React Query para Queries (GET)
 * 
 * Centraliza todas as queries com cache inteligente e type-safety.
 * As queries são automaticamente cacheadas e revalidadas conforme regras do queryClient.
 */

'use client'

import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { logger } from '@/lib/logger'
import { QueryTimings } from '@/lib/queryClient'

// ============================================================
// TIPOS
// ============================================================

interface UserProfile {
  id: string
  nome: string
  xp: number
  nivel_atual: string
  created_at?: string
}

interface Activity {
  id: string
  title: string
  image: string
  href: string
  type: 'multiplicacao' | 'soma' | 'subtracao'
}

interface ActivitiesResponse {
  success: boolean
  data: Activity[]
  count: number
}

// ============================================================
// QUERY KEYS (para deduplicação e invalidação)
// ============================================================

export const queryKeys = {
  user: {
    all: ['user'] as const,
    profile: ['user', 'profile'] as const,
    preferences: ['user', 'preferences'] as const,
  },
  activities: {
    all: ['activities'] as const,
    byId: (id: string) => ['activities', id] as const,
  },
} as const

// ============================================================
// API FETCHERS
// ============================================================

/**
 * Buscar perfil do usuário autenticado
 */
async function fetchUserProfile(): Promise<UserProfile> {
  logger.debug('Fetching user profile')
  const response = await fetch('/api/users/profile', {
    cache: 'no-store',
    credentials: 'include',
  })

  if (!response.ok) {
    const error = new Error('Erro ao buscar perfil')
    logger.error('Failed to fetch profile', error)
    throw error
  }

  return response.json()
}

/**
 * Buscar lista de atividades
 */
async function fetchActivities(): Promise<Activity[]> {
  logger.debug('Fetching activities list')
  const response = await fetch('/api/activities', {
    cache: 'force-cache',
  })

  if (!response.ok) {
    const error = new Error('Erro ao buscar atividades')
    logger.error('Failed to fetch activities', error)
    throw error
  }

  const data: ActivitiesResponse = await response.json()
  return data.data
}

/**
 * Buscar atividade específica por ID
 */
async function fetchActivityById(id: string): Promise<Activity> {
  logger.debug('Fetching activity by id', { id })
  const response = await fetch(`/api/activities/${id}`, {
    cache: 'force-cache',
  })

  if (!response.ok) {
    const error = new Error(`Atividade ${id} não encontrada`)
    logger.error('Failed to fetch activity', error, { id })
    throw error
  }

  return response.json()
}

// ============================================================
// HOOKS
// ============================================================

/**
 * Hook para buscar perfil do usuário autenticado
 * 
 * Cache: 5 minutos
 * Retry: 2x em falhas de rede
 * 
 * @example
 * ```tsx
 * const { data: profile, isLoading } = useUserProfile()
 * ```
 */
export function useUserProfile(
  options?: Partial<UseQueryOptions<UserProfile, Error>>
) {
  return useQuery<UserProfile, Error>({
    queryKey: queryKeys.user.profile,
    queryFn: fetchUserProfile,
    staleTime: QueryTimings.PROFILE_STALE_TIME,
    retry: 2,
    ...options,
  })
}

/**
 * Hook para buscar lista de atividades
 * 
 * Cache: 1 hora (dados estáticos)
 * Retry: 1x em falhas
 * 
 * @example
 * ```tsx
 * const { data: activities } = useActivities()
 * ```
 */
export function useActivities(
  options?: Partial<UseQueryOptions<Activity[], Error>>
) {
  return useQuery<Activity[], Error>({
    queryKey: queryKeys.activities.all,
    queryFn: fetchActivities,
    staleTime: QueryTimings.ACTIVITIES_STALE_TIME,
    retry: 1,
    ...options,
  })
}

/**
 * Hook para buscar atividade específica por ID
 * 
 * Cache: 1 hora
 * Query desabilitada se ID não for fornecido (enabled: !!id)
 * 
 * @param id - ID da atividade
 * @example
 * ```tsx
 * const { data: activity } = useActivityById('11')
 * ```
 */
export function useActivityById(
  id: string | null,
  options?: Partial<UseQueryOptions<Activity, Error>>
) {
  return useQuery<Activity, Error>({
    queryKey: id ? queryKeys.activities.byId(id) : ['disabled'],
    queryFn: () => (id ? fetchActivityById(id) : Promise.reject('ID não fornecido')),
    enabled: !!id,
    staleTime: QueryTimings.ACTIVITIES_STALE_TIME,
    ...options,
  })
}
