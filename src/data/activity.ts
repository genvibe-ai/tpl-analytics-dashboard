/**
 * Live activity feed (fictional). `recentActivity` is shown on load; `livePool` is cycled to
 * simulate new events arriving (see features/overview/activity-feed.tsx).
 */
import type { ActivityEvent } from '@/types'
import { minutesAgo } from './seed'

export const recentActivity: ActivityEvent[] = [
  { id: 'a1', type: 'upgrade', account: 'Talloway Robotics', text: 'upgraded from Growth to Scale', amount: 2_450, at: minutesAgo(2) },
  { id: 'a2', type: 'expansion', account: 'Yarrow Systems', text: 'added 12 seats', amount: 960, at: minutesAgo(9) },
  { id: 'a3', type: 'trial', account: 'Driftline Media', text: 'started a 14-day Growth trial', at: minutesAgo(26) },
  { id: 'a4', type: 'payment_failed', account: 'Quietwater Labs', text: 'payment failed, retry in 2 days', amount: -8_420, at: minutesAgo(41) },
  { id: 'a5', type: 'new', account: 'Copperwick Studio', text: 'converted from trial to Growth', amount: 1_180, at: minutesAgo(68) },
  { id: 'a6', type: 'downgrade', account: 'Halcyon Freight', text: 'removed 18 seats', amount: -430, at: minutesAgo(134) },
  { id: 'a7', type: 'churn', account: 'Emberly Games', text: 'cancelled their Scale plan', amount: -3_960, at: minutesAgo(251) },
  { id: 'a8', type: 'milestone', account: 'Mossgrove Learning', text: 'passed 1M tracked events this month', at: minutesAgo(372) },
  { id: 'a9', type: 'expansion', account: 'Saffron Ridge Foods', text: 'added 8 seats', amount: 320, at: minutesAgo(455) },
  { id: 'a10', type: 'upgrade', account: 'Vellum & Ink', text: 'upgraded from Starter to Growth', amount: 1_640, at: minutesAgo(530) },
  { id: 'a11', type: 'trial', account: 'Opalreach Health', text: 'started a 14-day Starter trial', at: minutesAgo(610) },
  { id: 'a12', type: 'milestone', account: 'Kitefin Logistics', text: 'renewed for another year', at: minutesAgo(760) },
]

/** Events that "arrive" while the page is open (timestamps are set when they appear). */
export const livePool: Omit<ActivityEvent, 'id' | 'at'>[] = [
  { type: 'expansion', account: 'Kitefin Logistics', text: 'added 20 seats', amount: 1_600 },
  { type: 'new', account: 'Opalreach Health', text: 'subscribed to Starter', amount: 149 },
  { type: 'trial', account: 'Garnetvale Energy', text: 'started a 14-day Scale trial' },
  { type: 'upgrade', account: 'Wrenfield Clinics', text: 'upgraded from Scale to Enterprise', amount: 5_120 },
  { type: 'payment_failed', account: 'Zephyr Lane Travel', text: 'invoice is 14 days overdue', amount: -2_380 },
  { type: 'new', account: 'Sablecrest Media', text: 'converted from trial to Growth', amount: 690 },
  { type: 'expansion', account: 'Brasswood Health', text: 'added the Forecasting add-on', amount: 1_250 },
  { type: 'milestone', account: 'Yarrow Systems', text: 'invited their 50th teammate' },
  { type: 'churn', account: 'Pebblemere Studio', text: 'cancelled their Starter plan', amount: -89 },
  { type: 'new', account: 'Heronbridge Legal', text: 'subscribed to Growth', amount: 540 },
  { type: 'upgrade', account: 'Corvid Optics', text: 'switched to annual billing', amount: 0 },
  { type: 'trial', account: 'Lindenmere Wellness', text: 'started a 14-day Growth trial' },
]
