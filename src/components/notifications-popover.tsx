import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Bell, CircleAlert, Info, TrendingUp, TriangleAlert } from 'lucide-react'
import { data, header } from '@/content'
import type { Notification } from '@/types'
import { fill, timeAgo } from '@/lib/format'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

const TONE = {
  positive: { icon: TrendingUp, className: 'bg-positive/12 text-positive' },
  negative: { icon: CircleAlert, className: 'bg-negative/12 text-negative' },
  warning: { icon: TriangleAlert, className: 'bg-warning/14 text-warning' },
  info: { icon: Info, className: 'bg-primary/14 text-primary-text' },
} satisfies Record<Notification['tone'], { icon: React.ElementType; className: string }>

export function NotificationsPopover() {
  const [items, setItems] = useState(data.notifications)
  const [open, setOpen] = useState(false)
  const unread = items.filter((n) => !n.read).length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='ghost' size='icon' className='relative' aria-label={header.notifications.open}>
          <Bell />
          {unread > 0 && (
            <span className='absolute top-1.5 right-1.5 flex size-2.5'>
              <span className='absolute inline-flex size-full animate-pulse-ring rounded-full bg-primary' />
              <span className='relative inline-flex size-2.5 rounded-full border-2 border-background bg-primary' />
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end' sideOffset={8} className='w-[min(22rem,calc(100vw-2rem))] p-0'>
        <div className='flex items-center justify-between gap-3 border-b px-4 py-3'>
          <div className='flex items-center gap-2'>
            <span className='font-display text-sm font-semibold'>{header.notifications.title}</span>
            {unread > 0 && (
              <span className='rounded-full bg-primary/15 px-1.5 py-0.5 text-[11px] font-semibold text-primary-text'>
                {fill(header.notifications.unread, { count: unread })}
              </span>
            )}
          </div>
          {unread > 0 && (
            <button
              type='button'
              onClick={() => setItems((list) => list.map((n) => ({ ...n, read: true })))}
              className='rounded text-xs font-medium text-primary-text hover:underline focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none'
            >
              {header.notifications.markAllRead}
            </button>
          )}
        </div>
        {items.length === 0 ? (
          <p className='px-4 py-8 text-center text-sm text-muted-foreground'>{header.notifications.empty}</p>
        ) : (
          <ul className='max-h-96 divide-y overflow-y-auto'>
            {items.map((n) => {
              const tone = TONE[n.tone]
              return (
                <li key={n.id} className={cn('flex gap-3 px-4 py-3 transition-colors hover:bg-accent/50', !n.read && 'bg-primary/[0.04]')}>
                  <span className={cn('mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg', tone.className)}>
                    <tone.icon className='size-4' aria-hidden='true' />
                  </span>
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-start justify-between gap-2'>
                      <p className='text-sm font-medium'>{n.title}</p>
                      <span className='shrink-0 text-[11px] text-muted-foreground tabular'>{timeAgo(n.at)}</span>
                    </div>
                    <p className='mt-0.5 text-[13px] leading-snug text-muted-foreground'>{n.body}</p>
                  </div>
                  {!n.read && <span className='mt-2 size-1.5 shrink-0 rounded-full bg-primary' aria-hidden='true' />}
                </li>
              )
            })}
          </ul>
        )}
        <div className='border-t p-2'>
          <Button asChild variant='ghost' size='sm' className='w-full'>
            <Link to='/' hash='activity' onClick={() => setOpen(false)}>
              {header.notifications.footer}
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
