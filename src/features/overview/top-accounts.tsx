import { useMemo } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { data, overview } from '@/content'
import { accountMrrHistory } from '@/data/customers'
import { formatCurrency, formatNumber } from '@/lib/format'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CompanyLogo } from '@/components/brand/company-logo'
import { Sparkline } from '@/components/charts/sparkline'
import { Delta } from '@/components/delta'
import { HealthMeter } from '@/components/health-meter'
import { PlanBadge } from '@/components/status-badge'
import { UserAvatar } from '@/components/user-avatar'

export function TopAccounts({ className }: { className?: string }) {
  const copy = overview.topAccounts
  const navigate = useNavigate()
  const rows = useMemo(
    () => [...data.customers].sort((a, b) => b.mrr - a.mrr).slice(0, copy.count),
    [copy.count]
  )

  return (
    <Card className={cn('gap-3 pb-2', className)}>
      <CardHeader>
        <CardTitle>{copy.title}</CardTitle>
        <CardDescription>{copy.description}</CardDescription>
        <CardAction>
          <Button asChild variant='ghost' size='sm' className='text-primary-text hover:text-primary-text'>
            <Link to='/customers'>
              {copy.viewAll}
              <ArrowRight />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <div className='px-2'>
        <Table>
          <TableHeader>
            <TableRow className='hover:bg-transparent'>
              <TableHead>{copy.columns.account}</TableHead>
              <TableHead className='text-end'>{copy.columns.mrr}</TableHead>
              <TableHead className='hidden text-end @lg/content:table-cell'>{copy.columns.change}</TableHead>
              <TableHead className='hidden text-end @4xl/content:table-cell'>{copy.columns.seats}</TableHead>
              <TableHead className='hidden @2xl/content:table-cell'>{copy.columns.health}</TableHead>
              <TableHead className='hidden w-32 @3xl/content:table-cell'>{copy.columns.trend}</TableHead>
              <TableHead className='hidden @5xl/content:table-cell'>{copy.columns.owner}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((customer, i) => {
              const owner = customer.ownerId ? data.teamById[customer.ownerId] : undefined
              return (
                <TableRow
                  key={customer.id}
                  className='cursor-pointer'
                  onClick={() => navigate({ to: '/customers', search: { customer: customer.id } })}
                >
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <CompanyLogo name={customer.name} />
                      <div className='grid min-w-0 leading-tight'>
                        <Link
                          to='/customers'
                          search={{ customer: customer.id }}
                          onClick={(e) => e.stopPropagation()}
                          className='truncate font-medium hover:underline focus-visible:underline focus-visible:outline-none'
                        >
                          {customer.name}
                        </Link>
                        <PlanBadge plan={customer.plan} className='text-xs text-muted-foreground' />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className='text-end font-medium tabular'>{formatCurrency(customer.mrr)}</TableCell>
                  <TableCell className='hidden text-end @lg/content:table-cell'>
                    <Delta value={customer.mrrChange} variant='plain' className='justify-end text-[13px]' />
                  </TableCell>
                  <TableCell className='hidden text-end tabular @4xl/content:table-cell'>{formatNumber(customer.seats)}</TableCell>
                  <TableCell className='hidden @2xl/content:table-cell'>
                    <HealthMeter score={customer.health} />
                  </TableCell>
                  <TableCell className='hidden @3xl/content:table-cell'>
                    <Sparkline
                      data={accountMrrHistory(customer)}
                      height={28}
                      area={false}
                      dot={false}
                      color='var(--chart-1)'
                      delay={0.1 + i * 0.05}
                    />
                  </TableCell>
                  <TableCell className='hidden @5xl/content:table-cell'>
                    {owner && (
                      <span className='flex items-center gap-2 text-[13px]'>
                        <UserAvatar name={owner.name} avatar={owner.avatar} className='size-6' />
                        {owner.name.split(' ')[0]}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
