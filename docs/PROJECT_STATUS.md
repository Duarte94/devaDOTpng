# Estado del proyecto y pendientes

> Documento de diagnóstico y roadmap — devaDOTpng (portfolio de **Deva.png**).
> Base de referencia: commit `a0725ca` (origin/main, 2026-10-19).
> Verificación actual: `tsc --noEmit` limpio · `oxlint` 0 warnings · build de producción funcional con datos client-side (mocks siempre activos — ver P0-1).
>
> **Deploy objetivo: Cloudflare Pages (plan free) con Git integration**, dominio propio por definir (placeholder `<dominio>` en este doc). La migración desde GitHub Pages está pendiente (ver P2-6).

---

## 1. Resumen ejecutivo

El frontend está **terminado en cuanto a estructura**: SPA con React 19 + Vite 8, 7 rutas, sistema de diseño glass consistente, animaciones con `framer-motion`, a11y básica (focus trap, Escape, `reducedMotion`), pipeline de imágenes R2 documentado y CI que lintea y buildea sin errores.

Lo que falta es de otra naturaleza:

1. **La estrategia de datos de producción quedó implícita.** Tras los últimos commits los mocks se registran siempre (`setupMock.ts:13`), así que el sitio funciona sin backend pero con datos congelados al commit y `VITE_USE_MOCKS` sin efecto. Falta decidir si ese modelo (fallback client-side) es el definitivo o si se migra a Pages Functions (P0-1).
2. **No hay contenido real**: `src/api/artworks.generated.json` está vacío (`[]`).
3. **Quedan placeholders visibles** en CTAs principales ("MAKE YOUR REQUEST" → `/`, Trello genérico, Patreon genérico, botones sociales muertos).
4. **Deuda de pulido**: sin favicon/OG image, años desactualizados, typos en el ToS, un bug de accesibilidad en `CommissionCard`, assets muertos de ~3 MB y ausencia total de tests.

---

## 2. Lo que ya funciona

- **Routing SPA completo**: `/`, `/gallery`, `/commissions`, `/fanarts`, `/nsfw`, `/terms`, `*` (404) — `src/App.tsx:23-31`.
- **Layout global**: fondo con blobs difuminados (`Background.tsx`), navbar sticky con drawer móvil (`Navbar.tsx`), footer (`Footer.tsx`), contenedor de scroll `#main-scroll`.
- **Galería**: filtros por tag, paginación, lightbox, empty state, animaciones escalonadas (`pages/Gallery.tsx`).
- **Fanarts**: grilla con overlay de usuario (`ArtworkGrid.tsx:61-65`), paginación, lightbox.
- **Estado "under construction"**: overlay reutilizable (`components/ui/UnderConstruction.tsx`) superpuesto a las secciones aún sin contenido real — grid de galería (`pages/Gallery.tsx:76`), waitlist (`pages/Home.tsx:103`), precios, fanarts y tiers.
- **Commissions**: gate de ToS con modal + checkbox, cards expandibles de precios, extras (`pages/Commissions.tsx`).
- **NSFW**: explainer + tiers de Patreon con card destacada (`pages/Nsfw.tsx`).
- **Terms**: contenido estructurado en `content/tos.tsx`, reusable por modal y página.
- **Capa de datos mock**: axios + `axios-mock-adapter` con paginación y filtrado server-like, registrado **incondicionalmente** (`src/api/setupMock.ts:13`) — funciona como fallback estático también en producción.
- **Pipeline de imágenes**: `scripts/upload-artworks.mjs` (sharp → WebP thumb/full → R2 → manifest), documentado en `docs/upload-artworks.md`.
- **CI actual**: GitHub Actions corre lint + build y deploya a GitHub Pages (`.github/workflows/static.yml`, con el fallback `404.html` específico de GH Pages) — **a migrar a Cloudflare Pages** (P2-6). Su `VITE_USE_MOCKS='false'` quedó sin efecto tras el cambio en `setupMock.ts`.
- **Accesibilidad base**: `useFocusTrap`, cierre con Escape en modales/drawer, `aria-modal`, `aria-pressed` en filtros, `focus-visible` cyan global, `MotionConfig reducedMotion="user"`.

