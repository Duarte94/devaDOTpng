#!/usr/bin/env node
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import sharp from 'sharp'
import { readdirSync, statSync, existsSync, readFileSync, writeFileSync } from 'fs'
import { join, parse, relative } from 'path'
import { fileURLToPath } from 'url'

const __dirname = join(fileURLToPath(import.meta.url), '..')

const ROOT = join(__dirname, '..')
const SRC_DIR = join(ROOT, 'artworks-src')
const MANIFEST_PATH = join(SRC_DIR, 'manifest.json')
const OUTPUT_PATH = join(ROOT, 'src', 'api', 'artworks.generated.json')

const THUMB_WIDTH = 512
const FULL_WIDTH = 1600

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET = 'deva-artworks',
  CDN_BASE_URL = 'https://cdn.devamon.com.ar',
} = process.env

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.error('Missing required env vars: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY')
  console.error('See .env.example for documentation.')
  process.exit(1)
}

if (!existsSync(SRC_DIR)) {
  console.error(`Source directory not found: ${SRC_DIR}`)
  console.error('Create it and drop your artwork PNGs in there.')
  process.exit(1)
}

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
})

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.tiff'])

function isImage(file) {
  return IMAGE_EXTS.has(parse(file).ext.toLowerCase())
}

function scanImages(dir) {
  const files = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      files.push(...scanImages(full))
    } else if (isImage(entry)) {
      files.push(full)
    }
  }
  return files
}

function loadManifest() {
  if (!existsSync(MANIFEST_PATH)) return {}
  const raw = JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'))
  if (!Array.isArray(raw)) {
    console.warn('  manifest.json should be an array — ignoring')
    return {}
  }
  const map = {}
  for (const entry of raw) {
    if (entry.file) map[entry.file] = entry
  }
  return map
}

function slugify(name) {
  return name
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase()
    .replace(/^-|-$/g, '')
}

async function checkExists(key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key }))
    return true
  } catch {
    return false
  }
}

async function uploadBuffer(key, buffer, contentType) {
  await s3.send(new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  }))
  console.log(`  uploaded → ${key}`)
}

const sourceFiles = scanImages(SRC_DIR)
if (sourceFiles.length === 0) {
  console.log('No image files found in artworks-src/. Nothing to do.')
  const entries = []
  writeFileSync(OUTPUT_PATH, JSON.stringify(entries, null, 2) + '\n', 'utf-8')
  console.log(`Wrote empty manifest: ${OUTPUT_PATH}`)
  process.exit(0)
}

console.log(`Found ${sourceFiles.length} image(s) in ${SRC_DIR}`)

const metaMap = loadManifest()
const outputEntries = []
let uploaded = 0
let skipped = 0

for (const filePath of sourceFiles) {
  const relPath = relative(SRC_DIR, filePath)
  const stem = slugify(parse(relPath).name)
  const meta = metaMap[relPath] || {}
  const title = meta.title || parse(relPath).name
  const tags = meta.tags || []
  const username = meta.username || undefined
  const id = slugify(title)

  const thumbKey = `thumb-${stem}.webp`
  const fullKey = `full-${stem}.webp`
  const thumbUrl = `${CDN_BASE_URL}/${thumbKey}`
  const fullUrl = `${CDN_BASE_URL}/${fullKey}`

  try {
    const thumbExists = await checkExists(thumbKey)
    const fullExists = await checkExists(fullKey)
    if (thumbExists && fullExists) {
      console.log(`  SKIP  ${relPath} — both variants already on R2`)
      skipped++
      outputEntries.push({ id, title, image: fullUrl, thumb: thumbUrl, tags: tags.length ? tags : undefined, username, width: undefined, height: undefined })
      continue
    }
  } catch {
    // proceed to upload
  }

  const srcBuffer = readFileSync(filePath)
  const srcMeta = await sharp(srcBuffer).metadata()
  const width = srcMeta.width ?? undefined
  const height = srcMeta.height ?? undefined

  const [thumbBuffer, fullBuffer] = await Promise.all([
    sharp(srcBuffer)
      .resize(THUMB_WIDTH, null, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer(),
    sharp(srcBuffer)
      .resize(FULL_WIDTH, null, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 90 })
      .toBuffer(),
  ])

  console.log(`  ${relPath} → generating variants (${width}x${height})`)
  await uploadBuffer(thumbKey, thumbBuffer, 'image/webp')
  await uploadBuffer(fullKey, fullBuffer, 'image/webp')
  uploaded++

  outputEntries.push({
    id,
    title,
    image: fullUrl,
    thumb: thumbUrl,
    tags: tags.length ? tags : undefined,
    username,
    width,
    height,
  })
}

writeFileSync(OUTPUT_PATH, JSON.stringify(outputEntries, null, 2) + '\n', 'utf-8')
console.log(`\nDone. Uploaded: ${uploaded}, Skipped: ${skipped}`)
console.log(`Wrote ${outputEntries.length} entries → ${OUTPUT_PATH}`)
