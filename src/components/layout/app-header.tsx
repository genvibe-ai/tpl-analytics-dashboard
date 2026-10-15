import { useEffect, useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { header, nav, settings, site, user, workspace } from '@/content'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { LogoMark } from '@/components/brand/logo'
import { NotificationsPopover } from '@/components/notifications-popover'
import { SearchButton } from '@/components/search'
import { ThemeToggle } from '@/components/theme-toggle'
import { UserAvatar } from '@/components/user-avatar'
import { isActivePath } from './nav-group'
import { UserMenu } from './user-menu'

function useCurrentTitle() {
  const pathname = useLocation({ select: (l) => l.pathname })
  const settingsPage = settings.nav.find((item) => item.href === pathname)
  const page = nav.groups.flatMap((g) => g.items).find((item) => isActivePath(pathname, item.url))
  return { page: page?.title, sub: settingsPage && settingsPage.href !== '/settings' ? settingsPage.title : undefined }
}

export function AppHeader() {
  const [scrolled, setScrolled] = useState(false)
  const { page, sub } = useCurrentTitle()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 px-3 transition-[background-color,border-color,box-shadow] duration-300 sm:px-4 md:rounded-t-2xl lg:px-6',
        'border-b border-transparent',
        scrolled && 'border-border bg-background/75 shadow-[0_8px_24px_-18px_rgb(0_0_0/0.5)] backdrop-blur-xl'
      )}
    >
      <SidebarTrigger className='size-9 text-muted-foreground hover:text-foreground' aria-label={header.toggleSidebar} />
      <Separator orientation='vertical' className='me-1 hidden h-5! md:block' />

      {/* Phones: brand. Desktop: where you are. */}
      <Link to='/' className='flex items-center gap-2 md:hidden' aria-label={site.name}>
        <LogoMark className='size-7' />
        <span className='font-display text-[15px] font-semibold tracking-tight'>{site.name}</span>
      </Link>
      <nav aria-label={header.breadcrumb} className='hidden min-w-0 items-center gap-1.5 text-sm md:flex'>
        <span className='truncate text-muted-foreground'>{workspace.name}</span>
        {page && (
          <>
            <span className='text-muted-foreground/60' aria-hidden='true'>/</span>
            <span className={cn('truncate', sub ? 'text-muted-foreground' : 'font-medium')}>{page}</span>
          </>
        )}
        {sub && (
          <>
            <span className='text-muted-foreground/60' aria-hidden='true'>/</span>
            <span className='truncate font-medium'>{sub}</span>
          </>
        )}
      </nav>

      <div className='ms-auto flex items-center gap-1 sm:gap-1.5'>
        <SearchButton className='me-1' />
        <NotificationsPopover />
        <ThemeToggle />
        <UserMenu>
          <button
            type='button'
            className='ms-1 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden'
            aria-label={header.account}
          >
            <UserAvatar name={user.name} avatar={user.avatar} className='size-8' />
          </button>
        </UserMenu>
      </div>
    </header>
  )
}
