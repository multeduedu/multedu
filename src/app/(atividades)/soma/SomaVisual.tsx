export default function SomaVisual({
  c,
  d,
  u,
}: {
  c: number
  d: number
  u: number
}) {
  return (
    <div className="flex justify-center gap-4">
      <div className="flex flex-wrap gap-1">
        {Array.from({ length: c }).map((_, i) => (
          <div key={i} className="h-6 w-6 bg-red-400" />
        ))}
      </div>

      <div className="flex flex-wrap gap-1">
        {Array.from({ length: d }).map((_, i) => (
          <div key={i} className="h-2 w-6 bg-yellow-400" />
        ))}
      </div>

      <div className="flex flex-wrap gap-1">
        {Array.from({ length: u }).map((_, i) => (
          <div key={i} className="h-2 w-2 bg-green-400" />
        ))}
      </div>
    </div>
  )
}