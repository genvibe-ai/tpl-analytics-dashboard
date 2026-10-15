import { cn } from '@/lib/utils'
import { FadeIn } from '@/components/motion/fade-in'

/** A settings card: title, description, content and an optional footer with actions. */
export function SettingsSection({
  title,
  description,
  action,
  footer,
  className,
  children,
}: {
  title: string
  description?: string
  action?: React.ReactNode
  footer?: React.ReactNode
  className?: string
  children: React.ReactNode
}) {
  return (
    <FadeIn y={8} className='min-w-0'>
      <section className={cn('overflow-hidden rounded-xl border bg-card shadow-card', className)}>
        <header className='flex flex-wrap items-start justify-between gap-3 border-b px-5 py-4'>
          <div className='grid gap-1'>
            <h2 className='text-base font-semibold'>{title}</h2>
            {description && <p className='text-[13px] text-muted-foreground'>{description}</p>}
          </div>
          {action}
        </header>
        <div className='p-5'>{children}</div>
        {footer && <footer className='flex flex-wrap items-center justify-end gap-2 border-t bg-muted/30 px-5 py-3'>{footer}</footer>}
      </section>
    </FadeIn>
  )
}
