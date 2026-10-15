import { useCallback, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { CornerDownLeft, Download, Inbox, Laptop, Moon, Sun, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { commandMenu, data, nav, settings } from '@/content'
import { formatCurrency } from '@/lib/format'
import { useSearch } from '@/context/search-provider'
import { useTheme } from '@/context/theme-provider'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import { CompanyLogo } from '@/components/brand/company-logo'

export function CommandMenu() {
  const navigate = useNavigate()
  const { setTheme } = useTheme()
  const { open, setOpen } = useSearch()

  const run = useCallback(
    (action: () => unknown) => {
      setOpen(false)
      action()
    },
    [setOpen]
  )

  const topCustomers = useMemo(
    () => [...data.customers].sort((a, b) => b.mrr - a.mrr).slice(0, 6),
    []
  )

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title={commandMenu.title}
      description={commandMenu.description}
      showCloseButton={false}
    >
      <CommandInput placeholder={commandMenu.placeholder} />
      <CommandList className='max-h-[min(26rem,60vh)]'>
        <CommandEmpty>{commandMenu.empty}</CommandEmpty>
        <CommandGroup heading={commandMenu.groups.pages}>
          {nav.groups.flatMap((group) => group.items).map((item) => (
            <CommandItem key={item.url} value={`page ${item.title}`} onSelect={() => run(() => navigate({ to: item.url }))}>
              <item.icon />
              {item.title}
              <CommandShortcut>
                <CornerDownLeft className='size-3.5' />
              </CommandShortcut>
            </CommandItem>
          ))}
          {settings.nav.slice(1).map((item) => (
            <CommandItem key={item.href} value={`settings ${item.title}`} onSelect={() => run(() => navigate({ to: item.href }))}>
              <item.icon />
              {settings.title} · {item.title}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading={commandMenu.groups.customers}>
          {topCustomers.map((customer) => (
            <CommandItem
              key={customer.id}
              value={`customer ${customer.name} ${customer.domain}`}
              onSelect={() => run(() => navigate({ to: '/customers', search: { customer: customer.id } }))}
            >
              <CompanyLogo name={customer.name} size='sm' className='size-5 rounded text-[8px]' />
              <span className='truncate'>{customer.name}</span>
              <CommandShortcut className='tracking-normal tabular'>{formatCurrency(customer.mrr)}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading={commandMenu.groups.actions}>
          <CommandItem value='action export' onSelect={() => run(() => toast.success(commandMenu.actions.exportDone))}>
            <Download />
            {commandMenu.actions.export}
          </CommandItem>
          <CommandItem value='action invite' onSelect={() => run(() => navigate({ to: '/settings/team' }))}>
            <UserPlus />
            {commandMenu.actions.invite}
          </CommandItem>
          <CommandItem value='action inbox' onSelect={() => run(() => navigate({ to: '/inbox' }))}>
            <Inbox />
            {commandMenu.actions.message}
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading={commandMenu.groups.theme}>
          <CommandItem value='theme light' onSelect={() => run(() => setTheme('light'))}>
            <Sun />
            {commandMenu.theme.light}
          </CommandItem>
          <CommandItem value='theme dark' onSelect={() => run(() => setTheme('dark'))}>
            <Moon />
            {commandMenu.theme.dark}
          </CommandItem>
          <CommandItem value='theme system' onSelect={() => run(() => setTheme('system'))}>
            <Laptop />
            {commandMenu.theme.system}
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
