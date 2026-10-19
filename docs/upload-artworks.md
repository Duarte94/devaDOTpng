# Artwork Upload Guide

High-resolution artwork is **not** stored in this repository. Instead, it lives on Cloudflare R2 (S3-compatible object storage) and is served through Cloudflare's CDN for fast, free-egress delivery.

The script `scripts/upload-artworks.mjs` handles the full pipeline: reading raw source images, generating optimized WebP variants, uploading them to R2, and writing a manifest that the site consumes.

## Prerequisites

- A [Cloudflare](https://cloudflare.com) account (free tier works)
- R2 enabled on your account (free tier includes 10 GB of storage)
- Access to the domain's DNS settings (e.g. `deva.png`) so the image CDN subdomain can be proxied through Cloudflare
- Node.js 20+ and pnpm installed locally

## Manual setup (one-time)

### 1. Create the R2 bucket

1. Go to the [Cloudflare Dashboard → R2](https://dash.cloudflare.com/?to=/?account=r2).
2. Click **Create bucket**, name it `deva-artworks`, choose the auto-selected region.
3. Once created, go to the bucket's **Settings** tab and enable **Public access**.
   - Copy the public URL (it looks like `https://pub-XXXXXXXX.r2.dev`) — you can use this as a fallback instead of a custom domain.

### 2. (Optional) Set up a custom subdomain

For production, point a subdomain (e.g. `cdn.deva.png`) to the R2 bucket so images are served through Cloudflare's CDN cache:

1. In the bucket's **Settings → Custom Domains**, enter `cdn.deva.png` and connect it.
2. Cloudflare will add a CNAME record automatically. Make sure the orange cloud (proxy) is enabled — this gives you free egress and CDN caching.
3. Set `CDN_BASE_URL` in `.env` to `https://cdn.deva.png`.

> If you skip this step, use the bucket's `r2.dev` public URL as `CDN_BASE_URL` (e.g. `https://pub-XXXXXXXX.r2.dev`). Egress is still free.

### 3. Create an R2 API token

1. In the Cloudflare Dashboard, go to **Account Home → R2 → Manage API Tokens**.
2. Click **Create API token**, select **Admin read & write** permission.
3. Copy the **Access Key ID** and **Secret Access Key** shown once (they won't be shown again).
4. Also note your **Account ID** (visible on the R2 overview page).

### 4. Fill in `.env`

Copy `.env.example` to `.env` and fill in the values:

```bash
# API
VITE_API_URL=/api

# R2 credentials (for upload script only — never exposed to the browser)
R2_ACCOUNT_ID=<your-cloudflare-account-id>
R2_ACCESS_KEY_ID=<your-r2-access-key-id>
R2_SECRET_ACCESS_KEY=<your-r2-secret-access-key>
R2_BUCKET=deva-artworks
CDN_BASE_URL=https://cdn.deva.png
```

> `.env` is gitignored — secrets stay local.

## Preparing source images

1. Create an `artworks-src/` directory in the project root:

   ```bash
   mkdir artworks-src
   ```

2. Drop your raw artwork files (PNG, JPG, TIFF, WebP, AVIF) into `artworks-src/`. Nested subdirectories are fine — the script scans recursively.

3. For images with specific metadata (title, tags, username for fanarts), add an optional `artworks-src/manifest.json`:

   ```json
   [
     { "file": "portrait-1.png", "title": "Portrait 1", "tags": ["headshot", "oc"] },
     { "file": "fanart-from-fan.png", "title": "Fanart by @Artist", "tags": ["fanart"], "username": "@Artist" }
   ]
   ```

   Fields:
   | Field | Required | Default |
   |-------|----------|---------|
   | `file` | yes | — |
   | `title` | no | filename without extension |
   | `tags` | no | `[]` |
   | `username` | no | `undefined` (artwork goes to gallery; if set, goes to fanarts) |

## Running the upload

```bash
pnpm upload-artworks
```

The script will:

1. Scan `artworks-src/` for image files
2. For each image, generate **two WebP variants** via `sharp`:
   - **thumb** — 512px wide, quality 80 (used in gallery grid)
   - **full** — 1600px wide, quality 90 (used in lightbox/modal)
3. Upload both to R2 with headers:
   - `Content-Type: image/webp`
   - `Cache-Control: public, max-age=31536000, immutable`
4. **Skip** files that already have both variants on R2 (idempotent)
5. Write `src/api/artworks.generated.json` with the complete manifest

Example output:

```
Found 3 image(s) in artworks-src/
  portrait-1.png → generating variants (1920x2560)
  uploaded → thumb-portrait-1.webp
  uploaded → full-portrait-1.webp
  fanart-from-fan.png → generating variants (1200x1600)
  uploaded → thumb-fanart-from-fan.webp
  uploaded → full-fanart-from-fan.webp
  already-uploaded.png — both variants already on R2 (SKIP)

Done. Uploaded: 2, Skipped: 1
Wrote 3 entries → src/api/artworks.generated.json
```

## After uploading

1. **Commit the updated manifest:**

   ```bash
   git add src/api/artworks.generated.json
   git commit -m "feat: add new artworks"
   ```

   The `.json` file is checked in so the development server (mock adapter) and the production build both have the artwork list.

   The actual image binaries (`artworks-src/`) are gitignored — they don't go in the repo.

2. **Run the dev server** to verify:

   ```bash
   pnpm dev
   ```

   Browse the gallery and fanarts pages. Grid thumbnails load the `thumb-*` WebP; clicking a work opens the `full-*` variant.

3. **Push to main** — GitHub Actions builds and deploys to Pages automatically.

## Naming conventions

The script slugs filenames into web-safe keys:

| Source file | R2 key (thumb) | R2 key (full) | CDN URL |
|-------------|----------------|----------------|---------|
| `portrait-1.png` | `thumb-portrait-1.webp` | `full-portrait-1.webp` | `https://cdn.deva.png/thumb-portrait-1.webp` |
| `Commission_Art.png` | `thumb-commission-art.webp` | `full-commission-art.webp` | `https://cdn.deva.png/full-commission-art.webp` |

Special characters are stripped, spaces become hyphens.

## Removing or replacing an artwork

To **remove**: delete the entry from `artworks.generated.json` and delete the files from R2 (via Cloudflare dashboard). Commit the change.

To **replace**: put the new file in `artworks-src/` with the same name (or update `manifest.json` to point to the new file) and re-run `pnpm upload-artworks`. The script will re-upload with the same key (overwriting).

## Reference

| File | Purpose |
|------|---------|
| `artworks-src/` | Put raw source images here (gitignored) |
| `artworks-src/manifest.json` | Optional metadata per artwork |
| `scripts/upload-artworks.mjs` | The upload script |
| `src/api/artworks.generated.json` | Generated manifest consumed by the site |
| `.env` | R2 credentials (gitignored) |
| `.env.example` | Documentation for required env vars |
