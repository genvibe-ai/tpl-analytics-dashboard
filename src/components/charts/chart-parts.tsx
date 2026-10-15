import { cn } from '@/lib/utils'

export type LegendItem = {
  label: string
  color: string
  /** Mirrors the mark: a line for lines, a square for bars and areas. */
  kind?: 'line' | 'rect'
  value?: string
  muted?: boolean
  onClick?: () => void
  pressed?: boolean
  title?: string
}

export function LegendKey({ color, kind = 'rect' }: { color: string; kind?: 'line' | 'rect' }) {
  return kind === 'line' ? (
    <span className='h-0.5 w-3.5 shrink-0 rounded-full' style={{ background: color }} aria-hidden='true' />
  ) : (
    <span className='size-2.5 shrink-0 rounded-[3px]' style={{ background: color }} aria-hidden='true' />
  )
}

/** Chart legend. Items with onClick become toggle buttons (hide / show a series). */
export function ChartLegend({ items, className }: { items: LegendItem[]; className?: string }) {
  return (
    <ul className={cn('flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground', className)}>
      {items.map((item) => {
        const content = (
          <>
            <LegendKey color={item.color} kind={item.kind} />
            <span className={cn(item.muted && 'line-through decoration-1')}>{item.label}</span>
            {item.value && <span className='font-medium text-foreground tabular'>{item.value}</span>}
          </>
        )
        return (
          <li key={item.label}>
            {item.onClick ? (
              <button
                type='button'
                onClick={item.onClick}
                aria-pressed={item.pressed}
                title={item.title}
                className={cn(
                  '-mx-1.5 inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 transition-[opacity,background-color] hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none',
                  item.muted && 'opacity-55'
                )}
              >
                {content}
              </button>
            ) : (
              <span className='inline-flex items-center gap-1.5'>{content}</span>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export type TooltipRow = {
  label: string
  value: string
  color: string
  kind?: 'line' | 'rect'
}

/** The card shown on hover. Values lead, labels follow. */
export function TooltipCard({ title, rows, footer }: { title: string; rows: TooltipRow[]; footer?: React.ReactNode }) {
  return (
    <div className='min-w-40 rounded-lg border bg-popover/95 px-3 py-2.5 text-xs shadow-float backdrop-blur-sm'>
      <div className='mb-1.5 font-medium text-muted-foreground'>{title}</div>
      <div className='space-y-1'>
        {rows.map((row) => (
          <div key={row.label} className='flex items-center gap-2'>
            <LegendKey color={row.color} kind={row.kind ?? 'line'} />
            <span className='font-semibold text-foreground tabular'>{row.value}</span>
            <span className='ms-auto ps-3 text-muted-foreground'>{row.label}</span>
          </div>
        ))}
      </div>
      {footer && <div className='mt-2 border-t pt-1.5 text-muted-foreground'>{footer}</div>}
    </div>
  )
}

/** Shared axis styling for Recharts. */
export const axisProps = {
  stroke: 'var(--chart-axis)',
  tickLine: false,
  axisLine: false,
  tick: { fill: 'var(--muted-foreground)', fontSize: 11 },
  tickMargin: 8,
} as const

type BarShapeProps = {
  x?: number
  y?: number
  width?: number
  height?: number
  fill?: string
  payload?: { value?: number }
}

/**
 * Bar shape with a 4px rounded data end and a square baseline.
 * `tip`: 'top' for bars that grow up, 'bottom' for bars that grow down, 'auto' to follow the sign
 * of `payload.value`.
 */
export function roundedBar(tip: 'top' | 'bottom' | 'auto' = 'top', radius = 4, horizontal = false) {
  return function RoundedBar(props: unknown) {
    const { x = 0, y = 0, width = 0, height = 0, fill, payload } = props as BarShapeProps
    const top = Math.min(y, y + height)
    const left = Math.min(x, x + width)
    const h = Math.abs(height)
    const w = Math.abs(width)
    if (h <= 0 || w <= 0) return <g />
    const positive = tip === 'auto' ? (payload?.value ?? 0) >= 0 : tip === 'top'
    const right = left + w
    const bottom = top + h
    if (horizontal) {
      // Bars grow sideways: round the right end for gains, the left end for losses.
      const r = Math.min(radius, w, h / 2)
      const d = positive
        ? `M${left},${top} L${right - r},${top} Q${right},${top} ${right},${top + r} L${right},${bottom - r} Q${right},${bottom} ${right - r},${bottom} L${left},${bottom} Z`
        : `M${right},${top} L${left + r},${top} Q${left},${top} ${left},${top + r} L${left},${bottom - r} Q${left},${bottom} ${left + r},${bottom} L${right},${bottom} Z`
      return <path d={d} fill={fill} />
    }
    const r = Math.min(radius, h, w / 2)
    const d = positive
      ? `M${left},${bottom} L${left},${top + r} Q${left},${top} ${left + r},${top} L${right - r},${top} Q${right},${top} ${right},${top + r} L${right},${bottom} Z`
      : `M${left},${top} L${right},${top} L${right},${bottom - r} Q${right},${bottom} ${right - r},${bottom} L${left + r},${bottom} Q${left},${bottom} ${left},${bottom - r} Z`
    return <path d={d} fill={fill} />
  }
}
