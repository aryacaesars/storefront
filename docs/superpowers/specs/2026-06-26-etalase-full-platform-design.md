# Etalase Full Platform Design

**Tanggal:** 2026-06-26  
**Status:** Approved — siap implementasi  
**Tim:** 2 orang

---

## 1. Overview & Goals

Etalase adalah platform SaaS multi-tenant untuk membuat storefront e-commerce. Owner store daftar di Etalase, buat store, beli template, lalu kelola produk/order melalui dashboard Etalase. End user belanja di subdomain store (`namatoko.etalase.com`).

**Perubahan besar dari versi sebelumnya:**
- Scalev dihapus total (tidak ada `lib/scalev/`, tidak ada token connect)
- Auth diganti NextAuth.js v5 (Google OAuth)
- Seluruh data (produk, order, customer) disimpan di PostgreSQL via Prisma
- Template marketplace dengan payment Stripe

---

## 2. User Roles & Flow

### 2.1 Tiga Aktor

| Role | Domain | Auth |
|---|---|---|
| **Admin Etalase** | `etalase.com/admin` | Google OAuth (email whitelist) |
| **Owner Store** | `etalase.com` | Google OAuth |
| **End User** | `namatoko.etalase.com` | Email+password atau Google OAuth |

> `User` (owner/admin) dan `Customer` (end user) adalah **tabel terpisah** di DB.

### 2.2 Flow Owner Store

```
etalase.com
  → Daftar/Login (Google OAuth)
  → /dashboard — lihat semua store milik akun
  → /stores/new — buat store baru (isi nama, slug → jadi subdomain)
  → /stores/[storeId]/templates — pilih & beli template (Stripe Checkout)
  → Template aktif setelah payment confirmed
  → /stores/[storeId]/customize — kustomisasi warna, font, dll
  → /stores/[storeId]/products — tambah & kelola produk
  → /stores/[storeId]/orders — lihat & proses order masuk
  → Storefront live di namatoko.etalase.com
```

### 2.3 Flow End User

```
namatoko.etalase.com
  → Daftar/Login (email+password atau Google OAuth)
  → Browse produk → Add to cart
  → /checkout — isi alamat, bayar (Stripe Payment Element)
  → /orders/[id] — konfirmasi order
  → /account — lihat profil & riwayat order
```

### 2.4 Flow Admin Etalase

```
etalase.com/admin (whitelist email)
  → /admin — platform overview: total store, revenue template
  → /admin/templates — CRUD template marketplace (nama, harga, preview, publish)
  → /admin/orders — semua transaksi pembelian template (siapa beli apa, status)
  → /admin/stores — semua tenant aktif di platform
```

---

## 3. Data Model (Prisma Schema)

### Platform

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  avatar    String?
  role      Role     @default(OWNER)  // OWNER | ADMIN
  stores    Store[]
  createdAt DateTime @default(now())
}

model Store {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique  // → subdomain namatoko.etalase.com
  ownerId   String
  owner     User     @relation(fields: [ownerId], references: [id])
  products  Product[]
  categories Category[]
  orders    Order[]
  customers Customer[]
  themeConfig StoreThemeConfig?
  purchases   TemplatePurchase[]
  createdAt DateTime @default(now())
}

model Template {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?
  price       Int      // dalam sen (IDR atau USD)
  previewUrl  String?
  published   Boolean  @default(false)
  purchases   TemplatePurchase[]
}

model TemplatePurchase {
  id              String   @id @default(cuid())
  storeId         String
  store           Store    @relation(fields: [storeId], references: [id])
  templateId      String
  template        Template @relation(fields: [templateId], references: [id])
  stripePaymentId String?
  status          PurchaseStatus @default(PENDING)  // PENDING | PAID | FAILED
  paidAt          DateTime?
  createdAt       DateTime @default(now())
}

model StoreThemeConfig {
  storeId    String   @id
  store      Store    @relation(fields: [storeId], references: [id])
  templateId String
  configJson Json     // warna, font, section settings
  updatedAt  DateTime @updatedAt
}
```

### Catalog Store

```prisma
model Category {
  id       String    @id @default(cuid())
  name     String
  slug     String
  storeId  String
  store    Store     @relation(fields: [storeId], references: [id])
  products Product[]

  @@unique([storeId, slug])
}

model Product {
  id          String         @id @default(cuid())
  name        String
  slug        String
  description String?
  price       Int
  stock       Int            @default(0)
  published   Boolean        @default(false)
  storeId     String
  store       Store          @relation(fields: [storeId], references: [id])
  categoryId  String?
  category    Category?      @relation(fields: [categoryId], references: [id])
  images      ProductImage[]
  orderItems  OrderItem[]

  @@unique([storeId, slug])
}

