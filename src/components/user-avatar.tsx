import { images } from '@/content'
import type { AvatarKey } from '@/types'
import { cn, getDisplayNameInitials } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type UserAvatarProps = {
  name: string
  avatar?: AvatarKey
  className?: string
  /** Show a small status dot (online). */
  online?: boolean
}

/** Portrait from public/images (see images.avatars in content.ts) with an initials fallback. */
export function UserAvatar({ name, avatar, className, online }: UserAvatarProps) {
  const image = avatar ? images.avatars[avatar] : undefined
  return (
    <span className={cn('relative inline-flex shrink-0', className)}>
      <Avatar className='size-full'>
        {image && (
          <AvatarImage
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading='lazy'
            decoding='async'
            className='object-cover'
          />
        )}
        <AvatarFallback className='bg-accent text-[0.7em] font-semibold text-foreground'>
          {getDisplayNameInitials(name)}
        </AvatarFallback>
      </Avatar>
      {online && (
        <span className='absolute -end-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-card bg-positive' />
      )}
    </span>
  )
}
