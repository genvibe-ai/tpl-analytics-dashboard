import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'

type CountUpProps = {
  value: number
  format: (value: number) => string
  /** Seconds. */
  duration?: number
  delay?: number
  className?: string
}

/**
 * Counts from 0 to `value` the first time it scrolls into view. Later changes animate from the
 * previous value. Reduced-motion users see the final number straight away.
 */
export function CountUp({ value, format, duration = 1.1, delay = 0, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(() => (reduced ? value : 0))
  const from = useRef(0)

  useEffect(() => {
    if (reduced) {
      setDisplay(value)
      from.current = value
      return
    }
    if (!inView) return
    const controls = animate(from.current, value, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(latest),
    })
    from.current = value
    return () => controls.stop()
  }, [inView, value, duration, delay, reduced])

  return (
    <span ref={ref} className={className}>
      {format(display)}
    </span>
  )
}
