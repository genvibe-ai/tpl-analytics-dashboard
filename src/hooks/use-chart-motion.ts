import { useEffect, useState } from 'react'
import { useReducedMotion } from 'motion/react'

const DURATION = 900

/**
 * Recharts animation props: one draw-in when the chart mounts (none for reduced-motion users).
 * Once it has played, later re-renders (window resizes, theme changes) draw instantly instead of
 * replaying it. Pass `replayKey` (for example the selected range) to play it again when that changes.
 */
export function useChartMotion(delay = 0, replayKey?: unknown) {
  const reduced = useReducedMotion()
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDone(false)
    const timer = window.setTimeout(() => setDone(true), delay + DURATION + 150)
    return () => window.clearTimeout(timer)
  }, [delay, replayKey])

  return {
    isAnimationActive: !reduced && !done,
    animationBegin: delay,
    animationDuration: DURATION,
    animationEasing: 'ease-out' as const,
  }
}
