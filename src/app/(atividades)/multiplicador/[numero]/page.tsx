import type { Metadata } from "next"
import { Indie_Flower } from "next/font/google"
import ThemeToggle from "@/components/ui/ThemeToggle"
import Multiplicador from "./Multiplicador"
import BackButton from "@/components/ui/BackButton"
import { DadosMultiplicadores } from "../../../../data/multiplicadores"

const indie = Indie_Flower({ subsets: ["latin"], weight: "400" })

export const metadata: Metadata = {
  title: `Multiplicação por {dados!.multiplicador} (Trachtenberg) | Treino`,
  description:
    `Treine multiplicação por {dados!.multiplicador} usando a metodologia Trachtenberg. Selecione dígitos, preencha o resultado e confira.`,
  robots: { index: true, follow: true },
  openGraph: {
    title: `Multiplicação por {dados!.multiplicador} (Trachtenberg) | Treino`,
    description:
      `Treine multiplicação por {dados!.multiplicador} usando a metodologia Trachtenberg. Selecione dígitos, preencha o resultado e confira.`,
    type: "website",
  },
}

export default async function Page({ params }: { params: { numero: string } }) {
  const resolvedParams = await params
  const multiplicador = Number(resolvedParams.numero)


  let dados = DadosMultiplicadores.find(
    (m) => m.multiplicador === multiplicador
  )

  console.log("params:", resolvedParams)
  console.log("numero:", resolvedParams.numero)

  if(!dados){
    dados = DadosMultiplicadores.find(
    (m) => m.multiplicador === 11
  )
  }
  
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
            backgroundImage: "linear-gradient(to right, #ff7f50, #ff6347)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            textShadow: "1px 1px 2px var(--color-primary)",
          }}
        >
          Multiplicação por {dados!.multiplicador} – Metodologia Trachtenberg
        </h1>

        <p className="mt-4 text-center text-[var(--color-text-secondary)]">
          Selecione os dígitos do número, siga as dicas por dígito e digite o resultado.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px] items-start">
          <section
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]
            shadow-sm p-3 sm:p-6 mx-auto w-full"
            aria-label={`Treino de multiplicação por ${dados!.multiplicador}`}
          >
            <Multiplicador dadosMult={dados!}/>
          </section>

          <aside
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]
            shadow-sm p-3 sm:p-6 w-full mx-auto"
            aria-label="Vídeo de apoio"
          >
            <h2 className="text-lg font-bold mb-3">Vídeo de apoio</h2>

            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[var(--color-border)]">
              <iframe
                className="absolute inset-0 h-full w-full"
                src={dados?.videoUrl}
                title={`Multiplicação por ${dados!.multiplicador} - Metodologia Trachtenberg (YouTube)`}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div hidden={!dados?.regraMetade} className="relative aspect-video w-full overflow-x-hidden rounded-xl border border-[var(--color-border)]">
              
              <h2 className="text-lg font-bold mb-3">Como calcular a metade do vizinho?</h2>
              <p>Desconsidere os números após a vírgula. Exemplo: 3 divido 2 é igual a 1,5; considere apenas o 1. A seguir uma lista de referência: </p>
              <ul>
                <li>1 = 0 </li>
                <li>3 = 1</li>
                <li>5 = 2</li>
                <li>7 = 3</li>
                <li>9 = 4</li>
              </ul>
            </div>

            <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
              Dica: assista e volte para praticar digitando cada dígito do resultado.
            </p>
          </aside>
        </div>
      </main>
    </div>
  )
}