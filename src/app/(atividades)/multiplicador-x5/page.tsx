import type { Metadata } from 'next'
import { Indie_Flower } from 'next/font/google'
import BackButton from '@/components/ui/BackButton'
import ThemeToggle from '@/components/ui/ThemeToggle'
import MultiplicadorX5 from './MultiplicadorX5'
import styles from "./page.module.css"
const indie = Indie_Flower({ subsets: ['latin'], weight: '400' })

export const metadata: Metadata = {
  title: 'Multiplicador x 5 | Multedu',
  description: 'Aprenda multiplicação por 5 usando a metodologia Trachtenberg com interatividade e feedback de moedas.',
  robots: 'index, follow',
  openGraph: {
    title: 'Multiplicador x 5 | Multedu',
    description: 'Método inovador para multiplicação por 5',
    type: 'website',
  },
}

export default function MultiplicadorX5Page() {
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
          className={`${indie.className} ${styles.gradientTitle} text-center font-bold leading-tight
          text-3xl sm:text-4xl lg:text-5xl`}
        >
          Multiplicação por 5 - Metodologia Trachtenberg
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 mt-10">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
            <MultiplicadorX5 />
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <h2 className="font-bold text-lg mb-3">Vídeo de apoio</h2>
              <div className="relative w-full overflow-hidden rounded-lg aspect-video">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/t5Tj47vdn9Y"
                  title="Multiplicação por 5 - Metodologia Trachtenberg"
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
                  <strong>1º Dígito:</strong> Se for par = 0, se ímpar = 5
                </p>
                <p>
                  <strong>Demais dígitos:</strong> Se ímpar +5, depois pegue a metade do vizinho à direita.
                </p>
                <p>
                  <strong>Observação:</strong> Arredonde a metade para baixo. Se o total {'>'} 9, some +1 ao próximo dígito.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
