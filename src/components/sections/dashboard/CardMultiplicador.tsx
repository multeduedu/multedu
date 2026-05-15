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
  // Mapeamento de emojis com aria-labels descritivos
  const emojiMap: Record<number, EmojiConfig> = {
    2: {
      emoji: "✌️",
      ariaLabel: "Número 2: dois dedos levantados",
    },
    3: {
      emoji: "✋",
      ariaLabel:
        "Número 3: três dedos levantados",
    },
    4: {
      emoji: "✋",
      ariaLabel:
        "Número 4: mão aberta com quatro dedos levantados",
    },
    5: {
      emoji: "🖐️",
      ariaLabel:
        "Número 5: mão completamente aberta com cinco dedos",
    },
    6: {
      emoji: "👌",
      ariaLabel:
        "Número 6: gesto de pinça",
    },
    7: {
      emoji: "✊",
      ariaLabel:
        "Número 7: punho neutro",
    },
    8: {
      emoji: "👋",
      ariaLabel:
        "Número 8: mão acenando",
    },
    9: {
      emoji: "🖖",
      ariaLabel:
        "Número 9: saudação simbólica",
    },
    11: {
      emoji: "🙌",
      ariaLabel: "Número 11: mãos levantadas",
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
