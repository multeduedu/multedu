import type { Metadata } from "next"
import { Indie_Flower } from "next/font/google"
import ThemeToggle from "@/components/ui/ThemeToggle"
import Soma from "./Soma"
import BackButton from "@/components/ui/BackButton"

const indie = Indie_Flower({ subsets: ["latin"], weight: "400" })

export const metadata: Metadata = {
  title: "Soma (CDU) | Treino de Adição",
  description:
    "Pratique soma com números de 3 dígitos (Centena, Dezena, Unidade). Selecione os valores, forme os números e calcule o resultado total.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Soma (CDU) | Treino de Adição",
    description:
      "Pratique soma com números de 3 dígitos (Centena, Dezena, Unidade). Selecione os valores, forme os números e calcule o resultado total.",
    type: "website",
  },
}

export default function Page() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--color-background)] text-[var(--color-text-primary)]">
      <header className="w-full">
        <div className="mx-auto max-w-6xl px-2 sm:px-4 pt-4 flex items-center justify-between gap-4">
          <BackButton href="/dashboard" />

          <div className="w-[180px]">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="conteudo" className="mx-auto max-w-6xl px-2 sm:px-4 pb-10 pt-6">
        <h1
          className={`${indie.className} text-center font-bold leading-tight
          text-3xl sm:text-4xl lg:text-5xl`}
          style={{
            backgroundImage: "linear-gradient(to right, #4CAF50, #45a049)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            textShadow: "1px 1px 2px var(--color-primary)",
          }}
        >
          Praticando Soma – Centena, Dezena e Unidade
        </h1>

        <p className="mt-4 text-center text-[var(--color-text-secondary)]">
          Escolha os valores, forme os números e calcule o resultado total da soma.
        </p>

        <div className="mt-8">
          <section
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]
            shadow-sm p-3 sm:p-6 mx-auto w-full"
            aria-label="Treino de soma"
          >
            <Soma />
          </section>
        </div>
      </main>
    </div>
  )
}
