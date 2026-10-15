import { ChevronsUpDown } from 'lucide-react'
import { user } from '@/content'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { UserAvatar } from '@/components/user-avatar'
import { UserMenu } from './user-menu'

export function NavUser() {
  const { isMobile, setOpenMobile } = useSidebar()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <UserMenu side={isMobile ? 'top' : 'right'} align='end' onNavigate={() => setOpenMobile(false)}>
          <SidebarMenuButton size='lg' className='text-foreground data-[state=open]:bg-sidebar-accent'>
            <UserAvatar name={user.name} avatar={user.avatar} className='size-8' online />
            <span className='grid flex-1 text-start leading-tight'>
              <span className='truncate text-sm font-medium'>{user.name}</span>
              <span className='truncate text-xs text-muted-foreground'>{user.email}</span>
            </span>
            <ChevronsUpDown className='ms-auto size-4 text-muted-foreground' />
          </SidebarMenuButton>
        </UserMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
