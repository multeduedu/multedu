'use client'

import { useAccessibility } from '@/hooks/useAccessibility'
import Swal from 'sweetalert2'
import { useState } from 'react'

export default function AccessibilityBar() {
  const { accessibility, setTextScale, setContrast, toggleContrast, toggleDyslexia } = useAccessibility()
  const [isOpen, setIsOpen] = useState(false)

  if (!accessibility) return null

  const handleAccessibilityInfo = () => {
    Swal.fire({
      title: '📖 Acessibilidade',
      html: `
        <div style="text-align: center; padding: clamp(12px, 5vw, 20px);">
          <p style="font-size: clamp(14px, 4vw, 16px); margin-bottom: 15px;">
            Recursos de acessibilidade estão disponíveis para ajustar a experiência do usuário.
          </p>
          <p style="font-size: clamp(12px, 3.5vw, 14px); color: #666; margin-bottom: 15px;">
            Use o painel de acessibilidade ou os atalhos para aumentar texto, ativar contraste alto ou modo dislexia.
          </p>
          <div style="background: #f0f0f0; padding: 10px; border-radius: 8px; font-size: clamp(11px, 3vw, 13px);">
            <strong>💡 Dica:</strong> Use os atalhos de teclado para navegação rápida.
          </div>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Entendi',
      confirmButtonColor: '#ff7f50',
      customClass: {
        container: 'swal2-custom',
        popup: 'rounded-2xl',
        confirmButton: 'rounded-lg',
      },
      width: '320px',
      padding: '8px',
    })
  }

  const handleShortcuts = () => {
    Swal.fire({
      title: '⌨️ Atalhos de Acessibilidade',
      html: `
        <div style="text-align: left; font-size: clamp(12px, 3.5vw, 14px);">
          <table style="width: 100%; border-collapse: collapse; font-size: clamp(11px, 3vw, 13px);">
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: clamp(6px, 2vw, 8px); font-weight: bold;">Atalho</td>
              <td style="padding: clamp(6px, 2vw, 8px); font-weight: bold;">Ação</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: clamp(6px, 2vw, 8px); background: #f5f5f5;"><strong>Alt + Shift + ↑</strong></td>
              <td style="padding: clamp(6px, 2vw, 8px);">Aumentar Texto</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: clamp(6px, 2vw, 8px); background: #f5f5f5;"><strong>Alt + Shift + ↓</strong></td>
              <td style="padding: clamp(6px, 2vw, 8px);">Diminuir Texto</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: clamp(6px, 2vw, 8px); background: #f5f5f5;"><strong>Alt + Shift + 0</strong></td>
              <td style="padding: clamp(6px, 2vw, 8px);">Redefinir Texto</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: clamp(6px, 2vw, 8px); background: #f5f5f5;"><strong>Alt + Shift + C</strong></td>
              <td style="padding: clamp(6px, 2vw, 8px);">Alternar Contraste</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: clamp(6px, 2vw, 8px); background: #f5f5f5;"> <strong>Alt + Shift + L</strong></td>
              <td style="padding: clamp(6px, 2vw, 8px);">Abrir painel de acessibilidade</td>
            </tr>
            <tr>
              <td style="padding: clamp(6px, 2vw, 8px); background: #f5f5f5;"><strong>Alt + Shift + D</strong></td>
              <td style="padding: clamp(6px, 2vw, 8px);">Modo Dislexia Amigável</td>
            </tr>
          </table>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Fechar',
      customClass: {
        container: 'swal2-custom',
        popup: 'rounded-2xl',
        confirmButton: 'rounded-lg',
      },
      width: '300px',
      padding: '6px',
      didOpen: (modal) => {
        modal.style.maxHeight = '80vh'
        modal.style.overflowY = 'auto'
        const htmlContent = modal.querySelector('.swal2-html-container') as HTMLElement
        if (htmlContent) {
          htmlContent.style.maxHeight = '35vh'
          htmlContent.style.overflowY = 'auto'
          htmlContent.style.overflowX = 'hidden'
        }
      }
    })
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[9999] bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-center gap-1 px-4 py-2 flex-wrap">
          <div className="flex items-center gap-0.5 bg-gray-50 rounded-sm p-1">
            <button
              onClick={() => setTextScale('small')}
              title="Texto Menor (Alt+Shift+↓)"
              className={`
                px-2 py-1.5 transition-all duration-200 text-xs font-medium
                ${
                  accessibility.textScale === 'small'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }
                border border-gray-200 hover:border-gray-300
                rounded-sm cursor-pointer
              `}
              aria-label="Diminuir tamanho do texto"
            >
              A −
            </button>

            <button
              onClick={() => setTextScale('normal')}
              title="Texto Normal (Alt+Shift+0)"
              className={`
                px-2 py-1.5 transition-all duration-200 text-xs font-medium
                ${
                  accessibility.textScale === 'normal'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }
                border border-gray-200 hover:border-gray-300
                rounded-sm cursor-pointer
              `}
              aria-label="Redefinir tamanho do texto"
            >
              A
            </button>

            <button
              onClick={() => setTextScale('large')}
              title="Texto Maior (Alt+Shift+↑)"
              className={`
                px-2 py-1.5 transition-all duration-200 text-xs font-medium text-lg
                ${
                  accessibility.textScale === 'large'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }
                border border-gray-200 hover:border-gray-300
                rounded-sm cursor-pointer
              `}
              aria-label="Aumentar tamanho do texto"
            >
              A +
            </button>
          </div>

          <div className="h-6 border-l border-gray-300 mx-1" />

          <button
            onClick={toggleContrast}
            title="Contraste Alto (Alt+Shift+C)"
            className={`
              px-2 py-1.5 transition-all duration-200 text-xs font-medium
              ${
                accessibility.contrast === 'high'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }
              border border-gray-200 hover:border-gray-300
              rounded-sm cursor-pointer
            `}
            aria-label={`Contraste: ${accessibility.contrast === 'high' ? 'Alto (ativado)' : 'Normal (desativado)'}`}
          >
            ◐ Contraste
          </button>

          <div className="h-6 border-l border-gray-300 mx-1" />

          <button
            onClick={toggleDyslexia}
            title="Modo Dislexia Amigável (Alt+Shift+D)"
            className={`
              px-2 py-1.5 transition-all duration-200 text-xs font-medium
              ${
                accessibility.dyslexiaFriendly
                  ? 'bg-purple-500 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }
              border border-gray-200 hover:border-gray-300
              rounded-sm cursor-pointer
            `}
            aria-label={`Dislexia: ${accessibility.dyslexiaFriendly ? 'Ativado' : 'Desativado'}`}
          >
            ⓓ Dislexia
          </button>

          <div className="h-6 border-l border-gray-300 mx-1" />

          <button
            onClick={handleAccessibilityInfo}
            title="Acessibilidade (Alt+Shift+L)"
            className="
              px-2 py-1.5 transition-all duration-200 text-xs font-medium
              bg-white text-gray-600 hover:bg-gray-100
              border border-gray-200 hover:border-gray-300
              rounded-sm cursor-pointer
            "
            aria-label="Abrir painel de acessibilidade"
          >
            📖 Acessibilidade
          </button>

          <div className="h-6 border-l border-gray-300 mx-1" />

          <button
            onClick={handleShortcuts}
            title="Ver atalhos de acessibilidade"
            className="
              px-2 py-1.5 transition-all duration-200 text-xs font-medium
              bg-white text-gray-600 hover:bg-gray-100
              border border-gray-200 hover:border-gray-300
              rounded-sm cursor-pointer
            "
            aria-label="Ver atalhos de acessibilidade"
          >
            ⌨️ Atalhos
          </button>
        </div>
      </div>
    </>
  )
}


