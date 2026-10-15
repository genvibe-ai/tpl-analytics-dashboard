/**
 * ────────────────────────────────────────────────────────────────────
 *  APP CONTENT — the single source of truth for this template.
 *
 *  Brand, colours, navigation, every label and message, image paths and the mock datasets
 *  (from src/data) are wired up here. Components only read from this file, so you can rebrand
 *  the whole dashboard by editing the objects below. Placeholders like {name} are filled in by
 *  the components.
 *
 *  Order: site → theme → images → workspace & user → nav → header & command menu → overview →
 *         customers → reports → inbox → settings → auth → errors → common → data
 * ────────────────────────────────────────────────────────────────────
 */
import {
  Bell,
  ChartColumnBig,
  CreditCard,
  Inbox,
  LayoutDashboard,
  Palette as PaletteIcon,
  Repeat2,
  Settings,
  UserMinus,
  UserRound,
  Users,
  UsersRound,
  Wallet,
} from 'lucide-react'
import { recentActivity, livePool } from './data/activity'
import { currentPlanId, invoices, paymentMethod, renewsInDays, usage } from './data/billing'
import { customerById, customers, TARGET_MRR } from './data/customers'
import { conversations } from './data/inbox'
import {
  customerSummary,
  kpiValues,
  planCounts,
  planMonths,
  planMrrNow,
  revenueSeries,
  signupWeeks,
} from './data/metrics'
import { notifications } from './data/notifications'
import { channelKeys, channelMonths, cohorts, mrrMovements, netNewMrr } from './data/reports'
import { pendingInvites, team, teamById } from './data/team'
import type {
  AvatarKey,
  ChartPalette,
  ImageAsset,
  Palette,
  ThemeMode,
  ThemePreference,
} from './types'

/* ── Brand ─────────────────────────────────────────────────────────── */

export const site = {
  name: 'Lumetric',
  tagline: 'Revenue analytics',
  title: 'Lumetric · Revenue and product analytics',
  description:
    'Lumetric brings MRR, retention, customers and cohorts into one live dashboard for SaaS teams.',
  /** Number, currency and date formatting. */
  locale: 'en-US',
  currency: 'USD',
}

/* ── Colours (written to CSS variables at startup by src/lib/theme.ts) ──
 * Keep text colours at 4.5:1 or more on `card` and `background`. `primary` is the brand violet;
 * button fills and violet text use AA-safe shades derived from it in src/styles/theme.css.
 */
export const theme = {
  /** What first-time visitors see: 'dark' | 'light' | 'system'. */
  defaultMode: 'dark' as ThemePreference,
  colors: {
    dark: {
      background: '#0B0D12', // graphite
      sidebar: '#08090D',
      card: '#10131A',
      popover: '#141821',
      foreground: '#ECEEF3',
      muted: '#161A23',
      mutedForeground: '#8E97A8',
      accent: '#1A1F2A', // hover and selected surfaces
      border: '#1F2430',
      input: '#272C38',
      primary: '#7C5CFF', // violet
      primaryForeground: '#FFFFFF',
      positive: '#34D399', // mint: rising numbers
      negative: '#FB7185',
      warning: '#FBBF24',
      destructive: '#E11D48',
    },
    light: {
      background: '#F7F7FA',
      sidebar: '#EFEFF4',
      card: '#FFFFFF',
      popover: '#FFFFFF',
      foreground: '#0B0D12',
      muted: '#F1F1F5',
      mutedForeground: '#5B6272',
      accent: '#EDEDF3',
      border: '#E4E4EC',
      input: '#DCDCE5',
      primary: '#7C5CFF',
      primaryForeground: '#FFFFFF',
      positive: '#047857', // deeper mint so it reads on white
      negative: '#E11D48',
      warning: '#B45309',
      destructive: '#E11D48',
    },
  } satisfies Record<ThemeMode, Palette>,
  /** Chart colours, validated for colour-blind separation and contrast in each mode. */
  charts: {
    dark: {
      series: ['#7C5CFF', '#D95926', '#3987E5', '#D55181'],
      plans: ['#4A5BE8', '#7C5CFF', '#A855F7', '#E879F9'],
      kpis: ['#8B6CFF', '#34D399', '#38BDF8', '#FB7185'],
      revenueEnd: '#E879F9',
      compare: '#6B7385',
      heatLow: '#151925',
      heatHigh: '#B5A6FF',
    },
    light: {
      series: ['#7C5CFF', '#EB6834', '#2A78D6', '#E87BA4'],
      plans: ['#4F5BD5', '#7C5CFF', '#9333EA', '#C026D3'],
      kpis: ['#6D4CFF', '#059669', '#0284C7', '#E11D48'],
      revenueEnd: '#C026D3',
      compare: '#8C93A1',
      heatLow: '#F3F0FF',
      heatHigh: '#4B2FD0',
    },
  } satisfies Record<ThemeMode, ChartPalette>,
}

