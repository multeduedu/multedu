"use client"

import { useEffect } from 'react'
import { lockManagerDiagnostics } from '@/utils/lockManagerDiagnostics'

export function LockManagerMonitor() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' || 
        localStorage.getItem('multedu-debug-locks') === 'true') {
      
      console.log('🔧 Inicializando monitoramento de LockManager...')
      lockManagerDiagnostics.startLockMonitoring()
      
      setTimeout(() => {
        lockManagerDiagnostics.runDiagnostics()
      }, 2000)
      
      // Verificar múltiplas abas periodicamente
      const interval = setInterval(() => {
        const hasMultipleTabs = lockManagerDiagnostics.checkMultipleTabs()
        if (hasMultipleTabs) {
          console.warn('⚠️ Múltiplas abas detectadas - isto pode causar problemas de LockManager')
        }
      }, 30000)
      
      return () => clearInterval(interval)
    }
  }, [])
  
  // Adicionar listeners para eventos de erro de LockManager
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.error?.message?.includes('Navigator LockManager lock') ||
          event.error?.message?.includes('timed out waiting')) {
        console.error('🚨 Erro de LockManager detectado:', event.error)
        
        setTimeout(() => {
          lockManagerDiagnostics.runDiagnostics()
        }, 1000)
      }
    }
    
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes('Navigator LockManager lock') ||
          event.reason?.message?.includes('timed out waiting')) {
        console.error('🚨 Promise rejection de LockManager:', event.reason)
        
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

  return null
}