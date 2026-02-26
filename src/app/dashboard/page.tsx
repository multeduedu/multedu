"use client"

import { useState } from "react"
import Sidebar from "../../components/sections/dashboard/SideBar"
import ActivityCard from "../../components/sections/dashboard/ActivityCard"
import ThemeToggle from "../../components/ui/ThemeToggle"
import { activities } from "@/data/activities"
import { User } from "@/types/user"

export default function DashboardPage() {
  const [filter, setFilter] = useState("all")

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
      />

      <main
        className="flex-1 overflow-y-auto p-6 flex flex-col items-center"
        aria-label="Área principal do dashboard"
      >
        <header className="w-full max-w-6xl flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">
            Escolha a atividade
          </h1>


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