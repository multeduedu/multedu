/**
 * GUIA DE USO - 4 Melhorias Implementadas
 * 
 * Este arquivo explica como usar as 4 melhorias implementadas:
 * 1. Validação com Zod
 * 2. API Routes Centralizadas
 * 3. React Query com Cache
 * 4. Logging Estruturado
 */

// ============================================================
// 1️⃣ VALIDAÇÃO COM ZOD
// ============================================================

/**
 * USAR: Validar dados antes de processar
 * 
 * Locais: src/lib/validations.ts contém todos os schemas
 */

import { SignUpSchema, ContactFormSchema, AddXPSchema, validateData } from '@/lib/validations'

// Exemplo 1: Validar com safeParse (retorna resultado)
function exemploValidacaoSignUp(data: unknown) {
  const result = SignUpSchema.safeParse(data)
  
  if (!result.success) {
    console.log('Erros de validação:', result.error.flatten())
    return null
  }
  
  // ✅ Data é garantidamente válida agora
  const { email, password, nome } = result.data
  return { email, password, nome }
}

// Exemplo 2: Usar helper validateData
function exemploComHelper(data: unknown) {
  const validation = validateData(ContactFormSchema, data)
  
  if (!validation.success) {
    return { error: validation.errors }
  }
  
  // ✅ Data validada
  console.log(validation.data)
}

// ============================================================
// 2️⃣ API ROUTES CENTRALIZADAS
// ============================================================

/**
 * USAR: Em vez de chamar Supabase diretamente em componentes
 * 
 * APIs disponíveis:
 * - GET  /api/users/profile       → buscar perfil
 * - POST /api/users/xp            → adicionar XP
 * - GET  /api/activities          → listar atividades
 * - POST /api/contact             → enviar contato
 * - GET  /api/health              → health check
 * 
 * ANTES (❌ chamada direta ao Supabase):
 * const { data } = await supabase
 *   .from('profiles')
 *   .select('nome, xp')
 *   .eq('id', user.id)
 * 
 * DEPOIS (✅ via API route):
 * const response = await fetch('/api/users/profile')
 * const data = await response.json()
 */

async function exemploAPIRoute() {
  // Buscar perfil
  const profileResponse = await fetch('/api/users/profile')
  const profile = await profileResponse.json()
  console.log(profile)

  // Adicionar XP
  const xpResponse = await fetch('/api/users/xp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      xpGain: 10,
      activity: 'multiplicacao',
      metadata: { multiplicador: 11, tempo_segundos: 45 }
    })
  })
  const xpResult = await xpResponse.json()
  console.log('XP adicionado:', xpResult.newXP)
}

// ============================================================
// 3️⃣ REACT QUERY COM CACHE
// ============================================================

/**
 * USAR: Em components e hooks para buscar dados com cache automático
 * 
 * Hooks disponíveis em src/hooks/queries.ts:
 * - useUserProfile()    → busca perfil (cache 5 min)
 * - useActivities()     → lista atividades (cache 1 hora)
 * - useActivityById()   → atividade específica
 * 
 * Mutações disponíveis em src/hooks/mutations.ts:
 * - useAddXP()          → adicionar XP (invalida cache após sucesso)
 * - useContactForm()    → enviar contato
 * - useUpdateProfile()  → atualizar perfil
 */

'use client'

import { useUserProfile, useActivities } from '@/hooks/queries'
import { useAddXP } from '@/hooks/mutations'

function ExemploComponenteComReactQuery() {
  // ✅ Buscar dados com cache automático
  const { data: profile, isLoading, error } = useUserProfile()
  const { data: activities } = useActivities()

  // ✅ Mutação para modificar dados
  const addXPMutation = useAddXP()

  if (isLoading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error.message}</div>

  async function handleCompleteActivity() {
    // Enviar XP - cache será invalidado automaticamente
    addXPMutation.mutate({
      xpGain: 10,
      activity: 'multiplicacao'
    })
  }

  return (
    <div>
      <p>Nome: {profile?.nome}</p>
      <p>XP: {profile?.xp}</p>
      <button onClick={handleCompleteActivity} disabled={addXPMutation.isPending}>
        {addXPMutation.isPending ? 'Salvando...' : 'Completar Atividade'}
      </button>
      
      {addXPMutation.error && <p>Erro: {addXPMutation.error.message}</p>}
    </div>
  )
}

