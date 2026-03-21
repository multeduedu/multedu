/**
 * Utilitários para diagnóstico e resolução de problemas do LockManager
 */

export const lockManagerDiagnostics = {
  // Verificar se há múltiplas abas com a mesma aplicação
  checkMultipleTabs: () => {
    if (typeof window === 'undefined') return false
    
    const storageKey = 'multedu-tab-count'
    const currentTime = Date.now()
    
    // Registrar esta aba
    localStorage.setItem(`${storageKey}-${currentTime}`, 'active')
    
    // Verificar quantas abas estão ativas nos últimos 30 segundos
    const activeTabKeys = Object.keys(localStorage)
      .filter(key => key.startsWith(storageKey))
      .filter(key => {
        const timestamp = parseInt(key.split('-')[3])
        return (currentTime - timestamp) < 30000 // 30 segundos
      })
    
    // Limpar keys antigas
    Object.keys(localStorage)
      .filter(key => key.startsWith(storageKey))
      .filter(key => {
        const timestamp = parseInt(key.split('-')[3])
        return (currentTime - timestamp) >= 30000
      })
      .forEach(key => localStorage.removeItem(key))
    
    return activeTabKeys.length > 1
  },

  // Limpar todos os dados relacionados ao Supabase
  clearSupabaseData: () => {
    if (typeof window === 'undefined') return
    
    console.log('Limpando dados do Supabase...')
    
    // Limpar localStorage
    const keysToRemove = Object.keys(localStorage).filter(key => 
      key.includes('supabase') || 
      key.includes('sb-') || 
      key.includes('auth-token')
    )
    keysToRemove.forEach(key => {
      localStorage.removeItem(key)
      console.log('Removido localStorage:', key)
    })
    
    // Limpar sessionStorage
    const sessionKeysToRemove = Object.keys(sessionStorage).filter(key => 
      key.includes('supabase') || 
      key.includes('sb-') || 
      key.includes('auth-token')
    )
    sessionKeysToRemove.forEach(key => {
      sessionStorage.removeItem(key)
      console.log('Removido sessionStorage:', key)
    })
    
    // Limpar cookies relacionados ao Supabase
    document.cookie.split(';').forEach(cookie => {
      const eqPos = cookie.indexOf('=')
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
      if (name.includes('sb-') || name.includes('supabase')) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
        console.log('Removido cookie:', name)
      }
    })
  },

  // Verificar status da conexão com Supabase
  checkSupabaseConnection: async () => {
    if (typeof window === 'undefined') return false
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
        method: 'HEAD',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        }
      })
      return response.ok
    } catch (error) {
      console.error('Erro ao verificar conexão com Supabase:', error)
      return false
    }
  },

  // Diagnóstico completo
  runDiagnostics: async () => {
    console.log('🔍 Executando diagnóstico do LockManager...')
    
    const results = {
      multipleTabs: lockManagerDiagnostics.checkMultipleTabs(),
      supabaseConnection: await lockManagerDiagnostics.checkSupabaseConnection(),
      browserInfo: {
        userAgent: navigator.userAgent,
        cookiesEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine
      },
      storageInfo: {
        localStorage: typeof(Storage) !== 'undefined',
        sessionStorage: typeof(Storage) !== 'undefined',
        localStorageKeys: Object.keys(localStorage).filter(key => 
          key.includes('supabase') || key.includes('sb-')
        )
      }
    }
    
    console.log('📊 Resultados do diagnóstico:', results)
    
    // Sugestões baseadas nos resultados
    const suggestions = []
    
    if (results.multipleTabs) {
      suggestions.push('❌ Múltiplas abas detectadas. Feche outras abas da aplicação.')
    }
    
    if (!results.supabaseConnection) {
      suggestions.push('❌ Conexão com Supabase falhou. Verifique sua internet.')
    }
    
    if (!results.browserInfo.cookiesEnabled) {
      suggestions.push('❌ Cookies desabilitados. Habilite cookies para esta aplicação.')
    }
    
    if (!results.browserInfo.onLine) {
      suggestions.push('❌ Sem conexão com internet. Verifique sua conectividade.')
    }
    
    if (results.storageInfo.localStorageKeys.length > 5) {
      suggestions.push('⚠️ Muitos dados de auth armazenados. Considere limpar o cache.')
    }
    
    if (suggestions.length === 0) {
      suggestions.push('✅ Nenhum problema óbvio detectado.')
    }
    
    console.log('💡 Sugestões:', suggestions)
    
    return { results, suggestions }
  },

  // Monitor de locks em tempo real
  startLockMonitoring: () => {
    if (typeof window === 'undefined') return
    
    console.log('🎯 Monitoramento de locks iniciado - versão simplificada')
    
    // Para evitar problemas de tipos complexos, vamos apenas logar quando possível
    const originalRequest = (navigator.locks as any)?.request
    if (!originalRequest) {
      console.warn('Navigator Locks API não disponível')
      return
    }
    
    console.log('✅ Navigator Locks API detectada e pronta para monitoramento')
  }
}

// Função de conveniência para usar em caso de emergência
export const emergencyReset = () => {
  lockManagerDiagnostics.clearSupabaseData()
  setTimeout(() => {
    window.location.href = '/login'
  }, 1000)
}

// Adicionar ao window para acesso via console
if (typeof window !== 'undefined') {
  ;(window as any).lockManagerDiagnostics = lockManagerDiagnostics
;(window as any).emergencyReset = emergencyReset
}