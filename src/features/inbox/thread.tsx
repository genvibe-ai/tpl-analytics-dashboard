import { Fragment, useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Archive, ArrowLeft, Building2, Ellipsis, MailOpen, Paperclip, SendHorizontal } from 'lucide-react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { inbox } from '@/content'
import type { Conversation, Message } from '@/types'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ContactAvatar } from './contact-avatar'

function dayLabel(iso: string) {
  const date = new Date(iso)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)
  if (date.toDateString() === today.toDateString()) return inbox.today
  if (date.toDateString() === yesterday.toDateString()) return inbox.yesterday
  return formatDate(date, 'date')
}

type ThreadProps = {
  conversation: Conversation
  /** Show a back arrow (single-pane layout). */
  showBack: boolean
  onBack: () => void
  onSend: (text: string) => void
  onMarkUnread: () => void
  onArchive: () => void
}

export function Thread({ conversation, showBack, onBack, onSend, onMarkUnread, onArchive }: ThreadProps) {
  const [draft, setDraft] = useState('')
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scroller.current
    if (el) el.scrollTo({ top: el.scrollHeight })
  }, [conversation.id, conversation.messages.length])

  function send() {
    const text = draft.trim()
    if (!text) return
    onSend(text)
    setDraft('')
  }

  const groups: { label: string; messages: Message[] }[] = []
  for (const message of conversation.messages) {
    const label = dayLabel(message.at)
    const last = groups[groups.length - 1]
    if (last?.label === label) last.messages.push(message)
    else groups.push({ label, messages: [message] })
  }

  return (
    <div className='flex min-h-0 flex-1 flex-col'>
      {/* Header */}
      <div className='flex items-center gap-3 border-b px-3 py-3 sm:px-5'>
        {showBack && (
          <Button variant='ghost' size='icon-sm' onClick={onBack} aria-label={inbox.back}>
            <ArrowLeft />
          </Button>
        )}
        <ContactAvatar conversation={conversation} className='size-10' />
        <div className='grid min-w-0 flex-1 leading-tight'>
          <span className='flex items-center gap-2'>
            <span className='truncate font-medium'>{conversation.name}</span>
            {conversation.label && (
              <Badge variant={conversation.label === 'Alert' ? 'negative' : 'secondary'} className='max-sm:hidden'>
                {conversation.label}
              </Badge>
            )}
          </span>
          <span className='truncate text-[13px] text-muted-foreground'>{conversation.subtitle}</span>
        </div>
        {conversation.customerId && (
          <Button asChild variant='outline' size='sm' className='max-sm:hidden'>
            <Link to='/customers' search={{ customer: conversation.customerId }}>
              <Building2 />
              {inbox.viewAccount}
            </Link>
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon-sm' aria-label={inbox.menu.label}>
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {conversation.customerId && (
              <DropdownMenuItem asChild className='sm:hidden'>
                <Link to='/customers' search={{ customer: conversation.customerId }}>
                  <Building2 />
                  {inbox.viewAccount}
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={onMarkUnread}>
              <MailOpen />
              {inbox.menu.markUnread}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onArchive}>
              <Archive />
              {inbox.menu.archive}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages */}
      <div ref={scroller} className='min-h-0 flex-1 overflow-y-auto px-3 py-5 sm:px-6'>
        <div className='mx-auto flex max-w-3xl flex-col gap-1.5'>
          {groups.map((group) => (
            <Fragment key={group.label}>
              <div className='my-3 flex items-center gap-3 text-[11px] font-medium text-muted-foreground'>
                <span className='h-px flex-1 bg-border' />
                {group.label}
                <span className='h-px flex-1 bg-border' />
              </div>
              {group.messages.map((message, i) => {
                const mine = message.from === 'me'
                const firstOfRun = group.messages[i - 1]?.from !== message.from
                return (
                  <motion.div
                    key={message.id}
                    layout='position'
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className={cn('flex items-end gap-2', mine ? 'justify-end' : 'justify-start', firstOfRun && 'mt-2')}
                  >
                    {!mine && (
                      <span className='w-8 shrink-0'>
                        {firstOfRun && <ContactAvatar conversation={conversation} className='size-8' />}
                      </span>
                    )}
                    <div className={cn('flex max-w-[min(32rem,82%)] flex-col', mine ? 'items-end' : 'items-start')}>
                      <div
                        className={cn(
                          'rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-xs',
                          mine
                            ? 'rounded-br-md bg-primary-fill text-primary-foreground'
                            : 'rounded-bl-md border bg-muted/70 text-foreground'
                        )}
                      >
                        {message.text}
                        {message.metric && (
                          <div className='mt-2.5 rounded-xl border bg-card px-3 py-2.5'>
                            <div className='text-xs text-muted-foreground'>{message.metric.label}</div>
                            <div className='mt-0.5 flex items-baseline gap-2'>
                              <span className='font-display text-lg font-semibold'>{message.metric.value}</span>
                              <span
                                className={cn(
                                  'text-xs font-semibold',
                                  message.metric.tone === 'negative' ? 'text-negative' : 'text-positive'
                                )}
                              >
                                {message.metric.delta}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      <time dateTime={message.at} className='mt-1 px-1 text-[11px] text-muted-foreground tabular'>
                        {mine ? `${inbox.you} · ` : ''}
                        {formatDate(message.at, 'time')}
                      </time>
                    </div>
                  </motion.div>
                )
              })}
            </Fragment>
          ))}
        </div>
      </div>

      {/* Composer */}
      <form
        className='border-t p-3 sm:p-4'
        onSubmit={(e) => {
          e.preventDefault()
          send()
        }}
      >
        <div className='mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border bg-background/60 p-2 transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/25'>
          <Button
            type='button'
            variant='ghost'
            size='icon-sm'
            onClick={() => toast(inbox.composer.attachToast)}
            aria-label={inbox.composer.attach}
          >
            <Paperclip />
          </Button>
          <label className='flex-1'>
            <span className='sr-only'>{inbox.composer.label}</span>
            <textarea
              rows={1}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault()
                  send()
                }
              }}
              placeholder={inbox.composer.placeholder}
              className='field-sizing-content max-h-36 min-h-8 w-full resize-none bg-transparent px-1 py-1.5 text-sm outline-none placeholder:text-muted-foreground'
            />
          </label>
          <Button type='submit' size='icon-sm' disabled={!draft.trim()} aria-label={inbox.composer.send}>
            <SendHorizontal />
          </Button>
        </div>
        <p className='mx-auto mt-1.5 hidden max-w-3xl px-2 text-[11px] text-muted-foreground sm:block'>
          {inbox.composer.hint}
        </p>
      </form>
    </div>
  )
}