/* ── Images (public/images) ────────────────────────────────────────── */

const avatar = (key: AvatarKey, alt: string): ImageAsset => ({
  src: `/images/${key}.webp`,
  alt,
  width: 320,
  height: 320,
})

export const images = {
  avatars: {
    'av-1': avatar('av-1', 'Amara Okafor'),
    'av-2': avatar('av-2', 'Daniel Kim'),
    'av-3': avatar('av-3', 'Sofia Herrera'),
    'av-4': avatar('av-4', 'Martin Keller'),
    'av-5': avatar('av-5', 'Leila Haddad'),
    'av-6': avatar('av-6', 'Arjun Mehta'),
    'av-7': avatar('av-7', 'Freya Lindqvist'),
    'av-8': avatar('av-8', 'Marcus Bell'),
  } satisfies Record<AvatarKey, ImageAsset>,
}

/* ── Workspace & signed-in user ────────────────────────────────────── */

export const workspace = {
  /** The company whose numbers the dashboard shows. */
  name: 'Fernwick',
  label: 'Workspaces',
  add: 'Add workspace',
  addToast: 'Workspaces are a demo here. Connect a backend to create more.',
  environments: [
    { id: 'production', name: 'Fernwick', caption: 'Production' },
    { id: 'staging', name: 'Fernwick Staging', caption: 'Sandbox data' },
  ],
}

/** The signed-in user is the first team member (src/data/team.ts). */
export const user = team[0]

/* ── Navigation ────────────────────────────────────────────────────── */

const unreadMessages = conversations.reduce((sum, c) => sum + c.unread, 0)

export const nav = {
  groups: [
    {
      title: 'Analytics',
      items: [
        { title: 'Overview', url: '/', icon: LayoutDashboard },
        { title: 'Customers', url: '/customers', icon: Users },
        { title: 'Reports', url: '/reports', icon: ChartColumnBig },
      ],
    },
    {
      title: 'Workspace',
      items: [
        { title: 'Inbox', url: '/inbox', icon: Inbox, badge: unreadMessages ? String(unreadMessages) : undefined },
        { title: 'Settings', url: '/settings', icon: Settings },
      ],
    },
  ],
  usageCard: {
    title: 'Pro plan',
    body: '{percent}% of this cycle’s tracked events used.',
    cta: 'Upgrade plan',
    href: '/settings/billing',
  },
  userMenu: {
    label: 'Account',
    profile: 'Profile',
    team: 'Team',
    billing: 'Billing',
    signOut: 'Sign out',
  },
}

/* ── Header, notifications, command menu ───────────────────────────── */

export const header = {
  toggleSidebar: 'Toggle sidebar',
  breadcrumb: 'Breadcrumb',
  search: 'Search',
  searchPlaceholder: 'Search or jump to…',
  shortcut: 'K',
  theme: { toDark: 'Switch to dark mode', toLight: 'Switch to light mode' },
  notifications: {
    open: 'Open notifications',
    title: 'Notifications',
    unread: '{count} new',
    markAllRead: 'Mark all as read',
    empty: 'You are all caught up.',
    footer: 'See live activity',
  },
  account: 'Open account menu',
}

