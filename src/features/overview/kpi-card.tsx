import type { CSSProperties } from 'react'
import { Info } from 'lucide-react'
import { motion } from 'motion/react'
import { common, data, overview } from '@/content'
import { formatKpi } from '@/lib/format'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Sparkline } from '@/components/charts/sparkline'
import { Delta } from '@/components/delta'
import { CountUp } from '@/components/motion/count-up'

type KpiDefinition = (typeof overview.kpis)[number]

export const kpiItemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
}

export function KpiCard({ kpi, index }: { kpi: KpiDefinition; index: number }) {
  const metric = data.kpiValues[kpi.id]
  const Icon = kpi.icon
  // Each card has its own accent (theme.charts.*.kpis in content.ts), used by the tile, glow and line.
  const accent = `var(--kpi-${index + 1})`
  return (
    <motion.article
      variants={kpiItemVariants}
      style={{ '--kpi': accent } as CSSProperties}
      className='group relative isolate flex min-w-0 flex-col overflow-hidden rounded-xl border bg-card shadow-card transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-float'
    >
      {/* A soft pool of the accent behind the trend line; brightens on hover. */}
      <span
        aria-hidden='true'
        className='pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-28 bg-[radial-gradient(70%_100%_at_85%_100%,color-mix(in_oklab,var(--kpi)_22%,transparent),transparent_70%)] opacity-80 transition-opacity duration-300 group-hover:opacity-100'
      />
      <div className='flex items-center justify-between gap-2 px-5 pt-4'>
        <h2 className='flex min-w-0 items-center gap-2 font-sans text-[13px] font-medium tracking-normal text-muted-foreground'>
          <span className='grid size-7 shrink-0 place-items-center rounded-lg bg-[color-mix(in_oklab,var(--kpi)_16%,transparent)] text-(--kpi) ring-1 ring-[color-mix(in_oklab,var(--kpi)_28%,transparent)] ring-inset'>
            <Icon className='size-3.5' aria-hidden='true' />
          </span>
          <span className='line-clamp-2 leading-snug'>{kpi.label}</span>
        </h2>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type='button'
              aria-label={`${common.info}: ${kpi.label}`}
              className='grid size-6 shrink-0 place-items-center rounded-md text-muted-foreground/80 transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none'
            >
              <Info className='size-3.5' />
            </button>
          </TooltipTrigger>
          <TooltipContent side='top' className='max-w-56'>
            {kpi.hint}
          </TooltipContent>
        </Tooltip>
      </div>
      <div className='px-5 pt-3'>
        <CountUp
          value={metric.value}
          format={(v) => formatKpi(v, kpi.format)}
          delay={0.15 + index * 0.08}
          className='block font-display text-[28px] leading-none font-semibold tracking-tight'
        />
        <div className='mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs'>
          <Delta value={metric.delta} unit={kpi.deltaUnit} upIsGood={kpi.upIsGood} />
          <span className='text-muted-foreground'>{overview.deltaCaption}</span>
        </div>
      </div>
      <div className='mt-auto pt-3'>
        <Sparkline data={metric.trend} color={accent} height={64} delay={0.3 + index * 0.08} />
      </div>
    </motion.article>
  )
}
