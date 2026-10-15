import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { CreditCard, LogOut, UserRound, Users } from 'lucide-react'
import { nav, user } from '@/content'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SignOutDialog } from '@/components/sign-out-dialog'
import { UserAvatar } from '@/components/user-avatar'

type UserMenuProps = {
  children: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  onNavigate?: () => void
}

/** Account dropdown shared by the sidebar footer and the mobile header. */
export function UserMenu({ children, side = 'bottom', align = 'end', onNavigate }: UserMenuProps) {
  const [signOutOpen, setSignOutOpen] = useState(false)
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent className='min-w-60' side={side} align={align} sideOffset={8}>
          <DropdownMenuLabel className='p-0 font-normal'>
            <div className='flex items-center gap-2.5 px-1.5 py-1.5'>
              <UserAvatar name={user.name} avatar={user.avatar} className='size-9' />
              <div className='grid min-w-0 leading-tight'>
                <span className='truncate text-sm font-medium'>{user.name}</span>
                <span className='truncate text-xs text-muted-foreground'>{user.email}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to='/settings' onClick={onNavigate}>
                <UserRound />
                {nav.userMenu.profile}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to='/settings/team' onClick={onNavigate}>
                <Users />
                {nav.userMenu.team}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to='/settings/billing' onClick={onNavigate}>
                <CreditCard />
                {nav.userMenu.billing}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive' onClick={() => setSignOutOpen(true)}>
            <LogOut />
            {nav.userMenu.signOut}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <SignOutDialog open={signOutOpen} onOpenChange={setSignOutOpen} />
    </>
  )
}
