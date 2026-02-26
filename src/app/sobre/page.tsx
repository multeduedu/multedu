"use client";

import Image from "next/image";
import {
  FiSmile,
  FiZap,
  FiTarget,
  FiGlobe,
  FiCpu,
} from "react-icons/fi";
import InfoCard from "@/components/ui/InfoCard";
import VoltarHomeButton from "@/components/ui/VoltarHome";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function SobrePage() {
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
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20">

        <VoltarHomeButton href="/">
          Voltar para Home
        </VoltarHomeButton>

        <section className="flex flex-col md:flex-row items-center gap-10 mb-20">

          <div className="max-w-2xl">
            <span className="text-[var(--color-primary)] font-bold text-xs tracking-widest uppercase mb-3 block">
              Sobre
            </span>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Sobre o MultEdu
            </h1>

            <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed">
              O MultEdu foi criado para transformar o aprendizado da matemática
              em uma experiência divertida, interativa e acessível para
              crianças do ensino fundamental I. Por meio de jogos educativos,
              estimulamos o raciocínio lógico e tornamos o processo de
              aprendizagem mais envolvente e eficaz.
            </p>
          </div>

          <div className="md:ml-4 flex justify-center">
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm transition-colors">
              <Image
                src="/logo.png"
                alt="Logo MultEdu"
                width={250}
                height={150}
                priority
                className="object-contain"
              />
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-8">

          <InfoCard
            icon={<FiSmile size={24} />}
            title="Aprendizado Lúdico"
          >
            Transformamos o aprendizado em uma aventura, incentivando
            participação ativa e tornando a matemática mais divertida.
          </InfoCard>

          <InfoCard
            icon={<FiTarget size={24} />}
            title="Interatividade"
          >
            As crianças escolhem entre três carros que avançam conforme
            seus acertos, tornando o aprendizado dinâmico e estimulante.
          </InfoCard>

          <InfoCard
            icon={<FiZap size={24} />}
            title="Feedback Imediato"
          >
            O retorno instantâneo ajuda os alunos a identificar pontos
            de melhoria e reforçar o conhecimento.
          </InfoCard>

          <InfoCard
            icon={<FiGlobe size={24} />}
            title="Acessibilidade"
          >
            Acesso ao conteúdo a qualquer hora e lugar, respeitando o
            ritmo individual de cada criança.
          </InfoCard>

          <InfoCard
            icon={<FiCpu size={24} />}
            title="Desenvolvimento Cognitivo"
            colSpan
          >
            Desenvolvemos raciocínio lógico e resolução de problemas,
            promovendo um aprendizado completo e eficaz.
          </InfoCard>

        </section>
      </div>
    </main>
  );
}