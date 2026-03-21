"use client";

import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

interface VoltarHomeButtonProps {
  href: string;
  children: React.ReactNode;
}

export default function VoltarHomeButton({
  href,
  children,
}: VoltarHomeButtonProps) {
  return (
    <Link
      href={href}
      className="
        inline-flex items-center gap-2 text-lg
        text-[var(--color-text-secondary)]
        hover:text-[var(--color-primary)]
        transition-colors duration-200
        mb-14
      "
    >
      <FiArrowLeft className="transition-transform duration-200 group-hover:-translate-x-1" />
      {children}
    </Link>
  );
}