export const commandMenu = {
  title: 'Command menu',
  description: 'Search pages, customers and actions',
  placeholder: 'Type a command or search…',
  empty: 'No results found.',
  groups: {
    pages: 'Pages',
    customers: 'Top customers',
    actions: 'Actions',
    theme: 'Theme',
  },
  actions: {
    export: 'Export revenue report',
    exportDone: 'Revenue report exported',
    invite: 'Invite a teammate',
    message: 'Open inbox',
  },
  theme: { light: 'Light', dark: 'Dark', system: 'System' },
}

/* ── Overview ──────────────────────────────────────────────────────── */

export const overview = {
  greeting: {
    morning: 'Good morning, {name}',
    afternoon: 'Good afternoon, {name}',
    evening: 'Good evening, {name}',
  },
  description: 'Here is how {workspace} is doing today. New subscription events stream in below.',
  kpisLabel: 'Key metrics',
  csv: { metric: 'Metric', value: 'Value', change: 'Change', date: 'Date' },
  actions: {
    export: 'Export',
    exportDone: 'Overview exported as CSV',
    share: 'Share',
    shareDone: 'Link copied to the clipboard',
  },
  kpis: [
    {
      id: 'mrr',
      label: 'Monthly recurring revenue',
      hint: 'All active subscriptions, normalized to one month.',
      format: 'currency',
      deltaUnit: '%',
      upIsGood: true,
      icon: Wallet,
    },
    {
      id: 'nrr',
      label: 'Net revenue retention',
      hint: 'Revenue kept from last year’s customers, including expansion.',
      format: 'percent',
      deltaUnit: 'pts',
      upIsGood: true,
      icon: Repeat2,
    },
    {
      id: 'customers',
      label: 'Paying customers',
      hint: 'Accounts with an active or past-due subscription.',
      format: 'number',
      deltaUnit: '%',
      upIsGood: true,
      icon: UsersRound,
    },
    {
      id: 'churn',
      label: 'Logo churn',
      hint: 'Share of paying customers who cancelled in the last 30 days.',
      format: 'percent',
      deltaUnit: 'pts',
      upIsGood: false,
      icon: UserMinus,
    },
  ] as const,
  deltaCaption: 'vs last month',
  revenue: {
    title: 'Revenue',
    description: 'Collected revenue against the previous period',
    rangesLabel: 'Time range',
    ranges: [
      { id: '7d', label: '7D', caption: 'Last 7 days' },
      { id: '30d', label: '30D', caption: 'Last 30 days' },
      { id: '90d', label: '90D', caption: 'Last 90 days' },
      { id: '12m', label: '12M', caption: 'Last 12 months' },
    ] as const,
    defaultRange: '30d' as const,
    legend: { current: 'This period', previous: 'Previous period' },
    vsPrevious: 'vs previous period',
  },
  plans: {
    title: 'MRR by plan',
    description: 'Last 6 months',
    total: 'MRR this month',
    accounts: '{count} accounts',
  },
  signups: {
    title: 'New vs churned',
    description: 'Paying customers per week, last 12 weeks',
    legend: { signups: 'New', churned: 'Churned' },
    net: 'Net',
    weekOf: 'Week of {date}',
  },
  topAccounts: {
    title: 'Top accounts',
    description: 'Highest MRR right now',
    viewAll: 'All customers',
    count: 6,
    columns: {
      account: 'Account',
      mrr: 'MRR',
      change: '30-day change',
      seats: 'Seats',
      health: 'Health',
      trend: '12-month MRR',
      owner: 'Owner',
    },
  },
  activity: {
    title: 'Live activity',
    description: 'Subscription events as they happen',
    live: 'Live',
    paused: 'Paused',
    pause: 'Pause live updates',
    resume: 'Resume live updates',
    /** How often a simulated event arrives, in ms. */
    intervalMs: 6500,
    maxItems: 12,
    types: {
      new: 'New customer',
      upgrade: 'Upgrade',
      expansion: 'Expansion',
      trial: 'Trial',
      downgrade: 'Contraction',
      churn: 'Churn',
      payment_failed: 'Payment failed',
      milestone: 'Milestone',
    },
  },
}

