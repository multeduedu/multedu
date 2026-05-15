/**
 * Sistema de Logging Estruturado
 * 
 * Fornece logging estruturado com níveis de severidade,
 * contexto automático e integração com serviços de monitoramento.
 * 
 * Uso:
 * ```ts
 * logger.info('Evento importante', { userId: '123' })
 * logger.error('Algo quebrou', error, { context: 'data' })
 * ```
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  userId?: string
  pathname?: string
  method?: string
  environment?: string
}

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  environment: string
  context?: Partial<LogContext>
  data?: Record<string, unknown>
  errorMessage?: string
  errorStack?: string
}

interface LogOptions {
  context?: Partial<LogContext>
}

/**
 * Logger - Gerencia logs estruturados com contexto
 */
class Logger {
  private context: Partial<LogContext> = {
    environment: process.env.NODE_ENV,
  }

  /**
   * Define contexto global que será incluído em todos os logs posteriores
   */
  setContext(newContext: Partial<LogContext>): void {
    this.context = { ...this.context, ...newContext }
  }

  /**
   * Limpa contexto global
   */
  clearContext(): void {
    this.context = { environment: process.env.NODE_ENV }
  }

  /**
   * Retorna contexto atual
   */
  getContext(): Partial<LogContext> {
    return { ...this.context }
  }

  /**
   * Formata entrada de log
   */
  private formatLog(
    level: LogLevel,
    message: string,
    data?: Record<string, unknown>,
    error?: Error | null
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      context: this.context,
      data,
      ...(error && {
        errorMessage: error.message,
        errorStack: error.stack,
      }),
    }
  }

  /**
   * Imprime log no console com formatação
   */
  private printLog(log: LogEntry): void {
    const colors = {
      debug: 'color: blue',
      info: 'color: green',
      warn: 'color: orange',
      error: 'color: red',
    }

    const prefix = `[${log.level.toUpperCase()}]`
    const color = colors[log.level]

    if (typeof window === 'undefined') {
      // Node.js/SSR
      console.log(JSON.stringify(log))
    } else {
      // Browser
      console.log(`%c${prefix}`, color, JSON.stringify(log, null, 2))
    }
  }

  /**
   * Log de debug - apenas em desenvolvimento
   */
  debug(message: string, data?: Record<string, unknown>): void {
    if (process.env.NODE_ENV === 'development') {
      const log = this.formatLog('debug', message, data)
      this.printLog(log)
    }
  }

  /**
   * Log de informação
   */
  info(message: string, data?: Record<string, unknown>): void {
    const log = this.formatLog('info', message, data)
    this.printLog(log)
    this.sendToMonitoring(log)
  }

  /**
   * Log de warning
   */
  warn(message: string, data?: Record<string, unknown>): void {
    const log = this.formatLog('warn', message, data)
    this.printLog(log)
    this.sendToMonitoring(log)
  }

  /**
   * Log de erro
   */
  error(message: string, error?: Error | null, data?: Record<string, unknown>): void {
    const log = this.formatLog(
      'error',
      message,
      data,
      error instanceof Error ? error : null
    )
    this.printLog(log)
    this.sendToMonitoring(log)

    // Em produção, enviar para serviço de monitoramento
    if (process.env.NODE_ENV === 'production') {
      this.reportToSentry(log)
    }
  }

  /**
   * Envia logs para serviço de monitoramento
   */
  private sendToMonitoring(log: LogEntry): void {
    // TODO: Integrar com serviço de monitoramento em produção
    // Ex: Sentry, LogRocket, CloudWatch, etc
    if (process.env.NEXT_PUBLIC_LOG_ENDPOINT) {
      fetch(process.env.NEXT_PUBLIC_LOG_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log),
      }).catch(() => {
        // Silenciosamente falha se não conseguir enviar
      })
    }
  }

  /**
   * Reporta erro crítico para Sentry (quando configurado)
   */
  private reportToSentry(log: LogEntry): void {
    // TODO: Integrar Sentry
    // if (window && (window as any).__SENTRY__) {
    //   Sentry.captureException(new Error(log.message), { contexts: { log } })
    // }
  }
}

// Exportar instância singleton
export const logger = new Logger()

// Tipos úteis
export type { LogLevel, LogContext, LogEntry, LogOptions }
