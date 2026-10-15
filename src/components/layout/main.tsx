import { cn } from '@/lib/utils'

type MainProps = React.HTMLAttributes<HTMLElement> & {
  /** Fill the viewport height and let the page manage its own scrolling (Inbox). */
  fixed?: boolean
  /** Full width instead of the centred max width. */
  fluid?: boolean
}

export function Main({ fixed, className, fluid, ...props }: MainProps) {
  return (
    <main
      id='content'
      tabIndex={-1}
      data-layout={fixed ? 'fixed' : 'auto'}
      className={cn(
        'relative px-4 pt-4 pb-10 outline-none sm:px-6 lg:px-8',
        fixed && 'flex min-h-0 grow flex-col overflow-hidden pb-4',
        !fluid && '@7xl/content:mx-auto @7xl/content:w-full @7xl/content:max-w-[90rem]',
        className
      )}
      {...props}
    />
  )
}