---

## 3. Pendientes P0 — Bloqueantes

### P0-1 · Estrategia de datos de producción (fallback client-side vs. Pages Functions)

**Estado actual (importante):** tras los últimos commits, `setupMock.ts:13` crea el `MockAdapter` **sin condicional** y `queries.ts:1` lo importa estáticamente. Resultado: en dev **y en producción** todos los `/api/*` se responden client-side con el manifest committed. Es decir, la opción "fallback estático" ya está implementada de facto: el sitio deployado funciona sin backend, pero con datos congelados al último commit, `axios-mock-adapter` en el bundle de prod, y el flag `VITE_USE_MOCKS` sin efecto (el `VITE_USE_MOCKS='false'` de `.github/workflows/static.yml:43` no hace nada). Si se agregaran Pages Functions sin re-gatear el adapter, nunca se llamarían.

**Decisión pendiente:** ¿se deja el fallback client-side como modelo definitivo, o se migra a Pages Functions?

| Opción | Cómo | Pros | Contras |
|---|---|---|---|
| **A. Dejar como está (fallback estático client-side)** | Cero cambios de código: `setupMock.ts` siempre activo + manifest committed. | Ya funciona en cualquier deploy; precios/tiers/waitlist editables por commit; sin infra; coherente con un portfolio estático. | `axios-mock-adapter` (~KB) en el bundle de prod; sin API real (no habilita waitlist dinámica ni lógica server-side); el proxy `/api` de `vite.config.ts` nunca se usa. |
| **B. Cloudflare Pages Functions** | Crear `functions/api/*` (file-based routing) que sirvan el manifest + datos estáticos compartidos; **re-gatear** `setupMock.ts` a solo-dev (`import.meta.env.DEV`, import dinámico). `public/_routes.json` con `include: ["/api/*"]`. | `/api` real en el free plan (100k req/día); estáticos siguen ilimitados; habilita KV (waitlist dinámica, 1k writes/día) y cualquier lógica server-side futura. | Requiere mover datos/helpers a módulos compartidos, re-gatear el adapter y validar con `wrangler pages dev` o previews. |
| **C. Backend externo real** | Implementar API propia con base de datos fuera de CF. | Máxima flexibilidad (requests, waitlist dinámica, panel admin). | Fuera de alcance: no hay requisitos de usuarios/autenticación ni presupuesto de mantenimiento. Innecesario si B alcanza. |

**Recomendación:** si la waitlist va a seguir editándose por commit, **A es suficiente y ya está hecha** (solo restaría limpiar el flag muerto `VITE_USE_MOCKS` y documentar el modelo). Migrar a **B** cuando haga falta editar la waitlist sin redeploy o exponer endpoints reales; el cliente no cambia (mismo contrato REST).

**Esbozo de B (cuando se decida):**

```txt
functions/
└── api/
    ├── gallery.ts            # paginación + filtro por tags (lógica extraída de setupMock)
    ├── fanarts.ts            # paginación
    ├── waitlist.ts
    ├── commission-status.ts  # opcional (ver P1-1)
    ├── commissions/
    │   ├── prices.ts
    │   └── extras.ts
    └── patreon/
        └── tiers.ts
public/
└── _routes.json              # { "version": 1, "include": ["/api/*"] }
```

