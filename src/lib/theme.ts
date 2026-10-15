/**
 * Applies the colours from src/content.ts to CSS variables and sets the page title/description.
 * Runs once at startup (src/main.tsx), before the first render.
 */
import { site, theme } from '@/content'
import type { ChartPalette, Palette, ThemeMode, ThemePreference } from '@/types'

const kebab = (key: string) => key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)

function variables(colors: Palette, charts: ChartPalette) {
  const lines = Object.entries(colors).map(([key, value]) => `--${kebab(key)}:${value};`)
  charts.series.forEach((value, i) => lines.push(`--chart-${i + 1}:${value};`))
  charts.plans.forEach((value, i) => lines.push(`--plan-${i + 1}:${value};`))
  lines.push(`--chart-compare:${charts.compare};`)
  return lines.join('')
}

export function applyContentTheme() {
  let style = document.getElementById('content-theme')
  if (!style) {
    style = document.createElement('style')
    style.id = 'content-theme'
    document.head.appendChild(style)
  }
  // `html:root` / `html.dark` outrank the fallbacks in src/styles/theme.css.
  style.textContent =
    `html:root{${variables(theme.colors.light, theme.charts.light)}}` +
    `html.dark{${variables(theme.colors.dark, theme.charts.dark)}}`

  document.title = site.title
  document.querySelector('meta[name="description"]')?.setAttribute('content', site.description)
}

/* ── Light / dark mode ─────────────────────────────────────────────── */

export const THEME_STORAGE_KEY = 'lumetric-theme'

export function readStoredPreference(): ThemePreference | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY)
    return value === 'dark' || value === 'light' || value === 'system' ? value : null
  } catch {
    return null
  }
}

export function storePreference(preference: ThemePreference) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference)
  } catch {
    // Storage can be blocked (private mode); the choice then lasts for this visit only.
  }
}

export const systemMode = (): ThemeMode =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

export const resolveMode = (preference: ThemePreference): ThemeMode =>
  preference === 'system' ? systemMode() : preference

/** Sets the `dark` class on <html> and the browser UI colour. */
export function applyMode(mode: ThemeMode) {
  const root = document.documentElement
  root.classList.toggle('dark', mode === 'dark')
  root.classList.toggle('light', mode === 'light')
  root.style.colorScheme = mode
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme.colors[mode].background)
}

export const initialPreference = (): ThemePreference => readStoredPreference() ?? theme.defaultMode
