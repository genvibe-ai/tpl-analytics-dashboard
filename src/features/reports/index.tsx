import { CalendarClock, Download } from 'lucide-react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { data, reports } from '@/content'
import { fill, formatDelta, formatSignedCurrency } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { Main } from '@/components/layout/main'
import { FadeIn } from '@/components/motion/fade-in'
import { PageHeader } from '@/components/page-header'
import { ChannelChart } from './channel-chart'
import { CohortHeatmap } from './cohort-heatmap'
import { MovementsChart } from './movements-chart'

function highlights() {
  const start = data.mrrMovements.find((m) => m.id === 'start')!.value
  // Month-6 retention: the newest cohort that has six months of data vs the oldest cohort.
  const withSix = data.cohorts.filter((c) => c.retention.length > 6)
  const newest = withSix[withSix.length - 1]
  const oldest = withSix[0]
  // Channel growth: the last 6 months vs the 6 months before.
  const growth = data.channelKeys.map((key) => {
    const first = data.channelMonths.slice(0, 6).reduce((s, r) => s + Number(r[key]), 0)
    const last = data.channelMonths.slice(-6).reduce((s, r) => s + Number(r[key]), 0)
    return { key, change: ((last - first) / first) * 100 }
  })
  const best = growth.sort((a, b) => b.change - a.change)[0]

  return [
    {
      label: reports.highlights.net,
      value: formatSignedCurrency(data.netNewMrr),
      caption: fill(reports.highlights.netCaption, { change: formatDelta((data.netNewMrr / start) * 100) }),
    },
    {
      label: reports.highlights.retention,
      value: `${newest.retention[6].toFixed(1)}%`,
      caption: fill(reports.highlights.retentionCaption, {
        change: formatDelta(newest.retention[6] - oldest.retention[6], 'pts'),
      }),
    },
    {
      label: reports.highlights.channel,
      value: reports.channels.labels[best.key],
      caption: fill(reports.highlights.channelCaption, { change: formatDelta(best.change) }),
    },
  ]
}

export function Reports() {
  return (
    <Main className='flex flex-col gap-6'>
      <PageHeader
        eyebrow={reports.period}
        title={reports.title}
        description={reports.description}
        actions={
          <>
            <Button variant='outline' onClick={() => toast.success(reports.actions.scheduleDone)}>
              <CalendarClock />
              {reports.actions.schedule}
            </Button>
            <Button onClick={() => toast.success(reports.actions.exportDone)}>
              <Download />
              {reports.actions.export}
            </Button>
          </>
        }
      />

      <motion.dl
        className='grid grid-cols-1 gap-3 @2xl/content:grid-cols-3'
        initial='hidden'
        animate='show'
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
      >
        {highlights().map((item) => (
          <motion.div
            key={item.label}
            variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
            className='relative overflow-hidden rounded-xl border bg-card px-4 py-3.5 shadow-card'
          >
            <span aria-hidden='true' className='absolute inset-y-0 start-0 w-0.5 bg-primary' />
            <dt className='text-xs text-muted-foreground'>{item.label}</dt>
            <dd className='mt-1 font-display text-xl font-semibold tracking-tight'>{item.value}</dd>
            <dd className='mt-0.5 text-xs text-muted-foreground'>{item.caption}</dd>
          </motion.div>
        ))}
      </motion.dl>

      <div className='grid grid-cols-1 gap-4 @6xl/content:grid-cols-2'>
        <FadeIn>
          <MovementsChart className='h-full' />
        </FadeIn>
        <FadeIn delay={0.08}>
          <ChannelChart className='h-full' />
        </FadeIn>
      </div>
      <FadeIn>
        <CohortHeatmap />
      </FadeIn>
    </Main>
  )
}
