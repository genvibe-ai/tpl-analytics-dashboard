import { useMemo, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { MessagesSquare, Search, SquarePen } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { toast } from 'sonner'
import { data, inbox } from '@/content'
import type { Conversation } from '@/types'
import { timeAgo } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useElementWidth } from '@/hooks/use-element-width'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Main } from '@/components/layout/main'
import { Segmented } from '@/components/segmented'
import { ContactAvatar } from './contact-avatar'
import { Thread } from './thread'

const route = getRouteApi('/_authenticated/inbox/')

const lastAt = (c: Conversation) => c.messages[c.messages.length - 1]?.at ?? ''

export function InboxPage() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const [frameRef, frameWidth] = useElementWidth<HTMLDivElement>()
  // Two panes when the inbox is wide enough; otherwise list and thread take turns (phones, tablets).
  const twoPane = frameWidth >= 720
  const [threads, setThreads] = useState<Conversation[]>(data.conversations)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const sorted = useMemo(() => [...threads].sort((a, b) => lastAt(b).localeCompare(lastAt(a))), [threads])
  const visible = sorted.filter((c) => {
    if (filter === 'unread' && c.unread === 0) return false
    const q = query.trim().toLowerCase()
    if (!q) return true
    return (
      c.name.toLowerCase().includes(q) ||
      c.subtitle.toLowerCase().includes(q) ||
      c.messages.some((m) => m.text.toLowerCase().includes(q))
    )
  })

  // Wide screens open the newest conversation by default; narrow ones start on the list.
  const selectedId = search.c ?? (twoPane ? sorted[0]?.id : undefined)
  const selected = threads.find((c) => c.id === selectedId)

  const update = (id: string, change: (c: Conversation) => Conversation) =>
    setThreads((list) => list.map((c) => (c.id === id ? change(c) : c)))

  function open(id: string) {
    update(id, (c) => ({ ...c, unread: 0 }))
    navigate({ search: { c: id } })
  }

  return (
    <Main fixed>
      <div ref={frameRef} className='flex min-h-0 flex-1 overflow-hidden rounded-2xl border bg-card shadow-card'>
        {/* Conversation list */}
        <aside
          className={cn(
            'flex min-w-0 flex-col',
            twoPane ? 'w-80 shrink-0 border-e @6xl/content:w-96' : 'w-full',
            !twoPane && selected && 'hidden'
          )}
          aria-label={inbox.title}
        >
          <div className='grid gap-3 border-b p-4'>
            <div className='flex items-center justify-between gap-2'>
              <h1 className='flex items-center gap-2 text-xl font-semibold'>
                {inbox.title}
                <MessagesSquare className='size-4 text-muted-foreground' aria-hidden='true' />
              </h1>
              <Button variant='ghost' size='icon-sm' onClick={() => toast(inbox.composeToast)} aria-label={inbox.compose}>
                <SquarePen />
              </Button>
            </div>
            <div className='relative'>
              <Search className='pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                type='search'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={inbox.searchPlaceholder}
                aria-label={inbox.searchPlaceholder}
                className='h-9 ps-9'
              />
            </div>
            <Segmented
              label={inbox.title}
              value={filter}
              onChange={setFilter}
              className='w-full [&>button]:flex-1'
              options={[
                { id: 'all', label: inbox.filters.all },
                {
                  id: 'unread',
                  label: (
                    <>
                      {inbox.filters.unread}
                      <span className='rounded-full bg-primary/15 px-1.5 text-[10px] font-semibold text-primary-text'>
                        {threads.filter((c) => c.unread > 0).length}
                      </span>
                    </>
                  ),
                },
              ]}
            />
          </div>
          <ul className='min-h-0 flex-1 overflow-y-auto p-2'>
            <AnimatePresence initial={false}>
              {visible.map((c) => {
                const last = c.messages[c.messages.length - 1]
                const active = c.id === selected?.id
                return (
                  <motion.li key={c.id} layout='position' exit={{ opacity: 0, height: 0 }}>
                    <button
                      type='button'
                      onClick={() => open(c.id)}
                      aria-current={active ? 'true' : undefined}
                      className={cn(
                        'flex w-full gap-3 rounded-xl px-3 py-3 text-start transition-colors outline-none hover:bg-accent/60 focus-visible:ring-2 focus-visible:ring-ring/60',
                        active && 'bg-accent shadow-[inset_2px_0_0_var(--primary)]'
                      )}
                    >
                      <ContactAvatar conversation={c} className='size-10' />
                      <span className='grid min-w-0 flex-1 gap-0.5'>
                        <span className='flex items-center gap-2'>
                          <span className={cn('truncate text-sm', c.unread ? 'font-semibold' : 'font-medium')}>
                            {c.name}
                          </span>
                          <span className='ms-auto shrink-0 text-[11px] text-muted-foreground tabular'>
                            {last ? timeAgo(last.at) : ''}
                          </span>
                        </span>
                        <span className='truncate text-xs text-muted-foreground'>{c.subtitle}</span>
                        <span className='flex items-center gap-2'>
                          <span className={cn('line-clamp-1 text-[13px]', c.unread ? 'text-foreground' : 'text-muted-foreground')}>
                            {last?.from === 'me' ? `${inbox.you}: ` : ''}
                            {last?.text}
                          </span>
                          {c.unread > 0 && (
                            <span className='ms-auto grid size-5 shrink-0 place-items-center rounded-full bg-primary-fill text-[10px] font-semibold text-primary-foreground'>
                              {c.unread}
                            </span>
                          )}
                        </span>
                        {c.label && (
                          <Badge variant={c.label === 'Alert' ? 'negative' : 'outline'} className='mt-1'>
                            {c.label}
                          </Badge>
                        )}
                      </span>
                    </button>
                  </motion.li>
                )
              })}
            </AnimatePresence>
            {visible.length === 0 && (
              <li className='px-4 py-10 text-center text-sm text-muted-foreground'>{inbox.noResults}</li>
            )}
          </ul>
        </aside>

        {/* Thread */}
        <section className={cn('flex min-w-0 flex-1 flex-col', !twoPane && !selected && 'hidden')}>
          {selected ? (
            <Thread
              key={selected.id}
              conversation={selected}
              showBack={!twoPane}
              onBack={() => navigate({ search: {} })}
              onSend={(text) =>
                update(selected.id, (c) => ({
                  ...c,
                  messages: [
                    ...c.messages,
                    { id: `${c.id}-${Date.now()}`, from: 'me', text, at: new Date().toISOString() },
                  ],
                }))
              }
              onMarkUnread={() => {
                update(selected.id, (c) => ({ ...c, unread: Math.max(1, c.unread) }))
                navigate({ search: {} })
              }}
              onArchive={() => {
                setThreads((list) => list.filter((c) => c.id !== selected.id))
                navigate({ search: {} })
                toast(inbox.menu.archived)
              }}
            />
          ) : (
            <div className='grid flex-1 place-items-center p-8 text-center'>
              <div className='grid justify-items-center gap-3'>
                <span className='grid size-14 place-items-center rounded-2xl border bg-muted/50'>
                  <MessagesSquare className='size-6 text-muted-foreground' />
                </span>
                <h2 className='text-lg font-semibold'>{inbox.empty.title}</h2>
                <p className='max-w-xs text-sm text-muted-foreground'>{inbox.empty.body}</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </Main>
  )
}
