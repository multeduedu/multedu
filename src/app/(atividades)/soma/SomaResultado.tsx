"use client"

import { useState } from "react"
import SomaBox from "./SomaBox"

type CDU = { c: number; d: number; u: number }

export default function SomaResultado() {
  const [boxes, setBoxes] = useState<CDU[]>(
    Array.from({ length: 3 }, () => ({ c: 0, d: 0, u: 0 }))
  )
  const [answer, setAnswer] = useState("")
  const [status, setStatus] = useState<"ok" | "error" | null>(null)

  const numbers = boxes.map(b => b.c * 100 + b.d * 10 + b.u)
  const total = numbers.reduce((a, b) => a + b, 0)

  function calculate() {
    setStatus(Number(answer) === total ? "ok" : "error")
  }

  function reset() {
    setBoxes(Array.from({ length: 3 }, () => ({ c: 0, d: 0, u: 0 })))
    setAnswer("")
    setStatus(null)
  }

  return (
    <>
      <div className="flex flex-wrap justify-center items-start gap-6 mb-10">
        {boxes.map((box, i) => (
          <SomaBox
            key={i}
            value={box}
            onChange={next =>
              setBoxes(prev => {
                const copy = [...prev]
                copy[i] = next
                return copy
              })
            }
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-4">
        <label htmlFor="total" className="font-bold">
          Seu resultado total
        </label>

        <input
          id="total"
          type="number"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          className="w-40 rounded-md border-2 border-blue-600 p-2 text-center text-lg"
        />

        <div className="flex gap-4">
          <button
            onClick={calculate}
            className="rounded-xl bg-green-600 px-6 py-3 font-bold text-white focus-visible:ring-2"
          >
            Somar
          </button>

          <button
            onClick={reset}
            className="rounded-xl bg-red-600 px-6 py-3 font-bold text-white focus-visible:ring-2"
          >
            Resetar
          </button>
        </div>

        {status && (
          <div
            role="status"
            aria-live="polite"
            className={`mt-4 w-full max-w-xl rounded-xl p-4 text-center font-bold ${
              status === "ok"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {numbers.map(n => String(n).padStart(3, "0")).join(" + ")} = {total}
            <div className="mt-2">
              {status === "ok"
                ? "Parabéns! Resultado correto."
                : `Resultado incorreto. O correto é ${total}.`}
            </div>
          </div>
        )}
      </div>
    </>
  )
}