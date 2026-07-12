# Project Structure

> Repository: **devaDOTpng** — static artist-commission portfolio for "Deva.png".

## Overview / Stack

- **Framework:** React 19 + TypeScript (~6.0.2), bundled with **Vite 8**.
- **Routing:** `react-router-dom` v7 (`BrowserRouter`, SPA).
- **Styling:** Tailwind CSS v4 (via `@tailwindcss/vite` 4.1.6, no separate config file — theme tokens live in `src/index.css`).
- **Animation:** `framer-motion` 12 (`MotionConfig reducedMotion="user"`).
- **Data layer:** `axios` 1.18 + `axios-mock-adapter` 2.1 (dev/mock mode only).
- **Image pipeline (build-time script):** `sharp` 0.35 + `@aws-sdk/client-s3` — uploads artwork to Cloudflare R2.
- **Lint/typecheck:** `oxlint` + `tsc -b` (via `pnpm build`).
- **Deploy:** Static build → GitHub Pages via GitHub Actions on push to `main`.

## Directory Layout

```
devaDOTpng/
├── index.html                  # HTML shell; loads REM font (Google) + Font Awesome 6.5.2 (CDN)
├── package.json                # Scripts: dev, build, lint, preview, upload-artworks
├── vite.config.ts              # react + tailwind plugins; base '/'; '/api' dev proxy → :3000
├── .env                        # local overrides (gitignored): VITE_API_URL, VITE_USE_MOCKS=true
├── .env.example                # documented env template (committed)
├── .gitignore                  # ignores .env*, artworks-src/, node_modules, dist, scripts/.cache
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── AGENTS.md / README.md / LICENSE
├── docs/
│   ├── PROJECT_STRUCTURE.md    # this file
│   └── upload-artworks.md      # Full guide to the R2 upload pipeline
├── scripts/
│   └── upload-artworks.mjs     # Generates WebP variants, uploads to R2, writes manifest
├── .github/workflows/
│   └── static.yml              # Build + deploy to GitHub Pages (SPA fallback)
└── src/
    ├── main.tsx                # React root mount + StrictMode
    ├── App.tsx                 # Router layout shell: Background / Navbar / Routes / Footer
    ├── index.css               # Tailwind import, @theme tokens, .glass utilities, base resets
    ├── api/                    # Data layer (see Data Flow)
    │   ├── types.ts            # ArtworkItem, PriceTier, PriceCategory, PatreonTier, WaitlistResponse, Paginated<T>
    │   ├── client.ts           # Axios instance (baseURL from VITE_API_URL)
    │   ├── setupMock.ts        # axios-mock-adapter registration (DEV + VITE_USE_MOCKS===true gate)
    │   ├── mockData.ts         # Imports artworks.generated.json + static price/patreon/waitlist data
    │   ├── queries.ts          # Typed fetchers: fetchGallery, fetchFanarts, fetchPrices, etc.
    │   └── artworks.generated.json   # R2 manifest (committed; currently [])
    ├── assets/                 # Bundled site-chrome images (hero banners, logo, Ani-Elfa preview)
    ├── components/             # Navbar, Footer, Hero, Background, ToSModal, CommissionCard, PatreonCard
    │   └── ui/                 # ArtworkGrid, Badge, Button, FilterBar, GlassCard, Lightbox, Pagination, SectionTitle
    ├── constants/
    │   └── tags.ts             # ALL_TAGS + tagLabels
    ├── content/
    │   └── tos.tsx             # Terms-of-Service section content (ReactNode)
    ├── hooks/
    │   ├── useQuery.ts         # Generic data-fetching hook (data / loading / error)
    │   ├── useFocusTrap.ts     # Tab-focus trapping for modals/drawers
    │   └── useMobile.ts        # Media-query hook (breakpoint 768px)
    ├── lib/
    │   └── scroll.ts           # scrollMainToTop() helper
    └── pages/                  # Home, Gallery, Commissions, Fanarts, Nsfw, Terms, NotFound
```

## Routing & Pages

Defined in `src/App.tsx` (all wrapped in `<MotionConfig>` and a `bg-black` flex column with `<Background/>` behind and `<Navbar/>`/`<Footer/>` around `<Routes>`). The scroll container is the element with `id="main-scroll"`.

