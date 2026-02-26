import Link from "next/link"
import Image from "next/image"
import { Activity } from "@/data/activities"

type Props = {
  activity: Activity
}

export default function ActivityCard({ activity }: Props) {
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
        className="w-full h-48 object-cover"
      />

      <div className="p-4 flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] text-center">
          {activity.title}
        </h2>

        <Link
          href={activity.href}
          tabIndex={0}
          className="
          text-center py-2 rounded-lg
          bg-[var(--color-primary)]
          hover:bg-[var(--color-primary-hover)]
          text-white font-medium
          transition
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
"
        >
          Iniciar 
        </Link>
      </div>
    </article>
  )
}