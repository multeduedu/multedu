import type { Metadata } from "next"
import SomaBox from "./SomaBox"
import SomaResultado from "./SomaResultado"

export const metadata: Metadata = {
  title: "Praticando Soma | CDU",
  description: "Pratique soma com centenas, dezenas e unidades",
}

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-center text-3xl font-bold mb-4">Praticando Soma</h1>

      <p className="mx-auto max-w-xl text-center text-slate-600 mb-8">
        Escolha centena, dezena e unidade, confira os números formados e resolva a soma.
      </p>

      <SomaResultado />
    </main>
  )
}