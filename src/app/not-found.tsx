"use client";

import DarkButton from "@/components/ui/DarkButton";
import { FiFrown } from "react-icons/fi";

export default function NotFound() {
  return (
    <main
      className="h-screen w-full bg-[url('/Home_Capa.avif')] bg-cover bg-center flex items-center justify-center p-4 overflow-hidden"
    >
      <div
        className="bg-[var(--color-background-secondary)]/85 backdrop-blur-md
        p-8 md:p-12 rounded-[30px]
        max-w-lg text-center shadow-xl
        "
      >
        <div className="text-[var(--color-primary)] text-6xl md:text-7xl mb-4 flex justify-center">
          <FiFrown />
        </div>

        <h1 className="text-6xl md:text-7xl font-extrabold text-[var(--color-text-secondary)] mb-4">
          404
        </h1>

        <h2 className="text-2xl md:text-3xl font-semibold text-[var(--color-text-secondary)] mb-6">
          Ops! Página não encontrada
        </h2>

        <p className="text-[var(--color-text-secondary)] mb-8 text-lg md:text-xl">
          A página que você está procurando não existe ou foi removida.
        </p>

        <DarkButton href="/">Voltar para a Home</DarkButton>
      </div>
    </main>
  );
}