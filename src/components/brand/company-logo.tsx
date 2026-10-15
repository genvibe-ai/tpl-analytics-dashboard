import { cn } from '@/lib/utils'

const HUES = [265, 228, 198, 168, 148, 72, 38, 12, 340, 298]

function hashName(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return h
}

export function companyInitials(name: string) {
  const words = name.replace(/&/g, ' ').split(/\s+/).filter(Boolean)
  return ((words[0]?.[0] ?? '') + (words[1]?.[0] ?? words[0]?.[1] ?? '')).toUpperCase()
}

/** Letter-mark logo for a (fictional) company, tinted from its name. */
export function CompanyLogo({
  name,
  className,
  size = 'md',
}: {
  name: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const hue = HUES[hashName(name) % HUES.length]
  return (
    <span
      aria-hidden='true'
      className={cn(
        'grid shrink-0 place-items-center font-display font-semibold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.22)]',
        size === 'sm' && 'size-7 rounded-md text-[10px]',
        size === 'md' && 'size-8 rounded-lg text-[11px]',
        size === 'lg' && 'size-12 rounded-xl text-base',
        className
      )}
      style={{
        backgroundImage: `linear-gradient(140deg, oklch(0.5 0.13 ${hue}), oklch(0.38 0.12 ${hue + 18}))`,
      }}
    >
      {companyInitials(name)}
    </span>
  )
}
