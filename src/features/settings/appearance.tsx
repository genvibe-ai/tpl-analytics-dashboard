import { Check } from 'lucide-react'
import { toast } from 'sonner'
import { settings, theme as brandTheme } from '@/content'
import type { ThemePreference } from '@/types'
import { fill } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useTheme } from '@/context/theme-provider'
import { SettingsSection } from './section'

const copy = settings.appearance

/** A tiny dashboard drawn in the colours of one mode. */
function Preview({ mode }: { mode: 'dark' | 'light' }) {
  const c = brandTheme.colors[mode]
  return (
    <div className='flex h-full w-full gap-1.5 p-2' style={{ background: c.background }}>
      <div className='w-1/4 rounded-md' style={{ background: c.sidebar }}>
        <div className='m-1.5 h-1.5 rounded-full' style={{ background: c.primary }} />
        <div className='mx-1.5 my-1 h-1 rounded-full' style={{ background: c.border }} />
        <div className='mx-1.5 my-1 h-1 rounded-full' style={{ background: c.border }} />
      </div>
      <div className='flex flex-1 flex-col gap-1.5'>
        <div className='flex gap-1.5'>
          {[0, 1].map((i) => (
            <div key={i} className='h-6 flex-1 rounded-md border' style={{ background: c.card, borderColor: c.border }}>
              <div className='m-1 h-1 w-1/2 rounded-full' style={{ background: c.mutedForeground }} />
            </div>
          ))}
        </div>
        <div className='flex flex-1 items-end gap-1 rounded-md border p-1.5' style={{ background: c.card, borderColor: c.border }}>
          {[40, 55, 48, 70, 62, 85].map((h, i) => (
            <div key={i} className='flex-1 rounded-sm' style={{ height: `${h}%`, background: c.primary, opacity: 0.5 + i * 0.1 }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function SettingsAppearance() {
  const { theme, setTheme } = useTheme()

  function choose(id: ThemePreference, label: string) {
    setTheme(id)
    toast.success(fill(copy.applied, { theme: label }))
  }

  return (
    <SettingsSection title={copy.title} description={copy.description}>
      <div role='radiogroup' aria-label={copy.themeLabel} className='grid grid-cols-1 gap-4 @xl/content:grid-cols-3'>
        {copy.options.map((option) => {
          const active = theme === option.id
          return (
            <button
              key={option.id}
              type='button'
              role='radio'
              aria-checked={active}
              onClick={() => choose(option.id, option.label)}
              className={cn(
                'group grid gap-3 rounded-xl border p-2 text-start transition-[border-color,box-shadow,transform] duration-200 outline-none hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring/60',
                active ? 'border-primary/70 shadow-glow' : 'hover:border-border-strong'
              )}
            >
              <div className='relative aspect-[16/10] overflow-hidden rounded-lg border'>
                {option.id === 'system' ? (
                  <div className='grid h-full grid-cols-2'>
                    <Preview mode='light' />
                    <Preview mode='dark' />
                  </div>
                ) : (
                  <Preview mode={option.id} />
                )}
                {active && (
                  <span className='absolute top-2 right-2 grid size-5 place-items-center rounded-full bg-primary-fill text-primary-foreground shadow'>
                    <Check className='size-3' strokeWidth={3} />
                  </span>
                )}
              </div>
              <div className='grid gap-0.5 px-1 pb-1'>
                <span className='text-sm font-medium'>{option.label}</span>
                <span className='text-xs text-muted-foreground'>{option.description}</span>
              </div>
            </button>
          )
        })}
      </div>
    </SettingsSection>
  )
}
