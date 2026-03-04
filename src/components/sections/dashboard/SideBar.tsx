"use client"

import Image from "next/image"
import { FiLogOut, FiX } from "react-icons/fi"
import { User } from "@/types/user"
import ThemeToggle from "../../ui/ThemeToggle"

type Props = {
  user: User | null
  filter: string
  setFilter: (value: string) => void
  isOpen?: boolean 
  onClose?: () => void 
}

export default function Sidebar({ user, filter, setFilter, isOpen = false, onClose }: Props) {
  return (
    <>
      <aside
        className="hidden lg:flex flex-col justify-between
        w-64 h-screen p-6
        bg-[var(--color-sidebar)]
        text-[var(--color-sidebar-text)]
        border-r border-[var(--color-border)]"
        aria-label="Menu lateral"
      >
        <SidebarContent user={user} filter={filter} setFilter={setFilter} />
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/30"
            onClick={onClose}
          />
          <aside
            className="relative w-64 h-full bg-[var(--color-sidebar)] text-[var(--color-sidebar-text)] p-6 flex flex-col justify-between border-r border-[var(--color-border)] transform transition-transform duration-300"
          >
            <button
              className="absolute top-4 right-4 text-white p-2 focus:outline-none focus:ring-2 focus:ring-white"
              onClick={onClose}
              aria-label="Fechar menu"
            >
              <FiX
                size={24}
                className="text-[var(--color-text-secondary)]"
              />
            </button>

            <SidebarContent user={user} filter={filter} setFilter={setFilter} />
          </aside>
        </div>
      )}
    </>
  )
}

function SidebarContent({ user, filter, setFilter }: Omit<Props, "isOpen" | "onClose">) {
  const firstName = user?.name ? user.name.split(' ')[0] : "Estudante"
  const robotStyle = user?.user_metadata?.avatar_style || 'bottts'
  const robotAvatar = `https://api.dicebear.com/7.x/${robotStyle}/svg?seed=${user?.email || 'default'}`

  const baseButton =
    "w-full text-left px-4 py-2 rounded-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] cursor-pointer"

  const activeButton =
    "bg-[var(--color-primary)] text-white font-semibold cursor-pointer"

  const inactiveButton =
    "text-[var(--color-sidebar-text)] hover:bg-[var(--color-primary)]/12 hover:text-[var(--color-primary)] cursor-pointer"

  return (
    <>
      <div>
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="relative w-20 h-20 bg-[var(--color-primary)]/10 rounded-full p-2 border-2 border-[var(--color-primary)]/20">
            <Image
              src={robotAvatar}
              alt="Avatar do usuário"
              width={80}
              height={80}
              className="rounded-full"
              priority
            />
          </div>
          <div className="text-center">
            <p className="font-semibold text-lg">Olá, {firstName}! 👋</p>
            
            <div className="mt-2 flex items-center justify-center gap-1 bg-[var(--color-primary)]/10 px-3 py-1 rounded-full border border-[var(--color-primary)]/20">
              <span className="text-xs font-bold text-[var(--color-primary)]">
                {user?.xp || 0} XP
              </span>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-3">
          {[
            { label: "Todas", value: "all" },
            { label: "Multiplicação", value: "multiplicacao" },
            { label: "Soma", value: "soma" },
            { label: "Subtração", value: "subtracao" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setFilter(item.value)}
              aria-pressed={filter === item.value}
              className={`${baseButton} ${filter === item.value ? activeButton : inactiveButton}`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => window.location.href = "/"}
          className="w-full flex items-center justify-center gap-2
          px-4 py-2 rounded-lg
          border border-[var(--color-border)]
          hover:bg-red-500 hover:text-white
          transition
          focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500
          cursor-pointer"
        >
          <FiLogOut size={18} />
          Sair
        </button>

        <ThemeToggle />
      </div>
    </>
  )
}