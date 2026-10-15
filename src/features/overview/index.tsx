import { Download, Share2 } from 'lucide-react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { data, overview, user, workspace } from '@/content'
import { downloadCsv } from '@/lib/csv'
import { fill, formatDate } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { Main } from '@/components/layout/main'
import { FadeIn } from '@/components/motion/fade-in'
import { PageHeader } from '@/components/page-header'
import { ActivityFeed } from './activity-feed'
import { KpiCard } from './kpi-card'
import { PlanChart } from './plan-chart'
import { RevenueChart } from './revenue-chart'
import { SignupsChart } from './signups-chart'
import { TopAccounts } from './top-accounts'

function greeting() {
  const hour = new Date().getHours()
  const template =
    hour < 12 ? overview.greeting.morning : hour < 18 ? overview.greeting.afternoon : overview.greeting.evening
  return fill(template, { name: user.name.split(' ')[0] })
}

function exportOverview() {
  const rows: (string | number)[][] = [[overview.csv.metric, overview.csv.value, overview.csv.change]]
  for (const kpi of overview.kpis) {
    const metric = data.kpiValues[kpi.id]
    rows.push([kpi.label, Number(metric.value.toFixed(2)), `${metric.delta.toFixed(1)} ${kpi.deltaUnit}`])
  }
  rows.push([], [overview.csv.date, overview.revenue.legend.current, overview.revenue.legend.previous])
  for (const point of data.revenueSeries('30d').points) {
    rows.push([formatDate(point.date, 'date'), point.value, point.previous])
  }
  downloadCsv(`${workspace.name.toLowerCase()}-overview.csv`, rows)
  toast.success(overview.actions.exportDone)
}

async function shareOverview() {
  try {
    await navigator.clipboard.writeText(window.location.href)
  } catch {
    // Clipboard can be blocked in embedded previews; the toast still confirms the action.
  }
  toast.success(overview.actions.shareDone)
}

export function Overview() {
  return (
    <Main>
      <PageHeader
        eyebrow={formatDate(new Date(), 'long')}
        title={greeting()}
        description={fill(overview.description, { workspace: workspace.name })}
        actions={
          <>
            <Button variant='outline' onClick={shareOverview}>
              <Share2 />
              {overview.actions.share}
            </Button>
            <Button onClick={exportOverview}>
              <Download />
              {overview.actions.export}
            </Button>
          </>
        }
      />

      <motion.section
        aria-label={overview.kpisLabel}
        className='mt-6 grid grid-cols-1 gap-4 @xl/content:grid-cols-2 @5xl/content:grid-cols-4'
        initial='hidden'
        animate='show'
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } }}
      >
        {overview.kpis.map((kpi, index) => (
          <KpiCard key={kpi.id} kpi={kpi} index={index} />
        ))}
      </motion.section>

      <div className='mt-4 grid grid-cols-1 gap-4 @3xl/content:grid-cols-2 @6xl/content:grid-cols-3'>
        <FadeIn delay={0.15} className='@3xl/content:col-span-2'>
          <RevenueChart className='h-full' />
        </FadeIn>
        <FadeIn delay={0.25} className='@max-6xl/content:order-last @3xl/content:col-span-2 @6xl/content:col-span-1 @6xl/content:row-span-2'>
          <ActivityFeed className='h-full @max-6xl/content:max-h-[34rem]' />
        </FadeIn>
        <FadeIn delay={0.1}>
          <PlanChart className='h-full' />
        </FadeIn>
        <FadeIn delay={0.18}>
          <SignupsChart className='h-full' />
        </FadeIn>
      </div>

      <FadeIn className='mt-4'>
        <TopAccounts />
      </FadeIn>
    </Main>
  )
}
