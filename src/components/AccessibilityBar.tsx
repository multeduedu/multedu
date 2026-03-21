'use client'

import { useAccessibility } from '@/hooks/useAccessibility'
import Swal from 'sweetalert2'
import { useState } from 'react'

export default function AccessibilityBar() {
  const { accessibility, setTextScale, setContrast, toggleContrast, toggleDyslexia } = useAccessibility()
  const [isOpen, setIsOpen] = useState(false)

  if (!accessibility) return null

  const handleLibras = () => {
    Swal.fire({
      title: '📖 Intérprete de Libras',
      html: `
        <div style="text-align: center; padding: 20px;">
          <p style="font-size: 16px; margin-bottom: 15px;">
            O <strong>VLibras</strong> foi carregado. Você verá um <strong>widget no canto inferior direito</strong> com o intérprete de Libras.
          </p>
          <p style="font-size: 14px; color: #666; margin-bottom: 15px;">
            Ele irá traduzir o conteúdo da página para Língua Brasileira de Sinais automaticamente.
          </p>
          <div style="background: #f0f0f0; padding: 10px; border-radius: 8px; font-size: 13px;">
            <strong>💡 Dica:</strong> Clique no widget VLibras no canto direito para ativar o intérprete!
          </div>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Entendi',
      confirmButtonColor: 'var(--color-primary)',
      customClass: {
        container: 'swal2-custom',
        popup: 'rounded-2xl',
        confirmButton: 'rounded-lg',
      },
    })
  }

  const handleShortcuts = () => {
    Swal.fire({
      title: '⌨️ Atalhos de Acessibilidade',
      html: `
        <div style="text-align: left; font-size: 14px; max-height: 400px; overflow-y: auto;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 8px; font-weight: bold;">Atalho</td>
              <td style="padding: 8px; font-weight: bold;">Ação</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 8px; background: #f5f5f5;"><strong>Alt + Shift + ↑</strong></td>
              <td style="padding: 8px;">Aumentar Texto</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 8px; background: #f5f5f5;"><strong>Alt + Shift + ↓</strong></td>
              <td style="padding: 8px;">Diminuir Texto</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 8px; background: #f5f5f5;"><strong>Alt + Shift + 0</strong></td>
              <td style="padding: 8px;">Redefiniir Texto</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 8px; background: #f5f5f5;"><strong>Alt + Shift + C</strong></td>
              <td style="padding: 8px;">Alternar Contraste</td>
            </tr>
            <tr>
              <td style="padding: 8px; background: #f5f5f5;"><strong>Alt + Shift + L</strong></td>
              <td style="padding: 8px;">Acessar Libras</td>
            </tr>
            <tr>
              <td style="padding: 8px; background: #f5f5f5;"><strong>Alt + Shift + D</strong></td>
              <td style="padding: 8px;">Modo Dislexia Amigável</td>
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
    })
  }

  return (
    <>
      {/* Barra de Acessibilidade - Estilo Prefeitura */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-center gap-1 px-4 py-2 flex-wrap">
          {/* Grupo: Tamanho do Texto */}
          <div className="flex items-center gap-0.5 bg-gray-50 rounded-sm p-1">
            {/* Texto Menor */}
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

            {/* Texto Normal */}
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
              aria-label="Redefiniir tamanho do texto"
            >
              A
            </button>

            {/* Texto Maior */}
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

          {/* Separador */}
          <div className="h-6 border-l border-gray-300 mx-1" />

          {/* Contraste */}
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

          {/* Separador */}
          <div className="h-6 border-l border-gray-300 mx-1" />

          {/* Modo Dislexia */}
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

          {/* Separador */}
          <div className="h-6 border-l border-gray-300 mx-1" />

          {/* Libras */}
          <button
            onClick={handleLibras}
            title="Libras VLibras (Alt+Shift+L)"
            className="
              px-2 py-1.5 transition-all duration-200 text-xs font-medium
              bg-white text-gray-600 hover:bg-gray-100
              border border-gray-200 hover:border-gray-300
              rounded-sm cursor-pointer
            "
            aria-label="Acessar intérprete de Libras - VLibras"
          >
            📖 Libras
          </button>

          {/* Separador */}
          <div className="h-6 border-l border-gray-300 mx-1" />

          {/* Atalhos */}
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

      {/* Padding para não sobrepor conteúdo */}
      <div className="h-14" />
    </>
  )
}
