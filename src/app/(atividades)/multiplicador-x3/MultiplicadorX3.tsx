'use client'

import { useState, useRef } from 'react'
import { useSound } from '@/hooks/useSound'
import Swal from 'sweetalert2'
import { CoinAnimation } from '@/components/ui/CoinAnimation'
import { addCoins } from '@/actions/auth'

type DigitIndex = 1 | 2 | 3 | 4 | 5

interface DigitInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  maxLength?: number
}

interface RadioDigitInputProps {
  digit: DigitIndex
  radioValue: number
  onRadioChange: (digit: DigitIndex) => void
  inputValue: string
  onInputChange: (digit: DigitIndex, value: string) => void
  placeholder?: string
}

export default function MultiplicadorX3() {
  const [selects, setSelects] = useState<Record<DigitIndex, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  })

  const [inputs, setInputs] = useState<Record<DigitIndex, string>>({
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
  })

  const [selectedDigit, setSelectedDigit] = useState<DigitIndex | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showCoinAnimation, setShowCoinAnimation] = useState(false)
  const [solvedQuestions, setSolvedQuestions] = useState<Set<string>>(new Set())
  const arrowRef = useRef<HTMLDivElement>(null)

  const clickSound = useSound('/sounds/click-button.mp3')
  const actionSound = useSound('/sounds/button-305770.mp3')

  const HELP_TEXT: Record<DigitIndex, string> = {
    1: 'Subtraímos por 10, dobramos o valor, e se impar adicionar +5',
    2: 'Subtrair por 9, dobrar e adicionar a metade do vizinho, se impar adicionar +5',
    3: 'Subtrair por 9, dobrar e adicionar a metade do vizinho, se impar adicionar +5',
    4: 'Subtrair por 9, dobrar e adicionar a metade do vizinho, se impar adicionar +5',
    5: 'Pegar a metade do vizinho e subtrair 2',
  }

  function showArrowForDigit(digit: DigitIndex) {
    if (!arrowRef.current) return

    arrowRef.current.style.opacity = '1'
    setTimeout(() => {
      if (arrowRef.current) {
        arrowRef.current.style.opacity = '0'
      }
    }, 4500)
  }

  function handleSelectChange(digit: DigitIndex, value: number) {
    clickSound.play()
    setSelects((prev) => ({ ...prev, [digit]: value }))
  }

  function handleRadioChange(digit: DigitIndex) {
    clickSound.play()
    setSelectedDigit(digit)
    showArrowForDigit(digit)
  }

  function handleInputChange(digit: DigitIndex, value: string) {
    const sanitized = value.replace(/[^0-9]/g, '').slice(0, 1)
    setInputs((prev) => ({ ...prev, [digit]: sanitized }))
  }

  async function handleSubmit() {
    if (isProcessing) return
    setIsProcessing(true)

    try {
      const all = `${selects[1]}${selects[2]}${selects[3]}${selects[4]}${selects[5]}`
      const answer = `${inputs[1]}${inputs[2]}${inputs[3]}${inputs[4]}${inputs[5]}`

      if (!answer || answer.split('').every((c: string) => c === '')) {
        Swal.fire({
          title: '⚠️ Aviso',
          text: 'Por favor, preencha pelo menos um campo de resposta.',
          icon: 'warning',
          confirmButtonText: 'OK',
          customClass: {
            container: 'swal2-custom',
            popup: 'rounded-2xl',
            confirmButton: 'rounded-lg',
          },
        })
        setIsProcessing(false)
        return
      }

      const original = Number(all)
      const correctAnswer = String(original * 3)
      const answerNormalized = answer.replace(/^0+/, '') || '0'
      const correctNormalized = correctAnswer.replace(/^0+/, '') || '0'
      const displayOriginal = all.replace(/^0+/, '') || '0'

      const questionKey = `x3_${all}`
      const isFirstTime = !solvedQuestions.has(questionKey)

      if (answerNormalized === correctNormalized) {
        actionSound.play()

        if (isFirstTime) {
          setSolvedQuestions((prev) => new Set([...prev, questionKey]))
          setShowCoinAnimation(true)
          setTimeout(() => setShowCoinAnimation(false), 2000)
          await addCoins(10)
        }

        Swal.fire({
          title: '✅ Acertou!',
          html: `A multiplicação de <strong>${displayOriginal} × 3</strong> é:<br><strong>${correctAnswer}</strong>`,
          icon: 'success',
          confirmButtonText: 'Entendi!',
          customClass: {
            container: 'swal2-custom',
            popup: 'rounded-2xl',
            confirmButton: 'rounded-lg bg-green-600 hover:bg-green-700',
          },
        })
      } else {
        actionSound.play()

        Swal.fire({
          title: '❌ Errou!',
          html: `Sua resposta <strong>(${answer})</strong> está incorreta.<br>O resultado correto de <strong>${displayOriginal} × 3</strong> é: <strong>${correctAnswer}</strong>`,
          icon: 'error',
          confirmButtonText: 'Entendi!',
          customClass: {
            container: 'swal2-custom',
            popup: 'rounded-2xl',
            confirmButton: 'rounded-lg bg-red-600 hover:bg-red-700',
          },
        })
      }
    } finally {
      setIsProcessing(false)
    }
  }

  function handleClear() {
    setSelects({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })
    setInputs({ 1: '', 2: '', 3: '', 4: '', 5: '' })
    setSelectedDigit(null)
    if (arrowRef.current) {
      arrowRef.current.style.opacity = '0'
    }

    Swal.fire({
      title: '🧹 Limpo!',
      text: 'Todos os valores foram limpos.',
      icon: 'info',
      confirmButtonText: 'OK',
      customClass: {
        container: 'swal2-custom',
        popup: 'rounded-2xl',
        confirmButton: 'rounded-lg',
      },
    })
  }

  function showHelp(digit: DigitIndex) {
    clickSound.play()
    Swal.fire({
      title: `Ajuda: ${digit}° Dígito`,
      text: HELP_TEXT[digit],
      icon: 'info',
      confirmButtonText: 'Entendi!',
      customClass: {
        container: 'swal2-custom',
        popup: 'rounded-2xl',
        confirmButton: 'rounded-lg',
      },
    })
    showArrowForDigit(digit)
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="sr-only">Treino de multiplicação por 3</h2>
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
                onClick={() => showHelp(n as DigitIndex)}
                className="shrink-0 cursor-pointer rounded-lg px-1.5 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-base font-bold
                bg-[var(--color-button-dark)] text-white
                hover:bg-[var(--color-button-dark-hover)]
                border border-[var(--color-border)]
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              >
                {n}° Dígito
              </button>
            ))}
          </div>
        </div>

        <div className="w-full overflow-x-auto overflow-y-hidden [-webkit-overflow-scrolling:touch] mb-6">
          <div
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

            {[1, 2, 3, 4, 5].map((digit) => (
              <select
                key={digit}
                value={selects[digit as DigitIndex]}
                onChange={(e) => handleSelectChange(digit as DigitIndex, Number(e.target.value))}
                disabled={digit === 5}
                className={`cursor-pointer h-8 sm:h-11 w-[42px] sm:w-[76px] rounded-lg text-center font-bold text-sm sm:text-lg
                ${
                  digit === 5
                    ? 'bg-red-600 text-white'
                    : digit === 4
                      ? 'bg-yellow-400 text-black'
                      : digit === 3
                        ? 'bg-green-600 text-white'
                        : digit === 2
                          ? 'bg-blue-600 text-white'
                          : 'bg-cyan-500 text-white'
                }
                border border-[var(--color-border)]
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
                disabled:opacity-80`}
                aria-label={`${digit}º dígito do número`}
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            ))}

            <span className="ml-0.5 font-bold text-sm sm:text-xl" aria-label="multiplicado por 3">
              ×3
            </span>
          </div>
        </div>

        <fieldset>
          <legend className="sr-only">Digite o resultado (5 dígitos)</legend>

          <div className="flex flex-nowrap items-center justify-center gap-0.5 sm:gap-4 min-w-max px-2 py-2">
            <DigitInput
              placeholder="5º"
              value={inputs[5]}
              onChange={(v) => handleInputChange(5, v)}
            />

            {[4, 3, 2, 1].map((digit) => (
              <RadioDigitInput
                key={digit}
                digit={digit as DigitIndex}
                radioValue={digit}
                onRadioChange={handleRadioChange}
                inputValue={inputs[digit as DigitIndex]}
                onInputChange={handleInputChange}
                placeholder={`${digit}º`}
              />
            ))}
          </div>
        </fieldset>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-8">
          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            className="px-6 sm:px-8 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-bold transition-colors"
          >
            Conferir
          </button>
          <button
            onClick={handleClear}
            className="px-6 sm:px-8 py-2 sm:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-bold transition-colors"
          >
            Limpar
          </button>
        </div>
      </div>
    </div>
  )
}