/* ── Customers ─────────────────────────────────────────────────────── */

export const customersPage = {
  title: 'Customers',
  description: 'Every account with its plan, health and revenue. Select a row for the full profile.',
  actions: {
    export: 'Export CSV',
    exportDone: '{count} customers exported',
  },
  summary: {
    total: 'All accounts',
    paying: 'Paying',
    trialing: 'In trial',
    atRisk: 'At risk',
    arpa: 'Avg. revenue per account',
  },
  searchPlaceholder: 'Search name, domain or contact…',
  filters: {
    plan: 'Plan',
    status: 'Status',
    region: 'Region',
  },
  statuses: {
    active: 'Active',
    trialing: 'Trial',
    past_due: 'Past due',
    churned: 'Churned',
  },
  plans: ['Starter', 'Growth', 'Scale', 'Enterprise'] as const,
  regions: ['North America', 'Europe', 'APAC', 'LATAM'] as const,
  columns: {
    name: 'Customer',
    domain: 'Domain',
    status: 'Status',
    plan: 'Plan',
    mrr: 'MRR',
    seats: 'Seats',
    health: 'Health',
    region: 'Region',
    lastActive: 'Last active',
    owner: 'Owner',
  },
  empty: 'No customers match these filters.',
  unassigned: 'Unassigned',
  health: { healthy: 'Healthy', watch: 'Watch', atRisk: 'At risk' },
  drawer: {
    stats: { mrr: 'MRR', seats: 'Seats', health: 'Health', ltv: 'Lifetime revenue' },
    mrrHistory: 'MRR, last 12 months',
    details: 'Details',
    fields: {
      plan: 'Plan',
      region: 'Region',
      industry: 'Industry',
      since: 'Customer since',
      lastActive: 'Last active',
      owner: 'Account owner',
      domain: 'Domain',
      id: 'Customer ID',
    },
    contact: 'Primary contact',
    actions: {
      message: 'Message',
      copyEmail: 'Copy email',
      emailCopied: 'Email address copied',
      openConversation: 'Open conversation',
    },
    notFound: 'This customer could not be found.',
  },
}

/* ── Data tables (shared by every table) ───────────────────────────── */

export const dataTable = {
  reset: 'Reset',
  view: 'Columns',
  viewTitle: 'Show columns',
  clear: 'Clear filters',
  noResults: 'No matches.',
  sort: { asc: 'Sort ascending', desc: 'Sort descending', hide: 'Hide column' },
  pagination: {
    rowsPerPage: 'Rows per page',
    showing: '{from}–{to} of {total}',
    page: 'Page {page} of {pages}',
    first: 'Go to first page',
    previous: 'Go to previous page',
    next: 'Go to next page',
    last: 'Go to last page',
    goTo: 'Go to page {page}',
  },
}

/* ── Reports ───────────────────────────────────────────────────────── */

