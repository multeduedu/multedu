'use client'

import { useAccessibility } from '@/hooks/useAccessibility'
import Swal from 'sweetalert2'
import { useState, useRef, useEffect, useCallback } from 'react'
import { FiChevronUp } from 'react-icons/fi'

interface Position {
  x: number
  y: number
}

export default function FloatingAccessibilityButton() {
  const { accessibility, setTextScale, setContrast, toggleContrast, toggleDyslexia } = useAccessibility()
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dragStateRef = useRef({ 
    startX: 0, 
    startY: 0, 
    initialX: 0, 
    initialY: 0,
    hasMoved: false 
  })

  // Recuperar posição salva do localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPosition = localStorage.getItem('a11y-button-position')
      if (savedPosition) {
        try {
          setPosition(JSON.parse(savedPosition))
        } catch (e) {
          setPosition({ x: 0, y: 0 })
        }
      }
    }
  }, [])

  // Salvar posição no localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && (position.x !== 0 || position.y !== 0)) {
      localStorage.setItem('a11y-button-position', JSON.stringify(position))
    }
  }, [position])

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    
    dragStateRef.current.hasMoved = false
    dragStateRef.current.startX = e.clientX
    dragStateRef.current.startY = e.clientY
    dragStateRef.current.initialX = position.x
    dragStateRef.current.initialY = position.y
    setIsDragging(true)
  }, [position])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return
    
    // Calcular delta (diferença de movimento)
    const deltaX = e.clientX - dragStateRef.current.startX
    const deltaY = e.clientY - dragStateRef.current.startY
    
    // Detecta movimento real
    if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
      dragStateRef.current.hasMoved = true
    }
    
    // Nova posição = posição inicial + delta
    const newX = dragStateRef.current.initialX + deltaX
    const newY = dragStateRef.current.initialY - deltaY // Invertido porque Y vai de cima para baixo, mas bottom vai de baixo para cima
    
    // Limites da tela
    const maxX = typeof window !== 'undefined' ? window.innerWidth - 56 : 0
    const maxY = typeof window !== 'undefined' ? window.innerHeight - 56 : 0
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    })
  }, [isDragging])

  const handleMouseUp = useCallback(() => {
    if (!dragStateRef.current.hasMoved) {
      // Se não houve movimento, alterna o menu
      setIsOpen(prev => !prev)
    }
    setIsDragging(false)
  }, [])

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    
    dragStateRef.current.hasMoved = false
    dragStateRef.current.startX = e.touches[0].clientX
    dragStateRef.current.startY = e.touches[0].clientY
    dragStateRef.current.initialX = position.x
    dragStateRef.current.initialY = position.y
    setIsDragging(true)
  }, [position])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return
    
    // Calcular delta (diferença de movimento)
    const deltaX = e.touches[0].clientX - dragStateRef.current.startX
    const deltaY = e.touches[0].clientY - dragStateRef.current.startY
    
    // Detecta movimento real
    if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
      dragStateRef.current.hasMoved = true
    }
    
    // Nova posição = posição inicial + delta
    const newX = dragStateRef.current.initialX + deltaX
    const newY = dragStateRef.current.initialY - deltaY // Invertido porque Y vai de cima para baixo, mas bottom vai de baixo para cima
    
    const maxX = typeof window !== 'undefined' ? window.innerWidth - 56 : 0
    const maxY = typeof window !== 'undefined' ? window.innerHeight - 56 : 0
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    })
  }, [isDragging])

  const handleTouchEnd = useCallback(() => {
    if (!dragStateRef.current.hasMoved) {
      setIsOpen(prev => !prev)
    }
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd])

  if (!accessibility) return null

  const handleLibras = () => {
    setIsOpen(false)
    Swal.fire({
      title: '📖 Intérprete de Libras',
      html: `
        <div style="text-align: center; padding: clamp(12px, 5vw, 20px);">
          <p style="font-size: clamp(14px, 4vw, 16px); margin-bottom: 15px;">
            O <strong>VLibras</strong> foi carregado. Você verá um <strong>widget no canto inferior direito</strong> com o intérprete de Libras.
          </p>
          <p style="font-size: clamp(12px, 3.5vw, 14px); color: #666; margin-bottom: 15px;">
            Ele irá traduzir o conteúdo da página para Língua Brasileira de Sinais automaticamente.
          </p>
          <div style="background: #f0f0f0; padding: 10px; border-radius: 8px; font-size: clamp(11px, 3vw, 13px);">
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
      width: '280px',
      padding: '6px',
      didOpen: (modal) => {
        modal.style.overflowY = 'visible'
        const htmlContent = modal.querySelector('.swal2-html-container') as HTMLElement | null
        if (htmlContent) {
          htmlContent.style.maxHeight = '30vh'
          htmlContent.style.overflowY = 'auto'
          htmlContent.style.overflowX = 'hidden'
          htmlContent.style.paddingRight = '4px'
        }
      }
    })
  }

  const handleShortcuts = () => {
    setIsOpen(false)
    Swal.fire({
      title: '⌨️ Atalhos de Acessibilidade',
      html: `
        <div style="text-align: left; font-size: clamp(12px, 3.5vw, 14px); max-height: 400px; overflow-y: auto;">
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
              <td style="padding: clamp(6px, 2vw, 8px);">Redefiniir Texto</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: clamp(6px, 2vw, 8px); background: #f5f5f5;"><strong>Alt + Shift + C</strong></td>
              <td style="padding: clamp(6px, 2vw, 8px);">Alternar Contraste</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: clamp(6px, 2vw, 8px); background: #f5f5f5;"><strong>Alt + Shift + L</strong></td>
              <td style="padding: clamp(6px, 2vw, 8px);">Acessar Libras</td>
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
        modal.style.overflowY = 'visible'
        const htmlContent = modal.querySelector('.swal2-html-container') as HTMLElement | null
        if (htmlContent) {
          htmlContent.style.maxHeight = '35vh'
          htmlContent.style.overflowY = 'auto'
          htmlContent.style.overflowX = 'hidden'
          htmlContent.style.paddingRight = '4px'
        }
      }
    })
  }

  return (
    <>
      {/* Botão Flutuante - Agora Arrastável */}
      <button
        ref={buttonRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={`fixed z-[9998] w-14 h-14 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-all duration-200 flex items-center justify-center ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          left: `${position.x}px`,
          bottom: `${position.y}px`,
          transform: isDragging ? 'scale(1.1)' : 'scale(1)',
        }}
        aria-label="Abrir menu de acessibilidade"
        title="Acessibilidade (arraste para mover)"
      >
        <span className="text-2xl">♿</span>
      </button>

      {/* Menu Flutuante */}
      {isOpen && (
        <div 
          className="fixed z-[9998] bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-72 md:w-80 max-h-96 overflow-y-auto pointer-events-auto"
          style={{
            left: `${position.x}px`,
            bottom: `${position.y + 70}px`,
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {/* Texto aumentar/diminuir */}
          <div className="mb-3">
            <p className="text-xs font-semibold text-gray-700 mb-2">Tamanho do Texto</p>
            <div className="flex gap-1 bg-gray-50 rounded p-1">
              <button
                onClick={() => setTextScale('small')}
                className={`flex-1 px-2 py-1 text-xs font-medium rounded transition-all ${
                  accessibility.textScale === 'small'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                A −
              </button>
              <button
                onClick={() => setTextScale('normal')}
                className={`flex-1 px-2 py-1 text-xs font-medium rounded transition-all ${
                  accessibility.textScale === 'normal'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                A
              </button>
              <button
                onClick={() => setTextScale('large')}
                className={`flex-1 px-2 py-1 text-xs font-medium rounded transition-all ${
                  accessibility.textScale === 'large'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                A +
              </button>
            </div>
          </div>

          {/* Separador */}
          <div className="border-t border-gray-200 my-2" />

          {/* Contraste */}
          <button
            onClick={toggleContrast}
            className={`w-full px-2 py-2 text-xs font-medium rounded mb-2 transition-all text-left ${
              accessibility.contrast === 'high'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            ◐ Contraste Alto
          </button>

          {/* Dislexia */}
          <button
            onClick={toggleDyslexia}
            className={`w-full px-2 py-2 text-xs font-medium rounded mb-2 transition-all text-left ${
              accessibility.dyslexiaFriendly
                ? 'bg-purple-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            ⓓ Modo Dislexia
          </button>

          {/* Separador */}
          <div className="border-t border-gray-200 my-2" />

          {/* Libras */}
          <button
            onClick={handleLibras}
            className="w-full px-2 py-2 text-xs font-medium rounded mb-2 bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 transition-all text-left"
          >
            📖 Libras
          </button>

          {/* Atalhos */}
          <button
            onClick={handleShortcuts}
            className="w-full px-2 py-2 text-xs font-medium rounded bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 transition-all text-left"
          >
            ⌨️ Atalhos
          </button>

          {/* Fechar */}
          <button
            onClick={() => setIsOpen(false)}
            className="w-full mt-2 px-2 py-1.5 text-xs font-medium rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Overlay para fechar menu */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9997]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
