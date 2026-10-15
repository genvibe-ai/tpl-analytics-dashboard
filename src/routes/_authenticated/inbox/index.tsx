import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { InboxPage } from '@/features/inbox'

export const Route = createFileRoute('/_authenticated/inbox/')({
  /** `c` = the open conversation id. */
  validateSearch: z.object({ c: z.string().optional().catch(undefined) }),
  component: InboxPage,
})
