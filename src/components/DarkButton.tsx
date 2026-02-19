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
      className="bg-[var(--color-dark)] hover:bg-[var(--color-btn-dark-hover)] 
                 text-[var(--color-text-white)] font-bold rounded-[30px] 
                 px-6 py-3 md:px-8 md:py-4 cursor-pointer 
                 transition-colors duration-200 inline-block text-center"
    >
      {children}
    </Link>
  );
}