export const reports = {
  title: 'Reports',
  description: 'Where revenue comes from, where it goes and how long customers stay.',
  period: 'Last 12 months',
  actions: {
    export: 'Export PDF',
    exportDone: 'Report exported',
    schedule: 'Schedule',
    scheduleDone: 'This report will be emailed every Monday at 9:00',
  },
  view: { label: 'Display as', chart: 'Chart', table: 'Table' },
  highlights: {
    net: 'Net new MRR, last 30 days',
    retention: 'Month-6 retention, newest cohort',
    channel: 'Fastest-growing channel',
    channelCaption: '{change} new MRR vs the previous 6 months',
    retentionCaption: '{change} vs the oldest cohort',
    netCaption: '{change} of starting MRR',
  },
  movements: {
    title: 'MRR movements',
    description: 'How MRR changed over the last 30 days',
    labels: {
      start: 'Starting MRR',
      new: 'New business',
      expansion: 'Expansion',
      reactivation: 'Reactivation',
      contraction: 'Contraction',
      churn: 'Churn',
      end: 'Ending MRR',
      net: 'Net change',
    },
    legend: { total: 'Net change', gain: 'Gain', loss: 'Loss' },
    table: { movement: 'Movement', amount: 'Amount', share: 'Share of starting MRR' },
  },
  cohorts: {
    title: 'Cohort retention',
    description: 'Share of each monthly cohort still paying, by months since they subscribed',
    cohort: 'Cohort',
    size: 'Customers',
    month: 'Month {n}',
    monthShort: 'M{n}',
    scaleLow: 'Lower',
    scaleHigh: 'Higher retention',
    tooltip: '{value} retained · {count} of {size} customers',
  },
  channels: {
    title: 'New MRR by channel',
    description: 'New monthly recurring revenue by acquisition channel',
    labels: {
      organic: 'Organic search',
      paid: 'Paid ads',
      partners: 'Partners',
      outbound: 'Outbound sales',
    } satisfies Record<(typeof channelKeys)[number], string>,
    total: 'Total',
    month: 'Month',
    toggle: 'Show or hide {channel}',
  },
}

/* ── Inbox ─────────────────────────────────────────────────────────── */

export const inbox = {
  title: 'Inbox',
  description: 'Customers, teammates and alerts in one place.',
  searchPlaceholder: 'Search conversations…',
  filters: { all: 'All', unread: 'Unread' },
  compose: 'New message',
  composeToast: 'Pick a conversation to reply to.',
  empty: {
    title: 'Pick a conversation',
    body: 'Messages from customers, teammates and alerts land here.',
  },
  noResults: 'No conversations match your search.',
  you: 'You',
  bot: 'Automated',
  back: 'Back to conversations',
  viewAccount: 'View account',
  menu: {
    label: 'Conversation actions',
    markUnread: 'Mark as unread',
    archive: 'Archive',
    archived: 'Conversation archived',
  },
  composer: {
    label: 'Reply',
    placeholder: 'Write a reply…',
    send: 'Send',
    attach: 'Attach a file',
    attachToast: 'Attachments are off in this demo.',
    hint: 'Enter to send, Shift + Enter for a new line',
  },
  today: 'Today',
  yesterday: 'Yesterday',
}

/* ── Settings ──────────────────────────────────────────────────────── */

