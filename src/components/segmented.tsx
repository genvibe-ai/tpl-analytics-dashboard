import { useId } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

type Option<T extends string> = { id: T; label: React.ReactNode; title?: string }

type SegmentedProps<T extends string> = {
  options: readonly Option<T>[]
  value: T
  onChange: (value: T) => void
  label: string
  size?: 'sm' | 'md'
  className?: string
}

/** A row of toggle buttons with a sliding highlight (range tabs, chart/table switch). */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  size = 'sm',
  className,
}: SegmentedProps<T>) {
  const layoutId = useId()
  return (
    <div
      role='group'
      aria-label={label}
      className={cn(
        'inline-flex shrink-0 items-center rounded-lg border bg-muted/60 p-0.5',
        className
      )}
    >
      {options.map((option) => {
        const active = option.id === value
        return (
          <button
            key={option.id}
            type='button'
            aria-pressed={active}
            title={option.title}
            onClick={() => onChange(option.id)}
            className={cn(
              'relative inline-flex items-center justify-center gap-1.5 rounded-md font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/60',
              size === 'sm' ? 'h-7 px-2.5 text-xs' : 'h-8 px-3 text-[13px]',
              active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className='absolute inset-0 rounded-md border border-border-strong bg-card shadow-sm dark:bg-accent'
                transition={{ type: 'spring', stiffness: 520, damping: 38 }}
              />
            )}
            <span className='relative inline-flex items-center gap-1.5'>{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}
