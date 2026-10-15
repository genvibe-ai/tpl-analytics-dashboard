# Lumetric — project memory

## What this app is
Revenue and product analytics dashboard for a fictional SaaS company ("Fernwick" workspace). Runs fully in the browser on seeded mock data: no backend, no env vars. Stack: Vite 8, React 19, TypeScript, Tailwind CSS 4, shadcn/ui (Radix), TanStack Router (file-based) + Table, Recharts, motion, lucide-react. Based on shadcn-admin (MIT). Commands: `yarn dev`, `yarn build`, `yarn preview`, `yarn typecheck`.

## Built so far
- Overview `/`: KPI cards (count-up, delta, sparkline), revenue chart with 7D/30D/90D/12M tabs, MRR by plan, new vs churned, top accounts, simulated live activity feed, CSV export.
- Customers `/customers`: 656 accounts, search, Status/Plan/Region facets, sorting, pagination, column picker, CSV export, URL-synced state, detail drawer (`?customer=id`).
- Reports `/reports`: MRR movements (waterfall/table), new MRR by channel (stacked bars/table), cohort retention heatmap.
- Inbox `/inbox?c=id`: conversations, unread filter, thread with composer.
- Settings `/settings/*`: profile, team (invite/roles/remove), billing (plans, usage, invoices), notifications, appearance.
- Shell: collapsible sidebar (⌘B), command menu (⌘K), notifications, workspace switcher, dark/light/system theme, sign-in (design only), 404/500. Works at 360px.

## Design
- Dark by default; both palettes in `theme.colors` (content.ts): background #0B0D12, card #10131A, primary violet #7C5CFF, positive mint #34D399, negative #FB7185, warning #FBBF24, foreground #ECEEF3. Chart colours in `theme.charts`.
- Fonts: Sora (display, numbers) + Hanken Grotesk (UI), Fontsource; set in src/main.tsx and src/styles/theme.css.
- Shape: 0.875rem radius cards, 1px borders, `shadow-card`/`shadow-float`/`shadow-glow`, 2px primary rail on active nav.
- Motion: count-ups, chart draw-in (`useChartMotion`), `FadeIn` reveals, hover lift; `MotionConfig reducedMotion="user"` + CSS fallback.

## Structure
- `src/content.ts`: all copy, nav, colours, image paths and data wiring. `src/data/*.ts`: seeded mock datasets. `src/types.ts`: shared types.
- `src/routes/`: TanStack file routes (`routeTree.gen.ts` is generated). `src/features/<screen>/`: screens. `src/components/`: layout, ui (shadcn), charts, data-table, motion. `src/lib/`: theme, format, csv, color. `src/hooks/`, `src/context/`.
- `public/images/av-1…8.webp` portraits (320×320), `public/favicon.svg`; `index.html` holds static title/OG tags.

## User preferences & rules
- Edit src/content.ts first; keep the design system (tokens, shadcn components, chart parts); never hard-code copy, colours or data in components.
- Fictional names only, emails end in `.example`, no real brands.
- Keep `yarn typecheck && yarn build` green; respect reduced motion; no horizontal scroll at 360px.

## Open issues & next ideas
- All data is mock: connect Supabase (customers, metrics, auth) and wire sign-in; PDF export and plan changes are toasts.
- Ideas: date-range picker, saved views, alerts page, customer notes.
