import type { Conversation } from '@/types'
import { cn } from '@/lib/utils'
import { LogoMark } from '@/components/brand/logo'
import { UserAvatar } from '@/components/user-avatar'

/** Photo, initials, or the brand mark for automated senders. */
export function ContactAvatar({ conversation, className }: { conversation: Conversation; className?: string }) {
  if (conversation.isBot) return <LogoMark className={cn('rounded-full', className)} />
  return <UserAvatar name={conversation.name} avatar={conversation.avatar} className={className} />
}
