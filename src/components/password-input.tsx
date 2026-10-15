import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { auth } from '@/content'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { Input } from './ui/input'

type PasswordInputProps = Omit<React.ComponentProps<'input'>, 'type'>

export function PasswordInput({ className, disabled, ...props }: PasswordInputProps) {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className={cn('relative', className)}>
      <Input type={visible ? 'text' : 'password'} disabled={disabled} className='pe-10' {...props} />
      <Button
        type='button'
        size='icon-sm'
        variant='ghost'
        disabled={disabled}
        className='absolute inset-e-0.5 top-1/2 size-8 -translate-y-1/2'
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? auth.signIn.hidePassword : auth.signIn.showPassword}
      >
        {visible ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  )
}
