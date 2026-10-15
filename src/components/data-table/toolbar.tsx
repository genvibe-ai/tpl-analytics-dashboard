import { type Table } from '@tanstack/react-table'
import { Search, X } from 'lucide-react'
import { dataTable } from '@/content'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter, type FilterOption } from './faceted-filter'
import { DataTableViewOptions } from './view-options'

type DataTableToolbarProps<TData> = {
  table: Table<TData>
  searchPlaceholder: string
  filters?: { columnId: string; title: string; options: FilterOption[] }[]
}

export function DataTableToolbar<TData>({ table, searchPlaceholder, filters = [] }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0 || !!table.getState().globalFilter

  return (
    <div className='flex flex-wrap items-center gap-2'>
      <div className='relative w-full sm:w-72'>
        <Search className='pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
        <Input
          type='search'
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          value={(table.getState().globalFilter as string) ?? ''}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className='h-9 ps-9'
        />
      </div>
      {filters.map((filter) => {
        const column = table.getColumn(filter.columnId)
        if (!column) return null
        return (
          <DataTableFacetedFilter key={filter.columnId} column={column} title={filter.title} options={filter.options} />
        )
      })}
      {isFiltered && (
        <Button
          variant='ghost'
          size='sm'
          className='h-9'
          onClick={() => {
            table.resetColumnFilters()
            table.setGlobalFilter('')
          }}
        >
          {dataTable.reset}
          <X />
        </Button>
      )}
      <DataTableViewOptions table={table} />
    </div>
  )
}
