"use client"

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary capturou erro:', error, errorInfo)
    
    // Se for erro de LockManager, tentar recarregar após delay
    if (error.message.includes('Navigator LockManager lock') || 
        error.message.includes('timed out waiting')) {
      setTimeout(() => {
        window.location.reload()
      }, 3000)
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      const isLockManagerError = this.state.error?.message.includes('Navigator LockManager lock') ||
                                this.state.error?.message.includes('timed out waiting')

      return (
        <div className="h-screen w-screen flex items-center justify-center bg-[var(--color-background)]">
          <div className="text-center p-6 max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold mb-4 text-[var(--color-text)]">
              {isLockManagerError ? 'Problema de Conectividade' : 'Erro Inesperado'}
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-6">
              {isLockManagerError 
                ? 'Detectamos um problema de conectividade. A página será recarregada automaticamente em alguns segundos.'
                : 'Algo deu errado. Por favor, tente recarregar a página.'
              }
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
              >
                Recarregar Página
              </button>
              <button 
                onClick={() => {
                  localStorage.clear()
                  sessionStorage.clear()
                  window.location.href = '/login'
                }}
                className="w-full px-4 py-2 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-background-secondary)] transition-colors"
              >
                Limpar Cache e Fazer Login
              </button>
            </div>
            {isLockManagerError && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  🔄 Recarregamento automático em andamento...
                </p>
              </div>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook para usar ErrorBoundary de forma mais simples
export const withErrorBoundary = (Component: React.ComponentType<any>, fallback?: ReactNode) => {
  return function WrappedComponent(props: any) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}