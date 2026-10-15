import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { data, overview } from '@/content'
import { fill, formatDate, formatNumber } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useChartMotion } from '@/hooks/use-chart-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { axisProps, ChartLegend, roundedBar, TooltipCard } from '@/components/charts/chart-parts'

const upBar = roundedBar('top')
const downBar = roundedBar('bottom')

type Row = { week: string; signups: number; churned: number }

export function SignupsChart({ className }: { className?: string }) {
  const copy = overview.signups
  const motionProps = useChartMotion(300)
  const rows = useMemo<Row[]>(
    () => data.signupWeeks.map((w) => ({ week: w.week, signups: w.signups, churned: -w.churned })),
    []
  )
  const totals = data.signupWeeks.reduce(
    (acc, w) => ({ signups: acc.signups + w.signups, churned: acc.churned + w.churned }),
    { signups: 0, churned: 0 }
  )
  const net = totals.signups - totals.churned

  return (
    <Card className={cn('gap-4', className)}>
      <CardHeader>
        <CardTitle>{copy.title}</CardTitle>
        <CardDescription>{copy.description}</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-1 flex-col gap-4'>
        <dl className='grid grid-cols-3 gap-2'>
          {[
            { label: copy.legend.signups, value: `+${formatNumber(totals.signups)}`, tone: 'text-positive' },
            { label: copy.legend.churned, value: `−${formatNumber(totals.churned)}`, tone: 'text-negative' },
            { label: copy.net, value: `${net >= 0 ? '+' : '−'}${formatNumber(Math.abs(net))}`, tone: 'text-foreground' },
          ].map((stat) => (
            <div key={stat.label} className='rounded-lg border bg-muted/40 px-3 py-2'>
              <dt className='text-xs text-muted-foreground'>{stat.label}</dt>
              <dd className={cn('font-display text-lg font-semibold tabular', stat.tone)}>{stat.value}</dd>
            </div>
          ))}
        </dl>
        <div className='-ms-2 min-h-44 flex-1'>
          <ResponsiveContainer width='100%' height='100%' minWidth={0}>
            <BarChart data={rows} stackOffset='sign' margin={{ top: 6, right: 4, left: 0, bottom: 0 }} barCategoryGap='30%'>
              <CartesianGrid vertical={false} stroke='var(--chart-grid)' />
              <XAxis dataKey='week' tickFormatter={(v: string) => formatDate(v, 'day')} minTickGap={20} {...axisProps} />
              <YAxis width={28} allowDecimals={false} tickFormatter={(v: number) => formatNumber(Math.abs(v))} {...axisProps} />
              <ReferenceLine y={0} stroke='var(--chart-axis)' />
              <Tooltip
                cursor={{ fill: 'var(--accent)', opacity: 0.5 }}
                content={(props) => {
                  const row = props.payload?.[0]?.payload as Row | undefined
                  if (!props.active || !row) return null
                  return (
                    <TooltipCard
                      title={fill(copy.weekOf, { date: formatDate(row.week, 'day') })}
                      rows={[
                        { label: copy.legend.signups, value: formatNumber(row.signups), color: 'var(--positive)', kind: 'rect' },
                        { label: copy.legend.churned, value: formatNumber(-row.churned), color: 'var(--negative)', kind: 'rect' },
                      ]}
                      footer={`${copy.net} ${row.signups + row.churned >= 0 ? '+' : '−'}${Math.abs(row.signups + row.churned)}`}
                    />
                  )
                }}
              />
              <Bar dataKey='signups' stackId='w' fill='var(--positive)' shape={upBar} maxBarSize={16} {...motionProps} />
              <Bar dataKey='churned' stackId='w' fill='var(--negative)' shape={downBar} maxBarSize={16} {...motionProps} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <ChartLegend
          className='mt-auto'
          items={[
            { label: copy.legend.signups, color: 'var(--positive)' },
            { label: copy.legend.churned, color: 'var(--negative)' },
          ]}
        />
      </CardContent>
    </Card>
  )
}
