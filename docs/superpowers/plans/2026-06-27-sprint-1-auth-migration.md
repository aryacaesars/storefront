# Sprint 1: Auth Migration — Scalev → NextAuth v5 + Prisma Schema Rebuild

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ganti Scalev token auth dengan NextAuth v5 Google OAuth sehingga owner bisa login via Google dan mengakses /dashboard.

**Architecture:** NextAuth v5 (beta) menangani OAuth dan JWT session. Prisma adapter menyimpan OAuth accounts. Cookie `sf_session` dikonfigurasi di NextAuth agar proxy.ts tidak perlu diubah besar-besaran. Seluruh stack Scalev dihapus.

**Tech Stack:** next-auth@beta, @auth/prisma-adapter, Next.js 16.2.7, Prisma 6, PostgreSQL, Tailwind CSS v4

## Global Constraints

- Next.js 16.2.7 — baca `node_modules/next/dist/docs/` sebelum nulis kode apapun
- Jangan push langsung ke `dev` atau `main`
- Jangan ubah file di luar scope tiap task
- Setiap task selesai → commit dengan deskripsi yang jelas
- `DATABASE_URL` harus terisi di `.env.local` sebelum menjalankan migration

---

## File Map

| Action | File | Tanggung Jawab |
|---|---|---|
| Rewrite | `prisma/schema.prisma` | Full schema baru: User, Store, Product, Order, dll + NextAuth models |
| Delete | `lib/db/schema.prisma` | File kosong, membingungkan |
| Create | `auth.ts` (root) | NextAuth config: Google provider, JWT strategy, cookie name, callbacks |
| Create | `app/api/auth/[...nextauth]/route.ts` | Route handler NextAuth |
| Create | `types/next-auth.d.ts` | Type augmentation: Session.user.id, Session.user.role |
| Rewrite | `features/auth/types.ts` | SessionData baru (tanpa scalevToken) |
| Rewrite | `features/auth/dal.ts` | getSession/requireSession pakai NextAuth auth() |
| Rewrite | `features/auth/actions.ts` | loginWithGoogle, logoutAction |
| Rewrite | `features/auth/components/LoginForm.tsx` | Tombol Google OAuth |
| Delete | `features/auth/session.ts` | JWE session — diganti NextAuth |
| Delete | `features/auth/normalize-token.ts` | Scalev-specific |
| Delete | `features/auth/provider.ts` | Scalev TokenAuthProvider |
| Modify | `proxy.ts` | Tambah /stores, /admin ke PROTECTED; tambah storefront customer gate |
| Delete | `lib/scalev/` | Seluruh folder |
| Delete | `app/api/auth/scalev/route.ts` | Scalev OAuth callback |
| Simplify | `server/services/tenant.service.ts` | Hapus Scalev imports; stub fungsi sementara (full rewrite Sprint 2) |

---

## Task 1: Update Prisma Schema

**Files:**
- Rewrite: `prisma/schema.prisma`
- Delete: `lib/db/schema.prisma`

**Interfaces:**
- Produces: Prisma models `User`, `Store`, `Account`, `VerificationToken` — dipakai Task 2 (NextAuth adapter) dan semua task selanjutnya

- [ ] **Step 1: Baca Next.js 16 docs**

  ```
  ls node_modules/next/dist/docs/
  ```
  Cari file relevan tentang Prisma atau database integration.

- [ ] **Step 2: Hapus file kosong**

  ```
  rm lib/db/schema.prisma
  ```

