import type { Metadata } from "next"
import { Indie_Flower } from "next/font/google"
import ThemeToggle from "@/components/ui/ThemeToggle"
import Multiplicador from "./Multiplicador"
import BackButton from "@/components/ui/BackButton"
import { DadosMultiplicadores } from "@/data/multiplicadores"
import { notFound } from "next/navigation"

type PageProps = {
  params: Promise<{ numero: string }>
}

const indie = Indie_Flower({ subsets: ["latin"], weight: "400" })

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { numero } = await params
  const multiplicadorNum = Number(numero)

  const dados = DadosMultiplicadores.find((m) => m.multiplicador === multiplicadorNum) || DadosMultiplicadores[0]

  return {
    title: `Multiplicação por ${dados.multiplicador} (Trachtenberg) | MultEdu`,
    description: `Aprenda a multiplicar por ${dados.multiplicador} usando o Método Trachtenberg com acessibilidade e gamificação.`,
  }
}

export default async function Page({ params }: PageProps) {
  const { numero } = await params
  const multiplicadorNum = Number(numero)

  const dados = DadosMultiplicadores.find(
    (m) => m.multiplicador === multiplicadorNum
  )

  if (!dados) notFound()

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
          className={`${indie.className} text-center font-bold leading-tight text-3xl sm:text-4xl lg:text-5xl`}
          style={{
            backgroundImage: "linear-gradient(to right, #ff7f50, #ff6347)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            textShadow: "1px 1px 2px var(--color-primary)",
          }}
        >
          Método Trachtenberg × {dados.multiplicador}
        </h1>

        <p className="mt-4 text-center text-[var(--color-text-secondary)] max-w-3xl mx-auto">
          Utilizaremos a Metodologia de Trachtenberg para aprender a multiplicar de forma rápida. 
          Assista ao vídeo explicativo dentro do painel de treino e siga o passo a passo.
        </p>

        <div className="mt-8 grid gap-6 items-start">
          <section
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm p-3 sm:p-6 mx-auto w-full"
            aria-label={`Área de treino de multiplicação por ${dados.multiplicador}`}
          >
            <Multiplicador dadosMult={dados} />
          </section>

          {/* Dica de apoio rápida (Regra da Metade) */}
          {dados.regraMetade && (
            <aside className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                💡 Dica: Como calcular a metade do vizinho?
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                No método Trachtenberg, muitas vezes somamos a "metade do vizinho". 
                Sempre desconsidere os números após a vírgula (arredonde para baixo):
              </p>
              <ul className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-sm font-bold">
                <li className="bg-[var(--color-background)] p-2 rounded-lg">1 → 0</li>
                <li className="bg-[var(--color-background)] p-2 rounded-lg">3 → 1</li>
                <li className="bg-[var(--color-background)] p-2 rounded-lg">5 → 2</li>
                <li className="bg-[var(--color-background)] p-2 rounded-lg">7 → 3</li>
                <li className="bg-[var(--color-background)] p-2 rounded-lg">9 → 4</li>
              </ul>
            </aside>
          )}
        </div>
      </main>
    </div>
  )
}