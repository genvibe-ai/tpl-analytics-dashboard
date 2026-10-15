import { ArrowRight } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { data, reports } from '@/content'
import { formatCurrency, formatPercent, formatSignedCurrency } from '@/lib/format'
import { useChartMotion } from '@/hooks/use-chart-motion'
import { useElementWidth } from '@/hooks/use-element-width'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { axisProps, ChartLegend, roundedBar, TooltipCard } from '@/components/charts/chart-parts'
import { ReportCard } from './report-card'

const copy = reports.movements

type Row = { id: string; label: string; value: number; color: string }

const movementBar = roundedBar('auto')
const movementBarHorizontal = roundedBar('auto', 4, true)

export function MovementsChart({ className }: { className?: string }) {
  const start = data.mrrMovements.find((m) => m.id === 'start')!.value
  const end = data.mrrMovements.find((m) => m.id === 'end')!.value
  const movements = data.mrrMovements.filter((m) => m.id !== 'start' && m.id !== 'end')

  const rows: Row[] = [
    ...movements.map((m) => ({
      id: m.id,
      label: copy.labels[m.id],
      value: m.value,
      color: m.value >= 0 ? 'var(--positive)' : 'var(--negative)',
    })),
    { id: 'net', label: copy.labels.net, value: data.netNewMrr, color: 'var(--chart-1)' },
  ]

  return (
    <ReportCard title={copy.title} description={copy.description} className={className}>
      {(view) => (
        <div className='grid gap-5'>
          <div className='flex flex-wrap items-center gap-x-4 gap-y-2'>
            <Figure label={copy.labels.start} value={formatCurrency(start)} />
            <ArrowRight className='size-4 text-muted-foreground' aria-hidden='true' />
            <Figure label={copy.labels.end} value={formatCurrency(end)} strong />
            <span className='rounded-md bg-positive/12 px-2 py-1 text-xs font-semibold text-positive tabular'>
              {formatSignedCurrency(data.netNewMrr)} · {formatPercent((data.netNewMrr / start) * 100)}
            </span>
          </div>

          {view === 'chart' ? (
            <>
              <MovementsBars rows={rows} start={start} />
              <ChartLegend
                items={[
                  { label: copy.legend.gain, color: 'var(--positive)' },
                  { label: copy.legend.loss, color: 'var(--negative)' },
                  { label: copy.legend.total, color: 'var(--chart-1)' },
                ]}
              />
            </>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className='hover:bg-transparent'>
                  <TableHead>{copy.table.movement}</TableHead>
                  <TableHead className='text-end'>{copy.table.amount}</TableHead>
                  {/* Allowed to wrap so the three columns fit a phone without scrolling. */}
                  <TableHead className='max-w-32 text-end leading-tight whitespace-normal'>{copy.table.share}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className='font-medium'>{copy.labels.start}</TableCell>
                  <TableCell className='text-end tabular'>{formatCurrency(start)}</TableCell>
                  <TableCell className='text-end text-muted-foreground tabular'>{formatPercent(100, 0)}</TableCell>
                </TableRow>
                {movements.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>{copy.labels[m.id]}</TableCell>
                    <TableCell className={m.value >= 0 ? 'text-end text-positive tabular' : 'text-end text-negative tabular'}>
                      {formatSignedCurrency(m.value)}
                    </TableCell>
                    <TableCell className='text-end text-muted-foreground tabular'>
                      {formatPercent((m.value / start) * 100)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow className='hover:bg-transparent'>
                  <TableCell className='font-semibold'>{copy.labels.end}</TableCell>
                  <TableCell className='text-end font-semibold tabular'>{formatCurrency(end)}</TableCell>
                  <TableCell className='text-end tabular'>{formatPercent((end / start) * 100)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          )}
        </div>
      )}
    </ReportCard>
  )
}

/** Vertical bars on wide cards; horizontal bars (labels on the left) on narrow ones. */
function MovementsBars({ rows, start }: { rows: Row[]; start: number }) {
  const motionProps = useChartMotion(150)
  const [ref, width] = useElementWidth<HTMLDivElement>()
  const narrow = width > 0 && width < 520

  const tooltip = (
    <Tooltip
      cursor={{ fill: 'var(--accent)', opacity: 0.5 }}
      content={(props) => {
        const row = props.payload?.[0]?.payload as Row | undefined
        if (!props.active || !row) return null
        return (
          <TooltipCard
            title={row.label}
            rows={[{ label: formatPercent((row.value / start) * 100), value: formatSignedCurrency(row.value), color: row.color, kind: 'rect' }]}
          />
        )
      }}
    />
  )

  return (
    <div ref={ref} className={narrow ? 'h-80' : '-ms-2 h-72'}>
      {width > 0 && (
        <ResponsiveContainer width='100%' height='100%' minWidth={0}>
          {narrow ? (
            <BarChart data={rows} layout='vertical' margin={{ top: 0, right: 56, left: 0, bottom: 0 }} barCategoryGap='22%'>
              <CartesianGrid horizontal={false} stroke='var(--chart-grid)' />
              <XAxis type='number' hide domain={[(min: number) => Math.min(0, min * 1.15), 'auto']} />
              <YAxis type='category' dataKey='label' width={92} {...axisProps} />
              <ReferenceLine x={0} stroke='var(--chart-axis)' />
              {tooltip}
              <Bar dataKey='value' maxBarSize={22} shape={movementBarHorizontal} {...motionProps}>
                {rows.map((row) => (
                  <Cell key={row.id} fill={row.color} />
                ))}
                <LabelList dataKey='value' content={<SideLabel />} />
              </Bar>
            </BarChart>
          ) : (
            <BarChart data={rows} margin={{ top: 22, right: 8, left: 0, bottom: 16 }} barCategoryGap='26%'>
              <CartesianGrid vertical={false} stroke='var(--chart-grid)' />
              <XAxis dataKey='label' interval={0} {...axisProps} tick={<WrappedTick />} />
              <YAxis
                width={52}
                domain={[(min: number) => Math.min(0, min * 1.8), (max: number) => max * 1.12]}
                tickFormatter={(v: number) => formatCurrency(v, { compact: true, decimals: 0 })}
                {...axisProps}
              />
              <ReferenceLine y={0} stroke='var(--chart-axis)' />
              {tooltip}
              <Bar dataKey='value' maxBarSize={28} shape={movementBar} {...motionProps}>
                {rows.map((row) => (
                  <Cell key={row.id} fill={row.color} />
                ))}
                <LabelList dataKey='value' content={<TipLabel />} />
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  )
}

/** Value to the right of a horizontal bar (for losses, just right of the zero line). */
function SideLabel(props: { x?: number | string; y?: number | string; width?: number | string; height?: number | string; value?: number | string }) {
  const x = Number(props.x ?? 0)
  const y = Number(props.y ?? 0)
  const width = Number(props.width ?? 0)
  const height = Number(props.height ?? 0)
  const value = Number(props.value ?? 0)
  const end = Math.max(x, x + width) + 6
  return (
    <text x={end} y={y + height / 2} dy={4} textAnchor='start' fontSize={11} fontWeight={600} fill='var(--foreground)'>
      {formatSignedCurrency(value, { compact: true })}
    </text>
  )
}

function Figure({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className='grid leading-tight'>
      <span className='text-xs text-muted-foreground'>{label}</span>
      <span className={strong ? 'font-display text-xl font-semibold tracking-tight' : 'font-display text-xl font-medium tracking-tight text-muted-foreground'}>
        {value}
      </span>
    </div>
  )
}

/** Value at the tip of each bar: above for gains, below for losses. */
function TipLabel(props: { x?: number | string; y?: number | string; width?: number | string; height?: number | string; value?: number | string }) {
  const x = Number(props.x ?? 0)
  const y = Number(props.y ?? 0)
  const width = Number(props.width ?? 0)
  const height = Number(props.height ?? 0)
  const value = Number(props.value ?? 0)
  const negative = value < 0
  // Recharts gives negative bars a negative height; the tip is the far end from zero.
  const tip = negative ? Math.max(y, y + height) + 15 : Math.min(y, y + height) - 7
  return (
    <text x={x + width / 2} y={tip} textAnchor='middle' fontSize={11} fontWeight={600} fill='var(--foreground)'>
      {formatSignedCurrency(value, { compact: true })}
    </text>
  )
}

/** X-axis label that wraps onto two lines when it has two words. */
function WrappedTick(props: { x?: number | string; y?: number | string; payload?: { value: string } }) {
  const words = String(props.payload?.value ?? '').split(' ')
  return (
    <text x={Number(props.x ?? 0)} y={Number(props.y ?? 0) + 10} textAnchor='middle' fontSize={11} fill='var(--muted-foreground)'>
      {words.length > 1 ? (
        <>
          <tspan x={Number(props.x ?? 0)} dy={0}>{words[0]}</tspan>
          <tspan x={Number(props.x ?? 0)} dy={13}>{words.slice(1).join(' ')}</tspan>
        </>
      ) : (
        words[0]
      )}
    </text>
  )
}
