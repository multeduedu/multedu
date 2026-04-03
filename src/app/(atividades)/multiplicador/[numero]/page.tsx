import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { DadosMultiplicadores } from "@/data/multiplicadores";
import Multiplicador from "./Multiplicador";

type Props = {
  params: Promise<{ numero: string }>;
};

export default async function MultiplicadorPage({ params }: Props) {
  const { numero } = await params;
  const multiplicadorNum = Number(numero);

  if (Number.isNaN(multiplicadorNum)) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
            ⚠️ Número Inválido
          </h1>
          <p className="text-[var(--color-text-secondary)] mb-6">
            O parâmetro na URL não é um número válido.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
          >
            <FiArrowLeft /> Voltar
          </Link>
        </div>
      </main>
    );
  }

  const dadosMult = DadosMultiplicadores.find(
    (d) => d.multiplicador === multiplicadorNum
  );

  if (!dadosMult) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
            ❌ Multiplicador Não Encontrado
          </h1>
          <p className="text-[var(--color-text-secondary)] mb-4">
            Desculpe, não temos dados para multiplicação por <strong>{numero}</strong>.
          </p>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            Os multiplicadores disponíveis são: 2, 3, 4, 5, 6, 7, 8, 9 e 11.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
          >
            <FiArrowLeft /> Voltar
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-background)] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
          >
            <FiArrowLeft /> Voltar
          </Link>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-2">
            Método Trachtenberg × {dadosMult.multiplicador}
          </h1>

          {dadosMult.descricao && (
            <p className="text-[var(--color-text-secondary)] mb-6">
              {dadosMult.descricao}
            </p>
          )}

          <Multiplicador dadosMult={dadosMult} />
        </div>
      </div>
    </main>
  );
}
