import { useState } from 'react'
import { toast } from 'sonner'
import { settings, user } from '@/content'
import { fill } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { SettingsSection } from './section'

const copy = settings.notifications

export function SettingsNotifications() {
  const [values, setValues] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(copy.groups.flatMap((g) => g.items.map((i) => [i.id, i.on])))
  )

  return (
    <SettingsSection
      title={copy.title}
      description={copy.description}
      footer={<Button onClick={() => toast.success(copy.saved)}>{copy.save}</Button>}
    >
      <div className='grid gap-6'>
        {copy.groups.map((group) => (
          <fieldset key={group.title} className='grid gap-1'>
            <legend className='eyebrow mb-2'>{group.title}</legend>
            {group.items.map((item) => {
              const id = `notify-${item.id}`
              return (
                <div key={item.id} className='flex items-center justify-between gap-4 rounded-lg px-1 py-2.5'>
                  <label htmlFor={id} className='grid cursor-pointer gap-0.5'>
                    <span className='text-sm font-medium'>{item.label}</span>
                    <span className='text-[13px] text-muted-foreground'>{fill(item.description, { email: user.email })}</span>
                  </label>
                  <Switch
                    id={id}
                    checked={values[item.id]}
                    onCheckedChange={(checked) => setValues((v) => ({ ...v, [item.id]: checked }))}
                  />
                </div>
              )
            })}
          </fieldset>
        ))}
      </div>
    </SettingsSection>
  )
}
