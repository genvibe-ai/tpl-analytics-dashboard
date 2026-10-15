
import { cn } from '@/lib/utils'
import { useSvgId } from '@/hooks/use-svg-id'

/**
 * Lumetric mark: a rising line ending in a point of light. Colours follow the theme
 * (--primary), so it recolours with content.ts. public/favicon.svg is a static copy.
 */
export function LogoMark({ className }: { className?: string }) {
  const id = useSvgId()
  return (
    <svg viewBox='0 0 32 32' aria-hidden='true' className={cn('size-8 shrink-0', className)}>
      <defs>
        <linearGradient id={`${id}-bg`} x1='4' y1='2' x2='28' y2='30' gradientUnits='userSpaceOnUse'>
          <stop offset='0' stopColor='color-mix(in oklab, var(--primary) 78%, white)' />
          <stop offset='1' stopColor='color-mix(in oklab, var(--primary) 82%, black)' />
        </linearGradient>
      </defs>
      <rect width='32' height='32' rx='9' fill={`url(#${id}-bg)`} />
      <rect x='0.5' y='0.5' width='31' height='31' rx='8.5' fill='none' stroke='white' strokeOpacity='0.18' />
      <path
        d='M8 21.5 L13.2 15.8 L17 18.6 L23 10.8'
        fill='none'
        stroke='white'
        strokeWidth='2.6'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <circle cx='23.2' cy='10.6' r='3.1' fill='var(--positive)' stroke='white' strokeWidth='1.6' />
    </svg>
  )
}

export function Wordmark({ name, className }: { name: string; className?: string }) {
  return (
    <span className={cn('font-display text-[15px] font-semibold tracking-tight', className)}>{name}</span>
  )
}
