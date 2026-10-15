import { type Column } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from 'lucide-react'
import { dataTable } from '@/content'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type DataTableColumnHeaderProps<TData, TValue> = React.HTMLAttributes<HTMLDivElement> & {
  column: Column<TData, TValue>
  title: string
  align?: 'start' | 'end'
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  align = 'start',
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(align === 'end' && 'text-end', className)}>{title}</div>
  }
  const sorted = column.getIsSorted()
  return (
    <div className={cn('flex items-center', align === 'end' && 'justify-end', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            className={cn(
              '-mx-2 h-7 gap-1 px-2 text-xs font-medium text-muted-foreground data-[state=open]:bg-accent',
              sorted && 'text-foreground'
            )}
          >
            <span>{title}</span>
            {sorted === 'desc' ? (
              <ArrowDown className='size-3.5' />
            ) : sorted === 'asc' ? (
              <ArrowUp className='size-3.5' />
            ) : (
              <ChevronsUpDown className='size-3.5 opacity-60' />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={align}>
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp />
            {dataTable.sort.asc}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown />
            {dataTable.sort.desc}
          </DropdownMenuItem>
          {column.getCanHide() && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                <EyeOff />
                {dataTable.sort.hide}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
