"use client"

import { useEffect, useState } from "react"
import SomaVisual from "./SomaVisual"

type CDU = { c: number; d: number; u: number }

export default function SomaBox({
  value,
  onChange,
}: {
  value: CDU
  onChange: (v: CDU) => void
}) {
  const [input, setInput] = useState("")

  const formed = value.c * 100 + value.d * 10 + value.u
  const valid = input !== "" && Number(input) === formed

  useEffect(() => {
    setInput("")
  }, [value.c, value.d, value.u])

  return (<>
    <section className="w-72 rounded-2xl border-2 bg-white p-4 shadow">
      <div className="flex justify-center gap-3 mb-4">
        {(["c", "d", "u"] as const).map(k => (
          <div key={k} className="flex flex-col items-center">
            <label className="text-sm font-bold">
              {k === "c" ? "Centena" : k === "d" ? "Dezena" : "Unidade"}
            </label>
            <select
              value={value[k]}
              onChange={e =>
                onChange({ ...value, Number(e.target.value) })
              }
              className="rounded-md border p-1"
            >
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <SomaVisual c={value.c} d={value.d} u={value.u} />

      <div className="mt-4 flex flex-col items-center gap-2">
        <label className="font-bold">Número formado</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="w-24 rounded-md border p-1 text-center"
          />
          <span
            aria-live="polite"
            className={`text-xl font-bold ${
              input === ""
                ? ""
                : valid
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {input === "" ? "" : valid ? "✓" : "✗"}
          </span>
        </div>
      </div>
    </section>
    </>
  )
}