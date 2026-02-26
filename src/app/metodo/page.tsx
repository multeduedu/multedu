"use client";

import { FaBrain, FaBolt, FaQuestionCircle } from "react-icons/fa";
import InfoCard from "@/components/ui/InfoCard";
import VoltarHomeButton from "@/components/ui/VoltarHome";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function NossoMetodo() {
  return (
    <main
      className="
        min-h-screen w-full
        bg-[var(--color-background)]
        text-[var(--color-text-primary)]
        transition-colors
        duration-300
        relative
      "
    >
      {/* Toggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20">

        {/* Voltar */}
        <VoltarHomeButton href="/">
          Voltar para Home
        </VoltarHomeButton>

        {/* HERO */}
        <section className="text-center mb-20">
          <span className="text-[var(--color-primary)] font-bold text-xs tracking-widest uppercase mb-3 block">
            Nosso Método
          </span>

          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            O Método de Trachtenberg
          </h1>

          <p className="text-md text-[var(--color-text-secondary)] leading-relaxed max-w-4xl mx-auto">
            No MultEdu, acreditamos que aprender matemática deve ser eficaz,
            envolvente e estimulante. Por isso, incorporamos o Método de
            Trachtenberg em nossa abordagem — uma técnica inovadora de cálculo
            mental que transforma a forma como as crianças interagem com os números.
          </p>
        </section>

        {/* CARDS */}
        <section className="flex flex-col gap-12">

          <div className="max-w-4xl mx-auto w-full">
            <InfoCard
              icon={<FaBrain size={22} />}
              title="O que é o Método de Trachtenberg?"
            >
              <p className="mb-4">
                Desenvolvido por Jakow Trachtenberg durante a Segunda Guerra Mundial,
                o método foi criado para permitir cálculos mentais rápidos utilizando
                regras simples e intuitivas.
              </p>

              <p>
                Ele fortalece o raciocínio lógico, desenvolve agilidade mental
                e promove confiança ao resolver problemas matemáticos,
                tornando a aprendizagem mais leve e acessível.
              </p>
            </InfoCard>
          </div>

          <div className="max-w-4xl mx-auto w-full">
            <InfoCard
              icon={<FaBolt size={22} />}
              title="Por que utilizamos no MultEdu?"
            >
              <ul className="space-y-2 text-[var(--color-text-secondary)]">
                <li>✔️ Desenvolve cálculo mental com rapidez</li>
                <li>✔️ Estimula autonomia e confiança</li>
                <li>✔️ Reduz bloqueios com matemática</li>
                <li>✔️ Torna o aprendizado mais dinâmico</li>
                <li>✔️ Complementa o ensino tradicional</li>
              </ul>
            </InfoCard>
          </div>

          <div className="max-w-4xl mx-auto w-full">
            <InfoCard
              icon={<FaQuestionCircle size={22} />}
              title="Perguntas Frequentes"
            >
              <div className="space-y-6">

                <details className="group cursor-pointer">
                  <summary className="font-semibold text-[var(--color-text-primary)]">
                    O método substitui o ensino tradicional?
                  </summary>
                  <p className="mt-2 text-[var(--color-text-secondary)]">
                    Não. Ele complementa o ensino tradicional.
                  </p>
                </details>

                <details className="group cursor-pointer">
                  <summary className="font-semibold text-[var(--color-text-primary)]">
                    É indicado para qual idade?
                  </summary>
                  <p className="mt-2 text-[var(--color-text-secondary)]">
                    Pode ser aplicado a partir do ensino fundamental.
                  </p>
                </details>

                <details className="group cursor-pointer">
                  <summary className="font-semibold text-[var(--color-text-primary)]">
                    Ajuda crianças com dificuldade?
                  </summary>
                  <p className="mt-2 text-[var(--color-text-secondary)]">
                    Sim. Trabalha lógica e confiança.
                  </p>
                </details>

              </div>
            </InfoCard>
          </div>

        </section>
      </div>
    </main>
  );
}