/**
 * Schemas de Validação com Zod
 * 
 * Centraliza todas as validações da aplicação com schemas reutilizáveis.
 * Uso: import { SignUpSchema } from '@/lib/validations'
 */

import { z } from 'zod'

// ============================================================
// UTILITÁRIOS DE VALIDAÇÃO
// ============================================================

/**
 * Validar dados contra schema com resultado estruturado
 */
export function validateData<T>(
  schema: z.Schema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string[]> } {
  const result = schema.safeParse(data)

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors as Record<string, string[]>
    return { success: false, errors }
  }

  return { success: true, data: result.data }
}

/**
 * Verificar se validação foi bem sucedida
 */
export function isValidationSuccess<T>(
  result: ReturnType<typeof validateData<T>>
): result is { success: true; data: T } {
  return result.success === true
}

// ============================================================
// MENSAGENS DE ERRO CUSTOMIZADAS
// ============================================================

const ErrorMessages = {
  email: 'Email inválido',
  emailTooShort: 'Email muito curto',
  passwordShort: 'Senha deve ter pelo menos 8 caracteres',
  passwordUppercase: 'Deve conter letra maiúscula',
  passwordNumber: 'Deve conter número',
  nameTooShort: 'Nome deve ter pelo menos 2 caracteres',
  nameTooLong: 'Nome muito longo',
  nameInvalid: 'Nome contém caracteres inválidos',
  xpMin: 'XP mínimo é 1',
  xpMax: 'XP máximo é 100',
  messageShort: 'Mensagem muito curta',
  messageLong: 'Mensagem muito longa',
  fontSizeMin: 'Tamanho mínimo é 75%',
  fontSizeMax: 'Tamanho máximo é 150%',
} as const

// ============================================================
// VALIDAÇÕES REUTILIZÁVEIS
// ============================================================

const emailField = z.string()
  .email(ErrorMessages.email)
  .min(5, ErrorMessages.emailTooShort)
  .toLowerCase()

const passwordField = z.string()
  .min(8, ErrorMessages.passwordShort)
  .regex(/[A-Z]/, ErrorMessages.passwordUppercase)
  .regex(/[0-9]/, ErrorMessages.passwordNumber)

const nameField = z.string()
  .min(2, ErrorMessages.nameTooShort)
  .max(100, ErrorMessages.nameTooLong)
  .trim()

const xpField = z.number()
  .int('XP deve ser um número inteiro')
  .min(1, ErrorMessages.xpMin)
  .max(100, ErrorMessages.xpMax)

// ============================================================
// AUTENTICAÇÃO
// ============================================================

export const SignUpSchema = z.object({
  email: emailField,
  password: passwordField,
  nome: nameField,
})

export type SignUpInput = z.infer<typeof SignUpSchema>

export const SignInSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'Senha é obrigatória'),
})

export type SignInInput = z.infer<typeof SignInSchema>

// ============================================================
// PERFIL
// ============================================================

export const UpdateProfileSchema = z.object({
  nome: nameField.optional(),
  nivel_atual: z.string().optional(),
})

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>

// ============================================================
// ATIVIDADES & GAMIFICAÇÃO
// ============================================================

export const ActivityTypeEnum = z.enum(['multiplicacao', 'soma', 'subtracao'])
export type ActivityType = z.infer<typeof ActivityTypeEnum>

export const ActivityMetadataSchema = z.object({
  multiplicador: z.number().optional(),
  tempo_segundos: z.number().optional(),
  tentativas: z.number().optional(),
})

export type ActivityMetadata = z.infer<typeof ActivityMetadataSchema>

export const AddXPSchema = z.object({
  xpGain: xpField,
  activity: ActivityTypeEnum,
  metadata: ActivityMetadataSchema.optional(),
})

export type AddXPInput = z.infer<typeof AddXPSchema>

// ============================================================
// CONTATO
// ============================================================

export const ContactSubjectEnum = z.enum(['dúvida', 'sugestão', 'bug', 'outro'])
export type ContactSubject = z.infer<typeof ContactSubjectEnum>

export const ContactFormSchema = z.object({
  name: nameField,
  email: emailField,
  subject: ContactSubjectEnum.default('outro'),
  message: z.string()
    .min(10, ErrorMessages.messageShort)
    .max(2000, ErrorMessages.messageLong)
    .trim(),
})

export type ContactFormInput = z.infer<typeof ContactFormSchema>

// ============================================================
// PREFERÊNCIAS
// ============================================================

export const AccessibilityPreferencesSchema = z.object({
  fontSize: z.number()
    .min(75, ErrorMessages.fontSizeMin)
    .max(150, ErrorMessages.fontSizeMax)
    .default(100),
  
  highContrast: z.boolean().default(false),
  dyslexiaMode: z.boolean().default(false),
  librasMode: z.boolean().default(false),
})

export type AccessibilityPreferences = z.infer<typeof AccessibilityPreferencesSchema>