1. **Datos compartidos**: mover `pricesMock`, `patreonTiersMock`, `waitlistMock`, `commissionExtrasMock` de `src/api/mockData.ts` a JSON (ej. `src/api/data/prices.json`, etc.). Los importan tanto los mocks de dev (cliente) como las Functions (wrangler los bundlea al deployar). Una sola fuente de verdad.
2. **Helpers compartidos**: extraer el paginado/filtrado de `setupMock.ts:15-47` a un módulo `src/api/paginate.ts` reutilizado por las Functions.
3. **Cliente**: `setupMock.ts` queda dev-only (`if (import.meta.env.DEV) { ... }`) con import dinámico desde `queries.ts`; `VITE_API_URL` sigue siendo `/api` (mismo origen).
4. **`public/_routes.json`**: los requests estáticos quedan fuera de Functions (ilimitados); solo `/api/*` consume la cuota de 100k/día.
5. **Runtime**: en Settings → Runtime, elegir **"Fail open"** para que los assets estáticos se sigan sirviendo si se agota la cuota diaria.
6. **Local**: `pnpm build` → `npx wrangler pages dev dist` para probar las Functions; el día a día sigue con mocks.

- [ ] Decidir con la artista: A (dejar client-side) o B (Pages Functions).
- [ ] Si A: eliminar el flag `VITE_USE_MOCKS` (`.env.example`, `static.yml`, docs) y documentar el modelo "datos por commit" en README/`AGENTS.md`.
- [ ] Si B: crear `functions/api/*`, re-gatear `setupMock.ts` a dev-only, agregar `public/_routes.json` y verificar en un preview deployment.
- [ ] Actualizar `docs/PROJECT_STRUCTURE.md` (sección "Mock vs real backend gating") y `AGENTS.md` con la decisión.

### P0-2 · Manifest de artworks vacío

**Qué pasa:** `src/api/artworks.generated.json` es `[]` → Gallery muestra "No artworks match…" y Fanarts queda vacía incluso en dev, sin importar la estrategia de P0-1. Las Functions propuestas leen este mismo archivo, así que es bloqueante para el contenido. Las secciones sin datos hoy muestran el overlay `UnderConstruction` como parche visual, pero el contenido real sigue pendiente.

**Solución:** correr el pipeline documentado en `docs/upload-artworks.md`:

1. Crear `artworks-src/` y volcar PNGs crudos (+ `manifest.json` con títulos/tags/usernames).
2. Completar `.env` con credenciales R2.
3. `pnpm upload-artworks` → commitear `artworks.generated.json`.

**Mitigación temporal (mientras no haya artwork):** agregar `src/api/artworks.demo.json` con 4–6 entradas apuntando a los assets bundled (`hero-1024.png`, `Ani-Elfa.webp`, etc.) para que dev y preview muestren la UI poblada. Consumirlo desde `mockData.ts` solo si `artworks.generated.json` está vacío.

- [ ] Subir artworks reales y commitear manifest.
- [ ] (Opcional) seed de demo para previsualización sin R2.

### P0-3 · Setup en dev y flag `VITE_USE_MOCKS` muerto

**Estado:** el problema original (mocks inertes sin `.env`) quedó resuelto de facto al quitar el gate en `setupMock.ts:13`: `pnpm dev` funciona recién clonado el repo, sin `.env`. Efecto colateral: la variable `VITE_USE_MOCKS` ya no tiene efecto en ningún entorno (el `VITE_USE_MOCKS='false'` de `static.yml:43` es decorativo).

**Solución:** decidir el destino del flag según P0-1:

- Si se vuelve a gatear el adapter (opción B de P0-1, Pages Functions): usar `import.meta.env.DEV` a secas (sin flag) para evitar la ambigüedad.
- Si se deja el fallback siempre-activo (opción A): eliminar `VITE_USE_MOCKS` de `.env.example`, del workflow y de los docs.

Además: agregar al `README.md` la sección de setup (`pnpm install` → `pnpm dev`) y linkear `docs/PROJECT_STATUS.md`.

- [ ] Resolver el flag (eliminar o re-gatear) según la decisión de P0-1.
- [ ] Documentar setup en README.

### P0-4 · Placeholders y enlaces muertos

