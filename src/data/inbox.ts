/**
 * Inbox conversations (fictional). Messages are oldest first. `customerId` links a thread to a
 * customer so "View account" can open their profile.
 */
import type { Conversation } from '@/types'
import { minutesAgo } from './seed'

const HOUR = 60
const DAY = 24 * HOUR

export const conversations: Conversation[] = [
  {
    id: 'c1',
    name: 'Leila Haddad',
    subtitle: 'VP Operations · Kitefin Logistics',
    avatar: 'av-5',
    customerId: 'cus_0001',
    label: 'Renewal',
    unread: 2,
    messages: [
      {
        id: 'c1m1',
        from: 'them',
        text: 'Hi Amara! We are starting renewal planning for next year. Could you send over our usage summary for the last two quarters?',
        at: minutesAgo(2 * DAY + 3 * HOUR),
      },
      {
        id: 'c1m2',
        from: 'me',
        text: 'Of course. I will pull it from Lumetric and share it by Thursday. Anything specific the board wants to see?',
        at: minutesAgo(2 * DAY + 2 * HOUR),
      },
      {
        id: 'c1m3',
        from: 'them',
        text: 'Mainly seat growth and how many teams use the forecasting dashboards. We are considering 40 more seats.',
        at: minutesAgo(DAY + 5 * HOUR),
      },
      {
        id: 'c1m4',
        from: 'them',
        text: 'Also, is there any flexibility on multi-year pricing if we expand?',
        at: minutesAgo(18),
      },
    ],
  },
  {
    id: 'c2',
    name: 'Lumetric Alerts',
    subtitle: 'Anomaly detection',
    isBot: true,
    label: 'Alert',
    unread: 1,
    messages: [
      {
        id: 'c2m1',
        from: 'them',
        text: 'Weekly check: revenue, retention and payments are all within their normal ranges.',
        at: minutesAgo(3 * DAY),
      },
      {
        id: 'c2m2',
        from: 'them',
        text: 'Churn in Europe is running 2.3× above its 30-day baseline. 4 accounts cancelled in the last 48 hours, mostly on the Starter plan.',
        at: minutesAgo(35),
        metric: { label: 'EU cancellations, 48h', value: '4 accounts', delta: '2.3× baseline', tone: 'negative' },
      },
    ],
  },
  {
    id: 'c3',
    name: 'Sofia Herrera',
    subtitle: 'VP Finance · Fernwick',
    avatar: 'av-3',
    label: 'Board',
    unread: 1,
    messages: [
      {
        id: 'c3m1',
        from: 'them',
        text: 'The board deck needs final MRR and NRR by 5pm. Are we still at 118% NRR after the Halcyon contraction?',
        at: minutesAgo(50),
      },
    ],
  },
  {
    id: 'c4',
    name: 'Daniel Kim',
    subtitle: 'Senior Data Analyst · Fernwick',
    avatar: 'av-2',
    unread: 0,
    messages: [
      {
        id: 'c4m1',
        from: 'them',
        text: 'The cohort report is refreshed. The March and April cohorts are tracking 4 points above last year.',
        at: minutesAgo(3 * HOUR + 10),
      },
      {
        id: 'c4m2',
        from: 'me',
        text: 'Love it. Can you add a payback-period column before the board deck on Friday?',
        at: minutesAgo(3 * HOUR),
      },
      {
        id: 'c4m3',
        from: 'them',
        text: 'On it. I will also break out Partners as its own channel. It is now about a quarter of new MRR.',
        at: minutesAgo(2 * HOUR + 20),
      },
    ],
  },
  {
    id: 'c5',
    name: 'Freya Lindqvist',
    subtitle: 'Head of Data · Mossgrove Learning',
    avatar: 'av-7',
    customerId: 'cus_0002',
    label: 'Feature request',
    unread: 0,
    messages: [
      {
        id: 'c5m1',
        from: 'them',
        text: 'Our analysts would love a scheduled CSV export of the retention table. Is that on the roadmap?',
        at: minutesAgo(DAY + 6 * HOUR),
      },
      {
        id: 'c5m2',
        from: 'me',
        text: 'It is in beta! I have switched it on for your workspace. You will find it under Reports, then Export.',
        at: minutesAgo(DAY + 4 * HOUR),
      },
      {
        id: 'c5m3',
        from: 'them',
        text: 'Amazing, thank you. The team is already using it.',
        at: minutesAgo(20 * HOUR),
      },
    ],
  },
  {
    id: 'c6',
    name: 'Marcus Bell',
    subtitle: 'Head of Sales · Fernwick',
    avatar: 'av-8',
    unread: 0,
    messages: [
      {
        id: 'c6m1',
        from: 'them',
        text: 'Talloway just signed the Scale upgrade. That is +$2,450 MRR, starting today.',
        at: minutesAgo(5 * HOUR),
      },
      {
        id: 'c6m2',
        from: 'me',
        text: 'Huge! Great work getting that over the line.',
        at: minutesAgo(4 * HOUR + 50),
      },
    ],
  },
  {
    id: 'c7',
    name: 'Tomás Ruiz',
    subtitle: 'Director of Finance · Halcyon Freight',
    customerId: 'cus_0003',
    label: 'Billing',
    unread: 0,
    messages: [
      {
        id: 'c7m1',
        from: 'them',
        text: 'We would like to reduce our plan by 18 seats from the next cycle. A few teams were consolidated.',
        at: minutesAgo(3 * DAY + 2 * HOUR),
      },
      {
        id: 'c7m2',
        from: 'me',
        text: 'Thanks for the heads-up, Tomás. The change is scheduled and will show on your next invoice.',
        at: minutesAgo(3 * DAY + HOUR),
      },
    ],
  },
]
