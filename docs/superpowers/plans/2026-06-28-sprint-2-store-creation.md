# Sprint 2: Store Creation + Basic Dashboard

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Owner bisa buat store baru dan melihat daftar store miliknya di dashboard.

**Architecture:** Setiap user bisa punya banyak store (1:N). Session hanya menyimpan `userId` — storeId selalu diambil dari URL params (`/stores/[storeId]/*`). Server Actions handle create store dengan slug validation. Dashboard menampilkan list store dari DB.

**Tech Stack:** Next.js 16 App Router, Prisma 6, NextAuth v5 (auth()), Tailwind CSS v4, Zod v4

## Global Constraints

- Next.js 16.2.7 — baca `node_modules/next/dist/docs/` sebelum nulis kode. Params di dynamic routes adalah `Promise<{ storeId: string }>`, harus di-await.
- `SessionData` shape: `{ userId, email, name, role }` — TIDAK ada `tenantId`, `tenantSlug`, `displayName`
- Import Prisma client dari `@/lib/db/prisma`
- Import session dari `@/features/auth/dal` (`requireSession`, `getSession`)
- Semua store functions di `server/services/tenant.service.ts` (bukan store.service — file ini sudah ada)
- Jangan push ke git — commit diserahkan ke developer
- Jangan ubah file di luar scope task

---

## File Map

| Action | File | Tanggung Jawab |
|---|---|---|
| Modify | `server/services/tenant.service.ts` | Tambah `createStore`, `slugExists` |
| Fix | `app/(builder)/(dashboard)/settings/page.tsx` | Suppress stale TS errors |
| Fix | `app/(builder)/customize/page.tsx` | Suppress stale TS errors |
| Fix | `app/api/upload/route.ts` | Suppress stale TS errors |
| Fix | `features/builder/actions/theme-actions.ts` | Suppress stale TS errors |
| Fix | `features/builder/theme-state.ts` | Suppress stale TS errors |
| Rewrite | `app/(builder)/(dashboard)/dashboard/page.tsx` | List user's stores |
| Create | `app/(builder)/(dashboard)/stores/new/page.tsx` | Halaman form buat store |
| Create | `app/(builder)/(dashboard)/stores/new/actions.ts` | Server Action: createStoreAction |
| Create | `features/builder/components/CreateStoreForm.tsx` | Client form component |
| Create | `app/(builder)/(dashboard)/stores/[storeId]/layout.tsx` | Store layout + nav sidebar inject |
| Create | `app/(builder)/(dashboard)/stores/[storeId]/dashboard/page.tsx` | Per-store dashboard |

---

## Task 1: Extend store.service.ts

**Files:**
- Modify: `server/services/tenant.service.ts`

**Interfaces:**
- Produces:
  - `createStore(input: { name: string; slug: string; ownerId: string }): Promise<Store>`
  - `slugExists(slug: string): Promise<boolean>`
  - Semua fungsi yang sudah ada (`getStoreBySlug`, `getStoreById`, `getStoresByOwnerId`, `slugify`) tetap ada

- [ ] **Step 1: Baca file saat ini**

  Baca `server/services/tenant.service.ts` untuk tahu konten existing.

- [ ] **Step 2: Tambahkan dua fungsi baru**

  Append ke akhir `server/services/tenant.service.ts`:

  ```typescript
  export async function createStore(input: {
    name: string
    slug: string
    ownerId: string
  }): Promise<Store> {
    return prisma.store.create({
      data: {
        name: input.name,
        slug: input.slug,
        ownerId: input.ownerId,
      },
    })
  }

  export async function slugExists(slug: string): Promise<boolean> {
    const count = await prisma.store.count({ where: { slug } })
    return count > 0
  }
  ```

- [ ] **Step 3: Verifikasi TypeScript**

  ```bash
  npx tsc --noEmit 2>&1 | grep "tenant.service"
  ```

  Expected: tidak ada error di `tenant.service.ts`.

- [ ] **Step 4: Siapkan commit**

  ```bash
  git add server/services/tenant.service.ts
  # commit message:
  # feat(store): add createStore and slugExists to store service
  ```

---

