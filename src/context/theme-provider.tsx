import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'
import type { ThemeMode, ThemePreference } from '@/types'
import {
  applyMode,
  initialPreference,
  resolveMode,
  storePreference,
  systemMode,
} from '@/lib/theme'

type ThemeContextValue = {
  /** What the user picked: dark, light or system. */
  theme: ThemePreference
  /** What is on screen right now. */
  resolvedTheme: ThemeMode
  setTheme: (theme: ThemePreference) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>(initialPreference)
  const [system, setSystem] = useState<ThemeMode>(systemMode)
  const resolvedTheme = theme === 'system' ? system : theme

  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setSystem(query.matches ? 'dark' : 'light')
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  useEffect(() => applyMode(resolvedTheme), [resolvedTheme])

  const setTheme = useCallback((next: ThemePreference) => {
    storePreference(next)
    const update = () => {
      flushSync(() => setThemeState(next))
      applyMode(resolveMode(next))
    }
    // Cross-fade between themes where the browser supports view transitions.
    if (typeof document.startViewTransition === 'function' && !prefersReducedMotion()) {
      document.startViewTransition(update)
    } else {
      update()
    }
  }, [])

  const toggleTheme = useCallback(
    () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
    [resolvedTheme, setTheme]
  )

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
    [theme, resolvedTheme, setTheme, toggleTheme]
  )

  return <ThemeContext value={value}>{children}</ThemeContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside ThemeProvider')
  return context
}
