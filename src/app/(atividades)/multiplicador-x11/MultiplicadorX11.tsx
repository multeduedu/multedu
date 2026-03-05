"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Swal from "sweetalert2"
import { useSound } from "@/hooks/useSound"
import { addCoins } from "@/actions/auth"
import { CoinAnimation } from "@/components/ui/CoinAnimation"

type DigitIndex = 1 | 2 | 3 | 4 | 5

const HELP_TEXT: Record<DigitIndex, string> = {
  1: "Mantenha o primeiro valor (da direita) e coloque na caixa.",
  2: "Somar o 1º valor (da direita) ao 2º valor e coloque na caixa. Se a soma for 10 ou mais, guarde a dezena e coloque apenas a unidade.",
  3: "Somar o 2º valor ao 3º valor e coloque na caixa. Some a dezena guardada (se houver). Se o total for 10 ou mais, guarde a nova dezena.",
  4: "Somar o 3º valor ao 4º valor e coloque na caixa. Some a dezena guardada (se houver). Se o total for 10 ou mais, guarde a nova dezena.",
  5: "Somar o 4º valor ao 5º valor e coloque na caixa. Some a dezena guardada (se houver). Se o total for 10 ou mais, coloque a dezena na próxima casa (que será a última, à esquerda).",
}

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

export default function MultiplicadorX11() {
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

  async function mostrarAjuda(digit: DigitIndex) {
    clickSound.play()
    setRadio(digit)

    await Swal.fire({
      ...swalBase,
      title: `Ajuda: ${digit}º dígito do resultado`,
      text: HELP_TEXT[digit],
      icon: "info",
      confirmButtonText: "Entendi!",
    })

    showArrowForDigit(digit)
  }

  async function conferir() {
    if (isProcessing) {
      return
    }

    setIsProcessing(true)
    
    try {
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

      const resultadoCorreto = String(numeroConvertido * 11)

      const a = normalizeNumberString(numeroDigitado)
      const b = normalizeNumberString(resultadoCorreto)

      const questionKey = `${numeroOriginal}_${resultadoCorreto}`

      if (a === b) {
        if (solvedQuestions.has(questionKey)) {
          Swal.fire({
            ...swalBase,
            title: "✅ Acertou!",
            text: `A multiplicação de ${numeroOriginal} × 11 é: ${resultadoCorreto}`,
            icon: "success",
            confirmButtonText: "Boa!",
          })
        } else {
          try {
            await addCoins(10)
            setSolvedQuestions(prev => new Set([...prev, questionKey]))
            
            setShowCoinAnimation(true)
            
            Swal.fire({
              ...swalBase,
              title: "✅ Acertou!",
              html: `
                <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
                  <div style="font-size: 18px;">A multiplicação de ${numeroOriginal} × 11 é: ${resultadoCorreto}</div>
                  <div style="display: flex; align-items: center; gap: 8px; background: linear-gradient(to right, #fef3c7, #fde68a); padding: 8px 16px; border-radius: 20px; border: 1px solid #fbbf24; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <div style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; background: linear-gradient(135deg, #fbbf24, #f59e0b, #d97706); border-radius: 50%; box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);">
                      <span style="font-size: 14px; font-weight: bold; color: #78350f;">$</span>
                    </div>
                    <span style="font-size: 18px; font-weight: bold; color: #a16207;">+10 moedas!</span>
                  </div>
                </div>
              `,
              icon: "success",
              confirmButtonText: "Boa!",
            })
            
          } catch (error) {
            console.error("Erro ao adicionar moedas:", error)
            Swal.fire({
              ...swalBase,
              title: "✅ Acertou!",
              text: `A multiplicação de ${numeroOriginal} × 11 é: ${resultadoCorreto}`,
              icon: "success",
              confirmButtonText: "Boa!",
            })
          }
        }
      } else {
        Swal.fire({
          ...swalBase,
          title: "❌ Errou!",
          text: `Sua resposta (${numeroDigitado}) está incorreta.\nO resultado correto de ${numeroOriginal} × 11 é: ${resultadoCorreto}`,
          icon: "error",
          confirmButtonText: "Entendi",
        })
      }
    } finally {
      setIsProcessing(false)
    }
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
      <h2 className="sr-only">Treino de multiplicação por 11</h2>

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
                onClick={() => mostrarAjuda(n as DigitIndex)}
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
              { id: "select4", idx: 1, bg: "bg-yellow-400 text-black" },
              { id: "select3", idx: 2, bg: "bg-green-600 text-white" },
              { id: "select2", idx: 3, bg: "bg-blue-600 text-white" },
              { id: "select1", idx: 4, bg: "bg-cyan-500 text-white" },
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

            <span className="ml-0.5 font-bold text-sm sm:text-xl" aria-label="multiplicado por 11">
              ×11
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
            />

              <DigitInput
                label="1º dígito do resultado"
                placeholder="1º"
                value={inputs[4]}
                onChange={(v) => setInput(4, v)}
                onSound={() => clickSound.play()}
              />
            </div>
          </fieldset>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3">
          <button
            type="button"
            onClick={conferir}
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
            onClick={limpar}
            className="cursor-pointer inline-flex items-center justify-center rounded-xl px-5 py-3 font-bold
            bg-[var(--color-surface)] text-[var(--color-text-primary)]
            border border-[var(--color-border)]
            hover:bg-[var(--color-card)]
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          >
            Limpar
          </button>
        </div>

        <div className="mt-5 text-center text-sm text-[var(--color-text-secondary)]">
          <span className="font-semibold">Número atual:</span>{" "}
          <span className="font-mono">{getNumeroOriginal()}</span>
        </div>
      </div>
      
      {showCoinAnimation && (
        <CoinAnimation 
          amount={10} 
          onComplete={() => setShowCoinAnimation(false)} 
        />
      )}
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