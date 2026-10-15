// Fonts: Sora (headings and numbers) + Hanken Grotesk (interface). Change them here and in
// src/styles/theme.css (--font-display, --font-sans).
import '@fontsource-variable/sora'
import '@fontsource-variable/hanken-grotesk'
import './styles/index.css'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { MotionConfig } from 'motion/react'
import { ThemeProvider } from './context/theme-provider'
import { applyContentTheme, applyMode, initialPreference, resolveMode } from './lib/theme'
import { routeTree } from './routeTree.gen'

// Colours, title and description come from src/content.ts; set them before the first paint.
applyContentTheme()
applyMode(resolveMode(initialPreference()))

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  ReactDOM.createRoot(rootElement).render(
    <StrictMode>
      <ThemeProvider>
        {/* Respect the visitor's reduced-motion setting everywhere. */}
        <MotionConfig reducedMotion='user'>
          <RouterProvider router={router} />
        </MotionConfig>
      </ThemeProvider>
    </StrictMode>
  )
}
