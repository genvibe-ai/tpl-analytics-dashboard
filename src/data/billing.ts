/**
 * Billing data for the workspace's own subscription (fictional). Plan names, prices and feature
 * lists are copy and live in content.ts (settings.billing).
 */
import type { Invoice, UsageMeter } from '@/types'
import { NOW, daysAgo } from './seed'

export const currentPlanId = 'pro'

/** Days until the subscription renews. */
export const renewsInDays = 18

export const usage: UsageMeter[] = [
  { id: 'events', used: 8_240_000, limit: 10_000_000 },
  { id: 'seats', used: 7, limit: 10 },
  { id: 'dashboards', used: 34, limit: 50 },
]

export const paymentMethod = {
  last4: '1879',
  expiry: '08/28',
  holder: 'Fernwick, Inc.',
  email: 'billing@fernwick.example',
}

const lastInvoice = new Date(daysAgo(12))

/** Monthly invoices on the same day each month, newest first (the last one was 12 days ago). */
export const invoices: Invoice[] = Array.from({ length: 8 }, (_, i) => ({
  id: `INV-${NOW.getFullYear()}-${String(148 - i).padStart(4, '0')}`,
  date: new Date(lastInvoice.getFullYear(), lastInvoice.getMonth() - i, lastInvoice.getDate()).toISOString(),
  amount: i < 5 ? 349 : 299,
  status: 'Paid',
}))
