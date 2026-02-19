"use client";

import Link from "next/link";
import { FaBrain, FaBolt, FaQuestionCircle } from "react-icons/fa";
import InfoCard from "@/components/InfoCard";
import VoltarHomeButton from "@/components/VoltarHome";

export default function NossoMetodo() {
    return (
        <main className="min-h-screen w-full bg-gray-100">
            <div className="max-w-6xl mx-auto px-6 py-20">

                {/* BOTÃO VOLTAR */}
                <VoltarHomeButton href="/">Voltar para Home</VoltarHomeButton>

                {/* HERO */}
                <section className="text-center mb-16">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        O Método de Trachtenberg
                    </h1>

                    <p className="text-md text-gray-700 leading-relaxed max-w-4xl mx-auto">
                        No MultEdu, acreditamos que aprender matemática deve ser eficaz,
                        envolvente e estimulante. Por isso, incorporamos o Método de
                        Trachtenberg em nossa abordagem — uma técnica inovadora de cálculo
                        mental que transforma a forma como as crianças interagem com os números.
                    </p>
                </section>

                {/* CARDS PADRÃO SOBRE */}
                <section className="flex flex-col gap-10">

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
                            <ul className="space-y-2 list-none">
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
                            <div className="space-y-4">
                                <details className="cursor-pointer">
                                    <summary className="font-semibold text-gray-900">
                                        O método substitui o ensino tradicional?
                                    </summary>
                                    <p className="mt-2">
                                        Não. Ele complementa o ensino tradicional.
                                    </p>
                                </details>

                                <details className="cursor-pointer">
                                    <summary className="font-semibold text-gray-900">
                                        É indicado para qual idade?
                                    </summary>
                                    <p className="mt-2">
                                        Pode ser aplicado a partir do ensino fundamental.
                                    </p>
                                </details>

                                <details className="cursor-pointer">
                                    <summary className="font-semibold text-gray-900">
                                        Ajuda crianças com dificuldade?
                                    </summary>
                                    <p className="mt-2">
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
