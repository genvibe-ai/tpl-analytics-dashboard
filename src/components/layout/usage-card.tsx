import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { data, nav } from '@/content'
import { fill } from '@/lib/format'
import { useSidebar } from '@/components/ui/sidebar'

/** Plan usage nudge at the bottom of the sidebar (hidden when the sidebar is collapsed). */
export function UsageCard() {
  const { setOpenMobile } = useSidebar()
  const meter = data.billing.usage[0]
  const percent = Math.round((meter.used / meter.limit) * 100)
  return (
    <div className='mx-2 mb-1 rounded-xl border bg-card/60 p-3 group-data-[collapsible=icon]:hidden'>
      <div className='flex items-center justify-between gap-2'>
        <span className='text-[13px] font-medium'>{nav.usageCard.title}</span>
        <span className='text-xs font-semibold text-primary-text tabular'>{percent}%</span>
      </div>
      <div
        className='mt-2 h-1.5 overflow-hidden rounded-full bg-accent'
        role='progressbar'
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={nav.usageCard.title}
      >
        <div
          className='h-full rounded-full bg-linear-to-r from-primary to-[color-mix(in_oklab,var(--primary)_60%,white)]'
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className='mt-2 text-xs leading-relaxed text-muted-foreground'>{fill(nav.usageCard.body, { percent })}</p>
      <Link
        to={nav.usageCard.href}
        onClick={() => setOpenMobile(false)}
        className='mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary-text hover:underline'
      >
        {nav.usageCard.cta}
        <ArrowUpRight className='size-3.5' />
      </Link>
    </div>
  )
}