- [ ] **Step 3: Tulis schema baru**

  Isi penuh `prisma/schema.prisma`:

  ```prisma
  generator client {
    provider = "prisma-client-js"
  }

  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }

  enum Role {
    OWNER
    ADMIN
  }

  enum PurchaseStatus {
    PENDING
    PAID
    FAILED
  }

  enum OrderStatus {
    PENDING
    PAID
    SHIPPED
    DONE
    CANCELLED
  }

  // NextAuth v5 — required by @auth/prisma-adapter
  model Account {
    id                String   @id @default(cuid())
    userId            String   @map("user_id")
    type              String
    provider          String
    providerAccountId String   @map("provider_account_id")
    refresh_token     String?  @db.Text
    access_token      String?  @db.Text
    expires_at        Int?
    token_type        String?
    scope             String?
    id_token          String?  @db.Text
    session_state     String?
    createdAt         DateTime @default(now()) @map("created_at")
    updatedAt         DateTime @updatedAt @map("updated_at")
    user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)

    @@unique([provider, providerAccountId])
    @@map("accounts")
  }

  model VerificationToken {
    identifier String
    token      String
    expires    DateTime

    @@unique([identifier, token])
    @@map("verification_tokens")
  }

  // Platform models
  model User {
    id            String    @id @default(cuid())
    email         String    @unique
    emailVerified DateTime? @map("email_verified")
    name          String?
    image         String?
    role          Role      @default(OWNER)
    accounts      Account[]
    stores        Store[]
    createdAt     DateTime  @default(now()) @map("created_at")

    @@map("users")
  }

  model Store {
    id          String             @id @default(cuid())
    name        String
    slug        String             @unique
    ownerId     String             @map("owner_id")
    owner       User               @relation(fields: [ownerId], references: [id])
    products    Product[]
    categories  Category[]
    orders      Order[]
    customers   Customer[]
    themeConfig StoreThemeConfig?
    purchases   TemplatePurchase[]
    createdAt   DateTime           @default(now()) @map("created_at")

    @@map("stores")
  }

  model Template {
    id          String             @id @default(cuid())
    name        String
    slug        String             @unique
    description String?
    price       Int
    previewUrl  String?            @map("preview_url")
    published   Boolean            @default(false)
    purchases   TemplatePurchase[]

    @@map("templates")
  }

  model TemplatePurchase {
    id              String         @id @default(cuid())
    storeId         String         @map("store_id")
    store           Store          @relation(fields: [storeId], references: [id])
    templateId      String         @map("template_id")
    template        Template       @relation(fields: [templateId], references: [id])
    stripePaymentId String?        @map("stripe_payment_id")
    status          PurchaseStatus @default(PENDING)
    paidAt          DateTime?      @map("paid_at")
    createdAt       DateTime       @default(now()) @map("created_at")

    @@map("template_purchases")
  }

  model StoreThemeConfig {
    storeId    String   @id @map("store_id")
    store      Store    @relation(fields: [storeId], references: [id])
    templateId String   @map("template_id")
    configJson Json     @map("config_json")
    updatedAt  DateTime @updatedAt @map("updated_at")

    @@map("store_theme_configs")
  }

  model Category {
    id       String    @id @default(cuid())
    name     String
    slug     String
    storeId  String    @map("store_id")
    store    Store     @relation(fields: [storeId], references: [id])
    products Product[]

    @@unique([storeId, slug])
    @@map("categories")
  }

  model Product {
    id          String         @id @default(cuid())
    name        String
    slug        String
    description String?
    price       Int
    stock       Int            @default(0)
    published   Boolean        @default(false)
    storeId     String         @map("store_id")
    store       Store          @relation(fields: [storeId], references: [id])
    categoryId  String?        @map("category_id")
    category    Category?      @relation(fields: [categoryId], references: [id])
    images      ProductImage[]
    orderItems  OrderItem[]

    @@unique([storeId, slug])
    @@map("products")
  }

  model ProductImage {
    id        String  @id @default(cuid())
    url       String
    productId String  @map("product_id")
    product   Product @relation(fields: [productId], references: [id])
    order     Int     @default(0)

    @@map("product_images")
  }

  model Customer {
    id        String    @id @default(cuid())
    email     String
    name      String?
    image     String?
    storeId   String    @map("store_id")
    store     Store     @relation(fields: [storeId], references: [id])
    orders    Order[]
    addresses Address[]
    createdAt DateTime  @default(now()) @map("created_at")

    @@unique([storeId, email])
    @@map("customers")
  }

  model Address {
    id         String   @id @default(cuid())
    customerId String   @map("customer_id")
    customer   Customer @relation(fields: [customerId], references: [id])
    label      String?
    street     String
    city       String
    province   String
    postalCode String   @map("postal_code")
    isDefault  Boolean  @default(false) @map("is_default")

    @@map("addresses")
  }

  model Order {
    id              String      @id @default(cuid())
    storeId         String      @map("store_id")
    store           Store       @relation(fields: [storeId], references: [id])
    customerId      String      @map("customer_id")
    customer        Customer    @relation(fields: [customerId], references: [id])
    status          OrderStatus @default(PENDING)
    total           Int
    stripePaymentId String?     @map("stripe_payment_id")
    items           OrderItem[]
    createdAt       DateTime    @default(now()) @map("created_at")

    @@map("orders")
  }

  model OrderItem {
    id        String  @id @default(cuid())
    orderId   String  @map("order_id")
    order     Order   @relation(fields: [orderId], references: [id])
    productId String  @map("product_id")
    product   Product @relation(fields: [productId], references: [id])
    quantity  Int
    price     Int

    @@map("order_items")
  }
  ```

