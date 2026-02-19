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
      className={`bg-gray-200 p-8 rounded-2xl hover:bg-gray-300 transition-colors ${
        colSpan ? "md:col-span-2" : ""
      }`}
    >
      <div className="flex items-center gap-3 mb-4 text-[var(--color-primary)]">
        {icon}
        <h2 className="font-semibold text-xl text-gray-900">
          {title}
        </h2>
      </div>

      <div className="text-gray-800 leading-relaxed">
        {children}
      </div>
    </div>
  );
}