import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { data, reports } from '@/content'
import type { ChannelMonth } from '@/types'
import { fill, formatCurrency, formatDate } from '@/lib/format'
import { useChartMotion } from '@/hooks/use-chart-motion'
import { useElementWidth } from '@/hooks/use-element-width'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { axisProps, ChartLegend, roundedBar, TooltipCard } from '@/components/charts/chart-parts'
import { ReportCard } from './report-card'

const copy = reports.channels
type Key = (typeof data.channelKeys)[number]
/** Colour follows the channel, never its rank, so hiding one never repaints the others. */
const colorOf = (key: Key) => `var(--chart-${data.channelKeys.indexOf(key) + 1})`
const topBar = roundedBar('top')

export function ChannelChart({ className }: { className?: string }) {
  const motionProps = useChartMotion(150)
  const [ref, width] = useElementWidth<HTMLDivElement>()
  // Every other month on narrow (phone) cards, so the labels stay evenly spaced instead of being thinned at random.
  const narrow = width > 0 && width < 420
  const [hidden, setHidden] = useState<Key[]>([])
  const visible = data.channelKeys.filter((k) => !hidden.includes(k))
  const total = (row: ChannelMonth) => visible.reduce((sum, k) => sum + Number(row[k]), 0)

  const toggle = (key: Key) =>
    setHidden((list) =>
      list.includes(key) ? list.filter((k) => k !== key) : list.length < data.channelKeys.length - 1 ? [...list, key] : list
    )

  return (
    <ReportCard title={copy.title} description={copy.description} className={className}>
      {(view) =>
        view === 'chart' ? (
          <div className='grid gap-4'>
            <ChartLegend
              items={data.channelKeys.map((key) => ({
                label: copy.labels[key],
                color: colorOf(key),
                muted: hidden.includes(key),
                pressed: !hidden.includes(key),
                title: fill(copy.toggle, { channel: copy.labels[key] }),
                onClick: () => toggle(key),
              }))}
            />
            <div ref={ref} className='-ms-2 h-72'>
              <ResponsiveContainer width='100%' height='100%' minWidth={0}>
                <BarChart data={data.channelMonths} margin={{ top: 6, right: 4, left: 0, bottom: 0 }} barCategoryGap='24%'>
                  <CartesianGrid vertical={false} stroke='var(--chart-grid)' />
                  <XAxis
                    dataKey='month'
                    interval={narrow ? 1 : 0}
                    tickFormatter={(v: string) => formatDate(v, 'month')}
                    {...axisProps}
                  />
                  <YAxis width={48} tickFormatter={(v: number) => formatCurrency(v, { compact: true, decimals: 0 })} {...axisProps} />
                  <Tooltip
                    cursor={{ fill: 'var(--accent)', opacity: 0.5 }}
                    content={(props) => {
                      const row = props.payload?.[0]?.payload as ChannelMonth | undefined
                      if (!props.active || !row) return null
                      return (
                        <TooltipCard
                          title={formatDate(String(row.month), 'monthLong')}
                          rows={[...visible].reverse().map((key) => ({
                            label: copy.labels[key],
                            value: formatCurrency(Number(row[key])),
                            color: colorOf(key),
                            kind: 'rect' as const,
                          }))}
                          footer={`${copy.total} ${formatCurrency(total(row))}`}
                        />
                      )
                    }}
                  />
                  {visible.map((key, i) => (
                    <Bar
                      key={key}
                      dataKey={key}
                      stackId='channels'
                      fill={colorOf(key)}
                      stroke='var(--card)'
                      strokeWidth={2}
                      maxBarSize={24}
                      shape={i === visible.length - 1 ? topBar : undefined}
                      {...motionProps}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className='hover:bg-transparent'>
                <TableHead>{copy.month}</TableHead>
                {data.channelKeys.map((key) => (
                  <TableHead key={key} className='text-end'>
                    {copy.labels[key]}
                  </TableHead>
                ))}
                <TableHead className='text-end'>{copy.total}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.channelMonths.map((row) => (
                <TableRow key={String(row.month)}>
                  <TableCell className='font-medium'>{formatDate(String(row.month), 'monthYear')}</TableCell>
                  {data.channelKeys.map((key) => (
                    <TableCell key={key} className='text-end tabular'>
                      {formatCurrency(Number(row[key]))}
                    </TableCell>
                  ))}
                  <TableCell className='text-end font-medium tabular'>
                    {formatCurrency(data.channelKeys.reduce((s, k) => s + Number(row[k]), 0))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      }
    </ReportCard>
  )
}
