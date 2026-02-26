"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { FiLogOut } from "react-icons/fi"
import { User } from "@/types/user"
import ThemeToggle from "../../ui/ThemeToggle"


type Props = {
  user: User | null
  filter: string
  setFilter: (value: string) => void
}

export default function Sidebar({ user, filter, setFilter }: Props) {
  const router = useRouter()
 

  function handleLogout() {
    
    router.push("/")
  }

  const baseButton =
    "w-full text-left px-4 py-2 rounded-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] cursor-pointer"

  const activeButton =
    "bg-[var(--color-primary)] text-white font-semibold cursor-pointer"

  const inactiveButton =
  "text-[var(--color-sidebar-text)] hover:bg-[var(--color-primary)]/12 hover:text-[var(--color-primary)] cursor-pointer"

  return (
    <aside
      className="hidden lg:flex flex-col justify-between
      w-64 h-screen p-6
      bg-[var(--color-sidebar)]
      text-[var(--color-sidebar-text)]
      border-r border-[var(--color-border)]"
      aria-label="Menu lateral"
    >
      {/* TOP */}
      <div>
        {/* USER INFO */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <Image
            src={user?.avatarUrl || "/avatar.png"}
            alt="Avatar do usuário"
            width={80}
            height={80}
            className="rounded-full"
          />
          <p className="font-semibold">{user?.name || "Usuário"}</p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {user?.email}
          </p>
        </div>

        {/* FILTERS */}
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
              className={`${baseButton} ${
                filter === item.value ? activeButton : inactiveButton
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* BOTTOM ACTIONS */}
      <div className="flex flex-col gap-4">
        {/* LOGOUT */}
        <button
          onClick={handleLogout}
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

        {/* THEME TOGGLE */}
        <ThemeToggle />
      </div>
    </aside>
  )
}