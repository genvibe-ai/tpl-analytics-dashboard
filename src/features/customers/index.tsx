import { useRef } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Download } from 'lucide-react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { customersPage, data, workspace } from '@/content'
import { downloadCsv } from '@/lib/csv'
import { fill, formatCurrency, formatDate, formatNumber } from '@/lib/format'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Main } from '@/components/layout/main'
import { CountUp } from '@/components/motion/count-up'
import { PageHeader } from '@/components/page-header'
import { CustomerDrawer } from './customer-drawer'
import { type CustomersTableHandle, CustomersTable } from './customers-table'

const route = getRouteApi('/_authenticated/customers/')

export function Customers() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const tableRef = useRef<CustomersTableHandle>(null)
  const open = search.customer ? data.customerById[search.customer] : undefined
  const summary = data.customerSummary

  const stats = [
    { label: customersPage.summary.total, value: summary.total, format: (v: number) => formatNumber(v) },
    { label: customersPage.summary.paying, value: summary.paying, format: (v: number) => formatNumber(v) },
    { label: customersPage.summary.trialing, value: summary.trialing, format: (v: number) => formatNumber(v) },
    { label: customersPage.summary.atRisk, value: summary.atRisk, format: (v: number) => formatNumber(v), tone: 'text-negative' },
    { label: customersPage.summary.arpa, value: summary.arpa, format: (v: number) => formatCurrency(v) },
  ]

  function exportCsv() {
    const rows = tableRef.current?.getRows() ?? data.customers
    const c = customersPage.columns
    downloadCsv(`${workspace.name.toLowerCase()}-customers.csv`, [
      [c.name, c.domain, c.status, c.plan, c.mrr, c.seats, c.health, c.region, c.lastActive],
      ...rows.map((r) => [
        r.name,
        r.domain,
        customersPage.statuses[r.status],
        r.plan,
        r.mrr,
        r.seats,
        r.health,
        r.region,
        formatDate(r.lastActive, 'date'),
      ]),
    ])
    toast.success(fill(customersPage.actions.exportDone, { count: formatNumber(rows.length) }))
  }

  return (
    <Main className='flex flex-1 flex-col gap-6'>
      <PageHeader
        title={customersPage.title}
        description={customersPage.description}
        actions={
          <Button variant='outline' onClick={exportCsv}>
            <Download />
            {customersPage.actions.export}
          </Button>
        }
      />

      <motion.dl
        className='grid grid-cols-2 gap-3 @xl/content:grid-cols-3 @5xl/content:grid-cols-5'
        initial='hidden'
        animate='show'
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
            className={cn('rounded-xl border bg-card px-4 py-3 shadow-card', i === stats.length - 1 && 'col-span-2 @xl/content:col-span-1')}
          >
            <dt className='text-xs text-muted-foreground'>{stat.label}</dt>
            <dd className={cn('mt-1 font-display text-xl font-semibold tracking-tight', stat.tone)}>
              <CountUp value={stat.value} format={stat.format} delay={0.1 + i * 0.05} />
            </dd>
          </motion.div>
        ))}
      </motion.dl>

      <CustomersTable
        ref={tableRef}
        data={data.customers}
        search={search}
        navigate={navigate}
        onOpen={(id) => navigate({ search: (prev) => ({ ...prev, customer: id }) })}
      />

      <CustomerDrawer
        customer={open}
        onClose={() => navigate({ search: (prev) => ({ ...prev, customer: undefined }) })}
      />
    </Main>
  )
}
