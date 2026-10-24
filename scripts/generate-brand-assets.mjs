#!/usr/bin/env node
/**
 * Generates the brand/SEO assets served from public/:
 *   favicon.svg, favicon-32x32.png, apple-touch-icon.png,
 *   icon-192.png, icon-512.png, og-image.png
 *
 * Source of truth for the mark: src/assets/devasign.svg
 * Run with: pnpm brand-assets
 */
import sharp from 'sharp'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const LOGO_PATH = join(ROOT, 'src', 'assets', 'devasign.svg')
const OUT_DIR = join(ROOT, 'public')

const BRAND = {
  bg: '#0a0a0a',
  cyan: '#52D0D0',
  purple: '#7154D6',
}

const logo = readFileSync(LOGO_PATH, 'utf8')

// The wordmark is "DEVA + A + PNG": six paths, all white.
const wordmarkPaths = [...logo.matchAll(/<path d="([^"]+)"/g)].map((match) => match[1])
// The "D" is the leftmost glyph (the last path in the source file).
const dGlyph = wordmarkPaths.find((d) => d.startsWith('M0.119499'))

if (!dGlyph) {
  throw new Error(
    'Could not find the "D" glyph in src/assets/devasign.svg. ' +
      'Update the extractor in scripts/generate-brand-assets.mjs if the logo changed.',
  )
}

// "D" bounds in the source viewBox (0 0 115 24): x 0.12..20.63, y 0.60..23.13.
const GLYPH_BOX = { x1: 0.119, x2: 20.631, y1: 0.6, y2: 23.13 }
const iconScale = 300 / (GLYPH_BOX.y2 - GLYPH_BOX.y1)
const iconX = 256 - ((GLYPH_BOX.x1 + GLYPH_BOX.x2) / 2) * iconScale
const iconY = 256 - ((GLYPH_BOX.y1 + GLYPH_BOX.y2) / 2) * iconScale

function iconSvg({ rounded }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${BRAND.cyan}"/>
      <stop offset="1" stop-color="${BRAND.purple}"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="${rounded ? 112 : 0}" fill="url(#brand)"/>
  <g transform="translate(${iconX.toFixed(2)} ${iconY.toFixed(2)}) scale(${iconScale.toFixed(4)})">
    <path d="${dGlyph}" fill="${BRAND.bg}"/>
  </g>
</svg>`
}

function ogSvg() {
  const scale = 560 / 115
  const wordmarkX = (1200 - 560) / 2
  const wordmarkY = 205
  const paths = wordmarkPaths
    .map((d) => `<path d="${d}" fill="#ffffff"/>`)
    .join('\n    ')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glowCyan" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${BRAND.cyan}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${BRAND.cyan}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowPurple" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${BRAND.purple}" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="${BRAND.purple}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="line" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${BRAND.cyan}"/>
      <stop offset="1" stop-color="${BRAND.purple}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="${BRAND.bg}"/>
  <circle cx="140" cy="40" r="520" fill="url(#glowCyan)"/>
  <circle cx="1080" cy="610" r="520" fill="url(#glowPurple)"/>
  <g transform="translate(${wordmarkX} ${wordmarkY}) scale(${scale.toFixed(4)})">
    ${paths}
  </g>
  <rect x="540" y="382" width="120" height="4" rx="2" fill="url(#line)"/>
  <text x="600" y="454" text-anchor="middle" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="26" letter-spacing="8" fill="#ffffff" fill-opacity="0.65">ARTIST PORTFOLIO</text>
  <text x="600" y="548" text-anchor="middle" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="21" letter-spacing="2" fill="#ffffff" fill-opacity="0.35">devamon.com.ar</text>
</svg>`
}

mkdirSync(OUT_DIR, { recursive: true })

async function renderIcon(svg, fileName, size) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(join(OUT_DIR, fileName))
}

writeFileSync(join(OUT_DIR, 'favicon.svg'), `${iconSvg({ rounded: true })}\n`)
await renderIcon(iconSvg({ rounded: true }), 'favicon-32x32.png', 32)
await renderIcon(iconSvg({ rounded: false }), 'apple-touch-icon.png', 180)
await renderIcon(iconSvg({ rounded: false }), 'icon-192.png', 192)
await renderIcon(iconSvg({ rounded: false }), 'icon-512.png', 512)
await sharp(Buffer.from(ogSvg())).png().toFile(join(OUT_DIR, 'og-image.png'))

console.log('Wrote public/favicon.svg, favicon-32x32.png, apple-touch-icon.png, icon-192.png, icon-512.png, og-image.png')
