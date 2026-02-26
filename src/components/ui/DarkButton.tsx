"use client";

import Link from "next/link";

interface DarkButtonProps {
  href: string;
  children: React.ReactNode;
}

export default function DarkButton({ href, children }: DarkButtonProps) {
  return (
    <Link
      href={href}
      className="
        bg-[var(--color-button-dark)]
        hover:bg-[var(--color-button-dark-hover)]
        text-white
        font-bold
        rounded-[30px]
        px-6 py-3 md:px-8 md:py-4
        cursor-pointer
        transition-all duration-200
        inline-block text-center
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-[var(--color-primary)]
      "
    >
      {children}
    </Link>
  );
}