| Archivo:línea | Actual | Debería ser |
|---|---|---|
| `src/pages/Commissions.tsx:47-54` | Botón "MAKE YOUR REQUEST" → `to="/"` | Formulario real (Google Forms/Tally) o DM de Discord; idealmente una ruta `/request` propia más adelante |
| `src/pages/Commissions.tsx:55` | `href="https://trello.com"` | URL del tablero real de la artista |
| `src/pages/Home.tsx:92` | `href="https://patreon.com"` | `https://patreon.com/deva.png` (como ya hacen `Nsfw.tsx:68` y `Footer.tsx:15`) |
| `src/components/Navbar.tsx:84-92` | Botones Discord/Instagram/X sin `href` | Links reales de la artista |
| `src/components/Navbar.tsx:157-165` | Mismos botones en drawer móvil, sin `href` | Links reales (ya no tienen `tabIndex={-1}`/`aria-hidden` — corregido en los últimos commits) |

**Solución estructural:** centralizar en `src/constants/links.ts`:

```ts
export const LINKS = {
  patreon: 'https://patreon.com/deva.png',
  trello: 'https://trello.com/b/XXXX/deva-commissions',
  discord: 'https://discord.gg/XXXX',
  instagram: 'https://instagram.com/deva.png',
  twitter: 'https://x.com/deva_png',
  requestForm: 'https://forms.gle/XXXX',
} as const
```

y consumirlo desde `Navbar`, `Footer`, `Home`, `Commissions`, `Nsfw`. Los botones sociales deberían ser `<a>` (o `Button href`) con `target="_blank" rel="noopener noreferrer"`.

- [ ] Pedir a la artista las URLs reales (Discord, IG, X, Trello, form de request).
- [ ] Crear `constants/links.ts` y reemplazar los 6 puntos.

---

## 4. Pendientes P1 — Funcional, SEO y accesibilidad

### P1-1 · Estado de comisión y waitlist hardcodeados

`Home.tsx:68-70` muestra "Commission status: OPEN" fijo y `mockData.ts:59-63` devuelve `Anon1..Anon5`. La waitlist real no tiene fuente.

**Solución progresiva:**
1. Mover el status a datos: agregar `status: 'open' | 'closed' | 'waitlist'` a `WaitlistResponse` (o endpoint `/commission-status`) y renderizar según eso.
2. Con Pages Functions (P0-1), exponerlo en `functions/api/waitlist.ts` para cerrar comisiones con un commit (o fila en KV).
3. **Waitlist dinámica (opcional)**: Workers KV en el free plan (100k reads y 1.000 writes por día) permite editar las entries sin redeploy (desde el dashboard o una Function admin protegida por token). Migrar solo si la artista lo necesita.

- [ ] Agregar `status` a la respuesta y condicionar CTA en Home (si está cerrado, el botón "Request now" debería deshabilitarse o cambiar a "Join waitlist").
- [ ] (Opcional) Waitlist dinámica con KV.

### P1-2 · SEO / social / favicon

- No existe `public/` → **sin favicon** (la pestaña muestra el ícono por defecto) ni `apple-touch-icon`.
- `index.html:8-12`: falta `og:image` (los links compartidos en Discord/Twitter no muestran preview), `og:url` apunta a `https://deva.png` (dominio incorrecto), falta `<link rel="canonical">`, `theme-color`, `twitter:image`.
- `title`/descripción dicen "DevaDOTpng", mientras la marca es "Deva.png".
- Sin `robots.txt` ni `sitemap.xml`.

**Solución:**

1. Crear `public/` con: `favicon.svg` (logo `devasign.svg` adaptado a 32×32), `apple-touch-icon.png` (180×180), `og-image.png` (1200×630, arte + nombre), `site.webmanifest`.
2. Completar `index.html` (reemplazar `<dominio>` por el dominio propio):

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<meta name="theme-color" content="#000000" />
<link rel="canonical" href="https://<dominio>/" />
<meta property="og:url" content="https://<dominio>/" />
<meta property="og:image" content="https://<dominio>/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:image" content="https://<dominio>/og-image.png" />
```

3. `public/robots.txt` + `public/sitemap.xml` con las 6 rutas estáticas (URLs sobre `<dominio>`).
4. Configurar el dominio propio en Cloudflare Pages (P2-6) y ajustar `CDN_BASE_URL` de R2 para que sea subdominio del mismo dominio (ej. `https://cdn.<dominio>`) — así los manifests futuros quedan consistentes.

