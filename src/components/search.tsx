import { SearchIcon } from 'lucide-react'
import { header } from '@/content'
import { cn } from '@/lib/utils'
import { useSearch } from '@/context/search-provider'
import { Button } from './ui/button'

/** Opens the command menu. Wide field on desktop, icon on phones. */
export function SearchButton({ className }: { className?: string }) {
  const { setOpen } = useSearch()
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
  return (
    <>
      <Button
        variant='outline'
        onClick={() => setOpen(true)}
        aria-keyshortcuts='Meta+K Control+K'
        className={cn(
          'group hidden h-9 w-60 justify-start gap-2 bg-card/70 px-3 font-normal text-muted-foreground shadow-none backdrop-blur-sm lg:flex xl:w-72',
          className
        )}
      >
        <SearchIcon className='size-4' />
        <span className='truncate'>{header.searchPlaceholder}</span>
        <kbd className='pointer-events-none ms-auto inline-flex h-5 items-center gap-0.5 rounded border bg-muted px-1.5 font-sans text-[11px] font-medium text-muted-foreground'>
          {isMac ? '⌘' : 'Ctrl'}
          {header.shortcut}
        </kbd>
      </Button>
      <Button
        variant='ghost'
        size='icon'
        onClick={() => setOpen(true)}
        className='lg:hidden'
        aria-label={header.search}
      >
        <SearchIcon />
      </Button>
    </>
  )
}
