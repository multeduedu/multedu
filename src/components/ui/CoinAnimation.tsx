"use client"

import { useEffect, useState } from 'react'

interface CoinAnimationProps {
  amount: number
  onComplete?: () => void
}

export function CoinAnimation({ amount, onComplete }: CoinAnimationProps) {
  const [coins, setCoins] = useState<Array<{ id: number; x: number; delay: number }>>([])

  useEffect(() => {
    // Criar moedas com posições e delays aleatórios
    const newCoins = Array.from({ length: Math.min(amount / 2, 5) }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10, // Entre 10% e 90%
      delay: i * 100, // Escalonamento de 100ms
    }))
    
    setCoins(newCoins)

    // Limpar após a animação
    const timeout = setTimeout(() => {
      setCoins([])
      onComplete?.()
    }, 2000)

    return () => clearTimeout(timeout)
  }, [amount, onComplete])

  if (coins.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {coins.map((coin) => (
        <div
          key={coin.id}
          className="absolute animate-coin-float"
          style={{
            left: `${coin.x}%`,
            top: '50%',
            animationDelay: `${coin.delay}ms`,
          }}
        >
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-500 rounded-full shadow-lg border-2 border-yellow-300">
            <span className="text-sm font-bold text-yellow-900 select-none">$</span>
          </div>
        </div>
      ))}
      
      {/* Texto de moedas ganhas */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-12 animate-fade-up opacity-0">
        <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-amber-100 px-4 py-2 rounded-full border border-yellow-300 shadow-lg">
          <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-500 rounded-full shadow-inner">
            <span className="text-sm font-bold text-yellow-900">$</span>
          </div>
          <span className="text-lg font-bold text-yellow-700">+{amount}</span>
        </div>
      </div>
    </div>
  )
}