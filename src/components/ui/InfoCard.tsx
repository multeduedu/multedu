"use client";

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  colSpan?: boolean;
}

export default function InfoCard({
  icon,
  title,
  children,
  colSpan = false,
}: InfoCardProps) {
  return (
    <div
      className={`
        bg-[var(--color-card)]
        border border-[var(--color-border)]
        p-8
        rounded-2xl
        shadow-sm
        transition-colors
        hover:border-[var(--color-primary)]
        ${colSpan ? "md:col-span-2" : ""}
      `}
    >
      <div className="flex items-center gap-3 mb-4 text-[var(--color-primary)]">
        {icon}
        <h2 className="font-semibold text-xl text-[var(--color-text-primary)]">
          {title}
        </h2>
      </div>

      <div className="text-[var(--color-text-secondary)] leading-relaxed">
        {children}
      </div>
    </div>
  );
}