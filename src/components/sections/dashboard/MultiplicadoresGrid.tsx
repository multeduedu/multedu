"use client";

import { DadosMultiplicadores } from "@/data/multiplicadores";
import { CardMultiplicador } from "./CardMultiplicador";

export function MultiplicadoresGrid() {
  return (
    <section className="w-full">
      <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-6">
        🧮 Método Trachtenberg
      </h2>
      
      <p className="text-[var(--color-text-secondary)] mb-8">
        Escolha um multiplicador para treinar o método de cálculo rápido:
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {DadosMultiplicadores.map((dados) => (
          <CardMultiplicador
            key={dados.multiplicador}
            multiplicador={dados.multiplicador}
            descricao={dados.descricao}
          />
        ))}
      </div>
    </section>
  );
}
