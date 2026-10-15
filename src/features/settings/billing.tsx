import { useState } from 'react'
import { Check, CreditCard, Download, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { data, settings } from '@/content'
import { fill, formatCurrency, formatDate, formatNumber } from '@/lib/format'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { SettingsSection } from './section'

const copy = settings.billing

export function SettingsBilling() {
  const [currentId, setCurrentId] = useState(data.billing.currentPlanId)
  const current = copy.plans.find((p) => p.id === currentId) ?? copy.plans[1]

  return (
    <div className='grid grid-cols-1 gap-6'>
      <SettingsSection title={copy.current} description={copy.description}>
        <div className='grid gap-6 @5xl/content:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]'>
          <div className='relative overflow-hidden rounded-xl border bg-linear-to-br from-primary/18 via-primary/5 to-transparent p-5'>
            <div aria-hidden='true' className='absolute -top-16 -right-10 size-48 rounded-full bg-primary/25 blur-3xl' />
            <div className='relative flex items-center gap-2'>
              <Sparkles className='size-4 text-primary-text' aria-hidden='true' />
              <span className='font-display text-lg font-semibold'>{current.name}</span>
              <Badge variant='default'>{copy.currentBadge}</Badge>
            </div>
            <p className='relative mt-1 text-[13px] text-muted-foreground'>{current.description}</p>
            <p className='relative mt-5 flex items-baseline gap-1'>
              <span className='font-display text-4xl font-semibold tracking-tight'>{formatCurrency(current.price)}</span>
              <span className='text-sm text-muted-foreground'>{copy.perMonth}</span>
            </p>
            <p className='relative mt-1 text-[13px] text-muted-foreground'>
              {fill(copy.renews, { days: data.billing.renewsInDays })}
            </p>
          </div>
          <div className='grid content-start gap-4'>
            <h3 className='font-sans text-[13px] font-medium tracking-normal text-muted-foreground'>{copy.usage}</h3>
            {data.billing.usage.map((meter) => {
              const pct = Math.round((meter.used / meter.limit) * 100)
              const compact = meter.limit >= 100_000
              return (
                <div key={meter.id} className='grid gap-1.5'>
                  <div className='flex items-center justify-between gap-2 text-sm'>
                    <span className='font-medium'>{copy.usageLabels[meter.id]}</span>
                    <span className='text-[13px] text-muted-foreground tabular'>
                      {fill(copy.usageOf, {
                        used: formatNumber(meter.used, { compact }),
                        limit: formatNumber(meter.limit, { compact }),
                      })}
                    </span>
                  </div>
                  <div
                    className='h-2 overflow-hidden rounded-full bg-accent'
                    role='progressbar'
                    aria-label={copy.usageLabels[meter.id]}
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className={cn('h-full rounded-full', pct >= 80 ? 'bg-warning' : 'bg-primary')}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </SettingsSection>

      <div className='grid grid-cols-1 gap-4 @4xl/content:grid-cols-3'>
        {copy.plans.map((plan) => {
          const active = plan.id === currentId
          return (
            <div
              key={plan.id}
              className={cn(
                'flex flex-col rounded-xl border bg-card p-5 shadow-card transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5',
                active ? 'border-primary/60 shadow-glow' : 'hover:border-border-strong'
              )}
            >
              <div className='flex items-center justify-between gap-2'>
                <span className='font-display text-base font-semibold'>{plan.name}</span>
                {active && <Badge variant='default'>{copy.currentBadge}</Badge>}
              </div>
              <p className='mt-1 text-[13px] text-muted-foreground'>{plan.description}</p>
              <p className='mt-4 flex items-baseline gap-1'>
                <span className='font-display text-2xl font-semibold tracking-tight'>{formatCurrency(plan.price)}</span>
                <span className='text-[13px] text-muted-foreground'>{copy.perMonth}</span>
              </p>
              <ul className='mt-4 grid gap-2 text-[13px]'>
                {plan.features.map((feature) => (
                  <li key={feature} className='flex items-center gap-2'>
                    <Check className='size-3.5 shrink-0 text-positive' aria-hidden='true' />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                variant={active ? 'secondary' : 'outline'}
                className='mt-5 w-full'
                disabled={active}
                onClick={() => {
                  setCurrentId(plan.id)
                  toast.success(copy.switched)
                }}
              >
                {active ? copy.currentBadge : fill(copy.choose, { plan: plan.name })}
              </Button>
            </div>
          )
        })}
      </div>

      <SettingsSection
        title={copy.payment.title}
        action={
          <Button variant='outline' size='sm' onClick={() => toast(copy.payment.updateToast)}>
            {copy.payment.update}
          </Button>
        }
      >
        <div className='flex flex-wrap items-center gap-4'>
          <div className='relative grid h-14 w-22 shrink-0 place-items-center overflow-hidden rounded-lg bg-linear-to-br from-[color-mix(in_oklab,var(--primary)_75%,black)] to-[color-mix(in_oklab,var(--primary)_40%,black)] text-white shadow-float'>
            <CreditCard className='size-6 opacity-90' aria-hidden='true' />
          </div>
          <div className='grid gap-0.5'>
            <span className='text-sm font-medium'>{fill(copy.payment.card, { last4: data.billing.paymentMethod.last4 })}</span>
            <span className='text-[13px] text-muted-foreground'>
              {fill(copy.payment.expires, { expiry: data.billing.paymentMethod.expiry })} · {data.billing.paymentMethod.holder}
            </span>
            <span className='text-[13px] text-muted-foreground'>
              {fill(copy.payment.contact, { email: data.billing.paymentMethod.email })}
            </span>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title={copy.invoices.title} className='[&>div]:p-0 [&>div]:px-2'>
        <Table>
          <TableHeader>
            <TableRow className='hover:bg-transparent'>
              <TableHead>{copy.invoices.invoice}</TableHead>
              {/* On phones the date moves under the invoice number so the table fits without scrolling. */}
              <TableHead className='max-sm:hidden'>{copy.invoices.date}</TableHead>
              <TableHead className='text-end'>{copy.invoices.amount}</TableHead>
              <TableHead>{copy.invoices.status}</TableHead>
              <TableHead className='w-12'>
                <span className='sr-only'>{copy.invoices.download}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.billing.invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className='font-mono text-xs'>
                  {invoice.id}
                  <span className='mt-0.5 block font-sans text-[11px] text-muted-foreground sm:hidden'>
                    {formatDate(invoice.date, 'date')}
                  </span>
                </TableCell>
                <TableCell className='text-[13px] text-muted-foreground max-sm:hidden'>{formatDate(invoice.date, 'date')}</TableCell>
                <TableCell className='text-end tabular'>{formatCurrency(invoice.amount, { decimals: 2 })}</TableCell>
                <TableCell>
                  <Badge variant={invoice.status === 'Paid' ? 'positive' : 'warning'}>{invoice.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant='ghost'
                    size='icon-sm'
                    aria-label={fill(copy.invoices.download, { id: invoice.id })}
                    onClick={() => toast.success(fill(copy.invoices.downloaded, { id: invoice.id }))}
                  >
                    <Download />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SettingsSection>
    </div>
  )
}
