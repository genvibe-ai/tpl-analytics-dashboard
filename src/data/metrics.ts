/**
 * Business metrics behind the Overview page: KPI values and trends, the daily revenue series,
 * MRR by plan and weekly new vs churned customers. Built from the customers dataset and a seeded
 * model so every number agrees with the others.
 */
import type { Plan, PlanMonth, RevenuePoint, SignupWeek } from '@/types'
import { TARGET_MRR, customers, isPaying } from './customers'
import { startingMrr } from './reports'
import { NOW, daysAgo, monthsAgo, seeded } from './seed'

const rand = seeded(7331)
const noise = (spread: number) => (rand() - 0.5) * 2 * spread

/* ── MRR history: 25 months, oldest first, last = today ────────────── */

export const mrrHistory: number[] = (() => {
  const months = 25
  const out = new Array<number>(months)
  out[months - 1] = TARGET_MRR
  out[months - 2] = startingMrr
  for (let i = months - 3; i >= 0; i--) {
    out[i] = Math.round(out[i + 1] / (1 + 0.047 + noise(0.012)))
  }
  return out
})()

/* ── KPIs ──────────────────────────────────────────────────────────── */

const paying = customers.filter(isPaying)
const payingCount = paying.length

const signupRand = seeded(5150)
/** New paying customers vs churned customers per week, last 12 weeks (oldest first). */
export const signupWeeks: SignupWeek[] = Array.from({ length: 12 }, (_, i) => ({
  week: daysAgo(7 * (11 - i) + ((NOW.getDay() + 6) % 7)),
  signups: Math.round(7 + i * 0.25 + signupRand() * 4.4),
  churned: Math.round(1.6 + signupRand() * 3.4),
}))

const netLast4Weeks = signupWeeks.slice(-4).reduce((sum, w) => sum + w.signups - w.churned, 0)

const customerTrend: number[] = (() => {
  const out = new Array<number>(12)
  out[11] = payingCount
  out[10] = payingCount - netLast4Weeks
  for (let i = 9; i >= 0; i--) out[i] = Math.round(out[i + 1] / (1 + 0.036 + noise(0.008)))
  return out
})()

const nrrTrend = [108.9, 109.6, 110.4, 111.2, 112.0, 112.6, 113.9, 114.8, 115.6, 116.4, 116.1, 118.2]
const churnTrend = [2.9, 2.8, 2.7, 2.7, 2.6, 2.4, 2.4, 2.3, 2.2, 2.1, 2.3, 1.9]

const pctChange = (now: number, before: number) => ((now - before) / before) * 100
const last = (list: number[]) => list[list.length - 1]
const prev = (list: number[]) => list[list.length - 2]

/** KPI numbers by id. Labels, hints and icons live in content.ts (overview.kpis). */
export const kpiValues = {
  mrr: {
    value: TARGET_MRR,
    delta: pctChange(TARGET_MRR, startingMrr),
    trend: mrrHistory.slice(-12),
  },
  nrr: {
    value: last(nrrTrend),
    delta: last(nrrTrend) - prev(nrrTrend),
    trend: nrrTrend,
  },
  customers: {
    value: payingCount,
    delta: pctChange(last(customerTrend), prev(customerTrend)),
    trend: customerTrend,
  },
  churn: {
    value: last(churnTrend),
    delta: last(churnTrend) - prev(churnTrend),
    trend: churnTrend,
  },
}

/* ── Daily revenue (800 days, oldest first) ────────────────────────── */

const WEEKDAY_FACTOR = [0.9, 1.03, 1.06, 1.05, 1.04, 1.01, 0.91] // Sun … Sat
const DAYS = 800

type Day = { date: string; value: number }

export const dailyRevenue: Day[] = (() => {
  const revRand = seeded(2718)
  const out: Day[] = []
  for (let d = DAYS - 1; d >= 0; d--) {
    const iso = daysAgo(d)
    const date = new Date(iso)
    // Interpolate MRR at this day from the monthly history.
    const monthsBack = d / 30.44
    const position = Math.max(0, mrrHistory.length - 1 - monthsBack)
    const lo = Math.floor(position)
    const hi = Math.min(mrrHistory.length - 1, lo + 1)
    const mrr = mrrHistory[lo] + (mrrHistory[hi] - mrrHistory[lo]) * (position - lo)
    const renewalBoost = date.getDate() === 1 ? 1.1 : 1
    const value =
      (mrr / 30.44) *
      WEEKDAY_FACTOR[date.getDay()] *
      renewalBoost *
      (0.95 + revRand() * 0.1)
    out.push({ date: iso, value: Math.round(value) })
  }
  return out
})()

