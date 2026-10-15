import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload } from 'lucide-react'
import { toast } from 'sonner'
import { settings, user } from '@/content'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { UserAvatar } from '@/components/user-avatar'
import { SettingsSection } from './section'

const copy = settings.profile

const schema = z.object({
  name: z.string().trim().min(2, copy.errors.name),
  email: z.email(copy.errors.email),
  title: z.string().trim(),
  timezone: z.string(),
  bio: z.string().max(160, copy.errors.bio),
})

type Values = z.infer<typeof schema>

export function SettingsProfile() {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: user.name, email: user.email, title: user.title, timezone: copy.timezone, bio: copy.bio },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => toast.success(copy.saved))} className='grid grid-cols-1 gap-6' noValidate>
        <SettingsSection
          title={copy.title}
          description={copy.description}
          footer={<Button type='submit'>{copy.save}</Button>}
        >
          <div className='grid gap-6'>
            <div className='flex flex-wrap items-center gap-4'>
              <UserAvatar name={user.name} avatar={user.avatar} className='size-16' />
              <div className='grid gap-2'>
                <span className='text-sm font-medium'>{copy.photo.label}</span>
                <div className='flex gap-2'>
                  <Button type='button' variant='outline' size='sm' onClick={() => toast(copy.photo.toast)}>
                    <Upload />
                    {copy.photo.change}
                  </Button>
                  <Button type='button' variant='ghost' size='sm' onClick={() => toast(copy.photo.toast)}>
                    {copy.photo.remove}
                  </Button>
                </div>
                <span className='text-xs text-muted-foreground'>{copy.photo.hint}</span>
              </div>
            </div>
            <div className='grid gap-4 @2xl/content:grid-cols-2'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{copy.fields.name}</FormLabel>
                    <FormControl>
                      <Input autoComplete='name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{copy.fields.email}</FormLabel>
                    <FormControl>
                      <Input type='email' autoComplete='email' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{copy.fields.title}</FormLabel>
                    <FormControl>
                      <Input autoComplete='organization-title' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='timezone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{copy.fields.timezone}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {copy.timezones.map((tz) => (
                          <SelectItem key={tz} value={tz}>
                            {tz}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='bio'
                render={({ field }) => (
                  <FormItem className='@2xl/content:col-span-2'>
                    <FormLabel>{copy.fields.bio}</FormLabel>
                    <FormControl>
                      <Textarea rows={3} className='resize-none' {...field} />
                    </FormControl>
                    <FormDescription>{copy.fields.bioHint}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </SettingsSection>
      </form>
    </Form>
  )
}
