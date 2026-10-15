/** Header notifications (fictional). */
import type { Notification } from '@/types'
import { minutesAgo } from './seed'

export const notifications: Notification[] = [
  {
    id: 'n1',
    tone: 'positive',
    title: 'Talloway Robotics upgraded',
    body: 'Moved from Growth to Scale, adding $2,450 in MRR.',
    at: minutesAgo(2),
  },
  {
    id: 'n2',
    tone: 'warning',
    title: 'Churn spike in Europe',
    body: '4 cancellations in 48 hours, 2.3× the 30-day baseline.',
    at: minutesAgo(35),
  },
  {
    id: 'n3',
    tone: 'negative',
    title: 'Payment failed',
    body: 'Quietwater Labs, $8,420. The card will be retried in 2 days.',
    at: minutesAgo(41),
  },
  {
    id: 'n4',
    tone: 'info',
    title: 'Sofia mentioned you',
    body: '“Board deck needs final MRR and NRR by 5pm.”',
    at: minutesAgo(50),
    read: true,
  },
  {
    id: 'n5',
    tone: 'info',
    title: 'Weekly revenue digest is ready',
    body: 'Share it with the team or download it as a PDF.',
    at: minutesAgo(190),
    read: true,
  },
]