- [ ] Definir dominio definitivo y reemplazar `<dominio>`.
- [ ] Crear `public/` (favicon, apple-touch, OG, manifest, robots, sitemap) y actualizar `index.html`.

### P1-3 · Bug de accesibilidad en `CommissionCard`

`CommissionCard.tsx:17` genera `id={"commission-toggle-" + title}` y `:38` lo referencia en `aria-labelledby`. Para `title = "Half body"` el id contiene espacios (**inválido** en HTML) y `aria-labelledby` se parte por tokens → la región expandible queda sin nombre accesible.

**Fix:**

```ts
const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const panelId = `commission-toggle-${slug}`
```

(usar en `id` y `aria-labelledby`). Idealmente reutilizar el mismo `slugify` del script de uploads, exportado a un util compartido `src/lib/slug.ts`.

- [ ] Corregir IDs y verificar con un screen reader/DevTools que la región se anuncie con el título.

### P1-4 · Años desactualizados y typos en el ToS

- `Footer.tsx:26` dice "© 2025" — hoy es 2026. Usar `new Date().getFullYear()`.
- `Terms.tsx:24` "Last updated: 2025" — actualizar a la fecha real de última edición del ToS.
- `src/content/tos.tsx` — typos a corregir:

| Línea | Actual | Corrección |
|---|---|---|
| 17 | "These artwork are created" | "These artworks are created" |
| 17 | "for finnancial gain" | "for financial gain" |
| 18 | "sell it events" | "sell it at events" |
| 20 | "for an specific date" | "for a specific date" |
| 28 | "delivered ffirst" | "delivered first" |
| 30 | "toavoid" | "to avoid" |

- [ ] Aplicar las correcciones de arriba.

### P1-5 · Estados de UI incompletos

- **Fanarts sin empty state** (`Fanarts.tsx:61-74`): con 0 items cae en el mismo branch que con datos (overlay `UnderConstruction` + grilla vacía). Agregar el mensaje de vacío como en `Gallery.tsx:66-73`.
- **Errores crudos**: se muestra el mensaje de axios tal cual ("Request failed with status code 500") en `Gallery.tsx:65`, `Fanarts.tsx:64`, `Commissions.tsx:75`, `Nsfw.tsx:45`, sin acción de reintento. Solución: normalizar en `useQuery` (mensaje amigable + `retry()` expuesto) y renderizar un botón "Retry".
- **Loading**: todos los estados son `Loading...` de texto plano. Opcional: skeletons con shimmer reutilizando la grilla (`animate-pulse`).
- **Lightbox limitado** (`Lightbox.tsx`): sin caption/título/usuario, sin navegación entre artworks (flechas ←/→), sin bloqueo de scroll del contenedor `#main-scroll` mientras está abierto. Con teclado ya se cierra con Escape.
- **`useQuery` no cancela la request real** (`useQuery.ts:17-34`): solo ignora la respuesta (`cancelled`), pero la petición sigue viva. Pasar `signal` de Axios desde los fetchers para abortar de verdad.

- [ ] Empty state de Fanarts.
- [ ] Error state con retry + normalización de mensajes.
- [ ] (Opcional) Skeletons.
- [ ] Lightbox: caption, prev/next, scroll lock.
- [ ] `useQuery` con `AbortController`.

### P1-6 · Persistencia de la aceptación del ToS

`Commissions.tsx:13` guarda `accepted` en estado local → al navegar o refrescar se pierde y hay que re-aceptar. Persistir en `sessionStorage` (o `localStorage` con fecha de aceptación, ej. válida por sesión) y precargar el estado.

- [ ] Persistir aceptación (con clave versionada, ej. `tos-accepted-v2026-01`).

---

## 5. Pendientes P2 — Pulido técnico

