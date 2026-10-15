/**
 * Helpers for the mock data.
 *
 * Random numbers are seeded, so every load shows the same data. Dates are relative to the moment the
 * app loads (minutesAgo, daysAgo, monthsAgo), so the dashboard always looks current.
 * Replace the files in src/data with real queries (for example Supabase) when you connect a backend.
 */

/** Deterministic pseudo-random generator (mulberry32). Returns numbers in [0, 1). */
export function seeded(seed: number) {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

/** Stable numeric hash of a string (for per-record seeds). */
export function hash(text: string) {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export const NOW = new Date()

export const minutesAgo = (minutes: number) =>
  new Date(NOW.getTime() - minutes * 60_000).toISOString()

/** Local midnight `days` days ago. */
export function daysAgo(days: number) {
  const d = new Date(NOW)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

/** First day of the month, `months` months ago (0 = this month). */
export function monthsAgo(months: number) {
  return new Date(NOW.getFullYear(), NOW.getMonth() - months, 1).toISOString()
}

export const round = (value: number, step = 1) => Math.round(value / step) * step
