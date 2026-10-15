import { useMemo } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { data, reports, theme } from '@/content'
import { mixOklab, readableText } from '@/lib/color'
import { fill, formatDate, formatNumber, formatPercent } from '@/lib/format'
import { useTheme } from '@/context/theme-provider'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ReportCard } from './report-card'

const copy = reports.cohorts
const MONTHS = 12
/** Retention values are mapped onto the colour ramp between these bounds. */
const SCALE_MIN = 60
const SCALE_MAX = 100

export function CohortHeatmap({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme()
  const reduced = useReducedMotion()
  const palette = theme.charts[resolvedTheme]
  const ink = theme.colors[resolvedTheme].foreground

  const cellColor = useMemo(() => {
    const cache = new Map<number, { bg: string; fg: string }>()
    return (value: number) => {
      const key = Math.round(value * 10)
      let hit = cache.get(key)
      if (!hit) {
        const t = Math.min(1, Math.max(0, (value - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)))
        const bg = mixOklab(palette.heatLow, palette.heatHigh, 0.08 + t * 0.92)
        hit = { bg, fg: readableText(bg, resolvedTheme === 'dark' ? '#0B0D12' : ink) }
        cache.set(key, hit)
      }
      return hit
    }
  }, [palette, ink, resolvedTheme])

  const scaleStops = [0, 0.25, 0.5, 0.75, 1].map((t) => mixOklab(palette.heatLow, palette.heatHigh, 0.08 + t * 0.92))

  return (
    <ReportCard title={copy.title} description={copy.description} className={className} toggle={false}>
      {() => (
        <div className='grid gap-4'>
          <div className='-mx-5 overflow-x-auto px-5 pb-1'>
            <table className='w-full min-w-[46rem] border-separate border-spacing-1 text-xs'>
              <thead>
                <tr>
                  <th scope='col' className='sticky start-0 z-10 bg-card pe-3 text-start font-medium text-muted-foreground'>
                    {copy.cohort}
                  </th>
                  <th scope='col' className='pe-2 text-end font-medium text-muted-foreground'>
                    {copy.size}
                  </th>
                  {Array.from({ length: MONTHS }, (_, m) => (
                    <th key={m} scope='col' className='text-center font-medium text-muted-foreground'>
                      <abbr title={fill(copy.month, { n: m })} className='no-underline'>
                        {fill(copy.monthShort, { n: m })}
                      </abbr>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.cohorts.map((cohort, row) => (
                  <tr key={cohort.month}>
                    <th scope='row' className='sticky start-0 z-10 bg-card pe-3 text-start font-medium whitespace-nowrap'>
                      {formatDate(cohort.month, 'monthYear')}
                    </th>
                    <td className='pe-2 text-end text-muted-foreground tabular'>{formatNumber(cohort.size)}</td>
                    {Array.from({ length: MONTHS }, (_, m) => {
                      const value = cohort.retention[m]
                      if (value === undefined) return <td key={m} aria-hidden='true' />
                      const { bg, fg } = cellColor(value)
                      const retained = Math.round((cohort.size * value) / 100)
                      return (
                        <td key={m} className='p-0'>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <motion.div
                                tabIndex={0}
                                initial={reduced ? false : { opacity: 0, scale: 0.85 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.35, delay: reduced ? 0 : (row + m) * 0.018 }}
                                className='grid h-9 min-w-11 place-items-center rounded-md font-semibold tabular outline-none transition-[box-shadow,transform] hover:z-10 hover:scale-[1.06] hover:shadow-[0_0_0_2px_var(--card),0_0_0_4px_var(--primary)] focus-visible:shadow-[0_0_0_2px_var(--card),0_0_0_4px_var(--primary)]'
                                style={{ backgroundColor: bg, color: fg }}
                              >
                                {Math.round(value)}
                              </motion.div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <span className='font-medium'>
                                {formatDate(cohort.month, 'monthYear')} · {fill(copy.month, { n: m })}
                              </span>
                              <br />
                              {fill(copy.tooltip, {
                                value: formatPercent(value),
                                count: formatNumber(retained),
                                size: formatNumber(cohort.size),
                              })}
                            </TooltipContent>
                          </Tooltip>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='flex flex-wrap items-center gap-x-3 gap-y-1 text-xs whitespace-nowrap text-muted-foreground'>
            <span>{copy.scaleLow}</span>
            <span className='flex h-2 w-28 overflow-hidden rounded-full sm:w-40' aria-hidden='true'>
              {scaleStops.map((color) => (
                <span key={color} className='flex-1' style={{ background: color }} />
              ))}
            </span>
            <span>{copy.scaleHigh}</span>
            <span className='tabular sm:ms-auto'>
              {SCALE_MIN}% – {SCALE_MAX}%
            </span>
          </div>
        </div>
      )}
    </ReportCard>
  )
}