export const settings = {
  title: 'Settings',
  description: 'Your profile, team, plan and preferences.',
  nav: [
    { title: 'Profile', href: '/settings', icon: UserRound },
    { title: 'Team', href: '/settings/team', icon: Users },
    { title: 'Billing', href: '/settings/billing', icon: CreditCard },
    { title: 'Notifications', href: '/settings/notifications', icon: Bell },
    { title: 'Appearance', href: '/settings/appearance', icon: PaletteIcon },
  ],
  profile: {
    title: 'Profile',
    description: 'How you appear to your team and in shared reports.',
    photo: {
      label: 'Photo',
      change: 'Change photo',
      remove: 'Remove',
      hint: 'Square image, at least 320 × 320 px.',
      toast: 'Photo uploads are off in this demo.',
    },
    fields: {
      name: 'Full name',
      email: 'Work email',
      title: 'Job title',
      timezone: 'Time zone',
      bio: 'About you',
      bioHint: 'Shown on your profile card. 160 characters max.',
    },
    bio: 'Runs revenue operations at Fernwick. Owns pricing, forecasting and the Monday metrics review.',
    timezones: [
      'Pacific Time (UTC−08:00)',
      'Eastern Time (UTC−05:00)',
      'London (UTC+00:00)',
      'Berlin (UTC+01:00)',
      'Lagos (UTC+01:00)',
      'Singapore (UTC+08:00)',
    ],
    timezone: 'London (UTC+00:00)',
    save: 'Save changes',
    saved: 'Profile saved',
    errors: {
      name: 'Enter your name.',
      email: 'Enter a valid email address.',
      bio: 'Keep it under 160 characters.',
    },
  },
  team: {
    title: 'Team',
    description: 'Invite teammates and choose what they can see and change.',
    seats: '{used} of {limit} seats used',
    invite: {
      title: 'Invite a teammate',
      emailLabel: 'Email address',
      emailPlaceholder: 'name@fernwick.example',
      roleLabel: 'Role',
      button: 'Send invite',
      sent: 'Invite sent to {email}',
      invalid: 'Enter a valid email address.',
    },
    roles: [
      { id: 'Admin', description: 'Everything, including billing and the team' },
      { id: 'Analyst', description: 'All dashboards, reports and exports' },
      { id: 'Viewer', description: 'Read-only dashboards' },
    ] as const,
    members: 'Members',
    pending: 'Pending invites',
    pendingSince: 'Invited {time}',
    you: 'You',
    online: 'Online',
    lastActive: 'Active {time}',
    actions: {
      menu: 'Actions for {name}',
      makeRole: 'Make {role}',
      remove: 'Remove from workspace',
      removed: '{name} was removed',
      roleChanged: '{name} is now {role}',
      resend: 'Resend invite',
      resent: 'Invite resent',
      revoke: 'Revoke invite',
      revoked: 'Invite revoked',
    },
  },
  billing: {
    title: 'Billing',
    description: 'Your Lumetric plan, usage and invoices.',
    current: 'Current plan',
    renews: 'Renews in {days} days',
    perMonth: '/ month',
    usage: 'Usage this cycle',
    usageOf: '{used} of {limit}',
    usageLabels: { events: 'Tracked events', seats: 'Seats', dashboards: 'Dashboards' },
    plans: [
      {
        id: 'core',
        name: 'Core',
        price: 99,
        description: 'For small teams getting started.',
        features: ['3 seats', '1M tracked events', 'Core revenue reports'],
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 349,
        description: 'For growing revenue teams.',
        features: ['10 seats', '10M tracked events', 'Cohorts and forecasting', 'Alerts by email and chat'],
      },
      {
        id: 'business',
        name: 'Business',
        price: 899,
        description: 'For companies with many teams.',
        features: ['Unlimited seats', '50M tracked events', 'Single sign-on and audit log', 'Priority support'],
      },
    ],
    currentBadge: 'Current plan',
    choose: 'Switch to {plan}',
    switched: 'Plan change requested. We will confirm by email.',
    payment: {
      title: 'Payment method',
      card: 'Card ending in {last4}',
      expires: 'Expires {expiry}',
      update: 'Update',
      updateToast: 'Payment details are handled by your billing provider.',
      contact: 'Invoices are sent to {email}',
    },
    invoices: {
      title: 'Invoices',
      invoice: 'Invoice',
      date: 'Date',
      amount: 'Amount',
      status: 'Status',
      download: 'Download {id}',
      downloaded: '{id} downloaded',
    },
  },
  notifications: {
    title: 'Notifications',
    description: 'Choose what Lumetric tells you about, and where.',
    groups: [
      {
        title: 'Revenue alerts',
        items: [
          { id: 'anomalies', label: 'Anomaly alerts', description: 'Unusual changes in MRR, churn or signups.', on: true },
          { id: 'payments', label: 'Failed payments', description: 'A payment fails or an invoice becomes overdue.', on: true },
          { id: 'upgrades', label: 'Plan changes', description: 'Upgrades and downgrades worth more than $500 MRR.', on: false },
        ],
      },
      {
        title: 'Digests',
        items: [
          { id: 'weekly', label: 'Weekly revenue digest', description: 'Every Monday at 9:00.', on: true },
          { id: 'monthly', label: 'Monthly board summary', description: 'On the first working day of the month.', on: true },
        ],
      },
      {
        title: 'Where to send them',
        items: [
          { id: 'email', label: 'Email', description: 'To {email}', on: true },
          { id: 'push', label: 'Browser notifications', description: 'On this device only.', on: false },
        ],
      },
    ],
    save: 'Save preferences',
    saved: 'Notification preferences saved',
  },
  appearance: {
    title: 'Appearance',
    description: 'Choose how Lumetric looks on this device.',
    themeLabel: 'Theme',
    options: [
      { id: 'dark', label: 'Dark', description: 'Graphite, easy on the eyes' },
      { id: 'light', label: 'Light', description: 'Bright and crisp' },
      { id: 'system', label: 'System', description: 'Follows your device' },
    ] as const,
    applied: '{theme} theme on',
  },
}

