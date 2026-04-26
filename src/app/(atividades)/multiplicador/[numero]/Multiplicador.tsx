"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import YouTube from "react-youtube";
import { useSound } from "@/hooks/useSound";
import { CoinAnimation } from "@/components/ui/CoinAnimation";
import { addCoins } from "@/actions/auth";
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
  radio?: {
    checked: boolean;
    value: DigitIndex;
    onClick: (value: number | null) => void;
  };
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 sm:gap-1 w-full border-2 border-[var(--color-border)] rounded-lg sm:rounded-xl overflow-hidden">
      <span className="sr-only">{props.label}</span>
      <div className="flex items-center justify-center gap-0.5 sm:gap-1 w-full ">
        <div className="w-5 flex justify-center">
          <input
            type="radio"
            name="digitSelector"
            checked={props.radio?.checked ?? false}
            onClick={() => {
              const v = props.radio!.value;
              props.radio!.onClick(v);
            }}
            readOnly
            disabled={!props.radio}
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
          className="cursor-text h-6 sm:h-10 md:h-14 w-6 sm:w-8 md:w-9 my-0.5 sm:my-1 text-center text-xs sm:text-lg md:text-2xl font-extrabold border-b-3 bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:bg-gray-100 focus-within:border-[var(--color-primary)] focus:outline-none"
          aria-label={props.label}
        />
      </div>
    </div>
  );
}

