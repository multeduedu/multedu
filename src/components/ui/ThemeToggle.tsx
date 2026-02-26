"use client"

import { useEffect, useState } from "react"
import { FiMoon, FiSun } from "react-icons/fi"

export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null)

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    const isDark = savedTheme === "dark"
    setDark(isDark)
    document.documentElement.classList.toggle("dark", isDark)
  }, [])

  useEffect(() => {
    if (dark === null) return
    document.documentElement.classList.toggle("dark", dark)
    localStorage.setItem("theme", dark ? "dark" : "light")
  }, [dark])

  if (dark === null) return null

  return (
    <button
      aria-label="Alternar tema"
      aria-pressed={dark}
      onClick={() => setDark(!dark)}
      className="w-full flex items-center justify-center gap-2
      px-4 py-2 rounded-lg transition
      bg-[var(--color-primary)]
      hover:bg-[var(--color-primary-hover)]
      text-white font-semibold
      focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
      cursor-pointer"
    >
      {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
      {dark ? "Tema Claro" : "Tema Escuro"}
    </button>
  )
}