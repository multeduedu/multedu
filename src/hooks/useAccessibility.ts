'use client'

import { useEffect, useState } from 'react'

export type TextScale = 'small' | 'normal' | 'large'
export type ContrastMode = 'normal' | 'high'

interface AccessibilityState {
  textScale: TextScale
  contrast: ContrastMode
  dyslexiaFriendly: boolean
}

const DEFAULT_STATE: AccessibilityState = {
  textScale: 'normal',
  contrast: 'normal',
  dyslexiaFriendly: false,
}

export function useAccessibility() {
  const [accessibility, setAccessibility] = useState<AccessibilityState | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('accessibility')
    const state = saved ? JSON.parse(saved) : DEFAULT_STATE
    setAccessibility(state)
    applyAccessibilitySettings(state)
  }, [])

  useEffect(() => {
    if (accessibility === null) return

    localStorage.setItem('accessibility', JSON.stringify(accessibility))
    applyAccessibilitySettings(accessibility)
  }, [accessibility])

  const setTextScale = (scale: TextScale) => {
    setAccessibility((prev) => prev ? { ...prev, textScale: scale } : DEFAULT_STATE)
  }

  const setContrast = (mode: ContrastMode) => {
    setAccessibility((prev) => prev ? { ...prev, contrast: mode } : DEFAULT_STATE)
  }

  const toggleContrast = () => {
    if (!accessibility) return
    const newContrast: ContrastMode = accessibility.contrast === 'normal' ? 'high' : 'normal'
    setContrast(newContrast)
  }

  const toggleDyslexia = () => {
    setAccessibility((prev) => 
      prev ? { ...prev, dyslexiaFriendly: !prev.dyslexiaFriendly } : DEFAULT_STATE
    )
  }

  const resetAccessibility = () => {
    setAccessibility(DEFAULT_STATE)
  }

  return {
    accessibility,
    setTextScale,
    setContrast,
    toggleContrast,
    toggleDyslexia,
    resetAccessibility,
  }
}

function applyAccessibilitySettings(state: AccessibilityState) {
  const html = document.documentElement

  html.classList.remove('text-scale-small', 'text-scale-normal', 'text-scale-large')
  html.classList.add(`text-scale-${state.textScale}`)

  html.classList.remove('contrast-normal', 'contrast-high')
  html.classList.add(`contrast-${state.contrast}`)

  if (state.dyslexiaFriendly) {
    html.classList.add('dyslexia-friendly')
  } else {
    html.classList.remove('dyslexia-friendly')
  }

  const scales = {
    small: {
      xs: '0.625rem',
      sm: '0.75rem',
      base: '0.875rem',
      lg: '1rem',
      xl: '1.125rem',
      '2xl': '1.25rem',
      '3xl': '1.5rem',
      '4xl': '1.875rem',
      '5xl': '2.25rem',
    },
    normal: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    large: {
      xs: '0.875rem',
      sm: '1rem',
      base: '1.125rem',
      lg: '1.25rem',
      xl: '1.5rem',
      '2xl': '1.875rem',
      '3xl': '2.25rem',
      '4xl': '2.875rem',
      '5xl': '3.75rem',
    },
  }

  const currentScale = scales[state.textScale]
  Object.entries(currentScale).forEach(([key, value]) => {
    html.style.setProperty(`--font-size-${key}`, value)
  })
}
