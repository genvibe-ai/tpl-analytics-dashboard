/**
 * Shapes of the content and mock data. Add a field here first, then fill it in
 * src/content.ts or src/data/*.ts, then read it in a component.
 */
import type { LucideIcon } from 'lucide-react'

/* ── Theme ─────────────────────────────────────────────────────────── */

export type ThemeMode = 'dark' | 'light'
export type ThemePreference = ThemeMode | 'system'

/** Base colours for one mode. Every other role (card text, rings, sidebar…) is derived in theme.css. */
export type Palette = {
  background: string
  foreground: string
  sidebar: string
  card: string
  popover: string
  muted: string
  mutedForeground: string
  accent: string
  border: string
  input: string
  primary: string
  primaryForeground: string
  positive: string
  negative: string
  warning: string
  destructive: string
}

/** Chart colours for one mode (validated for colour-blind separation and contrast). */
export type ChartPalette = {
  /** Categorical series, assigned in this fixed order (channels, segments…). */
  series: [string, string, string, string]
  /** Ordered plan tiers, lowest → highest (one hue, light → dark on light, dim → bright on dark). */
  plans: [string, string, string, string]
  /** De-emphasis line (previous period). */
  compare: string
  /** Heatmap ramp end points (cohort retention). */
  heatLow: string
  heatHigh: string
}

/* ── People & images ───────────────────────────────────────────────── */

export type ImageAsset = {
  src: string
  alt: string
  width: number
  height: number
}

export type AvatarKey = 'av-1' | 'av-2' | 'av-3' | 'av-4' | 'av-5' | 'av-6' | 'av-7' | 'av-8'

export type TeamRole = 'Owner' | 'Admin' | 'Analyst' | 'Viewer'

export type TeamMember = {
  id: string
  name: string
  title: string
  email: string
  role: TeamRole
  avatar?: AvatarKey
  /** Minutes since the member was last active. */
  lastActiveMinutes: number
}

/* ── Customers ─────────────────────────────────────────────────────── */

export type Plan = 'Starter' | 'Growth' | 'Scale' | 'Enterprise'
export type CustomerStatus = 'active' | 'trialing' | 'past_due' | 'churned'
export type Region = 'North America' | 'Europe' | 'APAC' | 'LATAM'

export type Customer = {
  id: string
  name: string
  domain: string
  industry: string
  plan: Plan
  status: CustomerStatus
  region: Region
  /** Monthly recurring revenue in the site currency (0 for trials and churned accounts). */
  mrr: number
  seats: number
  /** 0–100. 70+ healthy, 40–69 watch, under 40 at risk. */
  health: number
  /** Team member who owns the account (null = unassigned). */
  ownerId: string | null
  /** ISO date the account started. */
  since: string
  /** ISO timestamp of the last product activity. */
  lastActive: string
  contact: {
    name: string
    title: string
    email: string
    avatar?: AvatarKey
  }
  /** Change in MRR over the last 30 days, in percent. */
  mrrChange: number
  /** Featured accounts are hand-written in src/data/customers.ts; the rest are generated. */
  featured?: boolean
}

/* ── Metrics ───────────────────────────────────────────────────────── */

export type KpiFormat = 'currency' | 'percent' | 'number'

export type Kpi = {
  id: string
  label: string
  hint: string
  value: number
  format: KpiFormat
  /** Change vs the previous period; `deltaUnit` says how to show it. */
  delta: number
  deltaUnit: '%' | 'pts'
  /** true when a rising number is good news (false for churn). */
  upIsGood: boolean
  /** 12 points, oldest first; the last point is the current value. */
  trend: number[]
  icon: LucideIcon
}

export type RevenuePoint = {
  /** ISO date (day or first day of the month). */
  date: string
  value: number
  previous: number
}

export type PlanMonth = { month: string } & Record<Plan, number>

export type SignupWeek = {
  /** ISO date of the week's Monday. */
  week: string
  signups: number
  churned: number
}

/* ── Activity, inbox, notifications ────────────────────────────────── */

export type ActivityType =
  | 'new'
  | 'upgrade'
  | 'expansion'
  | 'trial'
  | 'downgrade'
  | 'churn'
  | 'payment_failed'
  | 'milestone'

export type ActivityEvent = {
  id: string
  type: ActivityType
  /** Account name shown in bold. */
  account: string
  /** Rest of the sentence after the account name. */
  text: string
  /** MRR impact in the site currency (signed); omit when not money-related. */
  amount?: number
  at: string
}

export type Message = {
  id: string
  from: 'me' | 'them'
  text: string
  at: string
  /** Optional metric card attached to a message (alerts). */
  metric?: { label: string; value: string; delta: string; tone: 'positive' | 'negative' }
}

export type Conversation = {
  id: string
  name: string
  /** Role and company, e.g. "VP Operations · Kitefin Logistics". */
  subtitle: string
  avatar?: AvatarKey
  /** Bots and system senders show the brand mark instead of a photo. */
  isBot?: boolean
  /** Customer id when the conversation is with a customer (opens their profile). */
  customerId?: string
  label?: string
  unread: number
  messages: Message[]
}

export type Notification = {
  id: string
  title: string
  body: string
  at: string
  tone: 'positive' | 'negative' | 'warning' | 'info'
  read?: boolean
}

/* ── Reports ───────────────────────────────────────────────────────── */

export type MrrMovement = {
  id: 'start' | 'new' | 'expansion' | 'reactivation' | 'contraction' | 'churn' | 'end'
  label: string
  value: number
}

export type Cohort = {
  /** ISO date of the cohort month. */
  month: string
  size: number
  /** Retention by month since signup, in percent. Index 0 is always 100. */
  retention: number[]
}

export type ChannelMonth = { month: string } & Record<string, number | string>

/* ── Billing ───────────────────────────────────────────────────────── */

export type Invoice = {
  id: string
  date: string
  amount: number
  status: 'Paid' | 'Due' | 'Refunded'
}

export type UsageMeter = {
  /** Key into settings.billing.usageLabels in content.ts. */
  id: 'events' | 'seats' | 'dashboards'
  used: number
  limit: number
}
