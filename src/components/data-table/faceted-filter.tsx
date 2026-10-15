import { type Column } from '@tanstack/react-table'
import { Check, CirclePlus } from 'lucide-react'
import { dataTable } from '@/content'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'

export type FilterOption = { label: string; value: string; icon?: React.ComponentType<{ className?: string }> }

type DataTableFacetedFilterProps<TData, TValue> = {
  column?: Column<TData, TValue>
  title: string
  options: FilterOption[]
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues()
  const selected = new Set(column?.getFilterValue() as string[])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='h-9 border-dashed'>
          <CirclePlus className='size-4' />
          {title}
          {selected.size > 0 && (
            <>
              <Separator orientation='vertical' className='mx-0.5 h-4!' />
              <Badge variant='default' className='rounded-sm px-1 font-medium lg:hidden'>
                {selected.size}
              </Badge>
              <span className='hidden gap-1 lg:flex'>
                {selected.size > 2 ? (
                  <Badge variant='default' className='rounded-sm px-1 font-medium'>
                    {selected.size}
                  </Badge>
                ) : (
                  options
                    .filter((option) => selected.has(option.value))
                    .map((option) => (
                      <Badge key={option.value} variant='default' className='rounded-sm px-1 font-medium'>
                        {option.label}
                      </Badge>
                    ))
                )}
              </span>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-56 p-0' align='start'>
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>{dataTable.noResults}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selected.has(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) selected.delete(option.value)
                      else selected.add(option.value)
                      const values = Array.from(selected)
                      column?.setFilterValue(values.length ? values : undefined)
                    }}
                  >
                    <span
                      className={cn(
                        'flex size-4 items-center justify-center rounded-[5px] border border-primary/60',
                        isSelected ? 'border-primary bg-primary-fill text-primary-foreground' : '[&_svg]:invisible'
                      )}
                    >
                      <Check className='size-3! text-current!' strokeWidth={3} />
                    </span>
                    {option.icon && <option.icon className='size-4 text-muted-foreground' />}
                    <span>{option.label}</span>
                    {facets?.get(option.value) !== undefined && (
                      <span className='ms-auto font-mono text-xs text-muted-foreground'>
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selected.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={() => column?.setFilterValue(undefined)} className='justify-center text-center'>
                    {dataTable.clear}
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
