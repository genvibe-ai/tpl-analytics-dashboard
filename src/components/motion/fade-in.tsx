import { motion, type HTMLMotionProps } from 'motion/react'

const EASE = [0.22, 1, 0.36, 1] as const

/** Fades and lifts its children in when they first scroll into view. */
export function FadeIn({
  delay = 0,
  y = 10,
  children,
  ...props
}: HTMLMotionProps<'div'> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
