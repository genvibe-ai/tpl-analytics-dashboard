import { useLayoutEffect, useRef, useState } from 'react'

/**
 * Width of an element in CSS pixels, kept up to date with a ResizeObserver. Transient 0 widths
 * (hidden or mid-layout) are ignored so charts keep their last real size instead of unmounting
 * and replaying their draw-in.
 */
export function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    const update = (next: number) => {
      if (next > 0) setWidth(next)
    }
    update(element.getBoundingClientRect().width)
    const observer = new ResizeObserver(([entry]) => update(entry.contentRect.width))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return [ref, width] as const
}
