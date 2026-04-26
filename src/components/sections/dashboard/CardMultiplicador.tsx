"use client";

import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

interface CardMultiplicadorProps {
  multiplicador: number;
  descricao?: string;
}

interface EmojiConfig {
  emoji: string;
  ariaLabel: string;
}

export function CardMultiplicador({
  multiplicador,
  descricao,
}: CardMultiplicadorProps) {
  // Mapeamento de emojis para representação em Libras com aria-labels descritivos
  const emojiMap: Record<number, EmojiConfig> = {
    2: {
      emoji: "✌️",
      ariaLabel: "Número 2 em Libras: dois dedos levantados (indicador e médio)",
    },
    3: {
      emoji: "✋",
      ariaLabel:
        "Número 3: três dedos levantados",
    },
    4: {
      emoji: "✋",
      ariaLabel:
        "Número 4 em Libras: mão aberta com quatro dedos levantados para cima",
    },
    5: {
      emoji: "🖐️",
      ariaLabel:
        "Número 5 em Libras: mão completamente aberta com cinco dedos espalhados",
    },
    6: {
      emoji: "👌",
      ariaLabel:
        "Número 6 em Libras: gesto de pinça (aproximação para configuração de seis)",
    },
    7: {
      emoji: "✊",
      ariaLabel:
        "Número 7: punho neutro",
    },
    8: {
      emoji: "👋",
      ariaLabel:
        "Número 8 em Libras: mão acenando (aproximação para configuração de oito)",
    },
    9: {
      emoji: "🖖",
      ariaLabel:
        "Número 9 em Libras: saudação Vulcana (aproximação para configuração de nove)",
    },
    11: {
      emoji: "🙌",
      ariaLabel: "Número 11 em Libras: duas mãos levantadas com dois dedos cada",
    },
  };

  const config = emojiMap[multiplicador] || {
    emoji: "🔢",
    ariaLabel: `Número ${multiplicador}`,
  };

  return (
    <Link href={`/multiplicador/${multiplicador}`}>
      <article
        className="
        bg-[var(--color-card)]
        border border-[var(--color-border)]
        rounded-2xl
        shadow-sm
        hover:shadow-lg
        transition-all duration-300
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
        cursor-pointer
        h-full
        flex flex-col items-center justify-center gap-4 p-6
        hover:border-[var(--color-primary)]
        hover:scale-105
      "
      >
        <span role="img" aria-label={config.ariaLabel} className="text-6xl">
          {config.emoji}
        </span>

        <div className="flex flex-col items-center gap-2 text-center">
          <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">
            × {multiplicador}
          </h3>

          {descricao && (
            <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
              {descricao}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 text-[var(--color-primary)] font-semibold group">
          <span>Treinar</span>
          <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
        </div>
      </article>
    </Link>
  );
}
