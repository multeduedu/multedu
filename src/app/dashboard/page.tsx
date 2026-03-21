"use client"

import { useState } from "react"
import Sidebar from "../../components/sections/dashboard/SideBar"
import ActivityCard from "../../components/sections/dashboard/ActivityCard"
import { activities } from "@/data/activities"
import { FiMenu } from "react-icons/fi"
import { useAuth } from "@/hooks/useAuth"

export default function DashboardPage() {
  const [filter, setFilter] = useState("all")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, loading, error } = useAuth()

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    )
  }

  if (error) {
    const isLockManagerError = error.includes('Navigator LockManager lock') || 
                              error.includes('timed out waiting') ||
                              error.includes('conectividade')
    
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="text-center p-6 max-w-md">
          <div className="text-6xl mb-4">{isLockManagerError ? '🔄' : '⚠️'}</div>
          <h2 className="text-xl font-bold mb-4 text-[var(--color-text)]">
            {isLockManagerError ? 'Problema de Conectividade' : 'Erro de Autenticação'}
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-6">
            {isLockManagerError 
              ? 'Detectamos um problema de conectividade temporário. Tente novamente.'
              : error
            }
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              Tentar Novamente
            </button>
            {isLockManagerError && (
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
            )}
          </div>
          {isLockManagerError && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-600 dark:text-blue-400">
                💡 Este erro é temporário e geralmente resolve com uma nova tentativa
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (!user) {
    return null // O hook já deve ter redirecionado para login
  }

  const filteredActivities =
    filter === "all"
      ? activities
      : activities.filter((a) => a.type === filter)

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar
        user={user}
        filter={filter}
        setFilter={setFilter}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
        <header className="w-full max-w-6xl flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-md bg-[var(--color-primary)] text-white"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menu lateral"
            >
              <FiMenu size={24} />
            </button>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Escolha a atividade</h1>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {filteredActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </section>
      </main>
    </div>
  )
}