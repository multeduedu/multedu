"use client"

import { useState } from "react"
import Sidebar from "../../components/sections/dashboard/SideBar"
import ActivityCard from "../../components/sections/dashboard/ActivityCard"
import { activities } from "@/data/activities"
import { User } from "@/types/user"
import { FiMenu, FiX } from "react-icons/fi"

export default function DashboardPage() {
  const [filter, setFilter] = useState("all")
  const [sidebarOpen, setSidebarOpen] = useState(false) // toggle mobile

  const user: User | null = {
    id: "1",
    name: "Eduardo Vernizzi",
    email: "edu@email.com",
  }

  const filteredActivities =
    filter === "all"
      ? activities
      : activities.filter((a) => a.type === filter)

  return (
    <div className="h-screen flex overflow-hidden">

      <Sidebar
        user={user}
        filter={filter}
        setFilter={setFilter}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main
        className="flex-1 overflow-y-auto p-6 flex flex-col items-center"
        aria-label="Área principal do dashboard"
      >
        <header className="w-full max-w-6xl flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-md bg-[var(--color-primary)] text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menu"
            >
              <FiMenu size={24} />
            </button>

            <h1 className="text-2xl font-bold">Escolha a atividade</h1>
          </div>
        </header>

        <section
          className="grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-3 
          gap-6 
          w-full max-w-6xl"
          aria-label="Lista de atividades"
        >
          {filteredActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </section>
      </main>
    </div>
  )
}