function DigitInput({ value, onChange, placeholder = '5º', maxLength = 1 }: DigitInputProps) {
  return (
    <div className="flex flex-col items-center gap-2 shrink-0">
      <input
        type="text"
        inputMode="numeric"
        maxLength={maxLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="cursor-pointer h-11 sm:h-14 w-[50px] sm:w-[84px]
        rounded-xl text-center text-lg sm:text-2xl font-extrabold
        bg-[var(--color-surface)] text-[var(--color-text-primary)]
        border border-[var(--color-border)]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        aria-label={`Digite o ${placeholder} dígito do resultado`}
      />
    </div>
  )
}

function RadioDigitInput({
  digit,
  radioValue,
  onRadioChange,
  inputValue,
  onInputChange,
  placeholder,
}: RadioDigitInputProps) {
  return (
    <div className="flex flex-col items-center gap-2 shrink-0">
      <div className="flex items-center justify-center gap-0.5">
        <input
          type="radio"
          name="digitSelector"
          value={radioValue}
          onChange={() => onRadioChange(digit)}
          className="cursor-pointer h-3.5 w-3.5 sm:h-5 sm:w-5 accent-[var(--color-primary)]
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          aria-label={`Selecionar ${digit}° dígito`}
        />
        <input
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={inputValue}
          onChange={(e) => onInputChange(digit, e.target.value)}
          placeholder={placeholder}
          className="cursor-pointer h-11 sm:h-14 w-[50px] sm:w-[84px]
          rounded-xl text-center text-lg sm:text-2xl font-extrabold
          bg-[var(--color-surface)] text-[var(--color-text-primary)]
          border border-[var(--color-border)]
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          aria-label={`Digite o ${placeholder} dígito do resultado`}
        />
      </div>
    </div>
  )
}
