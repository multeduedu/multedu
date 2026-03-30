'use client'

import { useEffect } from 'react'
import { useAccessibility } from '@/hooks/useAccessibility'
import Swal from 'sweetalert2'

export default function AccessibilityHotkeys() {
  const { accessibility, setTextScale, toggleContrast, toggleDyslexia } = useAccessibility()

  const handleLibrasShortcut = () => {
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

  useEffect(() => {
    if (!accessibility) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.altKey || !e.shiftKey) return

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          setTextScale(accessibility.textScale === 'large' ? 'large' : accessibility.textScale === 'normal' ? 'large' : 'normal')
          break

        case 'ArrowDown':
          e.preventDefault()
          setTextScale(accessibility.textScale === 'small' ? 'small' : accessibility.textScale === 'normal' ? 'small' : 'normal')
          break

        case '0':
          e.preventDefault()
          setTextScale('normal')
          break

        case 'c':
        case 'C':
          e.preventDefault()
          toggleContrast()
          break

        case 'l':
        case 'L':
          e.preventDefault()
          handleLibrasShortcut()
          break

        case 'd':
        case 'D':
          e.preventDefault()
          toggleDyslexia()
          break

        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [accessibility, setTextScale, toggleContrast])

  return null
}
