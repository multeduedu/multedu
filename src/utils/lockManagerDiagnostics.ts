/**
 * Utilitários para diagnóstico e resolução de problemas do LockManager
 */

export const lockManagerDiagnostics = {
  checkMultipleTabs: () => {
    if (typeof window === 'undefined') return false
    
    const storageKey = 'multedu-tab-count'
    const currentTime = Date.now()
    
    localStorage.setItem(`${storageKey}-${currentTime}`, 'active')
    

    const activeTabKeys = Object.keys(localStorage)
      .filter(key => key.startsWith(storageKey))
      .filter(key => {
        const timestamp = parseInt(key.split('-')[3])
        return (currentTime - timestamp) < 30000
      })
    
    Object.keys(localStorage)
      .filter(key => key.startsWith(storageKey))
      .filter(key => {
        const timestamp = parseInt(key.split('-')[3])
        return (currentTime - timestamp) >= 30000
      })
      .forEach(key => localStorage.removeItem(key))
    
    return activeTabKeys.length > 1
  },

  clearSupabaseData: () => {
    if (typeof window === 'undefined') return
    
    console.log('Limpando dados do Supabase...')
    
    const keysToRemove = Object.keys(localStorage).filter(key => 
      key.includes('supabase') || 
      key.includes('sb-') || 
      key.includes('auth-token')
    )
    keysToRemove.forEach(key => {
      localStorage.removeItem(key)
      console.log('Removido localStorage:', key)
    })
    
    const sessionKeysToRemove = Object.keys(sessionStorage).filter(key => 
      key.includes('supabase') || 
      key.includes('sb-') || 
      key.includes('auth-token')
    )
    sessionKeysToRemove.forEach(key => {
      sessionStorage.removeItem(key)
      console.log('Removido sessionStorage:', key)
    })
    
    document.cookie.split(';').forEach(cookie => {
      const eqPos = cookie.indexOf('=')
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
      if (name.includes('sb-') || name.includes('supabase')) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
        console.log('Removido cookie:', name)
      }
    })
  },


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

  startLockMonitoring: () => {
    if (typeof window === 'undefined') return
    
    console.log('🎯 Monitoramento de locks iniciado - versão simplificada')
    

    const originalRequest = (navigator.locks as any)?.request
    if (!originalRequest) {
      console.warn('Navigator Locks API não disponível')
      return
    }
    
    console.log('✅ Navigator Locks API detectada e pronta para monitoramento')
  }
}


export const emergencyReset = () => {
  lockManagerDiagnostics.clearSupabaseData()
  setTimeout(() => {
    window.location.href = '/login'
  }, 1000)
}

if (typeof window !== 'undefined') {
  ;(window as any).lockManagerDiagnostics = lockManagerDiagnostics
;(window as any).emergencyReset = emergencyReset
}