## Task 2: Fix Sprint 1 TS Errors

**Files:**
- Fix: `app/(builder)/(dashboard)/settings/page.tsx`
- Fix: `app/(builder)/customize/page.tsx`
- Fix: `app/api/upload/route.ts`
- Fix: `features/builder/actions/theme-actions.ts`
- Fix: `features/builder/theme-state.ts`

**Context:** File-file ini masih menggunakan `session.tenantSlug` / `session.tenantId` dari SessionData lama. Untuk Sprint 2, suppress dengan `@ts-expect-error` + komentar TODO. Fitur yang benar (pakai storeId dari URL) akan diimplementasikan di Sprint yang relevan.

**Interfaces:**
- Consumes: `SessionData` dari `features/auth/types.ts` — shape: `{ userId, email, name, role }`

- [ ] **Step 1: Jalankan tsc dan catat semua error yang tersisa**

  ```bash
  npx tsc --noEmit 2>&1
  ```

  Perhatikan baris dan kolom setiap error `tenantSlug` / `tenantId` / `displayName`.

- [ ] **Step 2: Untuk setiap baris error — tambahkan @ts-expect-error**

  Pattern: tambahkan baris ini TEPAT di atas baris yang error:

  ```typescript
  // @ts-expect-error TODO Sprint N: use storeId from URL params, session.tenantSlug removed
  ```

  Ganti `Sprint N` dengan sprint yang relevan (misalnya Sprint 4 untuk product/category, Sprint 3 untuk customize, dll).

  Contoh untuk `theme-actions.ts` yang pakai `session.tenantId`:
  ```typescript
  // @ts-expect-error TODO Sprint 3: use storeId from URL params
  const tenantId = session.tenantId
  ```

  Contoh untuk `upload/route.ts`:
  ```typescript
  // @ts-expect-error TODO Sprint 4: get storeId from request body/params
  const tenantId = session.tenantId
  ```

- [ ] **Step 3: Verifikasi error count turun ke 0**

  ```bash
  npx tsc --noEmit 2>&1 | wc -l
  ```

  Expected: 0 baris output (tidak ada error).

- [ ] **Step 4: Siapkan commit**

  ```bash
  git add app/(builder)/(dashboard)/settings/page.tsx \
          app/(builder)/customize/page.tsx \
          app/api/upload/route.ts \
          features/builder/actions/theme-actions.ts \
          features/builder/theme-state.ts
  # commit message:
  # fix(ts): suppress remaining SessionData shape errors with @ts-expect-error TODO comments
  ```

---

## Task 3: Rewrite /dashboard — List User's Stores

**Files:**
- Rewrite: `app/(builder)/(dashboard)/dashboard/page.tsx`

**Interfaces:**
- Consumes: `requireSession()` → `SessionData.userId`
- Consumes: `getStoresByOwnerId(ownerId: string): Promise<Store[]>` dari Task 1
- Produces: halaman `/dashboard` yang render list stores + tombol buat store

- [ ] **Step 1: Baca file existing**

  Baca `app/(builder)/(dashboard)/dashboard/page.tsx` untuk lihat konten lama.

- [ ] **Step 2: Tulis ulang halaman dashboard**

  ```tsx
  import { requireSession } from "@/features/auth/dal"
  import { getStoresByOwnerId } from "@/server/services/tenant.service"
  import Link from "next/link"

  export const metadata = { title: "Dashboard — Etalase" }

  export default async function DashboardPage() {
    const session = await requireSession()
    const stores = await getStoresByOwnerId(session.userId)

    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Store Saya</h1>
          <Link
            href="/stores/new"
            className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            + Buat Store
          </Link>
        </div>

        {stores.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="mb-4 text-base">Belum ada store. Buat store pertama kamu.</p>
            <Link
              href="/stores/new"
              className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Buat Store Sekarang
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stores.map((store) => (
              <Link
                key={store.id}
                href={`/stores/${store.id}/dashboard`}
                className="p-5 bg-white border border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-sm transition-all"
              >
                <p className="font-semibold text-gray-900">{store.name}</p>
                <p className="text-sm text-gray-400 mt-1">{store.slug}.etalase.com</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }
  ```