- [ ] **Step 4: Jalankan migration**

  ```bash
  npx prisma migrate dev --name init-v2
  ```

  Jika error karena data existing atau conflict schema lama:
  ```bash
  npx prisma migrate reset
  # Ketik "y" untuk konfirmasi — ini DROP semua tabel (dev only!)
  npx prisma migrate dev --name init-v2
  ```

- [ ] **Step 5: Generate Prisma client**

  ```bash
  npx prisma generate
  ```

  Expected output: `✔ Generated Prisma Client`

- [ ] **Step 6: Verifikasi TypeScript**

  ```bash
  npx tsc --noEmit 2>&1 | head -30
  ```

  Abaikan error dari file lain yang masih import Scalev — itu akan difix di Task 5. Pastikan tidak ada error di `prisma/schema.prisma` itu sendiri.

- [ ] **Step 7: Commit**

  ```bash
  git add prisma/schema.prisma
  git rm lib/db/schema.prisma
  git commit -m "feat(db): replace Scalev schema with full platform schema (User, Store, Product, Order, etc.)"
  ```

---

## Task 2: Install & Configure NextAuth v5

**Files:**
- Create: `auth.ts` (root)
- Create: `app/api/auth/[...nextauth]/route.ts`
- Create: `types/next-auth.d.ts`
- Modify: `.env.local`

**Interfaces:**
- Consumes: `prisma.user`, `prisma.account` dari Task 1
- Produces: `auth()`, `signIn()`, `signOut()` — dipakai Task 3

- [ ] **Step 1: Install packages**

  ```bash
  npm install next-auth@beta @auth/prisma-adapter
  ```

- [ ] **Step 2: Setup Google OAuth credentials**

  Buka Google Cloud Console → APIs & Services → Credentials → Create OAuth 2.0 Client ID.
  - Application type: Web application
  - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

  Tambahkan ke `.env.local`:
  ```
  GOOGLE_CLIENT_ID=<client_id_dari_google>
  GOOGLE_CLIENT_SECRET=<client_secret_dari_google>
  AUTH_SECRET=<generate dengan: openssl rand -base64 32>
  ADMIN_EMAILS=email-admin@gmail.com
  ```

- [ ] **Step 3: Buat auth.ts di root**

  ```typescript
  import NextAuth from "next-auth"
  import Google from "next-auth/providers/google"
  import { PrismaAdapter } from "@auth/prisma-adapter"
  import { prisma } from "@/lib/db/prisma"
  import type { Role } from "@prisma/client"

  const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean)

  export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [Google],
    session: { strategy: "jwt" },
    cookies: {
      sessionToken: {
        name: "sf_session",
        options: {
          httpOnly: true,
          sameSite: "lax" as const,
          path: "/",
          secure: process.env.NODE_ENV === "production",
        },
      },
    },
    callbacks: {
      async signIn({ user }) {
        return Boolean(user.email)
      },
      async jwt({ token, user }) {
        if (user?.id && user.email) {
          const role: Role = ADMIN_EMAILS.includes(user.email) ? "ADMIN" : "OWNER"
          await prisma.user.update({
            where: { id: user.id },
            data: { role },
          })
          token.id = user.id
          token.role = role
        }
        return token
      },
      session({ session, token }) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
        return session
      },
    },
  })
  ```

