# PROJECT BRIEF P7 — KESIMPULAN PERENCANAAN

**Website Storefront SaaS — Headless Commerce Scalev**

## 1. Tujuan MVP & Metrik Sukses

**Goal:** Merchant Scalev bisa daftar → pilih template → kustomisasi → punya storefront live di subdomain, end-to-end, < 10 menit, tanpa coding.

| Metrik | Target MVP |
|--------|-----------|
| Time-to-deploy storefront | < 10 menit dari daftar sampai live |
| Template aktif | >= 3 template responsif |
| Multi-tenant | 2 merchant + 2 subdomain aktif bersamaan |
| Checkout end-to-end | Order tercatat di Scalev (status sukses) |
| Data produk | Real-time dari Scalev API (bukan dummy) |

## 2. Scope

### Must-have (MVP — wajib)
- Auth merchant via Scalev Identity API (`GET /v3/me`)
- Builder dashboard: pilih template, edit branding (logo, warna, font, banner), preview live
- Library 3 template responsif (minimalist, bold, fashion)
- Halaman default: home, list produk, detail produk, kategori, cart, checkout, about, contact
- Konsumsi produk & varian dari Scalev API
- Cart & checkout headless via Scalev
- Subdomain otomatis + SSL per merchant
- Multi-tenant routing via host header

### Should-have (kalau waktu sisa)
- Manajemen asset upload (S3/MinIO)
- Dashboard admin platform (kelola template/tenant)
- Dokumentasi onboarding merchant

### Nice-to-have (DEFER — di luar MVP)
- Custom domain (CNAME + SSL otomatis)
- Theme editor drag-and-drop
- Marketplace template pihak ketiga
- A/B testing, SEO tools, multi-bahasa/multi-currency

## 3. Milestone & Timeline (8 minggu)

| Minggu | Fase | Output utama | Definition of Done |
|--------|------|--------------|--------------------|
| 1 | Riset API Scalev | Eksplor docs, validasi semua endpoint, sandbox account | Semua struktur response divalidasi manual |
| 2 | Desain Sistem | Arsitektur multi-tenant, ERD, model theme (JSON), wireframe | Diagram + skema DB disetujui mentor |
| 3 | Auth & Tenant | Login merchant via Scalev, buat tenant, subdomain dummy | 1 merchant login + tenant terbuat |
| 4 | Theme Engine | Sistem template + config JSON + 1 template referensi | Template render dari config |
| 5 | Template 2 & 3 | 2 template variatif, halaman produk & checkout aktif | 3 template live + produk real |
| 6 | Builder Dashboard | Editor branding + preview live | Edit logo/warna/font/banner → preview |
| 7 | Domain Otomatis | Integrasi Cloudflare subdomain + SSL, deploy multi-tenant | 2 subdomain aktif + SSL |
| 8 | QA & Demo | Test 1 merchant penuh, polish, dokumentasi, demo | Kriteria sukses MVP tercapai |

## 4. Top 3 Risiko & Mitigasi

| # | Risiko | Dampak | Mitigasi |
|---|--------|--------|----------|
| 1 | Scalev API tak sesuai asumsi (checkout headless vs redirect, rate limit, struktur data) | Blocker fatal Minggu 5-8 | Validasi MANUAL semua endpoint Minggu 1. Jangan biarkan agent menebak struktur. Konfirmasi sandbox + mode checkout ke mentor. |
| 2 | Multi-tenant routing bocor (data tenant tercampur) | Keamanan + demo gagal | Uji minimal 2 tenant simulasi tiap fase. Isolasi by host header sejak Minggu 3. |
| 3 | Subdomain + SSL otomatis (Cloudflare) telat | Storefront tak live | Spike Cloudflare API Minggu 1-2, fallback subdomain manual kalau mepet. |

## 5. Tech Stack (Revisi — Monorepo/Single Next.js)

**Keputusan:** SINGLE Next.js app (root, tanpa `src/`), App Router + Turbopack. Backend = Route Handlers (`app/api/*`), bukan NestJS terpisah. Satu deploy target Vercel agar MVP 40 hari kekejar.

