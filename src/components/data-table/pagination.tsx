import { type Table } from '@tanstack/react-table'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { dataTable } from '@/content'
import { fill, formatNumber } from '@/lib/format'
import { cn, getPageNumbers } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const copy = dataTable.pagination

export function DataTablePagination<TData>({ table, className }: { table: Table<TData>; className?: string }) {
  const { pageIndex, pageSize } = table.getState().pagination
  const currentPage = pageIndex + 1
  const totalPages = Math.max(1, table.getPageCount())
  const total = table.getFilteredRowModel().rows.length
  const from = total === 0 ? 0 : pageIndex * pageSize + 1
  const to = Math.min(total, (pageIndex + 1) * pageSize)

  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-x-6 gap-y-3', className)}>
      <div className='flex items-center gap-4 text-[13px] text-muted-foreground'>
        <span className='tabular'>
          {fill(copy.showing, { from: formatNumber(from), to: formatNumber(to), total: formatNumber(total) })}
        </span>
        <span className='hidden items-center gap-2 sm:flex'>
          {copy.rowsPerPage}
          <Select value={`${pageSize}`} onValueChange={(value) => table.setPageSize(Number(value))}>
            <SelectTrigger size='sm' className='w-18' aria-label={copy.rowsPerPage}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent side='top'>
              {[10, 20, 30, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </span>
      </div>

      <nav className='flex items-center gap-1' aria-label={fill(copy.page, { page: currentPage, pages: totalPages })}>
        <Button
          variant='outline'
          size='icon-sm'
          className='hidden sm:inline-flex'
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          aria-label={copy.first}
        >
          <ChevronsLeft />
        </Button>
        <Button
          variant='outline'
          size='icon-sm'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          aria-label={copy.previous}
        >
          <ChevronLeft />
        </Button>
        <span className='px-2 text-[13px] text-muted-foreground tabular sm:hidden'>
          {fill(copy.page, { page: currentPage, pages: totalPages })}
        </span>
        {getPageNumbers(currentPage, totalPages).map((page, index) =>
          page === '...' ? (
            <span key={`dots-${index}`} className='px-1 text-sm text-muted-foreground max-sm:hidden'>
              …
            </span>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'ghost'}
              size='sm'
              className='h-8 min-w-8 px-2 tabular max-sm:hidden'
              onClick={() => table.setPageIndex((page as number) - 1)}
              aria-label={fill(copy.goTo, { page })}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </Button>
          )
        )}
        <Button
          variant='outline'
          size='icon-sm'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          aria-label={copy.next}
        >
          <ChevronRight />
        </Button>
        <Button
          variant='outline'
          size='icon-sm'
          className='hidden sm:inline-flex'
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          aria-label={copy.last}
        >
          <ChevronsRight />
        </Button>
      </nav>
    </div>
  )
}
