import { Moon, Sun } from 'lucide-react'
import { header } from '@/content'
import { useTheme } from '@/context/theme-provider'
import { Button } from './ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme()
  const label = resolvedTheme === 'dark' ? header.theme.toLight : header.theme.toDark
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant='ghost' size='icon' onClick={toggleTheme} aria-label={label} className='relative'>
          <Sun className='scale-100 rotate-0 transition-transform duration-300 dark:scale-0 dark:-rotate-90' />
          <Moon className='absolute scale-0 rotate-90 transition-transform duration-300 dark:scale-100 dark:rotate-0' />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