- [ ] **Step 4: Buat route handler**

  Buat folder `app/api/auth/[...nextauth]/` lalu buat `route.ts`:

  ```typescript
  import { handlers } from "@/auth"
  export const { GET, POST } = handlers
  ```

- [ ] **Step 5: Buat type augmentation**

  Buat `types/next-auth.d.ts`:

  ```typescript
  import type { Role } from "@prisma/client"

  declare module "next-auth" {
    interface Session {
      user: {
        id: string
        role: Role
        name?: string | null
        email?: string | null
        image?: string | null
      }
    }
  }

  declare module "next-auth/jwt" {
    interface JWT {
      id: string
      role: Role
    }
  }
  ```

- [ ] **Step 6: Verifikasi TypeScript (auth.ts saja)**

  ```bash
  npx tsc --noEmit 2>&1 | grep -E "auth\.ts|next-auth"
  ```

  Tidak boleh ada error di `auth.ts` atau `types/next-auth.d.ts`.

- [ ] **Step 7: Commit**

  ```bash
  git add auth.ts app/api/auth/ types/next-auth.d.ts .env.local
  git commit -m "feat(auth): add NextAuth v5 with Google OAuth provider and JWT session"
  ```

  > ⚠️ Pastikan `.env.local` ada di `.gitignore` sebelum commit!

---

## Task 3: Rewrite features/auth/

**Files:**
- Rewrite: `features/auth/types.ts`
- Rewrite: `features/auth/dal.ts`
- Rewrite: `features/auth/actions.ts`
- Rewrite: `features/auth/components/LoginForm.tsx`
- Delete: `features/auth/session.ts`
- Delete: `features/auth/normalize-token.ts`
- Delete: `features/auth/provider.ts`

**Interfaces:**
- Consumes: `auth()`, `signIn()`, `signOut()` dari Task 2
- Produces: `getSession()`, `requireSession()`, `requireAdmin()`, `loginWithGoogle()`, `logoutAction()`, `LoginForm` — interface SAMA dengan sebelumnya agar semua caller tidak rusak

- [ ] **Step 1: Hapus file Scalev-specific**

  ```bash
  git rm features/auth/session.ts features/auth/normalize-token.ts features/auth/provider.ts
  ```

- [ ] **Step 2: Tulis types.ts baru**

  ```typescript
  import type { Role } from "@prisma/client"

  export interface SessionData {
    userId: string
    email: string
    name: string | null
    role: Role
  }

  export type LoginFormState = { error: string } | undefined
  ```

- [ ] **Step 3: Tulis dal.ts baru**

  ```typescript
  import "server-only"
  import { cache } from "react"
  import { redirect } from "next/navigation"
  import { auth } from "@/auth"
  import type { SessionData } from "./types"

  export const getSession = cache(async (): Promise<SessionData | null> => {
    const session = await auth()
    if (!session?.user?.id) return null
    return {
      userId: session.user.id,
      email: session.user.email ?? "",
      name: session.user.name ?? null,
      role: session.user.role,
    }
  })

  export async function requireSession(): Promise<SessionData> {
    const session = await getSession()
    if (!session) redirect("/login")
    return session
  }

  export async function requireAdmin(): Promise<SessionData> {
    const session = await requireSession()
    if (session.role !== "ADMIN") redirect("/dashboard")
    return session
  }
  ```

- [ ] **Step 4: Tulis actions.ts baru**

  ```typescript
  "use server"
  import { signIn, signOut } from "@/auth"

  export async function loginWithGoogle(): Promise<void> {
    await signIn("google", { redirectTo: "/dashboard" })
  }

  export async function logoutAction(): Promise<void> {
    await signOut({ redirectTo: "/login" })
  }
  ```

- [ ] **Step 5: Tulis LoginForm.tsx baru**

  ```tsx
  import { loginWithGoogle } from "@/features/auth/actions"

  export function LoginForm() {
    return (
      <form action={loginWithGoogle}>
        <button
          type="submit"
          className="flex items-center gap-3 px-6 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Masuk dengan Google
        </button>
      </form>
    )
  }
  ```

