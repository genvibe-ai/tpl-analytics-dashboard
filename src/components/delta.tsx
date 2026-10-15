import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { formatDelta } from '@/lib/format'
import { cn } from '@/lib/utils'

type DeltaProps = {
  value: number
  unit?: '%' | 'pts'
  /** false when a rise is bad news (churn, costs). */
  upIsGood?: boolean
  decimals?: number
  className?: string
  variant?: 'pill' | 'plain'
}

/** Signed change with an arrow; mint when the change is good, rose when it is bad. */
export function Delta({
  value,
  unit = '%',
  upIsGood = true,
  decimals = 1,
  className,
  variant = 'pill',
}: DeltaProps) {
  const flat = Math.abs(value) < 0.05
  const good = flat ? null : value > 0 === upIsGood
  const Icon = flat ? Minus : value > 0 ? ArrowUpRight : ArrowDownRight
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 font-semibold tabular whitespace-nowrap',
        variant === 'pill' && 'rounded-md px-1.5 py-0.5 text-xs',
        good === true && 'text-positive',
        good === false && 'text-negative',
        good === null && 'text-muted-foreground',
        variant === 'pill' && good === true && 'bg-positive/12',
        variant === 'pill' && good === false && 'bg-negative/12',
        variant === 'pill' && good === null && 'bg-accent',
        className
      )}
    >
      <Icon className='size-3.5' aria-hidden='true' strokeWidth={2.4} />
      {formatDelta(value, unit, decimals)}
    </span>
  )
}