| Layer | Stack |
|-------|-------|
| Storefront | Next.js App Router, multi-tenant middleware (host header), ISR |
| Builder dashboard | Next.js + Tailwind + shadcn/ui |
| Backend | Next.js Route Handlers (`app/api/*`) |
| ORM/DB | Prisma + PostgreSQL (data platform: tenant, theme config) |
| API client | Scalev client (`lib/scalev`) + validasi Zod |
| Hosting | Vercel (frontend + API serverless) |
| DNS/SSL | Cloudflare API (subdomain otomatis) |
| Storage | S3/MinIO (asset merchant) |

**Trade-off:** Route Handlers serverless = stateless. Provisioning subdomain (long-running) → background job / Vercel Cron. Cold start → mitigasi caching + ISR.

## 6. Endpoint Scalev yang Dibutuhkan (MVP)

Scalev punya 2 grup: `/v3/business/*` (konteks merchant terautentikasi → builder/backend) vs `/v3/storefront/*` (publik/guest → storefront end-consumer).

### A. Auth merchant
| Method | Path | Guna |
|--------|------|------|
| GET | `/v3/me` | Auth merchant, identity + connected_businesses → dasar tenant |

### B. Data toko & produk
| Method | Path | Guna |
|--------|------|------|
| GET | `/v3/business/stores` | List store merchant |
| GET | `/v3/business/stores/{id}` | Detail store |
| GET | `/v3/storefront/items` | Produk + bundle visible (sumber utama list produk) |
| GET | `/v3/business/products` | List produk (builder/admin) |
| GET | `/v3/business/products/{id}` | Detail produk |
| GET | `/v3/business/products/{id}/variants` | Varian per produk |
| GET | `/v3/business/variants/{id}` | Detail 1 varian |
| GET | `/v3/storefront/categories` | Kategori produk visible (nav) |
| GET | `/v3/business/product-taxonomies` | Taxonomy/kategori (builder) |

### C. Cart (storefront, guest)
| Method | Path | Guna |
|--------|------|------|
| POST | `/v3/storefront/cart/items` | Add item ke cart |
| GET | `/v3/storefront/cart` | Lihat isi cart |
| PATCH | `/v3/storefront/cart/items/{id}` | Update qty |
| DELETE | `/v3/storefront/cart/items/{id}` | Hapus item |

### D. Checkout (storefront, guest)
| Method | Path | Guna |
|--------|------|------|
| GET | `/v3/storefront/checkout/shipping-options` | Opsi kirim |
| POST | `/v3/storefront/checkout/summary` | Recompute ongkir + total |
| GET | `/v3/storefront/checkout/payment-methods` | Metode bayar |
| POST | `/v3/storefront/checkout/orders` | Buat order dari item |
| POST | `/v3/discounts/validate` | Validasi kode diskon |

### E. Order & Payment
| Method | Path | Guna |
|--------|------|------|
| POST | `/v3/storefront/orders/{id}/payments` | Buat payment untuk order |
| GET | `/v3/storefront/orders/{id}` | Status order publik (konfirmasi sukses) |
| GET | `/v3/business/orders` | List order (dashboard) |
| GET | `/v3/business/orders/{id}` | Detail order (dashboard) |

**WAJIB divalidasi manual Minggu 1 (jangan ditebak):** auth header `/v3/storefront/*` per-tenant; checkout full headless vs redirect; payment flow (redirect URL/gateway?); rate limit; struktur response `storefront/items`; ada sandbox/demo store?

## 7. Struktur Folder Next.js (root, tanpa src/)

Single app, feature-based. Multi-tenant via middleware host header: `app.platform.com` → builder; `*.platform.com` → storefront.

