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
    
    pendingOperations.forEach(({ resolve }) => resolve(supabaseInstance))
    pendingOperations = []
  }
  
  if (!supabaseInstance && isInitializing) {
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
      
      if (attempt === maxRetries) {
        throw lastError
      }

      if (lastError.message.includes('Navigator LockManager lock') ||  
          lastError.message.includes('timed out waiting')) {
        const delay = baseDelay * Math.pow(2, attempt)
        console.warn(`Tentativa ${attempt + 1} falhou, tentando novamente em ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      } else {
        throw lastError
      }
    }
  }

  throw lastError!
}

let cachedUserPromise: Promise<any> | null = null
let cacheTimeout: NodeJS.Timeout | null = null

const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
}

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
      
      if (errorMessage.includes('Navigator LockManager lock') ||  
          errorMessage.includes('timed out waiting')) {
        console.warn('LockManager timeout detectado, aguardando antes de retry...')
        await new Promise(resolve => setTimeout(resolve, 2000))
        throw error
      }
      
      throw error
    }
  }, 3, 2000)

  if (cacheTimeout) clearTimeout(cacheTimeout)
  cacheTimeout = setTimeout(() => {
    cachedUserPromise = null
  }, 5000)

  return cachedUserPromise
}

export const clearUserCache = () => {
  cachedUserPromise = null
  if (cacheTimeout) {
    clearTimeout(cacheTimeout)
    cacheTimeout = null
  }
}