export type RevenueRange = '7d' | '30d' | '90d' | '12m'

export type RevenueSeries = {
  points: RevenuePoint[]
  total: number
  previousTotal: number
  change: number
  granularity: 'day' | 'month'
}

const sum = (list: { value: number }[]) => list.reduce((s, p) => s + p.value, 0)

/** Revenue for a range, with the previous period aligned point by point. */
export function revenueSeries(range: RevenueRange): RevenueSeries {
  if (range === '12m') {
    const byMonth = new Map<string, number>()
    for (const day of dailyRevenue) {
      const d = new Date(day.date)
      const key = new Date(d.getFullYear(), d.getMonth(), 1).toISOString()
      byMonth.set(key, (byMonth.get(key) ?? 0) + day.value)
    }
    const points: RevenuePoint[] = []
    for (let m = 12; m >= 1; m--) {
      const key = monthsAgo(m)
      const prevKey = monthsAgo(m + 12)
      points.push({ date: key, value: byMonth.get(key) ?? 0, previous: byMonth.get(prevKey) ?? 0 })
    }
    const total = points.reduce((s, p) => s + p.value, 0)
    const previousTotal = points.reduce((s, p) => s + p.previous, 0)
    return { points, total, previousTotal, change: pctChange(total, previousTotal), granularity: 'month' }
  }
  const length = range === '7d' ? 7 : range === '30d' ? 30 : 90
  const current = dailyRevenue.slice(-length)
  const before = dailyRevenue.slice(-length * 2, -length)
  const points = current.map((p, i) => ({ date: p.date, value: p.value, previous: before[i]?.value ?? 0 }))
  const total = sum(current)
  const previousTotal = sum(before)
  return { points, total, previousTotal, change: pctChange(total, previousTotal), granularity: 'day' }
}

/* ── MRR by plan, last 6 months (oldest first) ─────────────────────── */

export const plans: Plan[] = ['Starter', 'Growth', 'Scale', 'Enterprise']

export const planMrrNow: Record<Plan, number> = plans.reduce(
  (acc, plan) => {
    acc[plan] = paying.filter((c) => c.plan === plan).reduce((s, c) => s + c.mrr, 0)
    return acc
  },
  {} as Record<Plan, number>
)

export const planCounts: Record<Plan, number> = plans.reduce(
  (acc, plan) => {
    acc[plan] = paying.filter((c) => c.plan === plan).length
    return acc
  },
  {} as Record<Plan, number>
)

const PLAN_GROWTH: Record<Plan, number> = {
  Starter: 0.012,
  Growth: 0.038,
  Scale: 0.064,
  Enterprise: 0.081,
}

export const planMonths: PlanMonth[] = (() => {
  const planRand = seeded(1618)
  const rows: PlanMonth[] = []
  const running = { ...planMrrNow }
  for (let m = 0; m < 6; m++) {
    // Scale the plan split so each month adds up to that month's MRR.
    const monthTotal = mrrHistory[mrrHistory.length - 1 - m]
    const rawTotal = plans.reduce((s, p) => s + running[p], 0)
    const row = { month: monthsAgo(m) } as PlanMonth
    for (const p of plans) row[p] = Math.round((running[p] / rawTotal) * monthTotal)
    rows.unshift(row)
    for (const p of plans) running[p] = running[p] / (1 + PLAN_GROWTH[p] + (planRand() - 0.5) * 0.02)
  }
  return rows
})()

/* ── Customers summary (Customers page) ────────────────────────────── */

export const customerSummary = {
  total: customers.length,
  paying: payingCount,
  trialing: customers.filter((c) => c.status === 'trialing').length,
  atRisk: customers.filter((c) => isPaying(c) && c.health < 40).length,
  arpa: TARGET_MRR / payingCount,
}
