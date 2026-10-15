import { nav } from '@/content'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { UsageCard } from './usage-card'
import { WorkspaceSwitcher } from './workspace-switcher'

export function AppSidebar() {
  return (
    <Sidebar collapsible='icon' variant='inset'>
      {/* 5px top padding puts the logo's centre on the top bar's centre line (37px from the top). */}
      <SidebarHeader className='pt-[5px]'>
        <WorkspaceSwitcher />
      </SidebarHeader>
      <SidebarContent>
        {nav.groups.map((group) => (
          <NavGroup key={group.title} title={group.title} items={group.items} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <UsageCard />
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
