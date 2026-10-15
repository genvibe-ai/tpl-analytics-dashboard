import { useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Copy, Mail, MessageSquare } from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { toast } from 'sonner'
import { customersPage, data } from '@/content'
import { accountMrrHistory } from '@/data/customers'
import { monthsAgo } from '@/data/seed'
import type { Customer } from '@/types'
import { formatCurrency, formatDate, formatNumber, timeAgo } from '@/lib/format'
import { useChartMotion } from '@/hooks/use-chart-motion'
import { useSvgId } from '@/hooks/use-svg-id'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { CompanyLogo } from '@/components/brand/company-logo'
import { axisProps, TooltipCard } from '@/components/charts/chart-parts'
import { Delta } from '@/components/delta'
import { healthTone } from '@/components/health-meter'
import { PlanBadge, StatusBadge } from '@/components/status-badge'
import { UserAvatar } from '@/components/user-avatar'

const copy = customersPage.drawer

export function CustomerDrawer({ customer, onClose }: { customer?: Customer; onClose: () => void }) {
  return (
    <Sheet open={!!customer} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side='right' className='w-full gap-0 overflow-y-auto p-0 sm:max-w-[30rem]'>
        {customer ? (
          <DrawerBody customer={customer} />
        ) : (
          <SheetHeader>
            <SheetTitle>{copy.notFound}</SheetTitle>
            <SheetDescription />
          </SheetHeader>
        )}
      </SheetContent>
    </Sheet>
  )
}

