"use client"

import { useEffect } from 'react'
import { lockManagerDiagnostics } from '@/utils/lockManagerDiagnostics'

export function LockManagerMonitor() {
  useEffect(() => {
    // Só executar em desenvolvimento ou quando necessário
    if (process.env.NODE_ENV === 'development' || 
        localStorage.getItem('multedu-debug-locks') === 'true') {
      
      console.log('🔧 Inicializando monitoramento de LockManager...')
      lockManagerDiagnostics.startLockMonitoring()
      
      // Executar diagnóstico inicial após 2 segundos
      setTimeout(() => {
        lockManagerDiagnostics.runDiagnostics()
      }, 2000)
      
      // Verificar múltiplas abas periodicamente
      const interval = setInterval(() => {
        const hasMultipleTabs = lockManagerDiagnostics.checkMultipleTabs()
        if (hasMultipleTabs) {
          console.warn('⚠️ Múltiplas abas detectadas - isto pode causar problemas de LockManager')
        }
      }, 30000) // Verificar a cada 30 segundos
      
      return () => clearInterval(interval)
    }
  }, [])
  
  // Adicionar listeners para eventos de erro de LockManager
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.error?.message?.includes('Navigator LockManager lock') ||
          event.error?.message?.includes('timed out waiting')) {
        console.error('🚨 Erro de LockManager detectado:', event.error)
        
        // Executar diagnóstico automático
        setTimeout(() => {
          lockManagerDiagnostics.runDiagnostics()
        }, 1000)
      }
    }
    
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes('Navigator LockManager lock') ||
          event.reason?.message?.includes('timed out waiting')) {
        console.error('🚨 Promise rejection de LockManager:', event.reason)
        
        // Executar diagnóstico automático
        setTimeout(() => {
          lockManagerDiagnostics.runDiagnostics()
        }, 1000)
      }
    }
    
    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    
    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return null // Este componente não renderiza nada
}

// Comandos para usar no console do browser em caso de problemas:
// lockManagerDiagnostics.runDiagnostics() - executa diagnóstico completo
// lockManagerDiagnostics.clearSupabaseData() - limpa todos os dados do Supabase
// emergencyReset() - reset completo + redirecionamento para login
// localStorage.setItem('multedu-debug-locks', 'true') - habilita debug em produção