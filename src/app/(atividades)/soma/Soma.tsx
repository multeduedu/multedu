"use client"

import { useEffect, useMemo, useState } from "react"
import Swal from "sweetalert2"
import { useSound } from "@/hooks/useSound"
import { addCoins } from "@/actions/auth"
import { CoinAnimation } from "@/components/ui/CoinAnimation"

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

interface NumberBox {
  hundreds: string
  tens: string
  units: string
  formedNumber: string
}

export default function Soma() {
  const clickSound = useSound("/sounds/click-button.mp3")
  const actionSound = useSound("/sounds/button-305770.mp3")

  const [boxes, setBoxes] = useState<NumberBox[]>([
    { hundreds: "0", tens: "0", units: "0", formedNumber: "" },
    { hundreds: "0", tens: "0", units: "0", formedNumber: "" },
    { hundreds: "0", tens: "0", units: "0", formedNumber: "" },
  ])
  const [totalAnswer, setTotalAnswer] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [solvedQuestions, setSolvedQuestions] = useState<Set<string>>(new Set())
  const [showCoinAnimation, setShowCoinAnimation] = useState(false)
  const [feedbackIcons, setFeedbackIcons] = useState<string[]>(["?", "?", "?"])

  const digits = useMemo(() => Array.from({ length: 10 }, (_, i) => String(i)), [])

  useEffect(() => {
    if (showCoinAnimation) {
      const timer = setTimeout(() => {
        setShowCoinAnimation(false)
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [showCoinAnimation])

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

  function updateBox(index: number, field: keyof NumberBox, value: string) {
    setBoxes((prev) => {
      const next = [...prev]
      const box = { ...next[index] }
      
      if (field === "formedNumber") {
        box[field] = value.replace(/\D/g, "").slice(0, 3)
      } else {
        box[field] = value
      }
      
      next[index] = box
      

      if (field === "formedNumber") {
        checkFormedNumber(index, next[index])
      }

      return next
    })
  }

  function checkFormedNumber(boxIndex: number, box: NumberBox) {
    const correctNumber = Number(box.hundreds) * 100 + Number(box.tens) * 10 + Number(box.units)
    const userAnswer = box.formedNumber.trim() === "" ? null : Number(box.formedNumber)

    let icon = "?"

    if (userAnswer !== null) {
      if (isNaN(userAnswer)) {
        icon = "✗"
      } else if (userAnswer === correctNumber) {
        icon = "✓"
      } else {
        icon = "✗"
      }
    }

    setFeedbackIcons((prev) => {
      const next = [...prev]
      next[boxIndex] = icon
      return next
    })
  }

  function getFormattedNumbers() {
    return boxes.map((box) => {
      const num = Number(box.hundreds) * 100 + Number(box.tens) * 10 + Number(box.units)
      return String(num).padStart(3, "0")
    })
  }

  function getTotalSum() {
    return boxes.reduce((sum, box) => {
      const num = Number(box.hundreds) * 100 + Number(box.tens) * 10 + Number(box.units)
      return sum + num
    }, 0)
  }

  async function somar() {
    if (isProcessing) {
      return
    }

    setIsProcessing(true)

    try {
      actionSound.play()

      const numbers = getFormattedNumbers()
      const totalSum = getTotalSum()
      const totalAnswerValue = totalAnswer.trim() === "" ? 0 : Number(totalAnswer)

      if (!totalAnswer.trim() || totalAnswerValue === 0) {
        Swal.fire({
          ...swalBase,
          title: "⚠️ Aviso",
          text: "Digite o resultado total da soma.",
          icon: "warning",
          confirmButtonText: "Ok",
        })
        return
      }

      if (isNaN(totalAnswerValue)) {
        Swal.fire({
          ...swalBase,
          title: "❌ Erro",
          text: "Digite um número válido.",
          icon: "error",
          confirmButtonText: "Ok",
        })
        return
      }

      const operationStr = numbers.join(" + ")
      const questionKey = `${numbers.join("_")}_${totalSum}`

      if (totalAnswerValue === totalSum) {
        if (solvedQuestions.has(questionKey)) {
          Swal.fire({
            ...swalBase,
            title: "✅ Acertou!",
            text: `${operationStr} = ${totalSum}`,
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
                  <div style="font-size: 18px;">${operationStr} = ${totalSum}</div>
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
              text: `${operationStr} = ${totalSum}`,
              icon: "success",
              confirmButtonText: "Boa!",
            })
          }
        }
      } else {
        Swal.fire({
          ...swalBase,
          title: "❌ Errou!",
          text: `Sua resposta (${totalAnswerValue}) está incorreta.\nO resultado correto é: ${totalSum}`,
          icon: "error",
          confirmButtonText: "Entendi",
        })
      }
    } finally {
      setIsProcessing(false)
    }
  }

  function resetar() {
    actionSound.play()

    setBoxes([
      { hundreds: "0", tens: "0", units: "0", formedNumber: "" },
      { hundreds: "0", tens: "0", units: "0", formedNumber: "" },
      { hundreds: "0", tens: "0", units: "0", formedNumber: "" },
    ])
    setTotalAnswer("")
    setFeedbackIcons(["?", "?", "?"])

    Swal.fire({
      ...swalBase,
      title: "🧹 Limpo!",
      text: "Todos os valores foram reset",
      icon: "info",
      confirmButtonText: "Ok",
    })
  }

  const blockColors = [
    { hundred: "bg-red-600", ten: "w-5 h-2 bg-red-300 border-red-600", unit: "w-2 h-2 bg-red-200 border-red-600" },
    { hundred: "bg-yellow-400", ten: "w-5 h-2 bg-yellow-200 border-yellow-500", unit: "w-2 h-2 bg-yellow-100 border-yellow-500" },
    { hundred: "bg-green-600", ten: "w-5 h-2 bg-green-300 border-green-600", unit: "w-2 h-2 bg-green-200 border-green-600" },
  ]

  return (
    <div className="flex flex-col w-full gap-6">
      <h2 className="sr-only">Treino de Soma</h2>

      {/* Título */}
      <div>
        <h3 className="text-center font-bold text-lg sm:text-xl mb-2">
          Selecione os números e forme a soma:
        </h3>
        <p className="text-center text-sm text-[var(--color-text-secondary)]">
          Digite o número formado em cada caixa. Depois, calcule o resultado total.
        </p>
      </div>

      {/* Números e caixas */}
      <div className="w-full overflow-x-auto overflow-y-hidden [-webkit-overflow-scrolling:touch]">
        <div className="mx-auto flex flex-nowrap items-stretch justify-center min-w-max px-2 py-2">
          {boxes.map((box, index) => (
            <div key={index} className="flex items-center">
              <div
                className="border-2 border-[var(--color-border)] rounded-xl p-4 sm:p-5 w-64 sm:w-72 bg-[var(--color-surface)] shadow-sm"
              >
                {/* Seletores CDU */}
                <div className="flex justify-center gap-6 mb-6">
                  <div className="flex flex-col items-center">
                    <label className="text-sm font-bold mb-2 text-[var(--color-text-secondary)]">
                      Centena
                    </label>
                    <select
                      value={box.hundreds}
                      onChange={(e) => updateBox(index, "hundreds", e.target.value)}
                      className="cursor-pointer h-10 w-16 rounded-lg text-center font-bold text-lg
                      bg-[var(--color-surface)] text-[var(--color-text-primary)]
                      border border-[var(--color-border)]
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                    >
                      {digits.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col items-center">
                    <label className="text-sm font-bold mb-2 text-[var(--color-text-secondary)]">
                      Dezena
                    </label>
                    <select
                      value={box.tens}
                      onChange={(e) => updateBox(index, "tens", e.target.value)}
                      className="cursor-pointer h-10 w-16 rounded-lg text-center font-bold text-lg
                      bg-[var(--color-surface)] text-[var(--color-text-primary)]
                      border border-[var(--color-border)]
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                    >
                      {digits.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col items-center">
                    <label className="text-sm font-bold mb-2 text-[var(--color-text-secondary)]">
                      Unidade
                    </label>
                    <select
                      value={box.units}
                      onChange={(e) => updateBox(index, "units", e.target.value)}
                      className="cursor-pointer h-10 w-16 rounded-lg text-center font-bold text-lg
                      bg-[var(--color-surface)] text-[var(--color-text-primary)]
                      border border-[var(--color-border)]
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                    >
                      {digits.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Representação Visual de Blocos */}
                <div className="border-t border-dashed border-gray-300 pt-4 mb-4">
                  <div className="flex justify-center gap-8">
                    {/* Centenas */}
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold mb-2 text-[var(--color-text-secondary)]">C:</span>
                      <div className="flex flex-wrap gap-1 w-24 justify-center">
                        {Array.from({ length: Number(box.hundreds) }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-6 h-6 ${blockColors[index].hundred} border border-gray-400`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Dezenas */}
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold mb-2 text-[var(--color-text-secondary)]">D:</span>
                      <div className="flex flex-wrap gap-1 w-24 justify-center">
                        {Array.from({ length: Number(box.tens) }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-5 h-2 ${blockColors[index].ten} border border-gray-400`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Unidades */}
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold mb-2 text-[var(--color-text-secondary)]">U:</span>
                      <div className="flex flex-wrap gap-1 w-24 justify-center">
                        {Array.from({ length: Number(box.units) }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 ${blockColors[index].unit} border border-gray-400`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verificação de Número Formado */}
                <div className="border-t border-dashed border-gray-300 pt-4">
                  <label className="text-sm font-bold mb-2 block text-[var(--color-text-secondary)]">
                    Número formado:
                  </label>
                  <div className="flex items-center justify-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="999"
                      placeholder="Ex: 123"
                      value={box.formedNumber}
                      onChange={(e) => updateBox(index, "formedNumber", e.target.value)}
                      onClick={() => clickSound.play()}
                      className="cursor-pointer h-10 w-20 rounded-lg text-center font-bold text-lg
                      bg-[var(--color-surface)] text-[var(--color-text-primary)]
                      border border-[var(--color-border)]
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
                      [-moz-appearance:textfield]
                      [&::-webkit-outer-spin-button]:[-webkit-appearance:none]
                      [&::-webkit-inner-spin-button]:[-webkit-appearance:none]"
                    />
                    <div
                      className={`text-2xl font-bold w-8 text-center ${
                        feedbackIcons[index] === "✓"
                          ? "text-green-600"
                          : feedbackIcons[index] === "✗"
                          ? "text-red-600"
                          : "text-gray-400"
                      }`}
                    >
                      {feedbackIcons[index]}
                    </div>
                  </div>
                </div>
              </div>

              {/* Símbolo de Adição */}
              {index < boxes.length - 1 && (
                <div className="shrink-0 text-xl sm:text-2xl font-bold text-center w-12 sm:w-16 text-[var(--color-text-primary)]">
                  +
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Input de Resposta Total */}
      <div className="flex flex-col items-center w-full px-4">
        <label className="text-sm font-bold mb-2 text-[var(--color-text-secondary)]">
          Seu resultado total:
        </label>
        <div className="w-full sm:w-80">
          <input
            type="number"
            placeholder="Digite o resultado"
            value={totalAnswer}
            onChange={(e) => setTotalAnswer(e.target.value)}
            onClick={() => clickSound.play()}
            className="cursor-pointer w-full h-12 rounded-xl text-center font-bold text-lg
            bg-[var(--color-surface)] text-[var(--color-text-primary)]
            border-2 border-[var(--color-primary)]
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
            [-moz-appearance:textfield]
            [&::-webkit-outer-spin-button]:[-webkit-appearance:none]
            [&::-webkit-inner-spin-button]:[-webkit-appearance:none]"
          />
        </div>
      </div>

      {/* Botões */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 px-4">
        <button
          type="button"
          onClick={somar}
          disabled={isProcessing}
          className={`cursor-pointer inline-flex items-center justify-center rounded-xl px-5 py-3 font-bold w-full sm:w-auto
          ${isProcessing 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]'
          } text-white
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]`}
        >
          {isProcessing ? 'Processando...' : 'Somar!'}
        </button>

        <button
          type="button"
          onClick={resetar}
          className="cursor-pointer inline-flex items-center justify-center rounded-xl px-5 py-3 font-bold w-full sm:w-auto
          bg-[var(--color-surface)] text-[var(--color-text-primary)]
          border border-[var(--color-border)]
          hover:bg-[var(--color-card)]
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        >
          Resetar
        </button>
      </div>

      {/* Info de Soma Atual */}
      <div className="text-center text-sm text-[var(--color-text-secondary)] px-4">
        <span className="font-semibold">Total atual: </span>
        <span className="font-mono font-bold text-[var(--color-text-primary)] break-all">
          {getFormattedNumbers().join(" + ")} = {getTotalSum()}
        </span>
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
