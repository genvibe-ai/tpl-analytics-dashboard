import { Link, Outlet, useLocation } from '@tanstack/react-router'
import { settings } from '@/content'
import { cn } from '@/lib/utils'
import { Main } from '@/components/layout/main'
import { PageHeader } from '@/components/page-header'

export function Settings() {
  const pathname = useLocation({ select: (l) => l.pathname })
  return (
    <Main>
      <PageHeader title={settings.title} description={settings.description} />
      <div className='mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10'>
        <nav
          aria-label={settings.title}
          className='no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 max-lg:[mask-image:linear-gradient(to_right,black_88%,transparent)] sm:-mx-6 sm:px-6 lg:sticky lg:top-20 lg:mx-0 lg:w-52 lg:shrink-0 lg:flex-col lg:px-0'
        >
          {settings.nav.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/60',
                  active
                    ? 'bg-accent font-medium text-foreground shadow-[inset_2px_0_0_var(--primary)] max-lg:shadow-[inset_0_-2px_0_var(--primary)]'
                    : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
                )}
              >
                <item.icon className={cn('size-4', active && 'text-primary-text')} />
                {item.title}
              </Link>
            )
          })}
        </nav>
        <div className='min-w-0 flex-1'>
          <Outlet />
        </div>
      </div>
    </Main>
  )
}