### P2-1 · Assets muertos y variantes faltantes

- `src/assets/Ani-Elfa.png` pesa **3.0 MB** y no se referencia en ningún lado (solo se usa `Ani-Elfa.webp`, `Commissions.tsx:10`). Eliminarlo del repo.
- `src/assets/hero-512.webp` (73 KB) existe pero el `<picture>` del Hero no lo usa: el fallback es `hero-512.png` (650 KB). Agregar `<source type="image/webp" srcSet={hero512Webp} />` antes del `<img>` (o eliminar el webp huérfano).
- Los PNG de hero (512/768/1024/1920) suman ~4.2 MB en el repo; podar el de 1920 si el webp ya cubre el caso, o mantener, pero señalizado.

- [ ] Borrar `Ani-Elfa.png` y `hero-512.webp` o darle uso.

### P2-2 · `axios-mock-adapter` en dependencies y activo en prod

- Está en `dependencies` (`package.json:16`), se importa estáticamente vía `queries.ts:1` y **hoy se registra siempre** (`setupMock.ts:13`), así que corre en producción. Si se elige la opción B de P0-1 (Pages Functions), debe pasar a **solo-dev** con import dinámico:

```ts
// src/api/queries.ts — solo en dev, code-splitteado por Vite
if (import.meta.env.DEV) {
  await import('./setupMock')
}
```
(requiere envolver en una `initPromise` para que las queries esperen la registración). Si se elige la opción A (dejarlo siempre activo), moverlo a `devDependencies` no aplica (se bundlea a propósito); sí conviene documentarlo como decisión.

- Detalle cosmético: al quitar el gate quedó indentación residual en `setupMock.ts:15-54` (una sangría extra de 2 espacios).

- [ ] Según decisión de P0-1: re-gatear a dev-only (B) o documentar el fallback permanente (A).

### P2-3 · Higiene de dependencias

- **`pnpm-lock.yaml` fue eliminado del repo** (commit `26d8cdc`, junto con cambios de Navbar — probablemente accidental). Sin lockfile los installs no son reproducibles y `pnpm install --frozen-lockfile` (workflow viejo) falla. Regenerar con `pnpm install` y commitearlo; si la eliminación fue intencional (cambio de package manager), actualizar `packageManager` en `package.json` y esta sección.
- `package-lock.json` sin trackear en la raíz (residuo de `npm install`): el proyecto declara pnpm (`packageManager: pnpm@9.15.9` en `package.json:6`). Borrarlo y/o agregarlo a `.gitignore`.
- En esta máquina no hay `pnpm` en el PATH ni `npx` habilitado (execution policy): para verificación local usar `& node_modules\.bin\oxlint.cmd` y `node node_modules\typescript\bin\tsc --noEmit -p tsconfig.app.json`.
- Declarar `engines` en `package.json` (Node 22, pnpm 9) para consistencia con el build de Cloudflare Pages y el pipeline R2.

- [ ] Regenerar y commitear `pnpm-lock.yaml`.
- [ ] Eliminar `package-lock.json`, considerar `.gitignore`, declarar `engines`.

### P2-4 · Sin tests

No hay ningún test ni framework configurado; el CI solo corre lint + build. Mínimo viable:

- **Vitest + Testing Library** para: `useQuery` (loading/error/cancel), `FilterBar` (toggle/`aria-pressed`), `Pagination` (límites), `Button` (variantes `to`/`href`/`disabled`), helper `slug` del P1-3, y las Functions de P0-1 (input/output del contrato REST).
- **Playwright** smoke E2E: cada ruta renderiza sin crash, filtro de galería reduce resultados, click en tile abre lightbox y Escape lo cierra, el gate de ToS deshabilita el CTA hasta aceptar.
- Integrar `pnpm test` / `pnpm test:e2e` en el pipeline (GitHub Actions como CI de PRs, aunque el deploy lo haga Cloudflare Pages).

- [ ] Setup Vitest + primeros tests unitarios.
- [ ] Smoke E2E + integración en CI.

