import { type ColumnDef, type FilterFn } from '@tanstack/react-table'
import { customersPage, data } from '@/content'
import type { Customer, Plan } from '@/types'
import { formatCurrency, formatNumber, timeAgo } from '@/lib/format'
import { CompanyLogo } from '@/components/brand/company-logo'
import { DataTableColumnHeader } from '@/components/data-table'
import { HealthMeter } from '@/components/health-meter'
import { PlanBadge, StatusBadge } from '@/components/status-badge'
import { UserAvatar } from '@/components/user-avatar'

const copy = customersPage.columns
const PLAN_ORDER: Record<Plan, number> = { Starter: 1, Growth: 2, Scale: 3, Enterprise: 4 }

const inList: FilterFn<Customer> = (row, columnId, value: string[]) =>
  !value?.length || value.includes(row.getValue(columnId))

/** Search across name, domain, industry and the primary contact. */
export const customerSearch: FilterFn<Customer> = (row, _columnId, value: string) => {
  const q = String(value ?? '').trim().toLowerCase()
  if (!q) return true
  const c = row.original
  return [c.name, c.domain, c.industry, c.contact.name, c.contact.email].some((field) =>
    field.toLowerCase().includes(q)
  )
}

export const customerColumns: ColumnDef<Customer>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title={copy.name} />,
    cell: ({ row }) => (
      <div className='flex min-w-0 items-center gap-3'>
        <CompanyLogo name={row.original.name} />
        <div className='grid min-w-0 leading-tight'>
          <span className='truncate font-medium'>{row.original.name}</span>
          <span className='truncate text-xs text-muted-foreground'>{row.original.domain}</span>
        </div>
      </div>
    ),
    enableHiding: false,
    meta: { title: copy.name, className: 'min-w-52 max-w-72' },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title={copy.status} />,
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
    filterFn: inList,
    enableSorting: false,
    meta: { title: copy.status, className: 'hidden @md/content:table-cell' },
  },
  {
    accessorKey: 'plan',
    header: ({ column }) => <DataTableColumnHeader column={column} title={copy.plan} />,
    cell: ({ row }) => <PlanBadge plan={row.original.plan} />,
    filterFn: inList,
    sortingFn: (a, b) => PLAN_ORDER[a.original.plan] - PLAN_ORDER[b.original.plan],
    meta: { title: copy.plan, className: 'hidden @xl/content:table-cell' },
  },
  {
    accessorKey: 'mrr',
    header: ({ column }) => <DataTableColumnHeader column={column} title={copy.mrr} align='end' />,
    cell: ({ row }) => (
      <div className='text-end font-medium tabular'>
        {row.original.mrr ? formatCurrency(row.original.mrr) : <span className='text-muted-foreground'>—</span>}
      </div>
    ),
    meta: { title: copy.mrr },
  },
  {
    accessorKey: 'seats',
    header: ({ column }) => <DataTableColumnHeader column={column} title={copy.seats} align='end' />,
    cell: ({ row }) => <div className='text-end tabular'>{formatNumber(row.original.seats)}</div>,
    meta: { title: copy.seats, className: 'hidden @5xl/content:table-cell' },
  },
  {
    accessorKey: 'health',
    header: ({ column }) => <DataTableColumnHeader column={column} title={copy.health} />,
    cell: ({ row }) => <HealthMeter score={row.original.health} />,
    meta: { title: copy.health, className: 'hidden @3xl/content:table-cell' },
  },
  {
    accessorKey: 'region',
    header: ({ column }) => <DataTableColumnHeader column={column} title={copy.region} />,
    cell: ({ row }) => <span className='text-[13px] text-muted-foreground'>{row.original.region}</span>,
    filterFn: inList,
    meta: { title: copy.region, className: 'hidden @6xl/content:table-cell' },
  },
  {
    accessorKey: 'lastActive',
    header: ({ column }) => <DataTableColumnHeader column={column} title={copy.lastActive} />,
    cell: ({ row }) => (
      <time dateTime={row.original.lastActive} className='text-[13px] text-muted-foreground tabular'>
        {timeAgo(row.original.lastActive)}
      </time>
    ),
    sortingFn: (a, b) => Date.parse(a.original.lastActive) - Date.parse(b.original.lastActive),
    meta: { title: copy.lastActive, className: 'hidden @4xl/content:table-cell' },
  },
  {
    id: 'owner',
    accessorFn: (c) => (c.ownerId ? data.teamById[c.ownerId]?.name : ''),
    header: ({ column }) => <DataTableColumnHeader column={column} title={copy.owner} />,
    cell: ({ row }) => {
      const owner = row.original.ownerId ? data.teamById[row.original.ownerId] : undefined
      return owner ? (
        <span className='flex items-center gap-2 text-[13px]'>
          <UserAvatar name={owner.name} avatar={owner.avatar} className='size-6' />
          {owner.name}
        </span>
      ) : (
        <span className='text-[13px] text-muted-foreground'>{customersPage.unassigned}</span>
      )
    },
    meta: { title: copy.owner, className: 'hidden @6xl/content:table-cell' },
  },
]
