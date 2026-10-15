import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { data, overview } from '@/content'
import type { PlanMonth } from '@/types'
import { fill, formatCurrency, formatDate, formatPercent } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useChartMotion } from '@/hooks/use-chart-motion'
import { useSvgId } from '@/hooks/use-svg-id'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { axisProps, LegendKey, TooltipCard } from '@/components/charts/chart-parts'
import { CountUp } from '@/components/motion/count-up'

const PLANS = ['Starter', 'Growth', 'Scale', 'Enterprise'] as const
const planColor = (i: number) => `var(--plan-${i + 1})`

export function PlanChart({ className }: { className?: string }) {
  const copy = overview.plans
  const motionProps = useChartMotion(250)
  const gradientId = useSvgId()
  const total = PLANS.reduce((sum, p) => sum + data.planMrrNow[p], 0)

  return (
    <Card className={cn('gap-4', className)}>
      <CardHeader>
        <CardTitle>{copy.title}</CardTitle>
        <CardDescription>{copy.description}</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-1 flex-col gap-4'>
        <div>
          <div className='text-xs text-muted-foreground'>{copy.total}</div>
          <CountUp
            value={total}
            format={(v) => formatCurrency(v)}
            className='font-display text-2xl font-semibold tracking-tight'
          />
        </div>
        <div className='-ms-2 min-h-40 flex-1'>
          <ResponsiveContainer width='100%' height='100%' minWidth={0}>
            <BarChart data={data.planMonths} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barCategoryGap='22%'>
              <defs>
                {PLANS.map((plan, i) => (
                  <linearGradient key={plan} id={`${gradientId}-${i}`} x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='0%' stopColor={planColor(i)} />
                    <stop offset='100%' stopColor={`color-mix(in oklab, ${planColor(i)} 72%, black)`} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid vertical={false} stroke='var(--chart-grid)' strokeDasharray='3 6' />
              <XAxis dataKey='month' tickFormatter={(v: string) => formatDate(v, 'month')} {...axisProps} />
              <YAxis width={44} tickFormatter={(v: number) => formatCurrency(v, { compact: true, decimals: 0 })} {...axisProps} />
              <Tooltip
                cursor={{ fill: 'var(--accent)', opacity: 0.5 }}
                content={(props) => {
                  const row = props.payload?.[0]?.payload as PlanMonth | undefined
                  if (!props.active || !row) return null
                  const sum = PLANS.reduce((s, p) => s + row[p], 0)
                  return (
                    <TooltipCard
                      title={formatDate(row.month, 'monthLong')}
                      rows={[...PLANS].reverse().map((p) => ({
                        label: p,
                        value: formatCurrency(row[p]),
                        color: planColor(PLANS.indexOf(p)),
                        kind: 'rect',
                      }))}
                      footer={formatCurrency(sum)}
                    />
                  )
                }}
              />
              {PLANS.map((plan, i) => (
                <Bar
                  key={plan}
                  dataKey={plan}
                  stackId='mrr'
                  fill={`url(#${gradientId}-${i})`}
                  stroke='var(--card)'
                  strokeWidth={2}
                  maxBarSize={36}
                  radius={i === PLANS.length - 1 ? [7, 7, 0, 0] : 0}
                  {...motionProps}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <ul className='mt-auto grid gap-2'>
          {[...PLANS].reverse().map((plan) => {
            const i = PLANS.indexOf(plan)
            const mrr = data.planMrrNow[plan]
            return (
              <li key={plan} className='flex items-center gap-2.5 text-[13px]'>
                <LegendKey color={planColor(i)} />
                <span className='font-medium'>{plan}</span>
                <span className='text-xs text-muted-foreground'>
                  {fill(copy.accounts, { count: data.planCounts[plan] })}
                </span>
                <span className='ms-auto font-medium tabular'>{formatCurrency(mrr, { compact: true })}</span>
                <span className='w-12 text-end text-xs text-muted-foreground tabular'>
                  {formatPercent((mrr / total) * 100, 0)}
                </span>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
