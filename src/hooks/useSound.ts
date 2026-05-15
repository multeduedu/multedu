"use client"

import { useRef, useCallback } from "react"

export function useSound(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const play = useCallback(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(src)
        audioRef.current.volume = 0.7
      }

      audioRef.current.currentTime = 0
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {})
      }
    } catch (error) {
      console.debug('Audio error:', error)
    }
  }, [src])

  return { play }
}
