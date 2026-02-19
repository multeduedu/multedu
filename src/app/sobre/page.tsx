"use client";

import Link from "next/link";
import Image from "next/image";
import {
    FiArrowLeft,
    FiSmile,
    FiZap,
    FiTarget,
    FiGlobe,
    FiCpu,
} from "react-icons/fi";
import InfoCard from "@/components/InfoCard";
import VoltarHomeButton from "@/components/VoltarHome";

export default function SobrePage() {
    return (
        <main className="min-h-screen w-full bg-gray-100">
            <div className="max-w-6xl mx-auto px-6 py-20">

                {/* Botão Voltar */}
                <VoltarHomeButton href="/">Voltar para Home</VoltarHomeButton>

                {/* HERO */}
                <section className="flex flex-col md:flex-row items-center md:items-center gap-8 mb-16">

                    {/* TEXTO */}
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight text-gray-900">
                            Sobre o MultEdu
                        </h1>

                        <p className="text-gray-700 text-lg leading-relaxed">
                            O MultEdu foi criado para transformar o aprendizado da matemática
                            em uma experiência divertida, interativa e acessível para
                            crianças do ensino fundamental I. Por meio de jogos educativos,
                            estimulamos o raciocínio lógico e tornamos o processo de
                            aprendizagem mais envolvente e eficaz.
                        </p>
                    </div>

                    {/* LOGO */}
                    <div className="md:ml-4">
                        <Image
                            src="/logo.png"
                            alt="Logo MultEdu"
                            width={250}
                            height={150}
                            priority
                            className="object-contain"
                        />
                    </div>

                </section>

                {/* CARDS */}
                <section className="grid md:grid-cols-2 gap-8">

                    <InfoCard icon={<FiSmile size={24} />} title="Aprendizado Lúdico">
                        Transformamos o aprendizado em uma aventura, incentivando
                        participação ativa e tornando a matemática mais divertida.
                    </InfoCard>

                    <InfoCard icon={<FiTarget size={24} />} title="Interatividade">
                        As crianças escolhem entre três carros que avançam conforme
                        seus acertos, tornando o aprendizado dinâmico e estimulante.
                    </InfoCard>

                    <InfoCard icon={<FiZap size={24} />} title="Feedback Imediato">
                        O retorno instantâneo ajuda os alunos a identificar pontos
                        de melhoria e reforçar o conhecimento.
                    </InfoCard>

                    <InfoCard icon={<FiGlobe size={24} />} title="Acessibilidade">
                        Acesso ao conteúdo a qualquer hora e lugar, respeitando o
                        ritmo individual de cada criança.
                    </InfoCard>

                    <InfoCard icon={<FiCpu size={24} />} title="Desenvolvimento Cognitivo" colSpan>
                        Desenvolvemos raciocínio lógico e resolução de problemas,
                        promovendo um aprendizado completo e eficaz.
                    </InfoCard>

                </section>

            </div>
        </main>
    );
}