- [ ] **Step 3: Verifikasi TypeScript**

  ```bash
  npx tsc --noEmit 2>&1 | grep "dashboard/page"
  ```

  Expected: tidak ada error.

- [ ] **Step 4: Test manual**

  Buka `http://localhost:3000/dashboard`. Pastikan:
  - Jika belum ada store: tampil pesan kosong + tombol "Buat Store Sekarang"
  - Tidak ada runtime error di console

- [ ] **Step 5: Siapkan commit**

  ```bash
  git add app/\(builder\)/\(dashboard\)/dashboard/page.tsx
  # commit message:
  # feat(dashboard): show user's stores from Prisma, remove Scalev stubs
  ```

---

## Task 4: Create /stores/new — Form Buat Store

**Files:**
- Create: `app/(builder)/(dashboard)/stores/new/actions.ts`
- Create: `features/builder/components/CreateStoreForm.tsx`
- Create: `app/(builder)/(dashboard)/stores/new/page.tsx`

**Interfaces:**
- Consumes: `requireSession()` → `session.userId`
- Consumes: `createStore`, `slugExists`, `slugify` dari `server/services/tenant.service.ts`
- Produces:
  - `createStoreAction(prev, formData): Promise<CreateStoreState>` — Server Action
  - `CreateStoreForm` — Client Component dengan `useActionState`
  - Page di `/stores/new`

- [ ] **Step 1: Buat Server Action**

  Buat file `app/(builder)/(dashboard)/stores/new/actions.ts`:

  ```typescript
  "use server"

  import { redirect } from "next/navigation"
  import { z } from "zod"
  import { requireSession } from "@/features/auth/dal"
  import {
    createStore,
    slugExists,
  } from "@/server/services/tenant.service"

  const CreateStoreInput = z.object({
    name: z.string().trim().min(1, "Nama store wajib diisi.").max(100, "Nama terlalu panjang."),
    slug: z
      .string()
      .trim()
      .min(2, "Slug minimal 2 karakter.")
      .max(63, "Slug maksimal 63 karakter.")
      .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, "Slug hanya huruf kecil, angka, dan tanda hubung. Tidak boleh diawali atau diakhiri tanda hubung."),
  })

  export type CreateStoreState = { error: string } | undefined

  export async function createStoreAction(
    _prev: CreateStoreState,
    formData: FormData,
  ): Promise<CreateStoreState> {
    const session = await requireSession()

    const parsed = CreateStoreInput.safeParse({
      name: formData.get("name"),
      slug: formData.get("slug"),
    })

    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Input tidak valid." }
    }

    const { name, slug } = parsed.data

    if (await slugExists(slug)) {
      return { error: `Slug "${slug}" sudah digunakan. Pilih slug lain.` }
    }

    const store = await createStore({ name, slug, ownerId: session.userId })

    redirect(`/stores/${store.id}/dashboard`)
  }
  ```

- [ ] **Step 2: Buat CreateStoreForm Client Component**

  Buat file `features/builder/components/CreateStoreForm.tsx`:

  ```tsx
  "use client"

  import { useActionState } from "react"
  import { createStoreAction } from "@/app/(builder)/(dashboard)/stores/new/actions"
  import type { CreateStoreState } from "@/app/(builder)/(dashboard)/stores/new/actions"

  export function CreateStoreForm() {
    const [state, action, pending] = useActionState<CreateStoreState, FormData>(
      createStoreAction,
      undefined,
    )

    return (
      <form action={action} className="flex flex-col gap-4">
        {state?.error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            {state.error}
          </p>
        )}

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nama Store
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Toko Sepatu Keren"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Slug (subdomain)
          </label>
          <div className="flex items-center gap-2">
            <input
              id="slug"
              name="slug"
              type="text"
              required
              placeholder="toko-sepatu"
              pattern="[a-z0-9][a-z0-9\-]*[a-z0-9]"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <span className="text-sm text-gray-400 whitespace-nowrap shrink-0">
              .etalase.com
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Hanya huruf kecil, angka, dan tanda hubung. Contoh: toko-sepatu
          </p>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {pending ? "Membuat store..." : "Buat Store"}
        </button>
      </form>
    )
  }
  ```

