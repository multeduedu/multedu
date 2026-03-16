"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Swal from "sweetalert2"
import { useSound } from "@/hooks/useSound"
import type { MultiplicadorData } from "../../../../data/multiplicadores";
import type { DigitIndex } from "../../../../data/multiplicadores"

type Props = {
  dadosMult: MultiplicadorData;
};

function onlyOneDigit(v: string) {
  return v.replace(/\D/g, "").slice(0, 1)
}

const swalBase = {
  buttonsStyling: false,
  customClass: {
    popup:
      "rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)]",
    title: "text-[var(--color-text-primary)]",
    htmlContainer: "text-[var(--color-text-secondary)]",
    confirmButton:
      "cursor-pointer rounded-xl px-4 py-2 font-bold bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
  },
} as const

export default function Multiplicador( { dadosMult } : Props ) {
  const clickSound = useSound("/sounds/click-button.mp3")
  const actionSound = useSound("/sounds/button-305770.mp3")

  const [selects, setSelects] = useState<string[]>(["0", "0", "0", "0", "0"]) // [s5,s4,s3,s2,s1]
  const [inputs, setInputs] = useState<string[]>(["", "", "", "", ""]) // [i5,i4,i3,i2,i1]
  const [radio, setRadio] = useState<DigitIndex | null>(null)
  const [helpDigit, setHelpDigit] = useState<DigitIndex | null>(null)
  const [helpOpen, setHelpOpen] = useState(true)

  const rowRef = useRef<HTMLDivElement | null>(null)
  const arrowRef = useRef<HTMLDivElement | null>(null)
  const selectRefs = useRef<Record<string, HTMLSelectElement | null>>({
    select1: null,
    select2: null,
    select3: null,
    select4: null,
    select5: null,
  })

  const digits = useMemo(() => Array.from({ length: 10 }, (_, i) => String(i)), [])

  useEffect(() => {
    setSelects((prev) => {
      const next = [...prev]
      next[0] = "0"
      return next
    })
  }, [])

  function setSelect(pos: number, value: string) {
    setSelects((prev) => {
      const next = [...prev]
      next[pos] = value
      return next
    })
  }

  function setInput(pos: number, value: string) {
    const cleaned = onlyOneDigit(value)
    setInputs((prev) => {
      const next = [...prev]
      next[pos] = cleaned
      return next
    })
  }

  function getNumeroOriginal(): string {
    return selects.join("")
  }

  function getNumeroDigitado(): string {
    return inputs.join("")
  }

  function normalizeNumberString(n: string) {
    const stripped = n.replace(/^0+/, "")
    return stripped.length ? stripped : "0"
  }

  function showArrowForDigit(digit: DigitIndex) {
    const map: Record<DigitIndex, string> = {
      1: "select1",
      2: "select2",
      3: "select3",
      4: "select4",
      5: "select5",
    }

    const targetId = map[digit]
    const target = selectRefs.current[targetId]
    const row = rowRef.current
    const arrow = arrowRef.current

    if (!target || !row || !arrow) return

    const targetRect = target.getBoundingClientRect()
    const rowRect = row.getBoundingClientRect()

    const left = targetRect.left - rowRect.left + targetRect.width / 2
    arrow.style.left = `${left}px`
    arrow.style.opacity = "1"

    window.setTimeout(() => {
      arrow.style.opacity = "0"
    }, 4500)
  }

  function abrirAjuda(digit : DigitIndex){
    setHelpOpen(true)
    setHelpDigit(digit)

  }

   function mostrarAjuda(digit: DigitIndex) {
    clickSound.play()
    setRadio(digit)
    abrirAjuda(digit)

    showArrowForDigit(digit)
  }

  function conferir() {
    actionSound.play()

    const numeroOriginal = getNumeroOriginal()
    const numeroDigitado = getNumeroDigitado()

    if (!normalizeNumberString(numeroDigitado) || normalizeNumberString(numeroDigitado) === "0") {
      Swal.fire({
        ...swalBase,
        title: "⚠️ Aviso",
        text: "Digite sua resposta nos campos abaixo.",
        icon: "warning",
        confirmButtonText: "Ok",
      })
      return
    }

    const numeroConvertido = Number(numeroOriginal)
    if (Number.isNaN(numeroConvertido)) {
      Swal.fire({
        ...swalBase,
        title: "Erro",
        text: "Valor inválido nos seletores. Certifique-se de que são números.",
        icon: "error",
        confirmButtonText: "Ok",
      })
      return
    }

    const resultadoCorreto = String(numeroConvertido * Number(dadosMult.multiplicador))

    const a = normalizeNumberString(numeroDigitado)
    const b = normalizeNumberString(resultadoCorreto)

    if (a === b) {
      Swal.fire({
        ...swalBase,
        title: "✅ Acertou!",
        text: `A multiplicação de ${numeroOriginal} × ${dadosMult.multiplicador} é: ${resultadoCorreto}`,
        icon: "success",
        confirmButtonText: "Boa!",
      })
    } else {
      Swal.fire({
        ...swalBase,
        title: "❌ Errou!",
        text: `Sua resposta (${numeroDigitado}) está incorreta.\nO resultado correto de ${numeroOriginal} × ${dadosMult.multiplicador} é: ${resultadoCorreto}`,
        icon: "error",
        confirmButtonText: "Entendi",
      })
    }
  }

  function pegarNumAleatorio(){
    setSelects(prev =>{
      const next = [... prev]
      next[0] = "0"
      for(let i = 1; i < next.length; i++){
        next[i] = String(Math.floor(Math.random()*10))
      }
      return next
    })
  }

  function limpar() {
    actionSound.play()

    setSelects(["0", "0", "0", "0", "0"])
    setInputs(["", "", "", "", ""])
    setRadio(null)

    Swal.fire({
      ...swalBase,
      title: "🧹 Limpo!",
      text: "Todos os valores foram limpos",
      icon: "info",
      confirmButtonText: "Ok",
    })
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="sr-only">Treino de multiplicação por {dadosMult.multiplicador}</h2>

      <div className="w-full">
        <h3 className="text-center font-bold text-lg sm:text-xl mb-4">
          Selecione os números e digite os dígitos do resultado:
        </h3>
        
        <div className="w-full overflow-x-auto overflow-y-hidden [-webkit-overflow-scrolling:touch] mb-6">
          <div
            ref={rowRef}
            className="relative flex flex-nowrap items-center justify-center gap-0.5 sm:gap-4 pt-10 pb-2 min-w-max px-2"
            aria-label="Seletores de dígitos do número"
          >
            <div
              ref={arrowRef}
              aria-hidden="true"
              className="pointer-events-none absolute top-2 transition-opacity duration-300"
              style={{ opacity: 0, transform: "translateX(-50%)" }}
            >
              <span className="text-3xl">⬇️</span>
            </div>

            <select
              ref={(el) => {
                selectRefs.current.select5 = el
              }}
              disabled
              value={selects[0]}
              onChange={(e) => setSelect(0, e.target.value)}
              className="cursor-not-allowed h-8 sm:h-11 w-[42px] sm:w-[76px] rounded-lg text-center font-bold text-sm sm:text-lg
              bg-gray-400 text-white
              border border-[var(--color-border)]
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
              disabled:opacity-80"
              aria-label="5º dígito do número (fixo)"
            >
              <option value="0">0</option>
            </select>

            {[
              { id: "select4", idx: 1, bg: "bg-green-600 text-white" },
              { id: "select3", idx: 2, bg: "bg-green-600 text-white" },
              { id: "select2", idx: 3, bg: "bg-green-600 text-white" },
              { id: "select1", idx: 4, bg: "bg-green-600 text-white" },
            ].map((s) => (
              <select
                key={s.id}
                ref={(el) => {
                  selectRefs.current[s.id] = el
                }}
                value={selects[s.idx]}
                onChange={(e) => setSelect(s.idx, e.target.value)}
                className={`cursor-pointer h-8 sm:h-11 w-[42px] sm:w-[76px] rounded-lg text-center font-bold text-sm sm:text-lg
                ${s.bg}
                border border-[var(--color-border)]
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]`}
                aria-label={`${s.id.replace("select", "")}º dígito do número`}
              >
                {digits.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            ))}

            <span className="ml-0.5 font-bold text-sm sm:text-xl" aria-label={`multiplicado por ${dadosMult.multiplicador}`}>
            X {dadosMult.multiplicador}
            </span>
          </div>
        </div>

        <div className="w-full overflow-x-auto overflow-y-hidden [-webkit-overflow-scrolling:touch] mb-6">
          <fieldset>
            <legend className="sr-only">Digite o resultado (5 dígitos)</legend>

            <div className="flex flex-nowrap items-center justify-center gap-0.5 sm:gap-4 min-w-max px-2 py-2">
            <DigitInput
              label="5º dígito do resultado"
              placeholder="5º"
              value={inputs[0]}
              onChange={(v) => setInput(0, v)}
              onSound={() => clickSound.play()}
              onFocus={() => abrirAjuda(5)}

            />

            <RadioDigitInput
              label="4º dígito do resultado"
              placeholder="4º"
              checked={radio === 4}
              onRadio={() => {
                clickSound.play()
                setRadio(4)
              }}
              value={inputs[1]}
              onChange={(v) => setInput(1, v)}
              onSound={() => clickSound.play()}
              onFocus={() => abrirAjuda(4)}

            />

            <RadioDigitInput
              label="3º dígito do resultado"
              placeholder="3º"
              checked={radio === 3}
              onRadio={() => {
                clickSound.play()
                setRadio(3)
              }}
              value={inputs[2]}
              onChange={(v) => setInput(2, v)}
              onSound={() => clickSound.play()}
              onFocus={() => abrirAjuda(3)}
              />

            <RadioDigitInput
              label="2º dígito do resultado"
              placeholder="2º"
              checked={radio === 2}
              onRadio={() => {
                clickSound.play()
                setRadio(2)
              }}
              value={inputs[3]}
              onChange={(v) => setInput(3, v)}
              onSound={() => clickSound.play()}
              onFocus={() => abrirAjuda(2)}
            />

              <DigitInput
                label="1º dígito do resultado"
                placeholder="1º"
                value={inputs[4]}
                onChange={(v) => setInput(4, v)}
                onSound={() => clickSound.play()}
                onFocus={() => abrirAjuda(1)}
              />
            </div>
          </fieldset>
        </div>


      <div className="mt-8 w-full max-w-xl mx-auto">

        <div className="border border-[var(--color-border)] rounded-xl overflow-hidden">

          <div className="flex justify-between items-center px-4 py-2 bg-[var(--color-surface)]">

            <span className="font-bold">
              Passo a passo para resolver
            </span>

            <button
              onClick={() => setHelpOpen(!helpOpen)}
              className="text-sm font-bold cursor-pointer"
            >
              {helpOpen ? "-" : "+"}
            </button>

          </div>

          {helpOpen && (
            <>
              <div className="flex border-t border-[var(--color-border)]">

                {[5,4,3,2,1].map((d)=>(
                  <button
                    key={d}
                    onClick={()=>setHelpDigit(d as DigitIndex)}
                    className={`cursor-pointer flex-1 py-2 text-sm font-bold
                    border-r border-[var(--color-border)]
                    ${helpDigit===d ? "bg-[var(--color-primary)] text-white" : ""}`}
                  >
                    {d}º dígito
                  </button>
                ))}

              </div>

              <div className="p-4 text-[var(--color-text-secondary)] min-h-[120px]">

                {helpDigit === null ? (
                  <span className="italic">
                    Clique na primeira caixa de texto para começar.
                  </span>
                ) : (
                  dadosMult.helpText[helpDigit]
                )}

              </div>

            </>
          )}

        </div>

      </div>



        <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3">
          <button
            type="button"
            onClick={conferir}
            className="cursor-pointer inline-flex items-center justify-center rounded-xl px-5 py-3 font-bold
            bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          >
            Conferir
          </button>

          <button
            type="button"
            onClick={limpar}
            className="cursor-pointer inline-flex items-center justify-center rounded-xl px-5 py-3 font-bold
            bg-[var(--color-surface)] text-[var(--color-text-primary)]
            border border-[var(--color-border)]
            hover:bg-[var(--color-card)]
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          >
            Limpar
          </button>

          <button
            type="button"
            onClick={pegarNumAleatorio}
            className="cursor-pointer inline-flex items-center justify-center rounded-xl px-5 py-3 font-bold
            bg-[var(--color-surface)] text-[var(--color-text-primary)]
            border border-[var(--color-border)]
            hover:bg-[var(--color-card)]
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          >
            Aleatório
          </button>
        </div>

        <div className="mt-5 text-center text-sm text-[var(--color-text-secondary)]">
          <span className="font-semibold">Número atual:</span>{" "}
          <span className="font-mono">{getNumeroOriginal()}</span>
        </div>
      </div>



    </div>
  )
}

function DigitInput(props: {
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  onSound?: () => void
  onFocus?: () => void
}) {
  return (
    <div className="flex flex-col items-center gap-2 shrink-0">
      <label className="sr-only">{props.label}</label>
      <input
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        onClick={() => props.onSound?.()}
        onFocus={props.onFocus}
        placeholder={props.placeholder}
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={1}
        className="cursor-pointer h-11 sm:h-14 w-[50px] sm:w-[84px]
        rounded-xl text-center text-lg sm:text-2xl font-extrabold
        bg-[var(--color-surface)] text-[var(--color-text-primary)]
        border border-[var(--color-border)]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        aria-label={props.label}
      />
    </div>
  )
}

function RadioDigitInput(props: {
  label: string
  placeholder: string
  checked: boolean
  onRadio: () => void
  value: string
  onChange: (value: string) => void
  onSound?: () => void
  onFocus: () => void
}) {
  return (
    <div className="flex flex-col items-center gap-2 shrink-0">
      <span className="sr-only">{props.label}</span>

      <div className="flex items-center justify-center gap-0.5">
        <input
          type="radio"
          name="digitSelector"
          checked={props.checked}
          onChange={props.onRadio}
          className="cursor-pointer h-3.5 w-3.5 sm:h-5 sm:w-5 accent-[var(--color-primary)]
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          aria-label={`Selecionar ${props.label}`}
        />

        <input
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          onClick={() => props.onSound?.()}
          onFocus={props.onFocus}
          placeholder={props.placeholder}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          className="cursor-pointer h-11 sm:h-14 w-[50px] sm:w-[84px]
          rounded-xl text-center text-lg sm:text-2xl font-extrabold
          bg-[var(--color-surface)] text-[var(--color-text-primary)]
          border border-[var(--color-border)]
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          aria-label={props.label}
        />
      </div>


    </div>
  )
}