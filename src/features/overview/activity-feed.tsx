import { useEffect, useRef, useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  CircleAlert,
  Clock,
  Layers,
  Pause,
  Play,
  Sparkles,
  Trophy,
  UserMinus,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { data, overview } from '@/content'
import type { ActivityEvent, ActivityType } from '@/types'
import { formatSignedCurrency, timeAgo } from '@/lib/format'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const copy = overview.activity

const TYPE_STYLE: Record<ActivityType, { icon: React.ElementType; tone: string }> = {
  new: { icon: Sparkles, tone: 'bg-positive/12 text-positive' },
  upgrade: { icon: ArrowUpRight, tone: 'bg-positive/12 text-positive' },
  expansion: { icon: Layers, tone: 'bg-positive/12 text-positive' },
  trial: { icon: Clock, tone: 'bg-primary/14 text-primary-text' },
  milestone: { icon: Trophy, tone: 'bg-primary/14 text-primary-text' },
  downgrade: { icon: ArrowDownRight, tone: 'bg-warning/14 text-warning' },
  churn: { icon: UserMinus, tone: 'bg-negative/12 text-negative' },
  payment_failed: { icon: CircleAlert, tone: 'bg-negative/12 text-negative' },
}

export function ActivityFeed({ className }: { className?: string }) {
  const [events, setEvents] = useState<ActivityEvent[]>(data.activity)
  const [paused, setPaused] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  const nextIndex = useRef(0)
  const nextId = useRef(0)

  // Simulated stream: a new event from the pool every few seconds.
  useEffect(() => {
    if (paused || hovering) return
    const timer = window.setInterval(() => {
      const template = data.livePool[nextIndex.current % data.livePool.length]
      nextIndex.current += 1
      nextId.current += 1
      const event: ActivityEvent = { ...template, id: `live-${nextId.current}`, at: new Date().toISOString() }
      setEvents((list) => [event, ...list].slice(0, copy.maxItems + 2))
      setNow(Date.now())
    }, copy.intervalMs)
    return () => window.clearInterval(timer)
  }, [paused, hovering])

  // Keep relative times fresh.
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  const live = !paused

  return (
    <Card id='activity' className={cn('scroll-mt-20 gap-3 overflow-hidden', className)}>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          {copy.title}
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-sans text-[11px] font-semibold',
              live ? 'bg-positive/12 text-positive' : 'bg-accent text-muted-foreground'
            )}
          >
            <span className='relative flex size-1.5'>
              {live && <span className='absolute inline-flex size-full animate-pulse-ring rounded-full bg-positive' />}
              <span className={cn('relative inline-flex size-1.5 rounded-full', live ? 'bg-positive' : 'bg-muted-foreground')} />
            </span>
            {live ? copy.live : copy.paused}
          </span>
        </CardTitle>
        <CardDescription>{copy.description}</CardDescription>
        <CardAction>
          <Button
            variant='ghost'
            size='icon-sm'
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? copy.resume : copy.pause}
            title={paused ? copy.resume : copy.pause}
          >
            {paused ? <Play /> : <Pause />}
          </Button>
        </CardAction>
      </CardHeader>
      <div
        className='relative flex-1 overflow-hidden'
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onFocus={() => setHovering(true)}
        onBlur={() => setHovering(false)}
      >
        <ul className='px-2'>
          <AnimatePresence initial={false}>
            {events.slice(0, copy.maxItems).map((event) => {
              const style = TYPE_STYLE[event.type]
              const Icon = style.icon
              return (
                <motion.li
                  key={event.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className='overflow-hidden'
                >
                  <div className='flex gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-accent/50'>
                    <span className={cn('mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg', style.tone)}>
                      <Icon className='size-4' aria-hidden='true' />
                    </span>
                    <div className='min-w-0 flex-1'>
                      <p className='text-[13px] leading-snug'>
                        <span className='font-semibold'>{event.account}</span>{' '}
                        <span className='text-muted-foreground'>{event.text}</span>
                      </p>
                      <p className='mt-1 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground'>
                        {typeof event.amount === 'number' && event.amount !== 0 && (
                          <span
                            className={cn(
                              'font-semibold tabular',
                              event.amount > 0 ? 'text-positive' : 'text-negative'
                            )}
                          >
                            {formatSignedCurrency(event.amount)}
                          </span>
                        )}
                        <span>{copy.types[event.type]}</span>
                        <span aria-hidden='true'>·</span>
                        <time dateTime={event.at} className='tabular'>
                          {timeAgo(event.at, now)}
                        </time>
                      </p>
                    </div>
                  </div>
                </motion.li>
              )
            })}
          </AnimatePresence>
        </ul>
        <div className='pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-card to-transparent' />
      </div>
    </Card>
  )
}
