import { customersPage } from '@/content'
import { cn } from '@/lib/utils'

export function healthTone(score: number) {
  if (score >= 70) return { label: customersPage.health.healthy, tone: 'positive' as const }
  if (score >= 40) return { label: customersPage.health.watch, tone: 'warning' as const }
  return { label: customersPage.health.atRisk, tone: 'negative' as const }
}

/** Health score: a short meter plus the number. The label is exposed to screen readers. */
export function HealthMeter({ score, className, showLabel = false }: { score: number; className?: string; showLabel?: boolean }) {
  const { label, tone } = healthTone(score)
  return (
    <span className={cn('inline-flex items-center gap-2', className)} title={label}>
      <span
        className='relative h-1.5 w-14 overflow-hidden rounded-full bg-accent'
        role='meter'
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={score}
        aria-label={label}
      >
        <span
          className={cn(
            'absolute inset-y-0 start-0 rounded-full',
            tone === 'positive' && 'bg-positive',
            tone === 'warning' && 'bg-warning',
            tone === 'negative' && 'bg-negative'
          )}
          style={{ width: `${Math.max(6, score)}%` }}
        />
      </span>
      <span className='text-[13px] font-medium tabular'>{score}</span>
      {showLabel && <span className='text-xs text-muted-foreground'>{label}</span>}
    </span>
  )
}
