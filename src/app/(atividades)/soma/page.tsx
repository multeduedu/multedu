import type { Metadata } from "next"
import SomaBox from "./SomaBox"
import SomaResultado from "./SomaResultado"
import ThemeToggle from "@/components/ui/ThemeToggle"
import BackButton from "@/components/ui/BackButton"

export const metadata: Metadata = {
  title: "Praticando Soma | CDU",
  description: "Pratique soma com centenas, dezenas e unidades",
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
      <main className="mx-auto max-w-6xl p-6">
        <h1 className="text-center text-3xl font-bold mb-4">Praticando Soma</h1>

        <p className="mx-auto max-w-xl text-center text-slate-600 mb-8">
          Escolha centena, dezena e unidade, confira os números formados e resolva a soma.
        </p>

        <SomaResultado />
      </main>
      </div>
  )
}