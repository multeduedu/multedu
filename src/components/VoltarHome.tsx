"use client";

import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

interface VoltarHomeButtonProps {
    href: string;
    children: React.ReactNode;
}

export default function VoltarHomeButton({ href, children }: VoltarHomeButtonProps) {
    return (
        <Link
            href={href}
            className="inline-flex items-center gap-2 text-lg text-gray-600 hover:text-[var(--color-primary)] transition-colors mb-14"
        >
            <FiArrowLeft />
            {children}
        </Link>
    );
}