```
storefront-saas/
|-- app/                        # ROUTING ONLY - App Router
|   |-- (builder)/              # group: dashboard merchant (app.platform.com)
|   |   |-- layout.tsx
|   |   |-- login/page.tsx      # auth via Scalev /v3/me
|   |   |-- dashboard/page.tsx
|   |   |-- templates/page.tsx  # pilih template
|   |   `-- customize/page.tsx  # editor branding + preview live
|   |-- (storefront)/           # group: storefront publik (*.platform.com)
|   |   |-- layout.tsx          # inject theme config per-tenant
|   |   |-- page.tsx            # home
|   |   |-- products/
|   |   |   |-- page.tsx        # list produk
|   |   |   `-- [slug]/page.tsx # detail produk
|   |   |-- categories/[slug]/page.tsx
|   |   |-- cart/page.tsx
|   |   |-- checkout/page.tsx
|   |   |-- orders/[id]/page.tsx # status order
|   |   |-- about/page.tsx
|   |   `-- contact/page.tsx
|   |-- api/                    # BACKEND - Route Handlers
|   |   |-- auth/scalev/route.ts   # session merchant
|   |   |-- tenants/route.ts       # CRUD tenant + provisioning subdomain
|   |   |-- tenants/[id]/route.ts
|   |   |-- themes/route.ts        # simpan/ambil config theme
|   |   |-- upload/route.ts        # presign S3/MinIO
|   |   `-- webhooks/scalev/route.ts # order/payment callback (jika ada)
|   |-- layout.tsx              # root layout
|   `-- globals.css
|-- features/                   # LOGIC per-domain
|   |-- auth/ (components/, actions.ts, types.ts)
|   |-- builder/ (BrandingForm, LivePreview, TemplatePicker)
|   |-- storefront/ (ProductCard, CartDrawer, CheckoutForm)
|   `-- tenant/ (resolve-tenant.ts, types.ts)
|-- themes/                     # THEME ENGINE - 3 template
|   |-- engine/
|   |   |-- theme-provider.tsx  # inject config (warna, font, logo)
|   |   |-- schema.ts           # Zod schema config theme (JSON)
|   |   `-- registry.ts         # map nama template -> komponen
|   |-- minimalist/ (index.tsx, sections/, theme.config.ts)
|   |-- bold/ (struktur sama)
|   `-- fashion/ (struktur sama)
|-- components/
|   `-- ui/                     # shadcn/ui - shared, minimalist
|-- lib/
|   |-- scalev/                 # SCALEV API CLIENT
|   |   |-- client.ts           # fetch wrapper + auth + base URL
|   |   |-- endpoints/          # identity, storefront, cart, checkout, orders
|   |   `-- schemas.ts          # Zod schema response (VALIDASI WAJIB)
|   |-- db/ (prisma.ts, schema.prisma)
|   |-- cloudflare/ (dns.ts - subdomain + SSL)
|   |-- storage/ (s3.ts - presign upload)
|   `-- utils.ts                # cn(), formatter
|-- server/
|   `-- services/ (tenant.service.ts, theme.service.ts)
|-- types/ (index.ts - tipe global)
|-- middleware.ts               # MULTI-TENANT routing by host header
|-- prisma/                     # migrations
|-- public/
|-- next.config.ts              # Turbopack
|-- tailwind.config.ts
|-- components.json             # shadcn
|-- .env.example
`-- package.json
```

### Penjelasan Folder Kunci
- **`app/`** — cuma routing/layout/page. Dua route group `(builder)` & `(storefront)` dipisah middleware berdasar host.
- **`features/`** — otak per-domain (komponen + Server Actions + types). `use client` ditahan serendah mungkin.
- **`themes/`** — engine + 3 template self-contained. Tambah template = tambah folder + daftar di `registry.ts`.
- **`lib/scalev/`** — satu-satunya pintu ke Scalev. `schemas.ts` Zod wajib validasi tiap response.
- **`lib/db` + `server/services`** — Prisma simpan data platform (tenant, theme), bukan data commerce. Pengganti modul NestJS.
- **`middleware.ts`** — baca host header → resolusi tenant → rewrite ke group yang benar.

### Aturan Implementasi (strict)
1. Akses Scalev HANYA via `lib/scalev/`. Tidak ada fetch langsung di komponen/page. Semua lolos Zod dulu.
2. Server Component default; `use client` cuma di `features/*/components` yang butuh state/interaksi. Data-fetch di server (ISR untuk storefront).
3. Data commerce (produk/order) tidak masuk Prisma — selalu live dari Scalev. Prisma cuma Tenant, ThemeConfig, MerchantSession.
4. Tambah template = folder baru di `themes/` + entri `registry.ts`. Dilarang hardcode nama template di luar registry.

## 8. Next Actions (Minggu 1)

| Aksi | Owner | Deadline |
|------|-------|----------|
| Minta akun sandbox Scalev + akses docs API | Peserta | Minggu 1, hari 1 |
| Validasi manual endpoint: identity, produk, order, checkout | Peserta | Minggu 1 |
| Tanya mentor: checkout headless/redirect? rate limit? pricing/billing? | Peserta | Minggu 1 |
| Spike Cloudflare API (subdomain + SSL) | Peserta | Minggu 1-2 |
| Setup repo + skeleton single-app Next.js (struktur di atas) | Peserta | Minggu 2 |