export default function Multiplicador({ dadosMult }: Props) {
  const clickSound = useSound("/sounds/click-button.mp3");
  const actionSound = useSound("/sounds/button-305770.mp3");

  // AJUSTE: Iniciando com strings vazias para mostrar o placeholder
  const [selects, setSelects] = useState<string[]>(["0", "", "", "", ""]);
  const [inputs, setInputs] = useState<string[]>(["", "", "", "", ""]);
  const [radio, setRadio] = useState<DigitIndex | null>(null);
  const [helpDigit, setHelpDigit] = useState<DigitIndex | null>(null);
  const [helpOpen, setHelpOpen] = useState(true);
  const [videoOpen, setVideoOpen] = useState(false);
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);

  const rowRef = useRef<HTMLDivElement | null>(null);
  const arrowRef = useRef<HTMLDivElement | null>(null);
  const selectRefs = useRef<Record<string, HTMLSelectElement | null>>({});

  const digits = useMemo(() => Array.from({ length: 10 }, (_, i) => String(i)), []);

  function setSelect(pos: number, value: string) {
    setSelects((prev) => {
      const next = [...prev];
      next[pos] = value;
      return next;
    });
  }

  function setInput(pos: number, value: string) {
    const cleaned = onlyOneDigit(value);
    setInputs((prev) => {
      const next = [...prev];
      next[pos] = cleaned;
      return next;
    });
  }

  // LÓGICA DE CÁLCULO REVISADA
  function conferir() {
    actionSound.play();

    // 1. Pega os números dos selects em ordem correta (0, 1, 2, 3, 4)
    const numBase = selects.join("");

    // 2. Pega o que o usuário digitou (na ordem visual: 5º, 4º, 3º, 2º, 1º)
    // inputs já está armazenado nessa ordem: [inputs[0]=5º, inputs[1]=4º, inputs[2]=3º, inputs[3]=2º, inputs[4]=1º]
    const numDigitado = inputs.join("");

    if (!numDigitado || numDigitado.trim() === "") {
      Swal.fire({ ...swalBase, title: "⚠️ Aviso", text: "Digite sua resposta.", icon: "warning" });
      return;
    }

    const valorOriginal = Number(numBase);
    const multiplicador = Number(dadosMult.multiplicador);
    const resultadoEsperado = valorOriginal * multiplicador;

    // Normalização para comparação (remove zeros à esquerda)
    const digitadoNormalizado = Number(numDigitado).toString();
    const esperadoNormalizado = resultadoEsperado.toString();

    if (digitadoNormalizado === esperadoNormalizado) {
      setShowCoinAnimation(true);
      addCoins(10).catch(console.error);
      Swal.fire({ ...swalBase, title: "✅ Acertou!", icon: "success", text: `Parabéns! ${valorOriginal} × ${multiplicador} = ${resultadoEsperado}` });
    } else {
      Swal.fire({ ...swalBase, title: "❌ Errou!", icon: "error", text: `O resultado correto de ${valorOriginal} × ${multiplicador} é ${resultadoEsperado}` });
    }
  }

  function limpar() {
    actionSound.play();
    setSelects(["0", "", "", "", ""]);
    setInputs(["", "", "", "", ""]);
    setRadio(null);
    Swal.fire({ ...swalBase, title: "🧹 Limpo!", icon: "info" });
  }

  function pegarNumAleatorio() {
    // Gera número aleatório de 100 a 999 (3 dígitos)
    const randomNumber = Math.floor(Math.random() * 900) + 100;
    // Converte para string com 5 dígitos (00XXX)
    const digits = String(randomNumber).padStart(5, '0').split('');
    setSelects(digits);
  }

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

  function mostrarAjuda(digit: DigitIndex) {
    clickSound.play();
    setHelpDigit(digit);
    showArrowForDigit(digit);
  }

  return (
    <div className="flex flex-col items-center gap-1 sm:gap-3 md:gap-6 relative">
      {showCoinAnimation && <CoinAnimation amount={10} onComplete={() => setShowCoinAnimation(false)} />}

      {/* Vídeo - Oculto por padrão no mobile, compacto quando aberto */}
      <div className="w-full border border-[var(--color-border)] rounded-lg sm:rounded-xl overflow-hidden">
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
      <div className="w-full flex flex-col gap-0.5 sm:gap-2">
        <h3 className="text-xs font-semibold px-1 sm:px-0">Resolva:</h3>
        <div className="relative w-full">
          <div ref={arrowRef} className="pointer-events-none absolute -top-6 left-1/2 transition-opacity opacity-0 -translate-x-1/2 z-40"><span className="text-2xl">⬇️</span></div>
          <div className="w-full overflow-x-auto p-0.5 sm:p-2 md:p-4 overflow-y-visible">
            <div ref={rowRef} className="relative grid grid-cols-[repeat(5,minmax(45px,1fr))_auto] sm:grid-cols-[repeat(5,minmax(60px,1fr))_auto] gap-0.5 sm:gap-1 items-center justify-center min-w-max">

            {/* O dígito 0 é fixo à esquerda (o vizinho fantasma do Trachtenberg) */}
            <select disabled value={selects[0]} className="h-6 sm:h-9 md:h-11 rounded text-center font-bold text-xs bg-[var(--color-border)] opacity-60"><option value="0">0</option></select>

            {/* Números que o usuário escolhe (posições 1, 2, 3, 4 do array) */}
            {[1, 2, 3, 4].map((idx) => (
              <select
                key={idx}
                ref={(el) => { selectRefs.current[`select${5-idx}`] = el; }}
                value={selects[idx]}
                onChange={(e) => setSelect(idx, e.target.value)}
                className="h-6 sm:h-9 md:h-11 rounded text-center font-bold text-xs sm:text-sm bg-[var(--color-primary)] text-white border border-[var(--color-border)]"
              >
                <option value="">-</option>
                {digits.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            ))}

            <span className="font-bold text-xs sm:text-base md:text-xl">× {dadosMult.multiplicador}</span>
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
                radio={i < 4 ? { checked: radio === (5-i), value: (5-i) as DigitIndex, onClick: (v) => setRadio(v as DigitIndex) } : undefined}
              />
            ))}
          </div>
        </div>
        </div>
      </div>

      {/* Ajuda - Compactada no mobile */}
      <div className="w-full border border-[var(--color-border)] rounded-lg sm:rounded-xl overflow-hidden">
        <div className="flex justify-between items-center px-2 sm:px-4 py-1 sm:py-2 bg-[var(--color-surface)]">
          <span className="font-bold text-xs sm:text-base">Passo a passo</span>
          <button onClick={() => setHelpOpen(!helpOpen)} className="text-xs sm:text-sm font-bold cursor-pointer">{helpOpen ? "-" : "+"}</button>
        </div>
        {helpOpen && (
          <div className="flex flex-col border-t border-[var(--color-border)]">
            <div className="flex bg-[var(--color-surface)]">
              {[5, 4, 3, 2, 1].map((d) => (
                <button key={d} onClick={() => setHelpDigit(d as DigitIndex)} className={`flex-1 py-0.5 sm:py-1 text-xs font-bold border-r border-[var(--color-border)] ${helpDigit === d ? "bg-[var(--color-primary)] text-white" : ""}`}>{d}º</button>
              ))}
            </div>
            <div className="p-1 sm:p-3 min-h-[45px] sm:min-h-[80px] text-xs">{helpDigit ? dadosMult.helpText[helpDigit] : "Selecione um dígito."}</div>
          </div>
        )}
      </div>

      {/* Botões - Em linha horizontal compacta */}
      <div className="flex flex-row gap-0.5 sm:gap-2 w-full">
        <button onClick={conferir} className="flex-1 rounded py-1.5 sm:py-2 md:py-3 text-xs sm:text-sm font-bold bg-[var(--color-primary)] text-white transition-colors hover:bg-[var(--color-primary-hover)]">Conferir</button>
        <button onClick={limpar} className="flex-1 rounded py-1.5 sm:py-2 md:py-3 text-xs sm:text-sm font-bold border border-[var(--color-border)] hover:bg-gray-50">Limpar</button>
        <button onClick={pegarNumAleatorio} className="flex-1 rounded py-1.5 sm:py-2 md:py-3 text-xs sm:text-sm font-bold border border-[var(--color-border)] hover:bg-gray-50">Aleatório</button>
      </div>
    </div>
  );
}
