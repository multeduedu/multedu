'use client'

import { useState } from 'react'
import { useAccessibility } from '@/hooks/useAccessibility'
import Swal from 'sweetalert2'
import { FiPlus, FiMinus, FiRotateCcw, FiMaximize2, FiInfo } from 'react-icons/fi'

export default function AccessibilityPanel() {
  const { accessibility, setTextScale, setContrast, toggleContrast, resetAccessibility } = useAccessibility()
  const [showModal, setShowModal] = useState(false)

  if (!accessibility) return null

  const handleLibras = () => {
    window.open('https://www.youtube.com/channel/UCP8DZ_10F0iMEz8BmKcvBqg', '_blank')
  }

  const handleShortcuts = () => {
    Swal.fire({
      title: '⌨️ Atalhos de Acessibilidade',
      html: `
        <div className="text-left space-y-3">
          <div>
            <strong>Aumentar Texto:</strong>
            <p style="font-size: 0.9rem; color: #666;">Clique no botão + ou pressione Alt + Shift + ↑</p>
          </div>
          <div>
            <strong>Diminuir Texto:</strong>
            <p style="font-size: 0.9rem; color: #666;">Clique no botão - ou pressione Alt + Shift + ↓</p>
          </div>
          <div>
            <strong>Redefiniir Texto:</strong>
            <p style="font-size: 0.9rem; color: #666;">Clique no botão ↻ ou pressione Alt + Shift + 0</p>
          </div>
          <div>
            <strong>Alternar Contraste:</strong>
            <p style="font-size: 0.9rem; color: #666;">Clique no botão ◐ ou pressione Alt + Shift + C</p>
          </div>
          <div>
            <strong>Libras:</strong>
            <p style="font-size: 0.9rem; color: #666;">Pressione Alt + Shift + L para acessar intérprete em Libras</p>
          </div>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Entendi',
      customClass: {
        container: 'swal2-custom',
        popup: 'rounded-2xl',
        confirmButton: 'rounded-lg',
      },
    })
  }

  return (
    <>
      <div className="flex flex-col gap-2 w-full">
        {/* Controles de Texto */}
        <div className="flex gap-1 sm:gap-2">
          <button
            onClick={() => setTextScale('small')}
            aria-label="Diminuir tamanho do texto"
            className={`flex-1 px-2 py-2 rounded-lg transition flex items-center justify-center gap-1
              ${
                accessibility.textScale === 'small'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-card-hover)]'
              }
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
              cursor-pointer text-xs sm:text-sm font-semibold`}
            title="Texto Menor (Alt+Shift+↓)"
          >
            <FiMinus size={16} />
            <span className="hidden sm:inline">Menor</span>
          </button>

          <button
            onClick={() => setTextScale('normal')}
            aria-label="Redefiniir tamanho do texto"
            className={`flex-1 px-2 py-2 rounded-lg transition flex items-center justify-center gap-1
              ${
                accessibility.textScale === 'normal'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-card-hover)]'
              }
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
              cursor-pointer text-xs sm:text-sm font-semibold`}
            title="Texto Normal (Alt+Shift+0)"
          >
            <FiRotateCcw size={16} />
            <span className="hidden sm:inline">Normal</span>
          </button>

          <button
            onClick={() => setTextScale('large')}
            aria-label="Aumentar tamanho do texto"
            className={`flex-1 px-2 py-2 rounded-lg transition flex items-center justify-center gap-1
              ${
                accessibility.textScale === 'large'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-card-hover)]'
              }
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
              cursor-pointer text-xs sm:text-sm font-semibold`}
            title="Texto Maior (Alt+Shift+↑)"
          >
            <FiPlus size={16} />
            <span className="hidden sm:inline">Maior</span>
          </button>
        </div>

        {/* Controles de Contraste e Extras */}
        <div className="flex gap-1 sm:gap-2">
          <button
            onClick={toggleContrast}
            aria-label={`Contraste: ${accessibility.contrast === 'high' ? 'Alto (ativado)' : 'Normal (desativado)'}`}
            className={`flex-1 px-2 py-2 rounded-lg transition flex items-center justify-center gap-1
              ${
                accessibility.contrast === 'high'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-card-hover)]'
              }
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
              cursor-pointer text-xs sm:text-sm font-semibold`}
            title="Contraste (Alt+Shift+C)"
          >
            <FiMaximize2 size={16} />
            <span className="hidden sm:inline">Contraste</span>
          </button>

          <button
            onClick={handleLibras}
            aria-label="Acessar intérprete de Libras"
            className="flex-1 px-2 py-2 rounded-lg transition flex items-center justify-center gap-1
            bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-card-hover)]
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
            cursor-pointer text-xs sm:text-sm font-semibold"
            title="API Libras (Alt+Shift+L)"
          >
            <span>🤟</span>
            <span className="hidden sm:inline">Libras</span>
          </button>

          <button
            onClick={handleShortcuts}
            aria-label="Ver atalhos de acessibilidade"
            className="flex-1 px-2 py-2 rounded-lg transition flex items-center justify-center gap-1
            bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-card-hover)]
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
            cursor-pointer text-xs sm:text-sm font-semibold"
            title="Atalhos"
          >
            <FiInfo size={16} />
            <span className="hidden sm:inline">Atalhos</span>
          </button>
        </div>
      </div>
    </>
  )
}
