import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Erro: As chaves do Supabase não foram encontradas no .env.local')
}

let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null
let isInitializing = false
let pendingOperations: Array<{ resolve: any; reject: any }> = []

export const supabase = (() => {
  if (typeof window === 'undefined') {
    // No lado servidor, sempre cria uma nova instância
    return createBrowserClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false
      }
    })
  }

  if (!supabaseInstance && !isInitializing) {
    isInitializing = true
    supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        flowType: 'pkce',
        storageKey: `sb-${supabaseUrl.split('//')[1].split('.')[0]}-auth-token`
      }
    })
    isInitializing = false
    
    // Resolver operações pendentes
    pendingOperations.forEach(({ resolve }) => resolve(supabaseInstance))
    pendingOperations = []
  }
  
  if (!supabaseInstance && isInitializing) {
    // Se ainda está inicializando, retorna uma promise que resolve quando pronto
    return new Promise((resolve, reject) => {
      pendingOperations.push({ resolve, reject })
    }) as any
  }
  
  return supabaseInstance
})()

// Função utilitária para retry com backoff exponencial
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> => {
  let lastError: Error

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      
      // Se for o último attempt, lança o erro
      if (attempt === maxRetries) {
        throw lastError
      }

      // Se for erro de LockManager timeout, tenta novamente
      if (lastError.message.includes('Navigator LockManager lock') || 
          lastError.message.includes('timed out waiting')) {
        const delay = baseDelay * Math.pow(2, attempt)
        console.warn(`Tentativa ${attempt + 1} falhou, tentando novamente em ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      } else {
        // Para outros erros, não faz retry
        throw lastError
      }
    }
  }

  throw lastError!
}

// Cache para evitar múltiplas chamadas simultâneas
let cachedUserPromise: Promise<any> | null = null
let cacheTimeout: NodeJS.Timeout | null = null

// Função debounce para evitar múltiplas chamadas
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
}

// Função wrapper para getUser com retry e cache
export const getUserWithRetry = (forceRefresh = false) => {
  if (!forceRefresh && cachedUserPromise) {
    return cachedUserPromise
  }

  cachedUserPromise = retryWithBackoff(async () => {
    try {
      const client = await Promise.resolve(supabase)
      return await client.auth.getUser()
    } catch (error) {
      const errorMessage = (error as Error).message
      
      // Se for erro de LockManager, aguarda um pouco antes de tentar novamente
      if (errorMessage.includes('Navigator LockManager lock') || 
          errorMessage.includes('timed out waiting')) {
        console.warn('LockManager timeout detectado, aguardando antes de retry...')
        await new Promise(resolve => setTimeout(resolve, 2000))
        throw error // Vai fazer o retry através do retryWithBackoff
      }
      
      throw error
    }
  }, 3, 2000) // 3 tentativas com delay de 2 segundos

  // Limpar cache após 5 segundos para evitar dados desatualizados
  if (cacheTimeout) clearTimeout(cacheTimeout)
  cacheTimeout = setTimeout(() => {
    cachedUserPromise = null
  }, 5000)

  return cachedUserPromise
}

// Função para limpar cache manualmente
export const clearUserCache = () => {
  cachedUserPromise = null
  if (cacheTimeout) {
    clearTimeout(cacheTimeout)
    cacheTimeout = null
  }
}