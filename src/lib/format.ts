/**
 * Number, money, percent and date formatting. Locale and currency come from `site` in content.ts.
 */
import { common, site } from '@/content'

const numberFormats = new Map<string, Intl.NumberFormat>()

function nf(options: Intl.NumberFormatOptions) {
  const key = JSON.stringify(options)
  let format = numberFormats.get(key)
  if (!format) {
    format = new Intl.NumberFormat(site.locale, options)
    numberFormats.set(key, format)
  }
  return format
}

type NumberOptions = { compact?: boolean; decimals?: number }

export function formatCurrency(value: number, { compact = false, decimals }: NumberOptions = {}) {
  const digits = decimals ?? (compact ? 1 : 0)
  return nf({
    style: 'currency',
    currency: site.currency,
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: digits,
    minimumFractionDigits: compact ? 0 : digits,
  }).format(value)
}

export function formatNumber(value: number, { compact = false, decimals }: NumberOptions = {}) {
  return nf({
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: decimals ?? (compact ? 1 : 0),
  }).format(value)
}

/** `value` is already a percentage (6.4 → "6.4%"). */
export function formatPercent(value: number, decimals = 1) {
  return nf({
    style: 'percent',
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value / 100)
}

/** Signed change: "+6.4%", "−0.4 pts". */
export function formatDelta(value: number, unit: '%' | 'pts' = '%', decimals = 1) {
  const sign = value > 0.0001 ? '+' : value < -0.0001 ? '−' : ''
  const number = nf({ maximumFractionDigits: decimals, minimumFractionDigits: decimals }).format(
    Math.abs(value)
  )
  return unit === '%' ? `${sign}${number}%` : `${sign}${number} ${common.points}`
}

/** Signed money: "+$1,240", "−$430". */
export function formatSignedCurrency(value: number, options: NumberOptions = {}) {
  const sign = value > 0 ? '+' : value < 0 ? '−' : ''
  return `${sign}${formatCurrency(Math.abs(value), options)}`
}

export function formatKpi(value: number, format: 'currency' | 'percent' | 'number', compact = false) {
  if (format === 'currency') return formatCurrency(value, { compact })
  if (format === 'percent') return formatPercent(value, 1)
  return formatNumber(value, { compact })
}

/* ── Dates ─────────────────────────────────────────────────────────── */

const dateFormats = {
  day: { month: 'short', day: 'numeric' },
  date: { month: 'short', day: 'numeric', year: 'numeric' },
  month: { month: 'short' },
  monthYear: { month: 'short', year: 'numeric' },
  monthLong: { month: 'long', year: 'numeric' },
  weekday: { weekday: 'short' },
  long: { weekday: 'long', month: 'long', day: 'numeric' },
  time: { hour: 'numeric', minute: '2-digit' },
} satisfies Record<string, Intl.DateTimeFormatOptions>

const dateCache = new Map<string, Intl.DateTimeFormat>()

export function formatDate(value: string | Date, style: keyof typeof dateFormats = 'date') {
  let format = dateCache.get(style)
  if (!format) {
    format = new Intl.DateTimeFormat(site.locale, dateFormats[style])
    dateCache.set(style, format)
  }
  return format.format(typeof value === 'string' ? new Date(value) : value)
}

const relative = () => new Intl.RelativeTimeFormat(site.locale, { numeric: 'auto', style: 'narrow' })
let relativeFormat: Intl.RelativeTimeFormat | undefined

/** "now", "5m ago", "3h ago", "yesterday", "4d ago", "2mo ago". */
export function timeAgo(value: string | Date, now = Date.now()) {
  relativeFormat ??= relative()
  const seconds = Math.round((now - new Date(value).getTime()) / 1000)
  if (seconds < 45) return relativeFormat.format(0, 'second')
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return relativeFormat.format(-minutes, 'minute')
  const hours = Math.round(minutes / 60)
  if (hours < 24) return relativeFormat.format(-hours, 'hour')
  const days = Math.round(hours / 24)
  if (days < 30) return relativeFormat.format(-days, 'day')
  const months = Math.round(days / 30.44)
  if (months < 12) return relativeFormat.format(-months, 'month')
  return relativeFormat.format(-Math.round(months / 12), 'year')
}

/** Replace {placeholders} in content strings. */
export function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match
  )
}
