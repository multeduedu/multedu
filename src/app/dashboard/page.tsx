"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "../../components/sections/dashboard/SideBar"
import ActivityCard from "../../components/sections/dashboard/ActivityCard"
import { activities } from "@/data/activities"
import { User } from "@/types/user"
import { FiMenu } from "react-icons/fi"
import { supabase } from "@/lib/supabase"

export default function DashboardPage() {
  const router = useRouter()
  const [filter, setFilter] = useState("all")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.replace("/login");
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('nome, xp')
          .eq('id', user.id)
          .single();

        setUser({
          id: user.id,
          name: profile?.nome || user.email?.split('@')[0] || 'Usuário',
          email: user.email || "",
          xp: profile?.xp || 0,
          user_metadata: user.user_metadata
        });
        
        if (profile?.nome) {
          const firstName = profile.nome.trim().split(/\s+/)[0];
          document.title = `MultEdu | ${firstName}`;
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        setUser({
          id: 'temp',
          name: 'Usuário',
          email: '',
          xp: 0,
          user_metadata: {}
        });
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    )
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

      <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
        <header className="w-full max-w-6xl flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-md bg-[var(--color-primary)] text-white"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menu lateral"
            >
              <FiMenu size={24} />
            </button>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Escolha a atividade</h1>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {filteredActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </section>
      </main>
    </div>
  )
}