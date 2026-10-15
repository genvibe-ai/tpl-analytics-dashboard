import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Customers } from '@/features/customers'

const plans = ['Starter', 'Growth', 'Scale', 'Enterprise'] as const
const statuses = ['active', 'trialing', 'past_due', 'churned'] as const
const regions = ['North America', 'Europe', 'APAC', 'LATAM'] as const

/** Table state lives in the URL so filtered views can be shared and survive reloads. */
const customersSearchSchema = z.object({
  page: z.number().int().positive().optional().catch(undefined),
  pageSize: z.number().int().positive().optional().catch(undefined),
  q: z.string().optional().catch(undefined),
  plan: z.array(z.enum(plans)).optional().catch(undefined),
  status: z.array(z.enum(statuses)).optional().catch(undefined),
  region: z.array(z.enum(regions)).optional().catch(undefined),
  /** Open the profile drawer for this customer id. */
  customer: z.string().optional().catch(undefined),
})

export const Route = createFileRoute('/_authenticated/customers/')({
  validateSearch: customersSearchSchema,
  component: Customers,
})