model ProductImage {
  id        String  @id @default(cuid())
  url       String
  productId String
  product   Product @relation(fields: [productId], references: [id])
  order     Int     @default(0)
}
```

### End User

```prisma
model Customer {
  id        String   @id @default(cuid())
  email     String
  name      String?
  avatar    String?
  storeId   String
  store     Store    @relation(fields: [storeId], references: [id])
  orders    Order[]
  addresses Address[]
  createdAt DateTime @default(now())

  @@unique([storeId, email])  // email unik per store
}

model Address {
  id         String   @id @default(cuid())
  customerId String
  customer   Customer @relation(fields: [customerId], references: [id])
  label      String?
  street     String
  city       String
  province   String
  postalCode String
  isDefault  Boolean  @default(false)
}

model Order {
  id              String      @id @default(cuid())
  storeId         String
  store           Store       @relation(fields: [storeId], references: [id])
  customerId      String
  customer        Customer    @relation(fields: [customerId], references: [id])
  status          OrderStatus @default(PENDING)  // PENDING | PAID | SHIPPED | DONE | CANCELLED
  total           Int
  stripePaymentId String?
  items           OrderItem[]
  createdAt       DateTime    @default(now())
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int
  price     Int     // snapshot harga saat order
}
```

---

## 4. Arsitektur & Tech Stack

### Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router) |
| Database | PostgreSQL + Prisma 6 |
| Auth platform | NextAuth.js v5 — Google OAuth |
| Auth storefront | NextAuth.js v5 — Email+Password + Google OAuth (session terpisah) |
| Payment | Stripe (Checkout untuk template, Payment Intent untuk order) |
| Storage gambar | AWS S3 (sudah ada) |
| Styling | Tailwind CSS v4 |

### Route Groups

```
app/
  (marketing)/           → etalase.com landing, showcase template
  (auth)/                → /login, /register owner
  (builder)/
    (dashboard)/         → /dashboard, /stores/[id]/* (owner)
    admin/               → /admin/* (admin Etalase only)
  (storefront)/          → namatoko.etalase.com halaman publik
  (storefront-auth)/     → /login, /register, /account (end user)
  api/
    auth/                → NextAuth handlers
    webhooks/stripe/     → Stripe webhook handler
```

### Proxy (proxy.ts — existing, perlu update)

```
request masuk
  ├── subdomain ada? → context = "storefront"
  │     → gate: /account, /orders → cek sf_customer_session cookie
  └── tidak ada subdomain → context = "builder"
        → gate: /dashboard, /stores, /admin → cek sf_session cookie

PROTECTED paths update:
  builder:   ["/dashboard", "/stores", "/admin", "/customize", "/templates"]
  storefront: ["/account", "/account/orders", "/checkout"]
```

### Session Cookies

```
sf_session          → owner/admin di etalase.com
sf_customer_session → end user di namatoko.etalase.com (domain-scoped)
```

---

## 5. Page & Route Map

### etalase.com — Marketing & Auth

```
/              → Landing page (hero, template showcase, pricing, CTA)
/login         → Login owner (Google OAuth)
/register      → Register owner (Google OAuth)
```

### etalase.com — Builder Dashboard (protected)

```
/dashboard                          → List semua store milik user
/stores/new                         → Form buat store baru
/stores/[storeId]/dashboard         → Analytics store (revenue, order, visitor)
/stores/[storeId]/products          → List produk
/stores/[storeId]/products/new      → Tambah produk
/stores/[storeId]/products/[id]     → Edit produk
/stores/[storeId]/categories        → Kelola kategori
/stores/[storeId]/orders            → List order end user
/stores/[storeId]/orders/[id]       → Detail order
/stores/[storeId]/customers         → List customer
/stores/[storeId]/customers/[id]    → Detail customer
/stores/[storeId]/templates         → Template aktif + beli template
/stores/[storeId]/customize         → Theme builder
/stores/[storeId]/settings          → Setting store (nama, logo, slug)
```

### etalase.com/admin — Admin Panel (whitelist only)

```
/admin                  → Platform overview (total store, revenue)
/admin/templates        → List template marketplace
/admin/templates/new    → Tambah template
/admin/templates/[id]   → Edit/publish template
/admin/orders           → Semua transaksi template purchase
/admin/stores           → Semua tenant aktif
```

### namatoko.etalase.com — Storefront

```
/                    → Home (theme-driven)
/products            → Semua produk
/products/[slug]     → Detail produk
/categories/[slug]   → Produk per kategori
/cart                → Keranjang
/checkout            → Checkout (Stripe Payment Element)
/orders/[id]         → Konfirmasi order
/login               → Login end user
/register            → Register end user
/account             → Profil + order history (protected)
/account/orders      → List order
/account/orders/[id] → Detail order
```

---

## 6. Stripe Integration

### Template Purchase (owner beli template)

```
Owner klik "Beli Template"
  → POST /api/stripe/checkout — create Stripe Checkout Session (mode: payment)
  → Redirect ke Stripe hosted checkout page
  → User bayar → Stripe kirim webhook
  → POST /api/webhooks/stripe
      event: checkout.session.completed
      → update TemplatePurchase.status = PAID
      → owner bisa aktifkan template
```

### Storefront Checkout (end user beli produk)

```
End user klik "Checkout"
  → POST /api/stripe/payment-intent — create Payment Intent
  → Render Stripe Payment Element di /checkout
  → User bayar → Stripe kirim webhook
  → POST /api/webhooks/stripe
      event: payment_intent.succeeded
      → create Order + OrderItems di DB
      → kurangi stock produk
      → redirect end user ke /orders/[id]
```

### Webhook Handler (/api/webhooks/stripe)

```typescript
// Satu endpoint, route berdasarkan event type
switch (event.type) {
  case "checkout.session.completed":
    // → template purchase flow
  case "payment_intent.succeeded":
    // → storefront order flow
}
// Selalu verifikasi Stripe-Signature header sebelum proses
```

---

## 7. Working Agreement

### Methodology: Agile-lite (sprint 1 minggu)

```
Senin   : Sprint planning — bagi task minggu ini, review spec
Kamis   : Mid-sprint check — progress, blocker
Jumat   : PR review + merge ke dev
```

**Aturan wajib:**
- Tidak ada coding sebelum ada spec/design yang approved
- Setiap fitur baru → diskusi dulu minimal 5 menit sebelum mulai

### Git Workflow

```
main        → production, tidak boleh push langsung
dev         → integrasi, merge dari feature branch via PR
feat/[nama] → satu branch per task/fitur

Contoh:
  feat/auth-owner
  feat/store-creation
  feat/template-purchase
  feat/product-crud
```

**Aturan branch:**
- Tidak boleh push langsung ke `dev` atau `main`
- Setiap PR wajib di-review sebelum merge
- PR description wajib tulis: file apa yang diubah dan kenapa

### Task Assignment Format

Setiap task yang dibagi ke tim wajib berisi:

```
TASK: [nama singkat]
SCOPE: Halaman / fitur yang dibuat
FILES YANG BOLEH DIUBAH:
  - app/(builder)/... 
  - features/...
  - prisma/schema.prisma (jika perlu)
FILES YANG TIDAK BOLEH DISENTUH:
  - proxy.ts (kecuali ada diskusi)
  - lib/scalev/ (sudah deprecated, akan dihapus)
  - [file lain di luar scope]
DONE CRITERIA:
  - [ ] Halaman render tanpa error
  - [ ] Data tersimpan/terbaca dari DB
  - [ ] PR description diisi
```

### Prompt Quality untuk Claude

Saat menggunakan Claude Code untuk task, wajib include:

```
Context:
- Baca docs/superpowers/specs/2026-06-26-etalase-full-platform-design.md dulu
- Stack: Next.js 16, Prisma, NextAuth v5, Stripe, Tailwind v4
- Jangan ubah file di luar scope task ini

Task: [deskripsi jelas apa yang perlu dibuat]
Scope files: [list file yang boleh diubah]
```

---

## 8. Migrasi dari Versi Scalev

File yang akan dihapus saat implementasi:

```
lib/scalev/           → hapus seluruh folder
app/api/auth/scalev/  → hapus
app/api/webhooks/scalev/ → hapus (ganti dengan webhooks/stripe)
features/auth/        → rewrite total (token connect → NextAuth)
server/services/tenant.service.ts → rewrite (Scalev logic → Prisma)
```

File yang dipertahankan & diadaptasi:

```
proxy.ts              → update PROTECTED paths + customer session gate
prisma/schema.prisma  → tambah semua model baru, hapus Scalev fields
themes/               → dipertahankan, tetap theme-driven
features/builder/     → sebagian besar dipertahankan, sesuaikan data source
```

---

## 9. Prioritas Implementasi (Sprint Order)

| Sprint | Fokus | Deliverable |
|---|---|---|
| 1 | Hapus Scalev + Setup NextAuth + DB schema baru | Login Google owner berjalan |
| 2 | Store creation + basic dashboard | Owner bisa buat store |
| 3 | Template marketplace + Stripe purchase | Owner bisa beli template |
| 4 | Product & category CRUD | Owner bisa tambah produk |
| 5 | Storefront end user auth + browse | End user bisa daftar & lihat produk |
| 6 | Cart + Checkout Stripe storefront | End user bisa checkout |
| 7 | Order management + analytics | Owner lihat order, admin lihat revenue |
| 8 | Polish + admin panel | Admin kelola template |
