"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Swal from "sweetalert2"
import { useSound } from "@/hooks/useSound"
import { addCoins } from "@/actions/auth"
import { CoinAnimation } from "@/components/ui/CoinAnimation"

type DigitIndex = 1 | 2 | 3 | 4 | 5

const HELP_TEXT: Record<DigitIndex, string> = {
  1: "Primeiro dígito: Subtraia de 10 e dobre.",
  2: "Segundo dígito: Subtraia de 9, dobre o resultado e adicione o vizinho à direita. Se maior que 9, some +1 ao próximo dígito.",
  3: "Terceiro dígito: Subtraia de 9, dobre o resultado e adicione o vizinho à direita. Se maior que 9, some +1 ao próximo dígito.",
  4: "Quarto dígito: Subtraia de 9, dobre o resultado e adicione o vizinho à direita. Se maior que 9, some +1 ao próximo dígito.",
  5: "Quinto dígito: Subtraia 2 do vizinho à direita.",
}

function onlyOneDigit(v: string) {
  return v.replace(/\D/g, "").slice(0, 1)
}

function normalizeNumberString(str: string): string {
  const trimmed = str.replace(/^0+/, "") || "0"
  return trimmed
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

export default function MultiplicadorX8() {
  const clickSound = useSound("/sounds/click-button.mp3")
  const actionSound = useSound("/sounds/button-305770.mp3")

  const [selects, setSelects] = useState<string[]>(["0", "0", "0", "0", "0"])
  const [inputs, setInputs] = useState<string[]>(["", "", "", "", ""])
  const [radio, setRadio] = useState<DigitIndex | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [solvedQuestions, setSolvedQuestions] = useState<Set<string>>(new Set())
  const [showCoinAnimation, setShowCoinAnimation] = useState(false)

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

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isProcessing) {
        event.preventDefault()
        event.returnValue = ''
      }
    }

    const handleUnload = () => {}

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('unload', handleUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('unload', handleUnload)
    }
  }, [isProcessing])

  useEffect(() => {
    if (showCoinAnimation) {
      const timer = setTimeout(() => {
        setShowCoinAnimation(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showCoinAnimation])

  function setSelect(idx: number, value: string) {
    setSelects((prev) => {
      const next = [...prev]
      next[idx] = value
      return next
    })
  }

  function updateInput(idx: number, value: string) {
    const sanitized = onlyOneDigit(value)
    setInputs((prev) => {
      const next = [...prev]
      next[idx] = sanitized
      return next
    })
  }

  function showArrowForDigit(digitIdx: DigitIndex) {
    if (!arrowRef.current) return

    arrowRef.current.style.opacity = "1"
    const timeout = setTimeout(() => {
      if (arrowRef.current) {
        arrowRef.current.style.opacity = "0"
      }
    }, 4500)

    return () => clearTimeout(timeout)
  }

  function handleHelp(digit: DigitIndex) {
    clickSound.play()
    showArrowForDigit(digit)

    Swal.fire({
      ...swalBase,
      title: `📌 Ajuda: ${digit}º Dígito`,
      text: HELP_TEXT[digit],
      icon: "info",
      confirmButtonText: "Entendi!",
    })
  }

  function handleRadioChange(digit: DigitIndex) {
    setRadio(digit)
    clickSound.play()
    showArrowForDigit(digit)
  }

  async function handleSubmit() {
    if (isProcessing) return
    setIsProcessing(true)

    try {
      actionSound.play()

      const userAnswer = inputs.join("")
      const correctAnswer = String(Number(selects.join("")) * 8)

      const userAnswerNormalized = normalizeNumberString(userAnswer)
      const correctAnswerNormalized = normalizeNumberString(correctAnswer)

      const questionKey = `x8_${selects.join("")}`

      if (userAnswerNormalized === correctAnswerNormalized) {
        actionSound.play()

        if (!solvedQuestions.has(questionKey)) {
          setSolvedQuestions((prev) => new Set([...prev, questionKey]))
          setShowCoinAnimation(true)
          await addCoins(10)
        }

        Swal.fire({
          ...swalBase,
          title: "✅ Acertou!",
          html: `A multiplicação de <strong>${selects.join("")}</strong> × 8 é: <strong>${correctAnswer}</strong>`,
          icon: "success",
          confirmButtonText: "Ótimo!",
        })
      } else {
        Swal.fire({
          ...swalBase,
          title: "❌ Errou!",
          html: `Sua resposta (<strong>${userAnswer}</strong>) está incorreta.<br>O resultado correto de <strong>${selects.join("")}</strong> × 8 é: <strong>${correctAnswer}</strong>`,
          icon: "error",
          confirmButtonText: "Tentar Novamente",
        })
      }
    } finally {
      setIsProcessing(false)
    }
  }

  function handleClear() {
    setSelects(["0", "0", "0", "0", "0"])
    setInputs(["", "", "", "", ""])
    setRadio(null)
    if (arrowRef.current) arrowRef.current.style.display = "none"
    Swal.fire({
      ...swalBase,
      title: "🧹 Limpo!",
      html: "Todos os valores foram limpos.",
      icon: "info",
    })
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="sr-only">Treino de multiplicação por 8</h2>

      {showCoinAnimation && <CoinAnimation amount={10} />}

      <div className="w-full">
        <h3 className="text-center font-bold text-lg sm:text-xl mb-4">
          Selecione os números e digite os dígitos do resultado:
        </h3>

        <div className="w-full overflow-x-auto overflow-y-hidden [-webkit-overflow-scrolling:touch] mb-6">
          <div className="mx-auto flex flex-nowrap justify-center gap-0.5 sm:gap-4 min-w-max px-2 py-1">
            {[5, 4, 3, 2, 1].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => handleHelp(n as DigitIndex)}
                className="shrink-0 cursor-pointer rounded-lg px-1.5 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-base font-bold
                bg-[var(--color-button-dark)] text-white
                hover:bg-[var(--color-button-dark-hover)]
                border border-[var(--color-border)]
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              >
                {n}º Dígito
              </button>
            ))}
          </div>
        </div>

        <div className="w-full overflow-x-auto overflow-y-hidden [-webkit-overflow-scrolling:touch] mb-6">
          <div
            ref={rowRef}
            className="relative flex flex-nowrap items-center justify-center gap-0.5 sm:gap-4 pt-10 pb-2 min-w-max px-2"
            aria-label="Seletores de dígitos do número"
          >
            <div
              ref={arrowRef}
              aria-hidden="true"
              className="pointer-events-none absolute -left-12 top-2 z-50 text-3xl transition-opacity duration-300 opacity-0"
            >
              ⬅️
            </div>

            <select
              ref={(el) => {
                selectRefs.current.select5 = el
              }}
              disabled
              value={selects[0]}
              onChange={(e) => setSelect(0, e.target.value)}
              className="cursor-pointer h-8 sm:h-11 w-[42px] sm:w-[76px] rounded-lg text-center font-bold text-sm sm:text-lg
              bg-red-600 text-white
              border border-[var(--color-border)]
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
              disabled:opacity-80"
              aria-label="5º dígito do número (fixo)"
            >
              <option value="0">0</option>
            </select>

            {[
              { id: "select1", idx: 1, bg: "bg-cyan-500 text-white" },
              { id: "select2", idx: 2, bg: "bg-blue-600 text-white" },
              { id: "select3", idx: 3, bg: "bg-green-600 text-white" },
              { id: "select4", idx: 4, bg: "bg-yellow-400 text-black" },
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

            <span className="ml-0.5 font-bold text-sm sm:text-xl" aria-label="multiplicado por 8">
              ×8
            </span>
          </div>
        </div>

        <fieldset>
          <legend className="sr-only">Digite o resultado (5 dígitos)</legend>

          <div className="flex flex-nowrap items-center justify-center gap-0.5 sm:gap-4 min-w-max px-2 py-2">
            <DigitInput
              label="5º dígito do resultado"
              placeholder="5º"
              value={inputs[0]}
              onChange={(v) => updateInput(0, v)}
              onSound={() => clickSound.play()}
            />

            <RadioDigitInput
              label="4º dígito do resultado"
              placeholder="4º"
              checked={radio === 4}
              onRadio={() => {
                clickSound.play()
                handleRadioChange(4)
              }}
              value={inputs[1]}
              onChange={(v) => updateInput(1, v)}
              onSound={() => clickSound.play()}
            />

            <RadioDigitInput
              label="3º dígito do resultado"
              placeholder="3º"
              checked={radio === 3}
              onRadio={() => {
                clickSound.play()
                handleRadioChange(3)
              }}
              value={inputs[2]}
              onChange={(v) => updateInput(2, v)}
              onSound={() => clickSound.play()}
            />

            <RadioDigitInput
              label="2º dígito do resultado"
              placeholder="2º"
              checked={radio === 2}
              onRadio={() => {
                clickSound.play()
                handleRadioChange(2)
              }}
              value={inputs[3]}
              onChange={(v) => updateInput(3, v)}
              onSound={() => clickSound.play()}
            />

            <DigitInput
              label="1º dígito do resultado"
              placeholder="1º"
              value={inputs[4]}
              onChange={(v) => updateInput(4, v)}
              onSound={() => clickSound.play()}
            />
          </div>
        </fieldset>

        <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isProcessing}
            className={`cursor-pointer inline-flex items-center justify-center rounded-xl px-5 py-3 font-bold
            ${isProcessing 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]'
            } text-white
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]`}
          >
            {isProcessing ? 'Processando...' : 'Conferir'}
          </button>

          <button
            type="button"
            onClick={handleClear}
            className={`cursor-pointer inline-flex items-center justify-center rounded-xl px-5 py-3 font-bold
            bg-[var(--color-surface)] text-[var(--color-text-primary)]
            border border-[var(--color-border)]
            hover:bg-[var(--color-card)]
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]`}
          >
            Limpar
          </button>
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
}) {
  return (
    <div className="flex flex-col items-center gap-2 shrink-0">
      <label className="sr-only">{props.label}</label>
      <input
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        onClick={() => props.onSound?.()}
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
