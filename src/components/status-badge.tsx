import { customersPage } from '@/content'
import type { CustomerStatus, Plan } from '@/types'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

const STATUS_VARIANT = {
  active: 'positive',
  trialing: 'default',
  past_due: 'warning',
  churned: 'outline',
} as const

export function StatusBadge({ status, className }: { status: CustomerStatus; className?: string }) {
  return (
    <Badge variant={STATUS_VARIANT[status]} className={cn('gap-1.5', className)}>
      <span className='size-1.5 rounded-full bg-current' aria-hidden='true' />
      {customersPage.statuses[status]}
    </Badge>
  )
}

const PLAN_INDEX: Record<Plan, number> = { Starter: 1, Growth: 2, Scale: 3, Enterprise: 4 }

/** Plan name with its tier colour (the same ordinal ramp the plan chart uses). */
export function PlanBadge({ plan, className }: { plan: Plan; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-[13px]', className)}>
      <span
        className='size-2 rounded-[3px]'
        style={{ background: `var(--plan-${PLAN_INDEX[plan]})` }}
        aria-hidden='true'
      />
      {plan}
    </span>
  )
}
