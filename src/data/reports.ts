/**
 * Report datasets: MRR movements (waterfall), cohort retention (heatmap) and new MRR by
 * acquisition channel. All fictional; numbers are consistent with TARGET_MRR in customers.ts.
 */
import type { ChannelMonth, Cohort, MrrMovement } from '@/types'
import { TARGET_MRR } from './customers'
import { monthsAgo, seeded } from './seed'

/* ── MRR movements over the last 30 days ───────────────────────────── */

const movementDeltas = {
  new: 24_820,
  expansion: 18_940,
  reactivation: 2_110,
  contraction: -6_380,
  churn: -9_650,
}

const netNewMrr = Object.values(movementDeltas).reduce((sum, v) => sum + v, 0)

/** Starting MRR 30 days ago (ending MRR minus the net movement). */
export const startingMrr = TARGET_MRR - netNewMrr

/** Labels come from content.ts (reports.movements.labels). */
export const mrrMovements: Omit<MrrMovement, 'label'>[] = [
  { id: 'start', value: startingMrr },
  { id: 'new', value: movementDeltas.new },
  { id: 'expansion', value: movementDeltas.expansion },
  { id: 'reactivation', value: movementDeltas.reactivation },
  { id: 'contraction', value: movementDeltas.contraction },
  { id: 'churn', value: movementDeltas.churn },
  { id: 'end', value: TARGET_MRR },
]

export { netNewMrr }

/* ── Cohort retention (logo retention of paying customers) ─────────── */

const cohortRand = seeded(4207)

export const cohorts: Cohort[] = Array.from({ length: 12 }, (_, i) => {
  const age = 11 - i // months since the cohort started (oldest first)
  const floor = 0.7 + 0.012 * (11 - age) // newer cohorts retain better
  const retention: number[] = []
  let previous = 100
  for (let m = 0; m <= age; m++) {
    const modelled = 100 * (floor + (1 - floor) * Math.exp(-m / 2.6))
    const value = m === 0 ? 100 : Math.min(previous, modelled + (cohortRand() - 0.5) * 2.4)
    retention.push(Math.round(value * 10) / 10)
    previous = value
  }
  return {
    month: monthsAgo(age),
    size: Math.round(30 + i * 1.4 + cohortRand() * 6),
    retention,
  }
})

/* ── New MRR by acquisition channel, last 12 complete months ───────── */

/** Channel keys; their labels and colours are set in content.ts (reports.channels). */
export const channelKeys = ['organic', 'paid', 'partners', 'outbound'] as const
export type ChannelKey = (typeof channelKeys)[number]

const channelRand = seeded(9931)
const channelModel: Record<ChannelKey, [start: number, end: number]> = {
  organic: [8_200, 10_600],
  paid: [6_400, 5_600],
  partners: [2_300, 6_800],
  outbound: [3_900, 4_600],
}

export const channelMonths: ChannelMonth[] = Array.from({ length: 12 }, (_, i) => {
  const t = i / 11
  const row: ChannelMonth = { month: monthsAgo(12 - i) }
  for (const key of channelKeys) {
    const [start, end] = channelModel[key]
    const value = start + (end - start) * t
    row[key] = Math.round((value * (0.93 + channelRand() * 0.14)) / 10) * 10
  }
  return row
})
