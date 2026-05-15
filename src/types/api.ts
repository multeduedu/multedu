/**
 * Tipos comuns para API Routes
 * 
 * Define interfaces reutilizáveis para respostas de API
 */

/**
 * Resposta de sucesso padrão
 */
export interface ApiSuccessResponse<T> {
  success: true
  data: T
  message?: string
}

/**
 * Resposta de erro padrão
 */
export interface ApiErrorResponse {
  error: string
  details?: Record<string, string[]>
  status?: number
}

/**
 * Tipo genérico para resposta de API
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

/**
 * Type guard para verificar se é sucesso
 */
export function isApiSuccess<T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> {
  return 'success' in response && response.success === true
}

/**
 * Type guard para verificar se é erro
 */
export function isApiError(response: unknown): response is ApiErrorResponse {
  return typeof response === 'object' && response !== null && 'error' in response
}
