# Storefront

Platform storefront builder multi-tenant: merchant membuat toko online lewat dashboard builder (drag & drop, tema, produk), lalu toko tayang di subdomain sendiri (`toko-a.domain.com`).

## Tech Stack

| Layer      | Teknologi                                          |
| ---------- | -------------------------------------------------- |
| Framework  | Next.js 16 (App Router, Turbopack), React 19       |
| Database   | PostgreSQL + Prisma                                |
| Auth       | NextAuth v5 (Google OAuth) untuk merchant; session cookie JWE (jose) untuk customer |
| Storage    | MinIO / S3-compatible (asset merchant)             |
| Payments   | Stripe (marketplace template + checkout)           |
| Styling    | Tailwind CSS v4, Radix UI, Framer Motion           |

## Prasyarat

- Node.js 20+
- Docker (untuk Postgres + MinIO lokal)
- Akun Google Cloud (OAuth credentials) & Stripe (test mode)

## Setup Lokal

```bash
# 1. Install dependencies
npm install

# 2. Jalankan Postgres + MinIO
docker compose up -d

# 3. Konfigurasi environment
cp .env.example .env
# Isi nilai yang kosong — lihat komentar di .env.example untuk cara dapat tiap nilai

# 4. Setup database
npm run db:migrate   # jalankan migrasi + generate Prisma client
npm run db:seed      # (opsional) seed data awal
npm run db:seed-products  # (opsional) seed produk contoh

# 5. Jalankan dev server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) untuk dashboard builder. Storefront tenant diakses via subdomain, mis. `http://toko-a.localhost:3000`.

> **Catatan MinIO:** setelah container jalan pertama kali, buat bucket `storefront-assets` lewat console [http://localhost:9001](http://localhost:9001) (login `minioadmin` / `minioadmin123`) dan set access-nya public read.

> **Catatan Stripe webhook (lokal):** jalankan `stripe listen --forward-to localhost:3000/api/webhooks/stripe`, lalu copy nilai `whsec_...` ke `STRIPE_WEBHOOK_SECRET`.

## Environment Variables

Semua variabel didokumentasikan di [.env.example](.env.example). Ringkasan:

| Variabel | Wajib | Fungsi |
| --- | --- | --- |
| `NEXT_PUBLIC_ROOT_DOMAIN` | ✅ | Root domain (tanpa protokol) untuk routing subdomain tenant |
| `NEXT_PUBLIC_APP_URL` | ✅ | Base URL app (dengan protokol), dipakai redirect Stripe |
| `DATABASE_URL` | ✅ | Koneksi PostgreSQL untuk Prisma |
| `AUTH_SECRET` | ✅ | Secret NextAuth (`openssl rand -base64 32`) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | ✅ | Google OAuth untuk login merchant |
| `ADMIN_EMAILS` | ✅ | Email yang dapat role ADMIN (comma-separated) |
| `SESSION_SECRET` | ✅ | Enkripsi cookie session customer (min 32 char) |
| `S3_*` (6 variabel) | ✅ | Endpoint, kredensial, bucket, dan URL publik MinIO/S3 |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | ✅ | Stripe API + verifikasi webhook |
| `REMOVE_BG_API_KEY` | ⬜ | remove.bg — fitur hapus background di builder (opsional) |

## Scripts

| Command | Fungsi |
| --- | --- |
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build (termasuk `prisma generate`) |
| `npm run start` | Jalankan hasil build |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Prisma migrate dev |
| `npm run db:push` | Push schema tanpa migrasi (prototyping) |
| `npm run db:studio` | Prisma Studio (GUI database) |
| `npm run db:seed` | Seed data awal |
| `npm run db:seed-products` | Seed produk contoh |

## Struktur Project

```
app/
├── (auth)/          # Halaman login/register merchant
├── (builder)/       # Dashboard builder (stores, templates, editor)
├── (docs)/          # Dokumentasi
├── (storefront)/    # Halaman toko publik (per-tenant)
├── api/             # Route handlers (upload, webhooks, images, auth)
└── preview/         # Preview tema/template
components/          # Komponen UI shared
features/            # Modul per-domain (auth, builder, storefront, tenant, pwa, i18n)
lib/                 # Utilities (db/prisma, storage/s3, stripe, tenant, storefront)
prisma/              # Schema, migrasi, seed
proxy.ts             # Resolusi subdomain → tenant (multi-tenant routing)
themes/              # Definisi tema storefront
```

## Multi-tenant Routing

[proxy.ts](proxy.ts) membaca `Host` header dan mencocokkannya dengan `NEXT_PUBLIC_ROOT_DOMAIN`:

- `localhost:3000` → dashboard builder / landing
- `<slug>.localhost:3000` → storefront tenant `<slug>`

Di lokal, subdomain `*.localhost` otomatis resolve ke `127.0.0.1` di browser modern — tidak perlu edit hosts file.
