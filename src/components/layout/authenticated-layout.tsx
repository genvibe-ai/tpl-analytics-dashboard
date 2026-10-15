import { Outlet } from '@tanstack/react-router'
import { getCookie } from '@/lib/cookies'
import { cn } from '@/lib/utils'
import { SearchProvider } from '@/context/search-provider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppHeader } from '@/components/layout/app-header'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { SkipToMain } from '@/components/skip-to-main'

export function AuthenticatedLayout({ children }: { children?: React.ReactNode }) {
  const defaultOpen = getCookie('sidebar_state') !== 'false'
  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <SkipToMain />
        <AppSidebar />
        <SidebarInset
          className={cn(
            // Container queries for page layouts (@container/content).
            '@container/content',
            // Pages with a fixed layout (Inbox) fill the viewport instead of scrolling the page.
            'has-data-[layout=fixed]:h-svh',
            'peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]'
          )}
        >
          <div
            aria-hidden='true'
            className='page-glow pointer-events-none absolute inset-x-0 top-0 h-96 md:rounded-t-2xl'
          />
          <AppHeader />
          {children ?? <Outlet />}
        </SidebarInset>
      </SidebarProvider>
    </SearchProvider>
  )
}
