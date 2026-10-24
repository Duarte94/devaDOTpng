# devaDOTpng — Agent Guide

Static artist portfolio site for **Deva.png** (commission artist).

## Stack

React 19 + TypeScript + Vite + Tailwind CSS v4. react-router-dom v7 for SPA navigation.

## Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start dev server with HMR |
| `pnpm build` | TypeScript check + Vite production build to `dist/` |
| `pnpm preview` | Preview production build locally |
| `pnpm lint` | Run oxlint |
| `pnpm brand-assets` | Regenerate favicon/OG icons in `public/` from `src/assets/devasign.svg` |

## Pages / Routes

| Route | Component | Notes |
|-------|-----------|-------|
| `/` | `Home.tsx` | Hero + about + promos + waitlist |
| `/gallery` | `Gallery.tsx` | Gallery grid + pagination |
| `/commissions` | `Commissions.tsx` | TOS modal + price cards |
| `/fanarts` | `Fanarts.tsx` | Fanart grid + pagination |
| `/nsfw` | `Nsfw.tsx` | Patreon tiers + join link |
| `/terms` | `Terms.tsx` | Terms of Service page |
| `*` | `NotFound.tsx` | 404 fallback |

## Key files

- `src/App.tsx` — React Router layout with `<Navbar />` + `<Footer />`
- `src/components/` — shared components (Navbar, Footer, Hero, ToSModal, CommissionCard, PatreonCard, Pagination)
- `src/pages/` — route page components
- `src/index.css` — Tailwind import + global styles
- `public/` — favicon, apple-touch icon, OG image, `site.webmanifest`, `robots.txt`, `sitemap.xml`

## CI / Deploy

- **Deploy: Cloudflare Workers (static assets) via Workers Builds (Git integration)** — Worker `devadotpng`, live at `https://devamon.com.ar` (Custom Domain; `www.devamon.com.ar` 301-redirects to the apex). Push to `main` → production deploy; branches/PRs → preview builds. Build command `pnpm build`, deploy command `npx wrangler deploy`, build vars `PNPM_VERSION=9.15.9` and `NODE_VERSION=22` (the build image does not detect pnpm from the lockfile or `packageManager`).
- Repo config lives in `wrangler.jsonc` (`assets.directory: ./dist`, `not_found_handling: "single-page-application"` — SPA routing for `BrowserRouter`; never add a `404.html`). Manual deploy: `pnpm deploy`. `pnpm-lock.yaml` is committed for reproducible builds.
- Data in production: the mock layer (`axios-mock-adapter` in `src/api/setupMock.ts`) currently registers **unconditionally**, so `/api/*` is served client-side from the committed manifest in both dev and prod (old `VITE_USE_MOCKS` gate removed; the flag is now a no-op). **Pending decision** — see `docs/PROJECT_STATUS.md` P0-1: keep that fallback or add a Worker API (`src/worker.ts` + `assets.run_worker_first: ["/api/*"]`).
- The legacy `.github/workflows/static.yml` (GitHub Pages deploy) was deleted; disable GitHub Pages in the repo settings if still enabled.

## Image Hosting

High-resolution artwork is hosted on **Cloudflare R2** (S3-compatible, free egress), served through Cloudflare CDN at `https://cdn.devamon.com.ar`. Site chrome (hero, banners, logo) remains bundled in the repo.

### Upload workflow

1. Add your raw artwork PNGs to `artworks-src/` (gitignored).
2. (Optional) Add `artworks-src/manifest.json` with metadata:
   ```json
   [{ "file": "portrait-1.png", "title": "Portrait 1", "tags": ["headshot", "oc"] }]
   ```
3. Ensure `.env` has the R2 credentials set (see `.env.example`).
4. Run `pnpm upload-artworks`.
   - The script generates **thumb** (512w WebP) and **full** (1600w WebP) variants via `sharp`.
   - Skips files already on R2 (idempotent).
   - Writes the artwork manifest to `src/api/artworks.generated.json`.
5. Commit the updated `artworks.generated.json` (it's checked in — served by the mock layer in dev/prod, and by the Worker API if that optional migration happens).
6. Browse the gallery to verify.

## Style notes

- Tailwind utility classes with arbitrary values for pixel-perfect spacing (`w-[182px]`, `h-[72px]`, etc.)
- Font: REM from Google Fonts (imported in `index.html`)
- Icons: Font Awesome 6 (loaded via CDN link in `index.html` — `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css`)
- Color palette: `#52D0D0` (cyan), `#7154D6` (purple), black background, white text