- [ ] **Step 3: Buat halaman /stores/new**

  Buat direktori `app/(builder)/(dashboard)/stores/new/` lalu buat `page.tsx`:

  ```tsx
  import { CreateStoreForm } from "@/features/builder/components/CreateStoreForm"
  import Link from "next/link"

  export const metadata = { title: "Buat Store Baru — Etalase" }

  export default function NewStorePage() {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            ← Kembali ke Dashboard
          </Link>
        </div>

        <div className="max-w-md">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Buat Store Baru
          </h1>
          <CreateStoreForm />
        </div>
      </div>
    )
  }
  ```

- [ ] **Step 4: Verifikasi TypeScript**

  ```bash
  npx tsc --noEmit 2>&1 | grep -E "stores/new|CreateStoreForm"
  ```

  Expected: tidak ada error di file-file baru.

- [ ] **Step 5: Test manual**

  1. Buka `http://localhost:3000/stores/new`
  2. Isi nama "Test Store" dan slug "test-store"
  3. Klik "Buat Store"
  4. Expected: redirect ke `/stores/[id]/dashboard`
  5. Test validasi: isi slug dengan karakter tidak valid (misal "test store" dengan spasi) — harus muncul error

- [ ] **Step 6: Siapkan commit**

  ```bash
  git add app/\(builder\)/\(dashboard\)/stores/new/ \
          features/builder/components/CreateStoreForm.tsx
  # commit message:
  # feat(store): add /stores/new page with form, validation, and createStoreAction
  ```

---

## Task 5: Create /stores/[storeId]/dashboard

**Files:**
- Create: `app/(builder)/(dashboard)/stores/[storeId]/layout.tsx`
- Create: `app/(builder)/(dashboard)/stores/[storeId]/dashboard/page.tsx`

**Interfaces:**
- Consumes: `requireSession()` → `session.userId`
- Consumes: `getStoreById(id: string): Promise<Store | null>` dari `tenant.service.ts`
- Produces: per-store dashboard page + store layout dengan nav links

**Note:** Next.js 16 — dynamic route params adalah `Promise`. Harus `await params`.

- [ ] **Step 1: Baca Next.js 16 docs tentang dynamic routes**

  ```bash
  cat node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md 2>/dev/null | head -80
  ```

- [ ] **Step 2: Buat store layout**

  Buat `app/(builder)/(dashboard)/stores/[storeId]/layout.tsx`:

  ```tsx
  import type { ReactNode } from "react"
  import Link from "next/link"
  import { requireSession } from "@/features/auth/dal"
  import { getStoreById } from "@/server/services/tenant.service"
  import { notFound } from "next/navigation"
  import {
    LayoutDashboard,
    Package,
    Tag,
    ShoppingCart,
    Users,
    Palette,
    Settings,
  } from "lucide-react"

  const NAV_ITEMS = [
    { label: "Dashboard", href: "dashboard", icon: LayoutDashboard },
    { label: "Produk", href: "products", icon: Package },
    { label: "Kategori", href: "categories", icon: Tag },
    { label: "Order", href: "orders", icon: ShoppingCart },
    { label: "Customer", href: "customers", icon: Users },
    { label: "Kustomisasi", href: "customize", icon: Palette },
    { label: "Pengaturan", href: "settings", icon: Settings },
  ]

  export default async function StoreLayout({
    children,
    params,
  }: {
    children: ReactNode
    params: Promise<{ storeId: string }>
  }) {
    const { storeId } = await params
    const session = await requireSession()
    const store = await getStoreById(storeId)

    if (!store || store.ownerId !== session.userId) notFound()

    return (
      <div className="h-full flex flex-col">
        <div className="px-6 py-3 bg-white border-b border-gray-200 flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            ← Store
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-medium text-gray-900">{store.name}</span>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <nav className="w-44 shrink-0 bg-white border-r border-gray-200 py-4 overflow-y-auto">
            {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={`/stores/${storeId}/${href}`}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            ))}
          </nav>

          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    )
  }
  ```

