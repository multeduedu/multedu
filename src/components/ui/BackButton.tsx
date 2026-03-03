import Link from "next/link"
import { ReactNode } from "react"

interface BackButtonProps {
  href: string
  label?: string
  icon?: ReactNode
}

export default function BackButton({
  href,
  label = "Voltar",
  icon,
}: BackButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-md px-3 py-2
      bg-[var(--color-surface)] border border-[var(--color-border)]
      hover:bg-[var(--color-card-hover)]
      transition
      focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
      aria-label={label}
    >
      {icon ?? <span aria-hidden="true">←</span>}
      <span className="font-semibold">{label}</span>
    </Link>
  )
}