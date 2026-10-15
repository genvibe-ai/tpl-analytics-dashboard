import { useEffect, useImperativeHandle, useState } from 'react'
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { customersPage } from '@/content'
import type { Customer } from '@/types'
import { cn } from '@/lib/utils'
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { customerColumns as columns, customerSearch } from './columns'

export type CustomersTableHandle = { getRows: () => Customer[] }

type CustomersTableProps = {
  data: Customer[]
  search: Record<string, unknown>
  navigate: NavigateFn
  onOpen: (id: string) => void
  ref?: React.Ref<CustomersTableHandle>
}

export function CustomersTable({ data, search, navigate, onOpen, ref }: CustomersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'mrr', desc: true }])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  // Search, filters and page live in the URL (see src/routes/_authenticated/customers/index.tsx).
  const {
    globalFilter,
    onGlobalFilterChange,
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: true, key: 'q', trim: false },
    columnFilters: [
      { columnId: 'status', searchKey: 'status', type: 'array' },
      { columnId: 'plan', searchKey: 'plan', type: 'array' },
      { columnId: 'region', searchKey: 'region', type: 'array' },
    ],
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination, columnFilters, columnVisibility, globalFilter },
    globalFilterFn: customerSearch,
    onPaginationChange,
    onColumnFiltersChange,
    onGlobalFilterChange,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  useImperativeHandle(ref, () => ({
    getRows: () => table.getPrePaginationRowModel().rows.map((r) => r.original),
  }))

  useEffect(() => {
    ensurePageInRange(table.getPageCount())
  }, [table, ensurePageInRange])

  const filters = [
    {
      columnId: 'status',
      title: customersPage.filters.status,
      options: (Object.keys(customersPage.statuses) as (keyof typeof customersPage.statuses)[]).map((value) => ({
        value,
        label: customersPage.statuses[value],
      })),
    },
    {
      columnId: 'plan',
      title: customersPage.filters.plan,
      options: customersPage.plans.map((plan) => ({ value: plan, label: plan })),
    },
    {
      columnId: 'region',
      title: customersPage.filters.region,
      options: customersPage.regions.map((region) => ({ value: region, label: region })),
    },
  ]

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <DataTableToolbar table={table} searchPlaceholder={customersPage.searchPlaceholder} filters={filters} />
      <div className='overflow-hidden rounded-xl border bg-card shadow-card'>
        <Table>
          <TableHeader className='bg-muted/40'>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id} className='hover:bg-transparent'>
                {group.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(header.column.columnDef.meta?.className, header.column.columnDef.meta?.thClassName)}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  tabIndex={0}
                  className='cursor-pointer outline-none focus-visible:bg-accent/60'
                  onClick={() => onOpen(row.original.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onOpen(row.original.id)
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(cell.column.columnDef.meta?.className, cell.column.columnDef.meta?.tdClassName)}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className='hover:bg-transparent'>
                <TableCell colSpan={columns.length} className='h-32 text-center text-muted-foreground'>
                  {customersPage.empty}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
