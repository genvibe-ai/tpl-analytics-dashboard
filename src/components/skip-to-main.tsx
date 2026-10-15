import { common } from '@/content'

export function SkipToMain() {
  return (
    <a
      className='fixed inset-s-4 top-3 z-999 -translate-y-24 rounded-lg bg-primary-fill px-4 py-2 text-sm font-medium whitespace-nowrap text-primary-foreground shadow-float transition focus:translate-y-0 focus-visible:ring-2 focus-visible:ring-ring'
      href='#content'
    >
      {common.skipToMain}
    </a>
  )
}
