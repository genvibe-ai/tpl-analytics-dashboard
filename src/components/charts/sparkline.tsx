import { useMemo } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { useElementWidth } from '@/hooks/use-element-width'
import { cn } from '@/lib/utils'
import { useSvgId } from '@/hooks/use-svg-id'

type SparklineProps = {
  data: number[]
  /** Any CSS colour, e.g. 'var(--chart-1)'. */
  color?: string
  height?: number
  className?: string
  /** Fill the area under the line with a soft wash. */
  area?: boolean
  /** Show the end point. */
  dot?: boolean
  delay?: number
}

/** Small decorative trend line (values are always shown as text next to it). */
export function Sparkline({
  data,
  color = 'var(--chart-1)',
  height = 40,
  className,
  area = true,
  dot = true,
  delay = 0,
}: SparklineProps) {
  const [ref, width] = useElementWidth<HTMLDivElement>()
  const inView = useInView(ref, { once: true })
  const reduced = useReducedMotion()
  const gradientId = useSvgId()

  const { line, fill, end } = useMemo(() => {
    if (width <= 0 || data.length < 2) return { line: '', fill: '', end: null }
    const pad = dot ? 7 : 3
    const min = Math.min(...data)
    const max = Math.max(...data)
    const span = max - min || 1
    const points = data.map((v, i) => [
      pad + (i / (data.length - 1)) * (width - pad * 2),
      pad + (1 - (v - min) / span) * (height - pad * 2),
    ])
    // Smooth the line with a light Catmull-Rom → Bézier conversion.
    let d = `M${points[0][0]},${points[0][1]}`
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] ?? points[i]
      const p1 = points[i]
      const p2 = points[i + 1]
      const p3 = points[i + 2] ?? p2
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
      d += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`
    }
    const last = points[points.length - 1]
    const areaPath = `${d} L${last[0]},${height} L${points[0][0]},${height} Z`
    return { line: d, fill: areaPath, end: last }
  }, [data, width, height, dot])

  const play = inView && !reduced

  return (
    <div ref={ref} className={cn('w-full', className)} style={{ height }} aria-hidden='true'>
      {line && (
        <svg width={width} height={height} className='block overflow-visible'>
          <defs>
            <linearGradient id={gradientId} x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stopColor={color} stopOpacity={0.24} />
              <stop offset='100%' stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          {area && (
            <motion.path
              d={fill}
              fill={`url(#${gradientId})`}
              initial={reduced ? false : { opacity: 0 }}
              animate={play || reduced ? { opacity: 1 } : undefined}
              transition={{ duration: 0.6, delay: delay + 0.5 }}
            />
          )}
          <motion.path
            d={line}
            fill='none'
            stroke={color}
            strokeWidth={2}
            strokeLinecap='round'
            strokeLinejoin='round'
            initial={reduced ? false : { pathLength: 0 }}
            animate={play || reduced ? { pathLength: 1 } : undefined}
            transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
          />
          {dot && end && (
            <motion.circle
              cx={end[0]}
              cy={end[1]}
              r={4}
              fill={color}
              stroke='var(--card)'
              strokeWidth={2}
              initial={reduced ? false : { opacity: 0, scale: 0.4 }}
              animate={play || reduced ? { opacity: 1, scale: 1 } : undefined}
              transition={{ duration: 0.35, delay: delay + 1 }}
              style={{ transformOrigin: `${end[0]}px ${end[1]}px` }}
            />
          )}
        </svg>
      )}
    </div>
  )
}
