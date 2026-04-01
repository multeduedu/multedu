"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Activity } from "@/data/activities"
import { addExperience } from "@/actions/auth"

type Props = {
  activity: Activity
}

export default function ActivityCard({ activity }: Props) {
  const router = useRouter()

  const handleStartActivity = async () => {
    try {
      
      await addExperience(10)
      
      
      router.push(activity.href)
    } catch (error) {
      console.error("Erro ao registrar XP:", error)
      
      router.push(activity.href)
    }
  }

  return (
    <article
      tabIndex={0}
      className="
      bg-[var(--color-card)]
      border border-[var(--color-border)]
      rounded-xl
      shadow-sm
      hover:shadow-lg
      transition-all duration-300
      focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
    "
    >
      <Image
        src={activity.image}
        alt={`Imagem da atividade ${activity.title}`}
        width={500}
        height={300}
        className="w-full h-48 object-cover rounded-t-xl"
        priority={false}
      />

      <div className="p-4 flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] text-center">
          {activity.title}
        </h2>

        <button
          onClick={handleStartActivity}
          className="
          text-center py-2 rounded-lg
          bg-[var(--color-primary)]
          hover:bg-[var(--color-primary-hover)]
          text-white font-medium
          transition
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
          cursor-pointer
        "
        >
          Iniciar
        </button>
      </div>
    </article>
  )
}