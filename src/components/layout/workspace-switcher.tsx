import { useState } from 'react'
import { Check, ChevronsUpDown, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { site, workspace } from '@/content'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { LogoMark } from '@/components/brand/logo'

export function WorkspaceSwitcher() {
  const { isMobile } = useSidebar()
  const [active, setActive] = useState(workspace.environments[0])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='text-foreground data-[state=open]:bg-sidebar-accent'
            >
              <LogoMark className='size-8' />
              <span className='grid flex-1 text-start leading-tight'>
                <span className='truncate font-display text-[15px] font-semibold tracking-tight'>
                  {site.name}
                </span>
                <span className='truncate text-xs text-muted-foreground'>
                  {active.name} · {active.caption}
                </span>
              </span>
              <ChevronsUpDown className='ms-auto text-muted-foreground' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-60'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={6}
          >
            <DropdownMenuLabel className='text-xs font-normal text-muted-foreground'>
              {workspace.label}
            </DropdownMenuLabel>
            {workspace.environments.map((env) => (
              <DropdownMenuItem key={env.id} onClick={() => setActive(env)} className='gap-2.5 py-2'>
                <span className='grid size-7 place-items-center rounded-md border bg-card font-display text-xs font-semibold'>
                  {env.name.charAt(0)}
                </span>
                <span className='grid leading-tight'>
                  <span className='text-sm'>{env.name}</span>
                  <span className='text-xs text-muted-foreground'>{env.caption}</span>
                </span>
                {env.id === active.id && <Check className='ms-auto text-primary-text!' />}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className='gap-2.5 py-2' onClick={() => toast(workspace.addToast)}>
              <span className='grid size-7 place-items-center rounded-md border border-dashed'>
                <Plus className='size-3.5' />
              </span>
              <span className='text-sm text-muted-foreground'>{workspace.add}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