function DrawerBody({ customer }: { customer: Customer }) {
  const navigate = useNavigate()
  const motionProps = useChartMotion(200)
  const gradientId = useSvgId('cust')
  const owner = customer.ownerId ? data.teamById[customer.ownerId] : undefined
  const conversation = data.conversations.find((c) => c.customerId === customer.id)

  const history = useMemo(
    () => accountMrrHistory(customer).map((value, i) => ({ month: monthsAgo(11 - i), value })),
    [customer]
  )
  const tenureMonths = Math.max(1, Math.round((Date.now() - Date.parse(customer.since)) / (30.44 * 86_400_000)))
  const averageMrr = history.reduce((s, p) => s + p.value, 0) / history.length
  const lifetime = Math.round(averageMrr * (customer.status === 'trialing' ? 0 : tenureMonths))
  const health = healthTone(customer.health)

  const details: [string, React.ReactNode][] = [
    [copy.fields.plan, <PlanBadge key='plan' plan={customer.plan} />],
    [copy.fields.region, customer.region],
    [copy.fields.industry, customer.industry],
    [copy.fields.since, formatDate(customer.since, 'date')],
    [copy.fields.lastActive, timeAgo(customer.lastActive)],
    [
      copy.fields.owner,
      owner ? (
        <span key='owner' className='flex items-center gap-2'>
          <UserAvatar name={owner.name} avatar={owner.avatar} className='size-5' />
          {owner.name}
        </span>
      ) : (
        customersPage.unassigned
      ),
    ],
    [copy.fields.domain, customer.domain],
    [copy.fields.id, <span key='id' className='font-mono text-xs'>{customer.id}</span>],
  ]

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(customer.contact.email)
    } catch {
      // Clipboard may be unavailable in embedded previews.
    }
    toast.success(copy.actions.emailCopied)
  }

  return (
    <>
      <SheetHeader className='gap-4 border-b p-5 pe-14'>
        <div className='flex items-start gap-3.5'>
          <CompanyLogo name={customer.name} size='lg' />
          <div className='grid min-w-0 gap-1'>
            <SheetTitle className='truncate font-display text-lg leading-tight'>{customer.name}</SheetTitle>
            <SheetDescription className='truncate'>
              {customer.industry} · {customer.domain}
            </SheetDescription>
            <div className='mt-1 flex flex-wrap items-center gap-2'>
              <StatusBadge status={customer.status} />
              {customer.mrrChange !== 0 && customer.status !== 'churned' && (
                <Delta value={customer.mrrChange} />
              )}
            </div>
          </div>
        </div>
      </SheetHeader>

      <div className='grid gap-6 p-5'>
        <dl className='grid grid-cols-2 gap-3'>
          {[
            [copy.stats.mrr, customer.mrr ? formatCurrency(customer.mrr) : '—'],
            [copy.stats.seats, formatNumber(customer.seats)],
            [copy.stats.health, `${customer.health} · ${health.label}`],
            [copy.stats.ltv, lifetime ? formatCurrency(lifetime, { compact: true }) : '—'],
          ].map(([label, value]) => (
            <div key={label} className='rounded-xl border bg-muted/40 px-3.5 py-3'>
              <dt className='text-xs text-muted-foreground'>{label}</dt>
              <dd className='mt-1 font-display text-lg font-semibold tracking-tight'>{value}</dd>
            </div>
          ))}
        </dl>

        <section>
          <h3 className='mb-2 font-sans text-[13px] font-medium tracking-normal text-muted-foreground'>{copy.mrrHistory}</h3>
          <div className='-mx-1 h-36'>
            <ResponsiveContainer width='100%' height='100%' minWidth={0}>
              <AreaChart data={history} margin={{ top: 6, right: 6, left: 6, bottom: 0 }}>
                <defs>
                  <linearGradient id={gradientId} x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='0%' stopColor='var(--chart-1)' stopOpacity={0.3} />
                    <stop offset='100%' stopColor='var(--chart-1)' stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey='month' tickFormatter={(v: string) => formatDate(v, 'month')} interval='preserveStartEnd' minTickGap={24} {...axisProps} />
                <Tooltip
                  cursor={{ stroke: 'var(--border-strong)' }}
                  content={(props) => {
                    const point = props.payload?.[0]?.payload as { month: string; value: number } | undefined
                    if (!props.active || !point) return null
                    return (
                      <TooltipCard
                        title={formatDate(point.month, 'monthLong')}
                        rows={[{ label: customersPage.columns.mrr, value: formatCurrency(point.value), color: 'var(--chart-1)', kind: 'rect' }]}
                      />
                    )
                  }}
                />
                <Area
                  type='monotone'
                  dataKey='value'
                  stroke='var(--chart-1)'
                  strokeWidth={2}
                  fill={`url(#${gradientId})`}
                  activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--popover)' }}
                  {...motionProps}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section>
          <h3 className='mb-2 font-sans text-[13px] font-medium tracking-normal text-muted-foreground'>{copy.details}</h3>
          <dl className='divide-y rounded-xl border'>
            {details.map(([label, value]) => (
              <div key={label} className='flex items-center justify-between gap-4 px-3.5 py-2.5 text-sm'>
                <dt className='text-muted-foreground'>{label}</dt>
                <dd className='min-w-0 truncate text-end'>{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h3 className='mb-2 font-sans text-[13px] font-medium tracking-normal text-muted-foreground'>{copy.contact}</h3>
          <div className='rounded-xl border p-3.5'>
            <div className='flex items-center gap-3'>
              <UserAvatar name={customer.contact.name} avatar={customer.contact.avatar} className='size-10' />
              <div className='grid min-w-0 leading-tight'>
                <span className='truncate text-sm font-medium'>{customer.contact.name}</span>
                <span className='truncate text-[13px] text-muted-foreground'>{customer.contact.title}</span>
              </div>
            </div>
            <a
              href={`mailto:${customer.contact.email}`}
              className='mt-3 flex items-center gap-2 text-[13px] text-primary-text hover:underline'
            >
              <Mail className='size-3.5' />
              {customer.contact.email}
            </a>
            <div className='mt-3 flex flex-wrap gap-2'>
              {conversation ? (
                <Button size='sm' onClick={() => navigate({ to: '/inbox', search: { c: conversation.id } })}>
                  <MessageSquare />
                  {copy.actions.openConversation}
                </Button>
              ) : (
                <Button size='sm' asChild>
                  <a href={`mailto:${customer.contact.email}`}>
                    <MessageSquare />
                    {copy.actions.message}
                  </a>
                </Button>
              )}
              <Button size='sm' variant='outline' onClick={copyEmail}>
                <Copy />
                {copy.actions.copyEmail}
              </Button>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}