| Route | Component | Notes |
|-------|-----------|-------|
| `/` | `pages/Home.tsx` | `Hero` + about `GlassCard` + commission/patreon promo cards + waitlist (fetched via `useQuery(fetchWaitlist)`) |
| `/gallery` | `pages/Gallery.tsx` | `SectionTitle` + `FilterBar` (tag filter) + `ArtworkGrid` + `Pagination` + `Lightbox` |
| `/commissions` | `pages/Commissions.tsx` | `ToSModal` (accept gate) + request buttons + price list via `fetchPrices` |
| `/fanarts` | `pages/Fanarts.tsx` | Intro `GlassCard` (#DevaVerse) + `ArtworkGrid` + `Pagination` + `Lightbox` |
| `/nsfw` | `pages/Nsfw.tsx` | Patreon tier explainer + `PatreonCard` grid via `fetchPatreonTiers` + "Join Now" button |
| `/terms` | `pages/Terms.tsx` | Renders `tosSections` from `content/tos.tsx` in `GlassCard`s (no API call) |
| `*` | `pages/NotFound.tsx` | 404 fallback with link home |

## Data Flow

### `src/api/` layer

- **`types.ts`** — Shared interfaces:
  - `ArtworkItem` — `id`, `title`, `image` (required) + optional `thumb`, `tags`, `username`, `width`, `height`.
  - `PriceTier`, `PriceCategory` (`{title, prices: PriceTier[]}`), `PatreonTier` (`{name, description, price, highlighted}`), `WaitlistResponse` (`{slots, total, entries}`), and `Paginated<T>` (`{items, total, page, perPage}`).
- **`client.ts`** — Single `axios` instance with `baseURL: import.meta.env.VITE_API_URL ?? '/api'`.
- **`setupMock.ts`** — Registers an `axios-mock-adapter` on the client **only when** `import.meta.env.DEV && import.meta.env.VITE_USE_MOCKS === 'true'` (`delayResponse: 400`). Endpoints:
  - `GET /gallery` — supports `page`, `perPage`, and `tags` (CSV) filtering; returns `Paginated<ArtworkItem>`.
  - `GET /fanarts` — `page`/`perPage` pagination; returns `Paginated<ArtworkItem>`.
  - `GET /commissions/prices`, `GET /patreon/tiers`, `GET /waitlist` — static mock payloads.
- **`mockData.ts`** — Imports `artworks.generated.json` (currently `[]`), splits into `galleryMock` (`!a.username`) and `fanartsMock` (`a.username`). Also exports `pricesMock`, `patreonTiersMock`, `waitlistMock`.
- **`queries.ts`** — `import './setupMock'` (side-effect; registers mock in dev) then exports typed fetchers: `fetchGallery`, `fetchFanarts`, `fetchPrices`, `fetchPatreonTiers`, `fetchWaitlist`.

### `useQuery` hook (`src/hooks/useQuery.ts`)

Generic `useQuery<T>(queryFn, deps)` returning `{ data, loading, error }`. Cancels stale requests via an Abort-style `cancelled` flag in `useEffect`. Pages call it with a fetcher and a dependency array (e.g. `[page, activeTags]` in Gallery).

### Mock vs real backend gating

- **Dev:** `VITE_USE_MOCKS=true` (`.env`) + `import.meta.env.DEV` → mock adapter intercepts `/api/*` and serves local data.
- **Prod:** GitHub Actions sets `VITE_USE_MOCKS='false'` during `pnpm build` (see `static.yml`), so the mock registration is skipped and requests fall through to `VITE_API_URL` (the real backend).
- The dev `/api` proxy in `vite.config.ts` points at `http://localhost:3000` for local real-backend work.
- Note: `MockAdapter` is statically imported via `setupMock.ts` → `queries.ts`, so the module is part of the dependency graph. The *registration* is gated; no mock interception runs in production.

## Components

**Top-level (`src/components/`):**
- **`Navbar.tsx`** — Sticky `glass-strong` bar. Logo `devasign.svg` (bundled). Desktop: nav links + Discord/Instagram/X buttons. Mobile (`useMobile`): hamburger → slide-in `role="dialog"` drawer with `useFocusTrap`, Escape-to-close, focus management.
- **`Footer.tsx`** — Centered links (Home/Gallery/Patreon/Terms), logo, "© 2025 Designed by Burpies."
- **`Hero.tsx`** — Bundled responsive `<picture>` (hero-512/768/1024/1920 in `.png` + `.webp`), dark gradient overlay, `hero-invite.png` + primary `Button` → `/commissions`. Entrance animation via `framer-motion`.
- **`Background.tsx`** — Fixed, pointer-events-none layer of blurred cyan/purple radial-gradient blobs behind all content.
- **`ToSModal.tsx`** — Checkbox + modal showing `tosSections`; "Accept" sets the parent's `accepted` state. Uses `useFocusTrap`.
- **`CommissionCard.tsx`** — Expandable `glass` card (animated height) showing preview image + price rows.
- **`PatreonCard.tsx`** — Tier card; `highlighted` variant gets cyan border/glow + cyan text.

**UI primitives (`src/components/ui/`):**
- **`ArtworkGrid.tsx`** — `framer-motion` staggered grid (`grid-cols-2 md:3 lg:4`). Renders `art.thumb || art.image` for the tile, shows tag `Badge`s and (for fanarts) a `GlassCard` `username` overlay, opens a `Lightbox` on click/Enter/Space.
- **`Badge.tsx`** — Pill tag; `variant` = `cyan` | `purple` | `white`.
- **`Button.tsx`** — `variant` = `primary` | `secondary` | `ghost`; renders `<Link>` if `to`, `<a>` if `href`, else `<button>`; supports `disabled`, `rel`.
- **`FilterBar.tsx`** — Toggle chips for the active tag set; labels via `tagLabels` import.
- **`GlassCard.tsx`** — Thin wrapper applying the `.glass` class.
- **`Lightbox.tsx`** — Focus-trapped full-screen image overlay; shows `art.image` (full variant).
- **`Pagination.tsx`** — First/Prev/`current/total`/Next/Last controls.
- **`SectionTitle.tsx`** — Heading prefixed with cyan `// ` (renders `h1`/`h2`/`h3`).

## Image Strategy

Two distinct sources:

1. **Bundled site-chrome assets** (`src/assets/`, committed to repo):
   - `hero-512/768/1024/1920.png` + `.webp`, `hero-invite.png` (used by `Hero`).
   - `commission-banner.png`, `patreon-banner.png` (used by `Home`).
   - `Ani-Elfa.png` + `Ani-Elfa.webp` (used by `CommissionCard`).
   - `devasign.svg` (logo in `Navbar`/`Footer`).
2. **R2-hosted artwork** (gallery + fanart only): high-res images live on Cloudflare R2, served via Cloudflare CDN at `https://cdn.deva.png`. Only the manifest is committed.

### Upload pipeline (`scripts/upload-artworks.mjs`)
- Reads raw images recursively from `artworks-src/` (gitignored; supported: png/jpg/jpeg/webp/avif/tiff).
- Optional `artworks-src/manifest.json` array maps `{file, title?, tags?, username?}`; `username` presence routes the item to **fanarts** vs **gallery**.
- For each image, `sharp` produces **thumb** (512w, q80) and **full** (1600w, q90) WebP variants.
- Uploads both to R2 (`<slug>-thumb.webp` / `<slug>-full.webp`) with `Cache-Control: public, max-age=31536000, immutable`; idempotent (skips if both already exist via `HeadObjectCommand`).
- Writes `src/api/artworks.generated.json` consumed by `mockData.ts`.
- **Current state:** the committed manifest is `[]` (no artworks uploaded yet) — Gallery/Fanarts render empty states until the script is run.

### Manifest entry shape
```json
{ "id": "...", "title": "...", "image": "<CDN>/full-….webp",
  "thumb": "<CDN>/thumb-….webp", "tags": ["..."], "username": "...",
  "width": 1920, "height": 2560 }
```

## Styling

- **Tailwind v4** with tokens declared in `src/index.css`:
  ```css
  @theme { --color-cyan: #52D0D0; --color-purple: #7154D6; }
  ```
- **Base resets:** `html, body { height:100%; overflow:hidden; background:black; font-family:'REM' }`. Global `.glass` / `.glass-strong` backdrop-blur utilities; `:focus-visible` cyan outline.
- **Global typography:** `App.tsx` root applies `font-['REM'] uppercase tracking-wide leading-none` — the entire site renders in uppercase.
- **Fonts:** REM loaded from Google Fonts (`index.html`); **Font Awesome 6.5.2** from cdnjs (`index.html`).
- **Theme:** Dark-only (black background) — no light/dark/system toggle.

## CI / Deploy

`.github/workflows/static.yml`:
- Triggers: push to `main` + `workflow_dispatch`.
- Job `deploy` (ubuntu-latest, Node 22, pnpm 9): checkout → `pnpm install --frozen-lockfile` → `pnpm lint` → `pnpm build` (with `VITE_USE_MOCKS='false'`) → `actions/configure-pages@v5` → SPA fallback `cp dist/index.html dist/404.html` → `upload-pages-artifact` → `deploy-pages`.
- `vite.config.ts` sets `base: '/'`.

## Env / Secrets

`.env.example` (committed; `.env` and `.env.*` are gitignored except `.env.example`):

```
VITE_API_URL=/api
VITE_USE_MOCKS=true
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=deva-artworks
CDN_BASE_URL=https://cdn.deva.png
```

- `VITE_*` vars are inlined into the client bundle.
- `R2_*` vars are script-only (never exposed to the browser), required by `upload-artworks.mjs`.
- `.gitignore` also excludes `artworks-src/`, `scripts/.cache/`, `node_modules`, `dist`.

## Shared Utilities / Constants

- **`src/constants/tags.ts`** — `ALL_TAGS` (`headshot`, `halfbody`, `fullbody`, `oc`, `fanart`, `furry`) and `tagLabels` (slug → display label), consumed by `FilterBar` and `Gallery`.
- **`src/content/tos.tsx`** — `tosSections: TosSection[]` (title + `ReactNode` content), used by `ToSModal` and `Terms`.
- **`src/lib/scroll.ts`** — `scrollMainToTop(behavior='smooth')` scrolls the `#main-scroll` container.
- **`src/hooks/useFocusTrap.ts`** — Returns `containerRef` + `handleKeyDown` for trapping Tab focus inside modals/drawers.
- **`src/hooks/useMobile.ts`** — `useMobile()` via `matchMedia('(max-width: 767px)')`.
