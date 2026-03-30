import type { Metadata } from 'next'
import { Indie_Flower } from 'next/font/google'
import ThemeToggle from '@/components/ui/ThemeToggle'
import MultiplicadorX3 from './MultiplicadorX3'
import BackButton from '@/components/ui/BackButton'

const indie = Indie_Flower({ subsets: ['latin'], weight: '400' })

export const metadata: Metadata = {
  title: 'Multiplicação por 3 (Trachtenberg) | Treino',
  description: 'Treine multiplicação por 3 usando a metodologia Trachtenberg. Selecione dígitos, preencha o resultado e confira.',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Multiplicação por 3 (Trachtenberg) | Treino',
    description: 'Treine multiplicação por 3 usando a metodologia Trachtenberg. Selecione dígitos, preencha o resultado e confira.',
    type: 'website',
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
          className={`${indie.className} text-center font-bold leading-tight text-3xl sm:text-4xl lg:text-5xl`}
          style={{
            backgroundImage: 'linear-gradient(to right, #ff7f50, #ff6347)',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            textShadow: '1px 1px 2px var(--color-primary)',
          }}
        >
          Multiplicação por 3 – Metodologia Trachtenberg
        </h1>

        <p className="mt-4 text-center text-[var(--color-text-secondary)]">
          Selecione os dígitos do número, siga as dicas por dígito e digite o resultado.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px] items-start">
          <section
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]
            shadow-sm p-3 sm:p-6 mx-auto w-full"
            aria-label="Treino de multiplicação por 3"
          >
            <MultiplicadorX3 />
          </section>

          <aside
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]
            shadow-sm p-3 sm:p-6 w-full mx-auto"
            aria-label="Vídeo de apoio"
          >
            <h2 className="text-lg font-bold mb-3">Vídeo de apoio</h2>

            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[var(--color-border)]">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/VQy1dF8jrqA"
                title="Multiplicação por 3 - Metodologia Trachtenberg"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>

            <h3 className="text-lg font-bold mt-6 mb-3">Dica</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Pratique cada dígito seguindo a sequência correta. Use o botão de ajuda para revisar as regras de cada posição.
            </p>

            <h3 className="text-lg font-bold mt-6 mb-3">Regras do Método</h3>
            <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
              <div>
                <strong className="block text-[var(--color-text-primary)]">1º Dígito:</strong>
                Subtraír por 10, dobrar o valor, se impar adicionar +5
              </div>
              <div>
                <strong className="block text-[var(--color-text-primary)]">2º, 3º e 4º Dígitos:</strong>
                Subtraír por 9, dobrar e adicionar a metade do vizinho, se impar adicionar +5
              </div>
              <div>
                <strong className="block text-[var(--color-text-primary)]">5º Dígito:</strong>
                Pegar a metade do vizinho e subtraír 2
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
