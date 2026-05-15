/**
 * Hooks de React Query para Mutations (POST/PUT/DELETE)
 * 
 * Centraliza todas as mutações com invalidação de cache automática
 * e error handling estruturado.
 */

'use client'

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query'
import { logger } from '@/lib/logger'
import { AddXPInput, ContactFormInput } from '@/lib/validations'
import { queryKeys } from './queries'

// ============================================================
// TIPOS
// ============================================================

interface ApiErrorResponse {
  error: string
  details?: Record<string, string[]>
}

interface XPResponse {
  success: boolean
  newXP: number
  xpGain: number
}

interface ContactResponse {
  success: boolean
  message: string
}

// ============================================================
// MUTATION HANDLERS
// ============================================================

/**
 * Enviar requisição POST para adicionar XP
 */
async function postAddXP(data: AddXPInput): Promise<XPResponse> {
  logger.debug('Posting XP addition', { xpGain: data.xpGain, activity: data.activity })

  const response = await fetch('/api/users/xp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData: ApiErrorResponse = await response.json()
    const error = new Error(errorData.error || 'Erro ao adicionar XP')
    logger.error('Failed to add XP', error, { status: response.status })
    throw error
  }

  return response.json()
}

/**
 * Enviar formulário de contato
 */
async function postContactForm(data: ContactFormInput): Promise<ContactResponse> {
  logger.debug('Posting contact form', { email: data.email, subject: data.subject })

  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData: ApiErrorResponse = await response.json()
    const error = new Error(errorData.error || 'Erro ao enviar mensagem')
    logger.error('Failed to send contact form', error, { status: response.status })
    throw error
  }

  return response.json()
}

/**
 * Atualizar perfil do usuário
 */
async function putUpdateProfile(
  data: Record<string, unknown>
): Promise<{ success: boolean }> {
  logger.debug('Putting profile update', { keys: Object.keys(data) })

  const response = await fetch('/api/users/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData: ApiErrorResponse = await response.json()
    const error = new Error(errorData.error || 'Erro ao atualizar perfil')
    logger.error('Failed to update profile', error, { status: response.status })
    throw error
  }

  return response.json()
}

// ============================================================
// HOOKS
// ============================================================

/**
 * Hook para adicionar XP à conta do usuário
 * 
 * Invalida automaticamente o cache do perfil após sucesso.
 * 
 * @example
 * ```tsx
 * const addXPMutation = useAddXP()
 * 
 * function handleComplete() {
 *   addXPMutation.mutate({
 *     xpGain: 10,
 *     activity: 'multiplicacao'
 *   })
 * }
 * ```
 */
export function useAddXP(
  options?: Partial<UseMutationOptions<XPResponse, Error, AddXPInput>>
) {
  const queryClient = useQueryClient()

  return useMutation<XPResponse, Error, AddXPInput>({
    mutationFn: postAddXP,
    
    onSuccess: (result) => {
      logger.info('XP added successfully', {
        xpGain: result.xpGain,
        newXP: result.newXP,
      })

      // Invalidar cache do perfil para refetch automático
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.profile,
      })
    },

    onError: (error) => {
      logger.error('Failed to add XP', error)
    },

    ...options,
  })
}

/**
 * Hook para enviar formulário de contato
 * 
 * @example
 * ```tsx
 * const contactMutation = useContactForm()
 * 
 * function handleSubmit(data: ContactFormInput) {
 *   contactMutation.mutate(data)
 * }
 * ```
 */
export function useContactForm(
  options?: Partial<UseMutationOptions<ContactResponse, Error, ContactFormInput>>
) {
  return useMutation<ContactResponse, Error, ContactFormInput>({
    mutationFn: postContactForm,

    onSuccess: () => {
      logger.info('Contact form sent successfully')
    },

    onError: (error) => {
      logger.error('Failed to send contact form', error)
    },

    ...options,
  })
}

/**
 * Hook para atualizar perfil do usuário
 * 
 * Invalida cache do perfil após atualização.
 * 
 * @example
 * ```tsx
 * const updateProfileMutation = useUpdateProfile()
 * 
 * function handleUpdate(name: string) {
 *   updateProfileMutation.mutate({ nome: name })
 * }
 * ```
 */
export function useUpdateProfile(
  options?: Partial<UseMutationOptions<{ success: boolean }, Error, Record<string, unknown>>>
) {
  const queryClient = useQueryClient()

  return useMutation<{ success: boolean }, Error, Record<string, unknown>>({
    mutationFn: putUpdateProfile,

    onSuccess: () => {
      logger.info('Profile updated successfully')

      // Invalidar cache
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.profile,
      })
    },

    onError: (error) => {
      logger.error('Failed to update profile', error)
    },

    ...options,
  })
}
