import type { Metadata } from "next"
import { Indie_Flower } from "next/font/google"
import BackButton from "@/components/ui/BackButton"
import ThemeToggle from "@/components/ui/ThemeToggle"
import MultiplicadorX2 from "./MultiplicadorX2"

const indie = Indie_Flower({ subsets: ["latin"], weight: "400" })

export const metadata: Metadata = {
  title: "Multiplicação por 2 (Trachtenberg) | Treino",
  description:
    "Treine multiplicação por 2 usando a metodologia Trachtenberg. Selecione dígitos, preencha o resultado e confira.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Multiplicação por 2 (Trachtenberg) | Treino",
    description:
      "Treine multiplicação por 2 usando a metodologia Trachtenberg. Selecione dígitos, preencha o resultado e confira.",
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
            backgroundImage: "linear-gradient(to right, #ff9800, #ff7043)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Multiplicação por 2 - Metodologia Trachtenberg
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 mt-10">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
            <MultiplicadorX2 />
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <h2 className="font-bold text-lg mb-3">Vídeo de apoio</h2>
              <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: "16 / 9" }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/XPylUHjQgxg"
                  title="Multiplicação por 2 - Metodologia Trachtenberg"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <h3 className="font-bold text-base mb-3">Regras do Método</h3>
              <div className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                <p>
                  <strong>Simples:</strong> Simplesmente dobre cada dígito do número original.
                </p>
                <p>
                  <strong>Carry:</strong> Se o resultado for 10 ou mais, coloque o dígito da unidade na resposta e some +1 ao próximo dígito.
                </p>
                <p>
                  <strong>Exemplo:</strong> 234 × 2 = 468
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
