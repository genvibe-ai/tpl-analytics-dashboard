import { useMemo, useState } from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { data, overview } from '@/content'
import type { RevenuePoint } from '@/types'
import type { RevenueRange } from '@/data/metrics'
import { formatCurrency, formatDate, formatDelta } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useSvgId } from '@/hooks/use-svg-id'
import { useChartMotion } from '@/hooks/use-chart-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { axisProps, ChartLegend, TooltipCard } from '@/components/charts/chart-parts'
import { Delta } from '@/components/delta'
import { CountUp } from '@/components/motion/count-up'
import { Segmented } from '@/components/segmented'

const copy = overview.revenue

export function RevenueChart({ className }: { className?: string }) {
  const [range, setRange] = useState<RevenueRange>(copy.defaultRange)
  const series = useMemo(() => data.revenueSeries(range), [range])
  // Replays the draw-in when the range changes; resizes and theme switches draw instantly.
  const motionProps = useChartMotion(150, range)
  const gradientId = useSvgId()
  const monthly = series.granularity === 'month'

  const tickFormat = (iso: string) =>
    monthly ? formatDate(iso, 'month') : range === '7d' ? formatDate(iso, 'weekday') : formatDate(iso, 'day')

  return (
    <Card className={cn('gap-4', className)}>
      <CardHeader className='flex flex-wrap items-start justify-between gap-x-4 gap-y-3'>
        <div className='grid gap-1'>
          <CardTitle>{copy.title}</CardTitle>
          <CardDescription>{copy.description}</CardDescription>
        </div>
        <Segmented
          label={copy.rangesLabel}
          options={copy.ranges.map((r) => ({ id: r.id, label: r.label, title: r.caption }))}
          value={range}
          onChange={setRange}
        />
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <div className='flex flex-wrap items-end justify-between gap-x-6 gap-y-3'>
          <div className='flex flex-wrap items-baseline gap-x-3 gap-y-1'>
            <CountUp
              value={series.total}
              format={(v) => formatCurrency(v)}
              className='font-display text-3xl font-semibold tracking-tight sm:text-[34px]'
            />
            <span className='flex items-center gap-2 text-xs'>
              <Delta value={series.change} />
              <span className='text-muted-foreground'>{copy.vsPrevious}</span>
            </span>
          </div>
          <ChartLegend
            items={[
              { label: copy.legend.current, color: 'var(--chart-1)', kind: 'rect' },
              { label: copy.legend.previous, color: 'var(--chart-compare)', kind: 'line' },
            ]}
          />
        </div>
        <div className='-ms-2 h-64 sm:h-72'>
          <ResponsiveContainer width='100%' height='100%' minWidth={0}>
            <ComposedChart data={series.points} margin={{ top: 8, right: 6, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0%' stopColor='var(--chart-1)' stopOpacity={0.28} />
                  <stop offset='70%' stopColor='var(--chart-1)' stopOpacity={0.06} />
                  <stop offset='100%' stopColor='var(--chart-1)' stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke='var(--chart-grid)' />
              <XAxis dataKey='date' tickFormatter={tickFormat} minTickGap={28} {...axisProps} />
              <YAxis
                width={52}
                tickFormatter={(v: number) => formatCurrency(v, { compact: true, decimals: 0 })}
                {...axisProps}
              />
              <Tooltip
                cursor={{ stroke: 'var(--border-strong)', strokeWidth: 1 }}
                content={(props) => {
                  const point = props.payload?.[0]?.payload as RevenuePoint | undefined
                  if (!props.active || !point) return null
                  const change = point.previous ? ((point.value - point.previous) / point.previous) * 100 : 0
                  return (
                    <TooltipCard
                      title={formatDate(point.date, monthly ? 'monthLong' : 'date')}
                      rows={[
                        { label: copy.legend.current, value: formatCurrency(point.value), color: 'var(--chart-1)', kind: 'rect' },
                        { label: copy.legend.previous, value: formatCurrency(point.previous), color: 'var(--chart-compare)' },
                      ]}
                      footer={`${formatDelta(change)} ${copy.vsPrevious}`}
                    />
                  )
                }}
              />
              <Line
                type='monotone'
                dataKey='previous'
                stroke='var(--chart-compare)'
                strokeWidth={1.5}
                dot={false}
                activeDot={false}
                {...motionProps}
              />
              <Area
                type='monotone'
                dataKey='value'
                stroke='var(--chart-1)'
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                activeDot={{ r: 4.5, strokeWidth: 2, stroke: 'var(--card)', fill: 'var(--chart-1)' }}
                {...motionProps}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