### P2-5 · Fuentes e iconos por CDN

`index.html:13-16` carga REM (Google Fonts) y Font Awesome 6.5.2 (cdnjs). Implicancias: dependencia externa en runtime, flash de iconos sin cargar, y requests a terceros. Opcional: self-hostear las fuentes variables (`woff2`) y el set reducido de FA (solo los ~10 iconos usados) o migrar a iconos SVG inline.

- [ ] (Opcional) Self-host de fuentes + subset de iconos.

### P2-6 · Migración de GitHub Pages a Cloudflare Pages

**Situación:** el repo todavía tiene `.github/workflows/static.yml`, que buildea y deploya a GitHub Pages (incluye un paso `cp dist/index.html dist/404.html` específico de GH Pages). El target decidido es **Cloudflare Pages free con Git integration**.

**Checklist de migración:**

1. **Desconectar/limpiar GitHub Pages**: eliminar `.github/workflows/static.yml` (o reducirlo a lint + build + tests como CI de PRs, sin deploy). Si se elimina, el lint pasa al build command de Pages.
2. **Crear el proyecto en Cloudflare Pages → "Connect to Git"** apuntando a este repo:
   - Build command: `pnpm lint && pnpm build` (o solo `pnpm build` si se conserva CI en GH).
   - Build output directory: `dist`.
   - Build variables (la build image v3 **no** detecta la versión de pnpm desde `pnpm-lock.yaml` ni desde `packageManager`; además hoy no hay lockfile — ver P2-3):
     - `PNPM_VERSION=9.15.9`
     - `NODE_VERSION=22`
   - `VITE_USE_MOCKS` ya no tiene efecto (P0-1/P0-3): eliminarlo del proyecto o re-gatear los mocks a dev-only si se eligen Pages Functions.
3. **SPA routing**: **no** crear `404.html`. En Cloudflare Pages, si no existe un `404.html` de nivel superior, el comportamiento por defecto es SPA: sirve `/index.html` para cualquier ruta sin asset, que es lo que necesita `BrowserRouter`. (El paso `cp` del workflow viejo queda obsoleto y no debe replicarse.)
4. **Functions** (P0-1): `functions/api/*` + `public/_routes.json` con `include: ["/api/*"]` → los estáticos no invocan Functions (ilimitados) y solo `/api/*` consume las 100k requests/día del free plan. En Settings → Runtime, elegir **"Fail open"**.
5. **Dominio propio**: agregarlo desde el dashboard de Pages (Custom domains). No se usa archivo `CNAME` en el repo (eso era de GH Pages). Confirmar que los DNS del dominio estén en Cloudflare (ya lo están para R2/CDN). `base: '/'` de `vite.config.ts:7` es correcto para dominio propio (no aplica el caso `usuario.github.io/repo`).
6. **Previews**: cada branch/PR genera un preview deployment automático (útil para validar Functions y cambios de UI antes de mergear a `main`).
7. **Redirects**: `_redirects` no aplica a rutas servidas por Functions; con el SPA default de Pages no se necesita archivo `_redirects` para el fallback.
8. **Docs**: actualizar `docs/PROJECT_STRUCTURE.md`, `AGENTS.md` y `README.md` cuando la migración esté hecha (mientras tanto, este doc es la referencia).

- [ ] Crear proyecto en Cloudflare Pages con Git integration (build vars `PNPM_VERSION`/`NODE_VERSION`).
- [ ] Eliminar o reconvertir `.github/workflows/static.yml`.
- [ ] Configurar dominio propio en el dashboard.
- [ ] Validar en preview: rutas SPA directas (deep links), `/api/*` con Functions, y el build sin `VITE_USE_MOCKS`.

### P2-7 · Otras observaciones menores

