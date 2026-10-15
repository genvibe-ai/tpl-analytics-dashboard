import type { TeamMember } from '@/types'

/**
 * The workspace team. `avatar` points at public/images/<key>.webp (see `images.avatars` in content.ts).
 * The first member is the signed-in user.
 */
export const team: TeamMember[] = [
  {
    id: 'amara',
    name: 'Amara Okafor',
    title: 'Head of Revenue Operations',
    email: 'amara@fernwick.example',
    role: 'Owner',
    avatar: 'av-1',
    lastActiveMinutes: 0,
  },
  {
    id: 'daniel',
    name: 'Daniel Kim',
    title: 'Senior Data Analyst',
    email: 'daniel@fernwick.example',
    role: 'Analyst',
    avatar: 'av-2',
    lastActiveMinutes: 12,
  },
  {
    id: 'sofia',
    name: 'Sofia Herrera',
    title: 'VP Finance',
    email: 'sofia@fernwick.example',
    role: 'Admin',
    avatar: 'av-3',
    lastActiveMinutes: 47,
  },
  {
    id: 'martin',
    name: 'Martin Keller',
    title: 'Chief Executive Officer',
    email: 'martin@fernwick.example',
    role: 'Viewer',
    avatar: 'av-4',
    lastActiveMinutes: 190,
  },
  {
    id: 'arjun',
    name: 'Arjun Mehta',
    title: 'Growth Lead',
    email: 'arjun@fernwick.example',
    role: 'Analyst',
    avatar: 'av-6',
    lastActiveMinutes: 5,
  },
  {
    id: 'marcus',
    name: 'Marcus Bell',
    title: 'Head of Sales',
    email: 'marcus@fernwick.example',
    role: 'Admin',
    avatar: 'av-8',
    lastActiveMinutes: 1460,
  },
]

/** Invites that have not been accepted yet. */
export const pendingInvites: { email: string; role: TeamMember['role']; sentDaysAgo: number }[] = [
  { email: 'lena@fernwick.example', role: 'Analyst', sentDaysAgo: 2 },
]

export const teamById = Object.fromEntries(team.map((m) => [m.id, m])) as Record<string, TeamMember>
