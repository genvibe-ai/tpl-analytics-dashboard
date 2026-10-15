import { motion } from 'motion/react'
import { site } from '@/content'
import { LogoMark } from '@/components/brand/logo'

/** Full-screen frame for error pages: brand mark, big code, message, actions. */
export function ErrorShell({
  code,
  title,
  body,
  children,
}: {
  code: string
  title: string
  body: string
  children: React.ReactNode
}) {
  return (
    <main
      id='content'
      className='page-glow relative grid min-h-svh place-items-center overflow-hidden bg-background px-4 py-16'
    >
      <div className='flex flex-col items-center text-center'>
        <div className='mb-10 flex items-center gap-2'>
          <LogoMark className='size-7' />
          <span className='font-display text-[15px] font-semibold tracking-tight'>{site.name}</span>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className='bg-linear-to-b from-foreground to-foreground/30 bg-clip-text font-display text-[7rem] leading-none font-semibold tracking-tighter text-transparent sm:text-[9rem]'
          aria-hidden='true'
        >
          {code}
        </motion.p>
        <h1 className='mt-4 text-2xl font-semibold'>{title}</h1>
        <p className='mt-2 max-w-sm text-sm text-muted-foreground'>{body}</p>
        <div className='mt-8 flex flex-wrap justify-center gap-3'>{children}</div>
      </div>
    </main>
  )
}
