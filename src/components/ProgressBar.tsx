type Props = { value: number; total: number; className?: string; barClassName?: string }

export function ProgressBar({ value, total, className = 'bg-black/10', barClassName = 'bg-ink' }: Props) {
  const pct = total === 0 ? 0 : Math.round((value / total) * 100)
  return (
    <div
      className={`h-1.5 w-full overflow-hidden rounded-full ${className}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={`h-full rounded-full transition-all duration-500 ${barClassName}`} style={{ width: `${pct}%` }} />
    </div>
  )
}
