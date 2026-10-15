import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { auth } from '@/content'
import { ConfirmDialog } from '@/components/confirm-dialog'

type SignOutDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Design-only sign out: closes the session UI and returns to the sign-in page. */
export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const navigate = useNavigate()

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={auth.signOut.title}
      desc={auth.signOut.description}
      confirmText={auth.signOut.confirm}
      cancelText={auth.signOut.cancel}
      destructive
      onConfirm={() => {
        onOpenChange(false)
        toast(auth.signOut.done)
        navigate({ to: '/sign-in', replace: true })
      }}
    />
  )
}
