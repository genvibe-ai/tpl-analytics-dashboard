import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

type PageHeaderProps = {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({ eyebrow, title, description, actions, className }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn('flex flex-wrap items-end justify-between gap-x-6 gap-y-4', className)}
    >
      <div className='min-w-0 space-y-1.5'>
        {eyebrow && <div className='eyebrow'>{eyebrow}</div>}
        <h1 className='text-2xl font-semibold text-balance sm:text-[28px] sm:leading-tight'>{title}</h1>
        {description && (
          <p className='max-w-2xl text-sm text-pretty text-muted-foreground'>{description}</p>
        )}
      </div>
      {actions && <div className='flex flex-wrap items-center gap-2'>{actions}</div>}
    </motion.div>
  )
}