- `Home.tsx:113-122`: las entries de la waitlist se keyean por nombre → nombres duplicados rompen React keys. Usar índice o agregar `id` al tipo.
- `containerRef as any` en `Navbar.tsx:111`, `ToSModal.tsx:78`, `Lightbox.tsx:31`: tipar `useFocusTrap` con genérico (`useFocusTrap<T extends HTMLElement>`) para eliminar los casts.
- `/nsfw` muestra contenido +18 sin confirmación de edad. Considerar un gate informativo (modal "Are you 18+?" persistido en sesión) — decisión de la artista, no blocker técnico.
- Global `uppercase tracking-wide leading-none` (`App.tsx:18`) afecta párrafos largos (ToS incluido). Si se busca legibilidad, aplicar `normal-case leading-snug` a bloques de texto largo.
- `index.css:21-28`: los resets globales `a { color: white }` / `p { color: white }` son muy amplios; funcionan hoy, pero generan sorpresas al sumar contenido. Migrar a clases cuando se toque esa zona.
- StrictMode + mock `delayResponse: 400` producen doble fetch visible en dev (petición descartada por el flag `cancelled`). Cosmético; se resuelve de raíz con el `AbortController` de P1-5.

---

## 6. Roadmap sugerido

### Iteración 1 — Deploy real en Cloudflare Pages (1–2 sesiones)
1. P0-1: decidir A/B. Si B, implementar Pages Functions (`functions/api/*` + datos/helpers compartidos + `public/_routes.json`); si A, documentar el modelo client-side.
2. P2-6: crear el proyecto de CF Pages (Git integration), build vars `PNPM_VERSION=9.15.9` / `NODE_VERSION=22`, retirar el workflow de GH Pages y configurar dominio.
3. P0-3: limpiar el flag `VITE_USE_MOCKS` según la decisión + setup en README.
4. P0-4: crear `constants/links.ts` (puede quedar con URLs pendientes marcadas) y arreglar el Patreon genérico de Home.
5. P0-2 (mitigación): seed de demo si aún no hay artwork.

**Criterio de salida:** el sitio en `<dominio>` (o `pages.dev` provisional) muestra galería, precios, tiers y waitlist sin errores, con deep links funcionando.

### Iteración 2 — Contenido y cara pública (1–2 sesiones)
1. P0-2: subir artworks reales a R2 y commitear el manifest.
2. P1-2: `public/` completo (favicon, OG, robots, sitemap) + meta del `index.html` con el dominio real.
3. P1-4: años dinámicos + typos del ToS.
4. P1-1: status de comisión data-driven.

**Criterio de salida:** compartir un link en Discord muestra preview con imagen; la pestaña tiene favicon; el ToS está limpio.

### Iteración 3 — Calidad (1–2 sesiones)
1. P1-3 (a11y `CommissionCard`), P1-5 (empty/error/retry/lightbox), P1-6 (persistencia ToS).
2. P2-1 (assets muertos), P2-2/P2-3 (higiene de deps).
3. P2-4: Vitest + Playwright smoke en CI (GitHub Actions como CI de PRs).

**Criterio de salida:** CI con tests verde; sin errores/warnings de a11y en las rutas principales.

---

## 7. Comandos útiles

| Acción | Comando |
|---|---|
| Dev server | `pnpm dev` (mocks siempre activos — ver P0-1/P0-3) |
| Typecheck | `node node_modules\typescript\bin\tsc --noEmit -p tsconfig.app.json` (o `pnpm build`) |
| Lint | `pnpm lint` (o `& node_modules\.bin\oxlint.cmd`) |
| Preview build | `pnpm build; pnpm preview` |
| Probar Functions localmente | `pnpm build` y luego `npx wrangler pages dev dist` |
| Subir artwork | `pnpm upload-artworks` (ver `docs/upload-artworks.md`) |

> Notas:
> - En Cloudflare Pages, pinear `PNPM_VERSION=9.15.9` y `NODE_VERSION=22` como build variables (la build image v3 no los detecta del repo).
> - En esta máquina Windows: `pnpm` no está en el PATH del shell activo y `npx` está bloqueado por execution policy; usar las variantes con `node_modules` o instalar/activar pnpm.
