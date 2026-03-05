"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { supabase, getUserWithRetry, clearUserCache } from '@/lib/supabase'
import { User as AppUser } from '@/types/user'

export const useAuth = () => {
  const router = useRouter()
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const isLoadingRef = useRef(false)

  const loadUser = useCallback(async (retryCount = 0, forceRefresh = false) => {
    // Evitar múltiplas chamadas simultâneas
    if (isLoadingRef.current && !forceRefresh) {
      return null
    }
    
    isLoadingRef.current = true
    
    // Cancelar requisição anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    abortControllerRef.current = new AbortController()
    
    try {
      setError(null)
      const { data: { user }, error: authError } = await getUserWithRetry(forceRefresh)

      if (authError) {
        console.error('Erro de autenticação:', authError)
        setError('Erro ao carregar dados do usuário')
        router.replace('/login')
        return null
      }

      if (!user) {
        router.replace('/login')
        return null
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('nome, xp')
        .eq('id', user.id)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Erro ao carregar perfil:', profileError)
        setError('Erro ao carregar perfil do usuário')
      }

      const appUser: AppUser = {
        id: user.id,
        name: profile?.nome || user.email?.split('@')[0] || 'Usuário',
        email: user.email || "",
        xp: profile?.xp || 0,
        user_metadata: user.user_metadata
      }

      setUser(appUser)
      
      if (profile?.nome) {
        const firstName = profile.nome.trim().split(/\s+/)[0]
        document.title = `MultEdu | ${firstName}`
      }

      return appUser

    } catch (error) {
      console.error('Erro ao carregar usuário:', error)
      const errorMessage = (error as Error).message

      // Verificar se é erro de LockManager e fazer retry limitado
      if ((errorMessage.includes('Navigator LockManager lock') || 
           errorMessage.includes('timed out waiting')) && 
          retryCount < 3) {
        console.warn(`Erro de LockManager, tentativa ${retryCount + 1} de 4...`)
        
        // Limpar cache antes de tentar novamente
        clearUserCache()
        
        // Aguardar um tempo progressivamente maior
        const delay = Math.min(1000 * Math.pow(2, retryCount), 8000)
        await new Promise(resolve => setTimeout(resolve, delay))
        
        return loadUser(retryCount + 1, true)
      }

      if (errorMessage.includes('Navigator LockManager lock') || 
          errorMessage.includes('timed out waiting')) {
        setError('Problema de conectividade persistente. Tente recarregar a página.')
        // Não redirecionar imediatamente - dar chance ao usuário tentar novamente
        console.error('Erro de LockManager persistente depois de múltiplas tentativas')
        return null
      }
      
      setError('Erro ao carregar dados do usuário')
      // Para outros erros, criar um usuário temporário
      const tempUser: AppUser = {
        id: 'temp',
        name: 'Usuário',
        email: '',
        xp: 0,
        user_metadata: {}
      }
      setUser(tempUser)
      return tempUser

    } finally {
      setLoading(false)
    }
  }, [router])

  const signOut = useCallback(async () => {
    try {
      setLoading(true)
      
      // Limpar cache antes de fazer logout
      clearUserCache()
      
      const client = await Promise.resolve(supabase)
      const { error } = await client.auth.signOut()
      
      if (error) {
        console.error('Erro ao fazer logout:', error)
        setError('Erro ao sair da conta')
      } else {
        setUser(null)
        router.replace('/login')
      }
    } catch (error) {
      console.error('Erro inesperado no logout:', error)
      setError('Erro inesperado ao sair da conta')
    } finally {
      setLoading(false)
    }
  }, [router])

  const refreshUser = useCallback(() => {
    setLoading(true)
    clearUserCache() // Limpar cache para forçar nova busca
    return loadUser(0, true) // forceRefresh = true
  }, [loadUser])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  // Listener para mudanças de autenticação
  useEffect(() => {
    let subscription: any = null
    
    const setupAuthListener = async () => {
      try {
        const client = await Promise.resolve(supabase)
        
        // Configurar listener de forma mais robusta
        const authListener = client.auth.onAuthStateChange(
          async (event: string, session: any) => {
            console.log('Auth state change:', event)
            
            if (event === 'SIGNED_OUT' && !session) {
              clearUserCache()
              setUser(null)
              router.replace('/login')
            } else if (event === 'SIGNED_IN' && session) {
              clearUserCache()
              loadUser(0, true)
            } else if (event === 'TOKEN_REFRESHED') {
              console.log('Token refreshed, atualizando usuário...')
              clearUserCache()
              loadUser(0, true)
            }
          }
        )
        
        // Verificar se authListener tem a propriedade data e subscription
        if (authListener && authListener.data && authListener.data.subscription) {
          subscription = authListener.data.subscription
        } else {
          console.warn('Formato de subscription inesperado:', authListener)
        }
      } catch (error) {
        console.error('Erro ao configurar listener de auth:', error)
      }
    }
    
    setupAuthListener()
    
    return () => {
      if (subscription) {
        try {
          if (typeof subscription.unsubscribe === 'function') {
            subscription.unsubscribe()
            console.log('Auth listener desconectado com sucesso')
          } else if (typeof subscription === 'function') {
            // Alguns casos onde o subscription é uma função de cleanup
            subscription()
            console.log('Auth listener cleanup executado')
          } else {
            console.warn('Subscription não tem método unsubscribe disponível')
          }
        } catch (error) {
          console.warn('Erro ao desinscrever listener de auth:', error)
        }
      }
      
      // Cancelar operação pendente se existir
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [loadUser, router])

  return {
    user,
    loading,
    error,
    signOut,
    refreshUser
  }
}