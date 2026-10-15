import { Link, useLocation } from '@tanstack/react-router'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

export type NavItem = {
  title: string
  url: string
  icon: React.ElementType
  badge?: string
}

export function isActivePath(pathname: string, url: string) {
  if (url === '/') return pathname === '/'
  return pathname === url || pathname.startsWith(`${url}/`)
}

export function NavGroup({ title, items }: { title: string; items: NavItem[] }) {
  const pathname = useLocation({ select: (location) => location.pathname })
  const { setOpenMobile } = useSidebar()
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.url}>
            <SidebarMenuButton asChild isActive={isActivePath(pathname, item.url)} tooltip={item.title}>
              <Link to={item.url} onClick={() => setOpenMobile(false)}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
            {item.badge && (
              <SidebarMenuBadge className='top-2! rounded-full bg-primary-fill px-1.5 text-[11px] text-primary-foreground'>
                {item.badge}
              </SidebarMenuBadge>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
