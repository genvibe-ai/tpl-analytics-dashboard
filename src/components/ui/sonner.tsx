import { Toaster as Sonner, type ToasterProps } from 'sonner'
import { useTheme } from '@/context/theme-provider'

export function Toaster(props: ToasterProps) {
  const { resolvedTheme } = useTheme()
  return (
    <Sonner
      theme={resolvedTheme}
      position='bottom-right'
      duration={4000}
      className='toaster group'
      toastOptions={{
        classNames: {
          toast: 'rounded-xl! border! shadow-float! font-sans!',
          description: 'text-muted-foreground!',
        },
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--success-bg': 'var(--popover)',
          '--success-text': 'var(--popover-foreground)',
          '--success-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}