- [ ] **Step 3: Buat per-store dashboard page**

  Buat `app/(builder)/(dashboard)/stores/[storeId]/dashboard/page.tsx`:

  ```tsx
  import { requireSession } from "@/features/auth/dal"
  import { getStoreById } from "@/server/services/tenant.service"
  import { notFound } from "next/navigation"

  export async function generateMetadata({
    params,
  }: {
    params: Promise<{ storeId: string }>
  }) {
    const { storeId } = await params
    const store = await getStoreById(storeId)
    return { title: store ? `${store.name} — Etalase` : "Store" }
  }

  export default async function StoreDashboardPage({
    params,
  }: {
    params: Promise<{ storeId: string }>
  }) {
    const { storeId } = await params
    const session = await requireSession()
    const store = await getStoreById(storeId)

    if (!store || store.ownerId !== session.userId) notFound()

    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">{store.name}</h1>
          <p className="text-sm text-gray-400 mt-1">
            {store.slug}.etalase.com
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-5 bg-white border border-gray-200 rounded-xl">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Produk
            </p>
            <p className="text-3xl font-semibold text-gray-900 mt-2">0</p>
          </div>
          <div className="p-5 bg-white border border-gray-200 rounded-xl">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Order
            </p>
            <p className="text-3xl font-semibold text-gray-900 mt-2">0</p>
          </div>
          <div className="p-5 bg-white border border-gray-200 rounded-xl">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Customer
            </p>
            <p className="text-3xl font-semibold text-gray-900 mt-2">0</p>
          </div>
        </div>

        <div className="p-5 bg-white border border-gray-200 rounded-xl">
          <p className="text-sm font-medium text-gray-700 mb-1">URL Storefront</p>
          <p className="text-sm text-gray-400">
            {store.slug}.etalase.com
          </p>
          <p className="text-xs text-gray-300 mt-2">
            Storefront aktif setelah template dipilih dan dikustomisasi.
          </p>
        </div>
      </div>
    )
  }
  ```

- [ ] **Step 4: Verifikasi TypeScript**

  ```bash
  npx tsc --noEmit 2>&1 | grep -E "stores/\[storeId\]"
  ```

  Expected: tidak ada error.

- [ ] **Step 5: Test manual end-to-end**

  1. Buka `http://localhost:3000/dashboard`
  2. Klik "Buat Store" → `/stores/new`
  3. Isi form → submit
  4. Expected: redirect ke `/stores/[id]/dashboard` dengan nama store muncul
  5. Klik "← Store" di breadcrumb → kembali ke `/dashboard`
  6. Store card muncul di dashboard list
  7. Test akses store orang lain: akses URL dengan storeId tidak valid → 404

- [ ] **Step 6: Siapkan commit**

  ```bash
  git add app/\(builder\)/\(dashboard\)/stores/
  # commit message:
  # feat(store): add /stores/[storeId]/dashboard with store layout and nav
  ```

---

## Self-Review

**Spec coverage:**
- ✅ `/dashboard` — list semua store milik user (Task 3)
- ✅ `/stores/new` — form buat store (Task 4)
- ✅ `/stores/[storeId]/dashboard` — per-store dashboard (Task 5)
- ✅ Sprint 2 deliverable: "Owner bisa buat store" (Tasks 1–5)
- ⏭️ `/stores/[storeId]/products`, `/stores/[storeId]/orders`, dll → Sprint 4+
- ⏭️ Template picker di `/stores/[storeId]/templates` → Sprint 3

**Placeholder scan:** Tidak ada TBD/TODO dalam implementasi. Stats (0) adalah data nyata dari DB — nanti diisi Sprint 4+.

**Type consistency:**
- `createStore(input: { name, slug, ownerId })` → dipakai di `createStoreAction` ✓
- `slugExists(slug)` → dipakai di `createStoreAction` ✓
- `getStoreById(id)` → dipakai di layout + dashboard page ✓
- `getStoresByOwnerId(ownerId)` → dipakai di dashboard list ✓
- `session.userId` → konsisten di semua tasks ✓
- Params `params: Promise<{ storeId: string }>` + `await params` → konsisten ✓