- [ ] **Step 6: Cek apakah ada halaman /login yang perlu diupdate**

  ```bash
  find app -name "*.tsx" | xargs grep -l "LoginForm\|loginAction" 2>/dev/null
  ```

  Untuk setiap file yang ditemukan: pastikan import `LoginForm` dari `@/features/auth/components/LoginForm` masih valid (tidak perlu diubah selama nama export sama).

  Jika ada yang masih import `loginAction` (lama): ganti dengan `loginWithGoogle`.

- [ ] **Step 7: Commit**

  ```bash
  git add features/auth/
  git commit -m "feat(auth): replace Scalev token auth with NextAuth v5 Google OAuth"
  ```

---

## Task 4: Update proxy.ts

**Files:**
- Modify: `proxy.ts`

**Interfaces:**
- Consumes: cookie `sf_session` (set oleh NextAuth via Task 2), `sf_customer_session` (Sprint 5, gate sudah dipasang sekarang)
- Produces: auth gate yang benar untuk builder dan storefront

- [ ] **Step 1: Update PROTECTED paths dan tambah storefront gate**

  Ganti bagian konstanta dan fungsi `proxy()` di `proxy.ts`:

  ```typescript
  // Cookie sesi owner/admin
  const SESSION_COOKIE = "sf_session"
  // Cookie sesi end user storefront (set saat Sprint 5 — gate sudah dipasang)
  const SF_CUSTOMER_COOKIE = "sf_customer_session"

  // Path builder yang wajib login
  const PROTECTED = ["/dashboard", "/templates", "/customize", "/stores", "/admin"]
  // Path storefront yang wajib login end user
  const PROTECTED_STOREFRONT = ["/account", "/checkout"]
  ```

  Di dalam fungsi `proxy()`, tambahkan storefront gate setelah builder gate:

  ```typescript
  // Auth gate builder: path terproteksi tanpa cookie → redirect /login
  if (context === "builder") {
    const needsAuth = PROTECTED.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`),
    )
    if (needsAuth && !request.cookies.has(SESSION_COOKIE)) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      return NextResponse.redirect(url)
    }
  }

  // Auth gate storefront: /account dan /checkout wajib login end user
  if (context === "storefront") {
    const needsAuth = PROTECTED_STOREFRONT.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`),
    )
    if (needsAuth && !request.cookies.has(SF_CUSTOMER_COOKIE)) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      return NextResponse.redirect(url)
    }
  }
  ```

- [ ] **Step 2: Verifikasi proxy.ts compile**

  ```bash
  npx tsc --noEmit 2>&1 | grep "proxy.ts"
  ```

  Tidak boleh ada error.

- [ ] **Step 3: Commit**

  ```bash
  git add proxy.ts
  git commit -m "feat(proxy): add /stores /admin to builder gate; add storefront customer gate"
  ```

---

## Task 5: Hapus Scalev + Fix Broken Imports

**Files:**
- Delete: `lib/scalev/` (seluruh folder)
- Delete: `app/api/auth/scalev/route.ts`
- Simplify: `server/services/tenant.service.ts`

**Interfaces:**
- Produces: `getStoreBySlug(slug)`, `getStoreById(id)`, `getStoresByOwnerId(userId)` — dipakai Task 6 dan Sprint 2

- [ ] **Step 1: Scan semua import ke Scalev dan auth lama**

  ```bash
  grep -r "lib/scalev\|features/auth/session\|features/auth/provider\|features/auth/normalize-token\|scalevToken\|ScalevError\|getAuthProvider\|loginAction" \
    --include="*.ts" --include="*.tsx" \
    -l app/ features/ server/ themes/ lib/ 2>/dev/null
  ```

  Catat semua file yang muncul — itu kandidat yang perlu difix.

- [ ] **Step 2: Hapus folder lib/scalev/**

  ```bash
  git rm -r lib/scalev/
  git rm app/api/auth/scalev/route.ts
  ```

- [ ] **Step 3: Tulis ulang server/services/tenant.service.ts**

  Hapus semua Scalev logic, replace dengan Prisma Store CRUD minimal untuk Sprint 1:

  ```typescript
  import "server-only"
  import { prisma } from "@/lib/db/prisma"
  import type { Store } from "@prisma/client"

  export type { Store }

  export async function getStoreBySlug(slug: string): Promise<Store | null> {
    return prisma.store.findUnique({ where: { slug } })
  }

  export async function getStoreById(id: string): Promise<Store | null> {
    return prisma.store.findUnique({ where: { id } })
  }

  export async function getStoresByOwnerId(ownerId: string): Promise<Store[]> {
    return prisma.store.findMany({
      where: { ownerId },
      orderBy: { createdAt: "asc" },
    })
  }

  export function slugify(input: string): string {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 63)
  }
  ```

- [ ] **Step 4: Fix broken imports di file lain**

  Jalankan TypeScript untuk lihat error:

  ```bash
  npx tsc --noEmit 2>&1 | head -60
  ```

  Untuk setiap file yang error karena import Scalev atau session lama:
  - Jika file itu **dalam scope Sprint 1** (auth, proxy, login page): fix sekarang
  - Jika file itu **di luar scope Sprint 1** (dashboard pages, themes): comment out import dan tambahkan `// TODO Sprint 2: reconnect to Prisma data source`

  Contoh cara comment out import yang rusak sementara:
  ```typescript
  // TODO Sprint 2: reconnect to Prisma
  // import { connectTenantCatalog } from "@/server/services/tenant.service"
  ```

- [ ] **Step 5: Verifikasi clean compile (dalam toleransi)**

  ```bash
  npx tsc --noEmit 2>&1 | wc -l
  ```

  Target: error count turun signifikan. Error di file theme/dashboard yang di-TODO adalah acceptable untuk Sprint 1.

- [ ] **Step 6: Commit**

  ```bash
  git add -A
  git commit -m "chore: remove Scalev stack; stub tenant.service.ts with Prisma Store CRUD"
  ```

---

## Task 6: Verifikasi Login Flow

**Files:** Tidak ada file yang diubah — pure verification step.

- [ ] **Step 1: Pastikan env vars lengkap**

  Cek `.env.local` punya:
  - `DATABASE_URL`
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `AUTH_SECRET`

- [ ] **Step 2: Jalankan dev server**

  ```bash
  npm run dev
  ```

  Expected: server start tanpa crash. Ada warning TypeScript dari file TODO adalah OK.

- [ ] **Step 3: Test login flow**

  1. Buka `http://localhost:3000/login`
  2. Klik "Masuk dengan Google"
  3. Pilih akun Google
  4. Expected: redirect ke `/dashboard`
  5. Buka DevTools → Application → Cookies
  6. Verifikasi cookie `sf_session` ada dan httpOnly

- [ ] **Step 4: Test proxy gate**

  1. Buka tab incognito
  2. Buka `http://localhost:3000/dashboard`
  3. Expected: redirect ke `/login`

- [ ] **Step 5: Test logout**

  Jika ada tombol logout di dashboard: klik → expected redirect ke `/login` + `sf_session` cookie hilang.

- [ ] **Step 6: Final commit (jika ada fix kecil)**

  ```bash
  git add -A
  git commit -m "fix: post-migration cleanup after Sprint 1 verification"
  ```

---

## Self-Review Checklist

- [x] Spec §8 (migrasi Scalev): lib/scalev/ dihapus ✓, app/api/auth/scalev/ dihapus ✓, features/auth/ direwrite ✓
- [x] Spec §3 (data model): semua 11 model ada di schema + NextAuth adapter models ✓
- [x] Spec §4 (proxy session cookies): sf_session untuk builder ✓, sf_customer_session untuk storefront ✓
- [x] Spec §4 (protected paths): /dashboard, /templates, /customize, /stores, /admin ✓
- [x] Spec §9 Sprint 1 deliverable: "Login Google owner berjalan" ✓
- [x] Tidak ada `scalevToken` di SessionData baru ✓
- [x] `requireAdmin()` di dal.ts untuk whitelist admin ✓
