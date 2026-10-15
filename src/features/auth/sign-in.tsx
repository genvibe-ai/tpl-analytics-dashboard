import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { KeyRound, LoaderCircle } from 'lucide-react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { auth, data, site } from '@/content'
import { fill, formatCurrency } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LogoMark } from '@/components/brand/logo'
import { Sparkline } from '@/components/charts/sparkline'
import { Delta } from '@/components/delta'
import { CountUp } from '@/components/motion/count-up'
import { PasswordInput } from '@/components/password-input'
import { ThemeToggle } from '@/components/theme-toggle'
import { UserAvatar } from '@/components/user-avatar'

const copy = auth.signIn

const schema = z.object({
  email: z.email(copy.errors.email),
  password: z.string().min(8, copy.errors.password),
  remember: z.boolean(),
})

type Values = z.infer<typeof schema>

/** Design-only sign-in. Connect onSubmit to your auth provider (for example Supabase Auth). */
export function SignIn() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: copy.defaultEmail, password: '', remember: true },
  })

  function onSubmit() {
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      toast.success(copy.success)
      navigate({ to: '/' })
    }, 700)
  }

  const mrr = data.kpiValues.mrr

  return (
    <div className='grid min-h-svh bg-background lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]'>
      {/* Form */}
      <main id='content' className='relative flex flex-col px-5 py-6 sm:px-10'>
        <div className='flex items-center justify-between'>
          <Link to='/' className='flex items-center gap-2'>
            <LogoMark className='size-8' />
            <span className='font-display text-base font-semibold tracking-tight'>{site.name}</span>
          </Link>
          <ThemeToggle />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className='mx-auto my-auto w-full max-w-sm py-12'
        >
          <h1 className='text-3xl font-semibold'>{copy.title}</h1>
          <p className='mt-2 text-sm text-muted-foreground'>{copy.description}</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='mt-8 grid gap-4' noValidate>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{copy.email}</FormLabel>
                    <FormControl>
                      <Input type='email' autoComplete='email' placeholder={copy.emailPlaceholder} className='h-10' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center justify-between'>
                      <FormLabel>{copy.password}</FormLabel>
                      <button
                        type='button'
                        onClick={() => toast(copy.forgotToast)}
                        className='rounded text-[13px] font-medium text-primary-text hover:underline focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none'
                      >
                        {copy.forgot}
                      </button>
                    </div>
                    <FormControl>
                      <PasswordInput autoComplete='current-password' placeholder='••••••••' className='[&_input]:h-10' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='remember'
                render={({ field }) => (
                  <FormItem className='flex items-center gap-2'>
                    <FormControl>
                      <input
                        type='checkbox'
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className='size-4 rounded accent-[var(--primary)]'
                      />
                    </FormControl>
                    <FormLabel className='font-normal text-muted-foreground'>{copy.remember}</FormLabel>
                  </FormItem>
                )}
              />
              <Button type='submit' size='lg' className='mt-2 w-full' disabled={loading}>
                {loading && <LoaderCircle className='animate-spin' />}
                {loading ? copy.submitting : copy.submit}
              </Button>
            </form>
          </Form>

          <div className='my-6 flex items-center gap-3 text-xs text-muted-foreground'>
            <span className='h-px flex-1 bg-border' />
            {copy.or}
            <span className='h-px flex-1 bg-border' />
          </div>
          <Button variant='outline' size='lg' className='w-full' onClick={() => toast(copy.ssoToast)}>
            <KeyRound />
            {copy.sso}
          </Button>
          <p className='mt-8 text-center text-sm text-muted-foreground'>
            {copy.noAccount}{' '}
            <button
              type='button'
              onClick={() => toast.success(copy.requestToast)}
              className='rounded font-medium text-primary-text hover:underline focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none'
            >
              {copy.request}
            </button>
          </p>
        </motion.div>

        <p className='text-center text-xs text-muted-foreground'>
          {fill(auth.legal, { year: new Date().getFullYear() })}
        </p>
      </main>

      {/* Brand panel */}
      <aside className='relative m-3 hidden overflow-hidden rounded-3xl border bg-sidebar lg:flex lg:flex-col lg:justify-between lg:p-12'>
        <div aria-hidden='true' className='absolute inset-0'>
          <div className='absolute -top-32 -right-24 size-[34rem] rounded-full bg-primary/30 blur-[120px]' />
          <div className='absolute -bottom-40 -left-24 size-[28rem] rounded-full bg-chart-3/20 blur-[120px]' />
          <div className='absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)] bg-[size:44px_44px] opacity-60' />
        </div>
        <div className='relative'>
          <p className='eyebrow'>{auth.panel.eyebrow}</p>
          <p className='mt-4 max-w-md font-display text-4xl leading-[1.1] font-semibold tracking-tight text-balance'>
            {auth.panel.headline}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24, rotate: -1.5 }}
          animate={{ opacity: 1, y: 0, rotate: -1.5 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className='relative mx-auto w-full max-w-md rounded-2xl border bg-card/90 p-6 shadow-float backdrop-blur'
        >
          <p className='text-[13px] text-muted-foreground'>{auth.panel.statLabel}</p>
          <div className='mt-2 flex items-end justify-between gap-4'>
            <CountUp value={mrr.value} format={(v) => formatCurrency(v)} className='font-display text-4xl font-semibold tracking-tight' delay={0.4} />
            <Delta value={mrr.delta} className='mb-1' />
          </div>
          <Sparkline data={mrr.trend} height={84} className='mt-4' delay={0.5} />
        </motion.div>

        <figure className='relative max-w-md'>
          <blockquote className='text-lg leading-relaxed text-pretty'>“{auth.panel.quote}”</blockquote>
          <figcaption className='mt-4 flex items-center gap-3'>
            <UserAvatar name={auth.panel.author} avatar={auth.panel.avatar} className='size-10' />
            <span className='grid leading-tight'>
              <span className='text-sm font-medium'>{auth.panel.author}</span>
              <span className='text-[13px] text-muted-foreground'>{auth.panel.role}</span>
            </span>
          </figcaption>
        </figure>
      </aside>
    </div>
  )
}
