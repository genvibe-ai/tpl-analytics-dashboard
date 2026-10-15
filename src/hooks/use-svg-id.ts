import { useId } from 'react'

/** A unique id that is safe inside SVG `url(#id)` references. */
export function useSvgId(prefix = 'g') {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
}
