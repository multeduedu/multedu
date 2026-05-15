"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Swal from "sweetalert2";
import YouTube from "react-youtube";
import { useSound } from "@/hooks/useSound";
import { useTone } from "@/hooks/useTone";
import { CoinAnimation } from "@/components/ui/CoinAnimation";
import { addCoins } from "@/actions/auth";
import { OnboardingTutorial, useTutorial } from "@/components/OnboardingTutorial";
import type { MultiplicadorData, DigitIndex } from "@/data/multiplicadores";

type Props = {
  dadosMult: MultiplicadorData;
};

function onlyOneDigit(v: string) {
  return v.replace(/\D/g, "").slice(0, 1);
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
} as const;

function DigitInput(props: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSound?: () => void;
  onFocus?: () => void;
  isPulsing?: boolean;
  radio?: {
    checked: boolean;
    value: DigitIndex;
    onClick: (value: number | null) => void;
  };
  disabled?: boolean;
}) {
  return (
    <div className={`flex flex-col items-center gap-0.5 sm:gap-1 w-full border-2 border-[var(--color-border)] rounded-lg sm:rounded-xl overflow-hidden transition-all ${
      props.isPulsing ? "ring-2 ring-blue-500 ring-offset-2 animate-pulse-tutorial" : ""
    }`}>
      <span className="sr-only">{props.label}</span>
      <div className="flex items-center justify-center gap-0.5 sm:gap-1 w-full ">
        <div className="w-5 flex justify-center">
          <input
            type="radio"
            name={`digitSelector-${props.label}`}
            checked={props.radio?.checked ?? false}
            onClick={() => {
              if (!props.radio) return;
              props.radio.onClick(props.radio.value);
            }}
            readOnly
            disabled={!props.radio || !!props.disabled}
            className="h-3.5 w-3.5 m-1 cursor-pointer accent-[var(--color-primary)] disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label={`Selecionar ${props.label}`}
          />
        </div>
        <input
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          onClick={() => props.onSound?.()}
          onFocus={props.onFocus}
          placeholder={props.placeholder}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          disabled={props.disabled}
          className={`cursor-text h-6 sm:h-10 md:h-14 w-6 sm:w-8 md:w-9 my-0.5 sm:my-1 text-center text-xs sm:text-lg md:text-2xl font-extrabold border-b-3 bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:bg-gray-100 focus-within:border-[var(--color-primary)] focus:outline-none ${props.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
          aria-label={props.label}
        />
      </div>
      <style>{`
        @keyframes pulse-tutorial {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
          }
        }
        .animate-pulse-tutorial {
          animation: pulse-tutorial 2s infinite;
        }
      `}</style>
    </div>
  );
}

export default function Multiplicador({ dadosMult }: Props) {
  const clickSound = useSound("/sounds/click-button.mp3");
  const actionSound = useSound("/sounds/button-305770.mp3");
  const successSound = useSound("/sounds/success.mp3");
  const errorSound = useSound("/sounds/error.mp3");
  const tone = useTone();

  const tutorial = useTutorial(`multiplicador-${dadosMult.multiplicador}`);

  // AJUSTE: Iniciando com strings vazias para mostrar o placeholder
  const [selects, setSelects] = useState<string[]>(["0", "", "", "", ""]);
  const [inputs, setInputs] = useState<string[]>(["", "", "", "", ""]);
  const [radio, setRadio] = useState<DigitIndex | null>(null);
  const [helpDigit, setHelpDigit] = useState<DigitIndex | null>(null);
  const [helpOpen, setHelpOpen] = useState(true);
  const [videoOpen, setVideoOpen] = useState(false);
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);
  const [isTypingFirstInput, setIsTypingFirstInput] = useState(false);
  const [hasGeneratedNumber, setHasGeneratedNumber] = useState(false);
  const [pulsingStep, setPulsingStep] = useState<'aleatorio' | number | null>('aleatorio');
  const [isProcessing, setIsProcessing] = useState(false);

  const rowRef = useRef<HTMLDivElement | null>(null);
  const arrowRef = useRef<HTMLDivElement | null>(null);
  const selectRefs = useRef<Record<string, HTMLSelectElement | null>>({});

  const digits = useMemo(() => Array.from({ length: 10 }, (_, i) => String(i)), []);

  // Auto-avanço do tutorial
  useEffect(() => {
    if (!tutorial.isTutorialActive) return;

    const delays: Record<string, number> = {
      multiplicando: 4000,
      passos: 4000,
    };

    const delay = delays[tutorial.currentStep];
    if (!delay) return;

    const timer = setTimeout(() => {
      tutorial.advanceStep();
    }, delay);

    return () => clearTimeout(timer);
  }, [tutorial.currentStep, tutorial.isTutorialActive, tutorial]);

  function handleShowHelp() {
    // Reinicia apenas o fluxo de ajuda (pulsing sequence)
    setHasGeneratedNumber(false);
    setPulsingStep('aleatorio');
    tutorial.resetTutorial();
  }
  
  const setSelect = useCallback((pos: number, value: string) => {
    setSelects((prev) => {
      const next = [...prev];
      next[pos] = value;
      return next;
    });
    clickSound.play();
    tone.click();
  }, [clickSound, tone]);
  const setInput = useCallback((pos: number, value: string) => {
    const cleaned = onlyOneDigit(value);
    setInputs((prev) => {
      const next = [...prev];
      next[pos] = cleaned;
      return next;
    });
    clickSound.play();
    tone.click();

    if (pos === 4 && cleaned && tutorial.isTutorialActive) {
      setIsTypingFirstInput(true);
    }

    if (pos === 4 && tutorial.isTutorialActive) {
      tutorial.completeTutorial();
    }

    // Avança pulso para o próximo dígito quando o usuário preencher o atual
    if (hasGeneratedNumber && typeof pulsingStep === 'number' && cleaned) {
      if (pos === pulsingStep) {
        if (pulsingStep > 0) setPulsingStep((s) => (typeof s === 'number' ? s - 1 : s));
        else setPulsingStep(null);
      }
    }
  }, [clickSound, tone, tutorial, hasGeneratedNumber, pulsingStep]);
  const conferir = useCallback(() => {
    if (isProcessing) return;
    setIsProcessing(true);

    const numBase = selects.join("");
    const numDigitado = inputs.join("");

    if (!numDigitado || numDigitado.trim() === "") {
      Swal.fire({ ...swalBase, title: "⚠️ Aviso", text: "Digite sua resposta.", icon: "warning" });
      setIsProcessing(false);
      return;
    }

    const valorOriginal = Number(numBase);
    const multiplicador = Number(dadosMult.multiplicador);
    const resultadoEsperado = valorOriginal * multiplicador;

    const digitadoNormalizado = Number(numDigitado).toString();
    const esperadoNormalizado = resultadoEsperado.toString();

    if (digitadoNormalizado === esperadoNormalizado) {
      successSound.play();
      tone.success();
      setShowCoinAnimation(true);
      addCoins(10).catch(console.error);
      Swal.fire({ ...swalBase, title: "✅ Acertou!", icon: "success", text: `Parabéns! ${valorOriginal} × ${multiplicador} = ${resultadoEsperado}` });
    } else {
      errorSound.play();
      tone.error();
      Swal.fire({ ...swalBase, title: "❌ Errou!", icon: "error", text: `O resultado correto de ${valorOriginal} × ${multiplicador} é ${resultadoEsperado}` });
    }
    
    setTimeout(() => setIsProcessing(false), 500);
  }, [selects, inputs, dadosMult.multiplicador, isProcessing, successSound, tone, errorSound]);

  const limpar = useCallback(() => {
    if (isProcessing) return;
    actionSound.play();
    setSelects(["0", "", "", "", ""]);
    setInputs(["", "", "", "", ""]);
    setRadio(null);
    setHasGeneratedNumber(false);
    setPulsingStep('aleatorio');
    Swal.fire({ ...swalBase, title: "🧹 Limpo!", icon: "info" });
  }, [isProcessing, actionSound]);

  const pegarNumAleatorio = useCallback(() => {
    if (isProcessing) return;
    const randomNumber = Math.floor(Math.random() * 900) + 100;
    const digits = String(randomNumber).padStart(5, '0').split('');
    setSelects(digits);
    clickSound.play();
    setHasGeneratedNumber(true);
    setPulsingStep(4);
    if (tutorial.isTutorialActive) {
      tutorial.advanceStep();
      tutorial.advanceStep();
    }
  }, [isProcessing, clickSound, tutorial]);

  function showArrowForDigit(digit: DigitIndex) {
    const map: Record<DigitIndex, string> = { 1: "select1", 2: "select2", 3: "select3", 4: "select4", 5: "select5" };
    const target = selectRefs.current[map[digit]];
    const row = rowRef.current;
    const arrow = arrowRef.current;
    if (!target || !row || !arrow) return;
    const targetRect = target.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    arrow.style.left = `${targetRect.left - rowRect.left + targetRect.width / 2}px`;
    arrow.style.opacity = "1";
    setTimeout(() => { arrow.style.opacity = "0"; }, 4500);
  }

  const mostrarAjuda = useCallback((digit: DigitIndex) => {
    clickSound.play();
    setHelpDigit(digit);
    showArrowForDigit(digit);
  }, [clickSound]);

  return (
    <div className="flex flex-col items-center gap-1 sm:gap-3 md:gap-6 relative px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-6">
      {showCoinAnimation && <CoinAnimation amount={10} onComplete={() => setShowCoinAnimation(false)} />}

      <OnboardingTutorial
        isVisible={tutorial.isTutorialActive}
        onDismiss={tutorial.completeTutorial}
        currentStep={tutorial.currentStep}
        isTyping={isTypingFirstInput}
      />

      <div className="fixed left-2 sm:left-4 bottom-4 sm:bottom-6 z-50 pointer-events-auto">
        <button
          onClick={handleShowHelp}
          title="Mostrar guia novamente"
          aria-label="Ajuda"
          className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-500 text-white font-bold text-base sm:text-lg hover:bg-blue-600 transition-colors shadow-2xl border-2 border-white"
        >
          ?
        </button>
      </div>

      {/* Vídeo - Oculto por padrão no mobile, compacto quando aberto */}
      <div className="w-full mr-8 sm:mr-12 md:mr-16 border border-[var(--color-border)] rounded-lg sm:rounded-xl overflow-hidden">
        <div className="flex justify-between items-center px-2 sm:px-4 py-1 sm:py-2 bg-[var(--color-surface)]">
          <span className="font-bold text-xs sm:text-base">🎥 Vídeo</span>
          <button onClick={() => setVideoOpen(!videoOpen)} className="text-xs sm:text-sm font-bold cursor-pointer">{videoOpen ? "-" : "+"}</button>
        </div>
        {videoOpen && (
          <div className="w-full bg-black p-1 sm:p-2">
            <YouTube videoId={dadosMult.videoUrl} opts={{ width: "100%", height: typeof window !== 'undefined' && window.innerWidth < 640 ? "120" : "360", playerVars: { autoplay: 1 } }} iframeClassName="w-full aspect-video max-h-[120px] sm:max-h-[360px]" />
          </div>
        )}
      </div>

      {/* Operação */}
      <div className="w-full flex flex-col gap-1 sm:gap-2 md:gap-3">
        <h3 className="text-xs sm:text-sm font-semibold px-0 sm:px-0">Resolva:</h3>
        <div className="relative w-full">
          <div ref={arrowRef} className="pointer-events-none absolute -top-16 sm:-top-12 md:-top-8 left-1/2 transition-opacity opacity-0 -translate-x-1/2 z-10"><span className="text-2xl">⬇️</span></div>
          <div className="w-full overflow-x-auto p-0.5 sm:p-2 md:p-4 overflow-y-visible">
            <div ref={rowRef} className="relative grid grid-cols-[repeat(5,minmax(40px,1fr))_auto] sm:grid-cols-[repeat(5,minmax(55px,1fr))_auto] md:grid-cols-[repeat(5,minmax(70px,1fr))_auto] gap-0.5 sm:gap-1 md:gap-2 items-center justify-center min-w-max">

            {/* O dígito 0 é fixo à esquerda (o vizinho fantasma do Trachtenberg) */}
            <select disabled value={selects[0]} className="h-5 sm:h-8 md:h-11 rounded text-center font-bold text-xs sm:text-sm bg-[var(--color-border)] opacity-60"><option value="0">0</option></select>

            {/* Números que o usuário escolhe (posições 1, 2, 3, 4 do array) */}
            {[1, 2, 3, 4].map((idx) => (
              <select
                key={idx}
                ref={(el) => { selectRefs.current[`select${5-idx}`] = el; }}
                value={selects[idx]}
                onChange={(e) => setSelect(idx, e.target.value)}
                disabled={!hasGeneratedNumber}
                className={`h-5 sm:h-8 md:h-11 rounded text-center font-bold text-xs sm:text-sm md:text-base bg-[var(--color-primary)] text-white border border-[var(--color-border)] transition-all ${
                  tutorial.isTutorialActive && tutorial.currentStep === "multiplicando"
                    ? "ring-2 ring-yellow-400 ring-offset-2"
                    : ""
                }`}
              >
                <option value="">-</option>
                {digits.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            ))}

            <span className="font-bold text-xs sm:text-sm md:text-base lg:text-xl px-0.5 sm:px-1">× {dadosMult.multiplicador}</span>
            <div className="col-span-full border-b-3 border-[var(--color-border)]"></div>

            {/* Inputs de resposta (5º ao 1º dígito, da esquerda para direita) */}
            {[0, 1, 2, 3, 4].map((i) => (
              <DigitInput
                key={i}
                label={`${5-i}º dígito`}
                placeholder={`${5-i}º`}
                value={inputs[i]}
                onChange={(v) => setInput(i, v)}
                onFocus={() => mostrarAjuda((5-i) as DigitIndex)}
                isPulsing={pulsingStep === i}
                radio={i < 4 ? { checked: radio === (5-i), value: (5-i) as DigitIndex, onClick: (v) => setRadio(v as DigitIndex) } : undefined}
                disabled={!hasGeneratedNumber}
              />
            ))}
          </div>
        </div>
        </div>
      </div>

      {/* Ajuda - Compactada no mobile */}
      <div className={`w-full border border-[var(--color-border)] rounded-lg sm:rounded-xl overflow-hidden transition-all ${
        tutorial.isTutorialActive && tutorial.currentStep === "passos"
          ? "ring-2 ring-green-400 ring-offset-2"
          : ""
      }`}>
        <div className="flex justify-between items-center px-2 sm:px-4 py-1 sm:py-2 bg-[var(--color-surface)]">
          <span className="font-bold text-xs sm:text-base">Passo a passo</span>
          <button onClick={() => setHelpOpen(!helpOpen)} className="text-xs sm:text-sm font-bold cursor-pointer">{helpOpen ? "-" : "+"}</button>
        </div>
        {helpOpen && (
          <div className="flex flex-col border-t border-[var(--color-border)]">
            <div className="flex bg-[var(--color-surface)]">
              {[5, 4, 3, 2, 1].map((d) => (
                <button key={d} onClick={() => setHelpDigit(d as DigitIndex)} className={`flex-1 py-1 sm:py-1.5 text-xs sm:text-sm font-bold border-r border-[var(--color-border)] ${helpDigit === d ? "bg-[var(--color-primary)] text-white" : ""}`}>{d}º</button>
              ))}
            </div>
            <div className="p-1.5 sm:p-3 md:p-4 min-h-[50px] sm:min-h-[80px] md:min-h-[100px] text-xs sm:text-sm">{helpDigit ? dadosMult.helpText[helpDigit] : "Selecione um dígito."}</div>
          </div>
        )}
      </div>

      {/* Botões - Em linha horizontal compacta */}
      <div className="flex flex-row gap-1 sm:gap-2 md:gap-3 w-full">
        <button
          onClick={conferir}
          disabled={isProcessing}
          aria-label="Conferir resposta"
          className="flex-1 rounded py-1.5 sm:py-2 md:py-3 text-xs sm:text-sm font-bold bg-[var(--color-primary)] text-white transition-all duration-200 hover:bg-[var(--color-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
        >
          {isProcessing ? '⏳' : '✓'} Conferir
        </button>
        <button
          onClick={limpar}
          disabled={isProcessing}
          aria-label="Limpar todos os campos"
          className="flex-1 rounded py-1.5 sm:py-2 md:py-3 text-xs sm:text-sm font-bold border border-[var(--color-border)] transition-all duration-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
        >
          🧹 Limpar
        </button>
        <button
          onClick={pegarNumAleatorio}
          disabled={isProcessing}
          aria-label="Gerar número aleatório para multiplicar"
          className={`flex-1 rounded py-1.5 sm:py-2 md:py-3 text-xs sm:text-sm font-bold border border-[var(--color-border)] transition-all duration-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 ${
            pulsingStep === 'aleatorio' ? 'animate-pulse-tutorial ring-2 ring-blue-500 ring-offset-2' : ''
          }`}
        >
          🎲 Aleatório
        </button>
      </div>
    </div>
  );
}