/* ── Sign-in (design only; wire it to your auth provider) ──────────── */

export const auth = {
  signIn: {
    title: 'Welcome back',
    description: 'Sign in to your Lumetric workspace.',
    email: 'Work email',
    emailPlaceholder: 'you@company.example',
    defaultEmail: 'amara@fernwick.example',
    password: 'Password',
    forgot: 'Forgot password?',
    forgotToast: 'Password reset is not connected in this demo.',
    remember: 'Keep me signed in',
    submit: 'Sign in',
    submitting: 'Signing in…',
    or: 'or',
    sso: 'Continue with single sign-on',
    ssoToast: 'Single sign-on is not connected in this demo.',
    noAccount: 'New to Lumetric?',
    request: 'Request access',
    requestToast: 'Thanks! We will be in touch.',
    success: 'Signed in. Welcome back!',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    errors: {
      email: 'Enter a valid email address.',
      password: 'Use at least 8 characters.',
    },
  },
  panel: {
    eyebrow: 'Revenue, live',
    headline: 'Every number your revenue team needs, in one calm view.',
    statLabel: 'Monthly recurring revenue',
    quote: 'Lumetric turned our Monday metrics meeting into a five-minute read.',
    author: 'Sofia Herrera',
    role: 'VP Finance, Fernwick',
    avatar: 'av-3' as AvatarKey,
  },
  legal: '© {year} Lumetric. Every company, person and number here is fictional.',
  signOut: {
    title: 'Sign out?',
    description: 'You will need to sign in again to see your dashboards.',
    confirm: 'Sign out',
    cancel: 'Cancel',
    done: 'Signed out',
  },
}

/* ── Errors ────────────────────────────────────────────────────────── */

export const errors = {
  notFound: {
    code: '404',
    title: 'This page wandered off',
    body: 'The page you are looking for does not exist or has moved.',
    home: 'Back to overview',
    back: 'Go back',
  },
  general: {
    code: '500',
    title: 'Something went wrong',
    body: 'An unexpected error stopped this page from loading. Please try again.',
    retry: 'Try again',
    home: 'Back to overview',
  },
}

/* ── Shared words ──────────────────────────────────────────────────── */

export const common = {
  skipToMain: 'Skip to main content',
  points: 'pts',
  close: 'Close',
  cancel: 'Cancel',
  more: 'More',
  unknown: '—',
  info: 'About this metric',
}

/* ── Mock data (src/data) ──────────────────────────────────────────── */

export const data = {
  team,
  teamById,
  pendingInvites,
  customers,
  customerById,
  customerSummary,
  conversations,
  notifications,
  activity: recentActivity,
  livePool,
  kpiValues,
  revenueSeries,
  planMonths,
  planMrrNow,
  planCounts,
  signupWeeks,
  mrrMovements,
  netNewMrr,
  cohorts,
  channelKeys,
  channelMonths,
  billing: { currentPlanId, renewsInDays, usage, paymentMethod, invoices },
  totalMrr: TARGET_MRR,
}
