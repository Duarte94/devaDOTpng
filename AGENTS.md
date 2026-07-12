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

## CI / Deploy

- GitHub Actions (`.github/workflows/static.yml`) deploys to **GitHub Pages** on push to `main`.
- Build step: `pnpm install` → `pnpm build` → copies `dist/index.html` → `dist/404.html` (SPA fallback) → uploads `dist/`.

## Image Hosting

High-resolution artwork is hosted on **Cloudflare R2** (S3-compatible, free egress), served through Cloudflare CDN at `https://cdn.deva.png`. Site chrome (hero, banners, logo) remains bundled in the repo.

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
5. Commit the updated `artworks.generated.json` (it's checked in so the mock adapter works).
6. Browse the gallery to verify.

## Style notes

- Tailwind utility classes with arbitrary values for pixel-perfect spacing (`w-[182px]`, `h-[72px]`, etc.)
- Font: REM from Google Fonts (imported in `index.html`)
- Icons: Font Awesome 6 (loaded via CDN link in `index.html` — `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css`)
- Color palette: `#52D0D0` (cyan), `#7154D6` (purple), black background, white text