// ============================================================
// 4️⃣ LOGGING ESTRUTURADO
// ============================================================

/**
 * USAR: Para registrar eventos, erros e debug da aplicação
 * 
 * Níveis de log:
 * - logger.debug()  → desenvolvimento apenas
 * - logger.info()   → evento importante
 * - logger.warn()   → coisa não ideal mas que funciona
 * - logger.error()  → algo quebrou
 */

import { logger } from '@/lib/logger'

// Exemplo 1: Log simples
function exemploLogSimples() {
  logger.info('Usuário fez login', { userId: '123', email: 'user@example.com' })
  // Output: {"level":"info","message":"Usuário fez login","timestamp":"2026-05-15T14:30:45Z","context":{"userId":"123"},"data":{"userId":"123","email":"user@example.com"}}
}

// Exemplo 2: Log de erro
function exemploLogErro(error: Error) {
  logger.error('Erro ao buscar perfil', error, { userId: '123' })
  // Inclui automaticamente stack trace do erro
}

// Exemplo 3: Log com contexto
function exemploLogContexto() {
  logger.setContext({ userId: '123', pathname: '/dashboard' })
  logger.info('Atividade concluída') 
  // Todos os logs subsequentes incluem userId e pathname
}

// Exemplo 4: Log de debug (apenas em desenvolvimento)
function exemploLogDebug() {
  logger.debug('Renderizando componente', { props: { multiplicador: 2 } })
  // Só aparece no console em desenvolvimento
}

// ============================================================
// ✅ EXEMPLO COMPLETO - COMPONENTE COM TODAS AS 4 MELHORIAS
// ============================================================

'use client'

import { useState } from 'react'
import { useUserProfile } from '@/hooks/queries'
import { useAddXP } from '@/hooks/mutations'
import { AddXPSchema } from '@/lib/validations'
import { logger } from '@/lib/logger'

export function ExemploCompleto() {
  const [numero, setNumero] = useState(2)
  const [resposta, setResposta] = useState('')
  
  const { data: profile } = useUserProfile()
  const addXPMutation = useAddXP()

  async function handleResposta() {
    logger.debug('Verificando resposta', { numero, resposta })
    
    // ✅ 1️⃣ VALIDAR COM ZOD
    const validation = AddXPSchema.safeParse({
      xpGain: 10,
      activity: 'multiplicacao'
    })
    
    if (!validation.success) {
      logger.warn('Validação falhou', { errors: validation.error.flatten() })
      return
    }

    // ✅ 4️⃣ LOG do evento
    logger.info('Resposta verificada', { numero, resposta, xpGain: 10 })

    // ✅ 3️⃣ USAR REACT QUERY MUTATION
    // (internamente usa 2️⃣ API routes)
    addXPMutation.mutate(validation.data, {
      onSuccess: () => {
        logger.info('XP adicionado com sucesso')
        // Cache é invalidado automaticamente
      },
      onError: (error) => {
        logger.error('Erro ao adicionar XP', error)
      }
    })
  }

  return (
    <div>
      <p>Perfil XP: {profile?.xp}</p>
      <p>Você respondeu: {resposta}</p>
      <button onClick={handleResposta} disabled={addXPMutation.isPending}>
        Verificar
      </button>
    </div>
  )
}

// ============================================================
// 🚀 PRÓXIMOS PASSOS
// ============================================================

/**
 * 1. Adicionar mais endpoints conforme necessário em src/app/api/
 * 2. Criar mais schemas de validação em src/lib/validations.ts
 * 3. Integrar Sentry ou LogRocket para produção
 * 4. Criar testes para as API routes
 * 5. Configurar health checks em produção
 */
