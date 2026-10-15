import { useState } from 'react'
import { z } from 'zod'
import { Ellipsis, MailPlus, RotateCcw, Send, Trash2, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { toast } from 'sonner'
import { data, settings, user } from '@/content'
import type { TeamMember, TeamRole } from '@/types'
import { fill, timeAgo } from '@/lib/format'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UserAvatar } from '@/components/user-avatar'
import { SettingsSection } from './section'

const copy = settings.team
const SEAT_LIMIT = data.billing.usage.find((u) => u.id === 'seats')?.limit ?? 10

type Invite = { email: string; role: TeamRole; at: string }

export function SettingsTeam() {
  const [members, setMembers] = useState<TeamMember[]>(data.team)
  const [invites, setInvites] = useState<Invite[]>(() =>
    data.pendingInvites.map((i) => ({
      email: i.email,
      role: i.role,
      at: new Date(Date.now() - i.sentDaysAgo * 86_400_000).toISOString(),
    }))
  )
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<TeamRole>('Analyst')
  const [error, setError] = useState('')

  function invite(e: React.FormEvent) {
    e.preventDefault()
    if (!z.email().safeParse(email.trim()).success) {
      setError(copy.invite.invalid)
      return
    }
    setInvites((list) => [{ email: email.trim(), role, at: new Date().toISOString() }, ...list])
    toast.success(fill(copy.invite.sent, { email: email.trim() }))
    setEmail('')
    setError('')
  }

  const seatsUsed = members.length + invites.length

  return (
    <div className='grid grid-cols-1 gap-6'>
      <SettingsSection title={copy.invite.title} description={copy.description}>
        <form onSubmit={invite} className='grid gap-3 @2xl/content:grid-cols-[1fr_11rem_auto] @2xl/content:items-end' noValidate>
          <div className='grid gap-2'>
            <Label htmlFor='invite-email'>{copy.invite.emailLabel}</Label>
            <Input
              id='invite-email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={copy.invite.emailPlaceholder}
              aria-invalid={!!error}
              aria-describedby={error ? 'invite-error' : undefined}
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='invite-role'>{copy.invite.roleLabel}</Label>
            <Select value={role} onValueChange={(v) => setRole(v as TeamRole)}>
              <SelectTrigger id='invite-role' className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {copy.roles.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type='submit'>
            <Send />
            {copy.invite.button}
          </Button>
          {error && (
            <p id='invite-error' className='text-[13px] text-negative @2xl/content:col-span-3'>
              {error}
            </p>
          )}
        </form>
        <ul className='mt-4 grid gap-1.5 text-xs text-muted-foreground @4xl/content:grid-cols-3'>
          {copy.roles.map((r) => (
            <li key={r.id}>
              <span className='font-medium text-foreground'>{r.id}</span> · {r.description}
            </li>
          ))}
        </ul>
      </SettingsSection>

      <SettingsSection
        title={copy.members}
        description={fill(copy.seats, { used: seatsUsed, limit: SEAT_LIMIT })}
        action={
          <div className='h-1.5 w-32 self-center overflow-hidden rounded-full bg-accent'>
            <div
              className='h-full rounded-full bg-primary'
              style={{ width: `${Math.min(100, (seatsUsed / SEAT_LIMIT) * 100)}%` }}
            />
          </div>
        }
        className='[&>div]:p-0'
      >
        <ul className='divide-y'>
          <AnimatePresence initial={false}>
            {members.map((member) => {
              const isYou = member.id === user.id
              return (
                <motion.li
                  key={member.id}
                  layout='position'
                  exit={{ opacity: 0, height: 0 }}
                  className='flex flex-wrap items-center gap-3 px-5 py-3.5'
                >
                  <UserAvatar name={member.name} avatar={member.avatar} className='size-10' online={member.lastActiveMinutes < 15} />
                  <div className='grid min-w-0 flex-1 leading-tight'>
                    <span className='flex items-center gap-2 truncate text-sm font-medium'>
                      {member.name}
                      {isYou && <Badge variant='secondary'>{copy.you}</Badge>}
                    </span>
                    <span className='truncate text-[13px] text-muted-foreground'>
                      {member.title} · {member.email}
                    </span>
                  </div>
                  <span className='hidden text-xs text-muted-foreground md:block'>
                    {member.lastActiveMinutes < 15
                      ? copy.online
                      : fill(copy.lastActive, { time: timeAgo(new Date(Date.now() - member.lastActiveMinutes * 60_000)) })}
                  </span>
                  <Badge variant={member.role === 'Owner' ? 'default' : 'outline'} className='min-w-16'>
                    {member.role}
                  </Badge>
                  {!isYou && member.role !== 'Owner' ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon-sm' aria-label={fill(copy.actions.menu, { name: member.name })}>
                          <Ellipsis />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        {copy.roles
                          .filter((r) => r.id !== member.role)
                          .map((r) => (
                            <DropdownMenuItem
                              key={r.id}
                              onClick={() => {
                                setMembers((list) => list.map((m) => (m.id === member.id ? { ...m, role: r.id } : m)))
                                toast.success(fill(copy.actions.roleChanged, { name: member.name, role: r.id }))
                              }}
                            >
                              {fill(copy.actions.makeRole, { role: r.id })}
                            </DropdownMenuItem>
                          ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant='destructive'
                          onClick={() => {
                            setMembers((list) => list.filter((m) => m.id !== member.id))
                            toast(fill(copy.actions.removed, { name: member.name }))
                          }}
                        >
                          <Trash2 />
                          {copy.actions.remove}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <span className='size-8' aria-hidden='true' />
                  )}
                </motion.li>
              )
            })}
          </AnimatePresence>
        </ul>
      </SettingsSection>

      {invites.length > 0 && (
        <SettingsSection title={copy.pending} className='[&>div]:p-0'>
          <ul className='divide-y'>
            <AnimatePresence initial={false}>
              {invites.map((inv) => (
                <motion.li
                  key={inv.email}
                  layout='position'
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className='flex flex-wrap items-center gap-3 px-5 py-3.5'
                >
                  <span className='grid size-10 place-items-center rounded-full border border-dashed text-muted-foreground'>
                    <MailPlus className='size-4' />
                  </span>
                  <div className='grid min-w-0 flex-1 leading-tight'>
                    <span className='truncate text-sm font-medium'>{inv.email}</span>
                    <span className='text-[13px] text-muted-foreground'>
                      {fill(copy.pendingSince, { time: timeAgo(inv.at) })}
                    </span>
                  </div>
                  <Badge variant='outline'>{inv.role}</Badge>
                  <Button
                    variant='ghost'
                    size='icon-sm'
                    onClick={() => toast.success(copy.actions.resent)}
                    aria-label={copy.actions.resend}
                    title={copy.actions.resend}
                  >
                    <RotateCcw />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon-sm'
                    onClick={() => {
                      setInvites((list) => list.filter((i) => i.email !== inv.email))
                      toast(copy.actions.revoked)
                    }}
                    aria-label={copy.actions.revoke}
                    title={copy.actions.revoke}
                  >
                    <X />
                  </Button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </SettingsSection>
      )}
    </div>
  )
}
