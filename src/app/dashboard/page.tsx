"use client"

import { useState, useEffect } from "react"
import Sidebar from "../../components/sections/dashboard/SideBar"
import ActivityCard from "../../components/sections/dashboard/ActivityCard"
import { activities } from "@/data/activities"
import { User } from "@/types/user"
import { FiMenu } from "react-icons/fi"
import { supabase } from "@/lib/supabase"

export default function DashboardPage() {
  const [filter, setFilter] = useState("all")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    async function fetchUserData() {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (authUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('nome, xp')
          .eq('id', authUser.id)
          .single()

        if (profile) {
          const userData: User = {
            id: authUser.id,
            name: profile.nome,
            email: authUser.email || "",
            xp: profile.xp,
            user_metadata: authUser.user_metadata
          }
          
          setUser(userData)
          
          const firstName = profile.nome.split(' ')[0]
          document.title = `MultEdu | ${firstName}`
        }
      }
    }

    fetchUserData()
  }, [])

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



