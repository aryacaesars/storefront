# Sprint 4 — Product & Category CRUD

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Owner store bisa mengelola kategori dan produk (tambah, edit, hapus) dari dashboard store.

**Architecture:** Semua data product/category disimpan di PostgreSQL via Prisma, scoped per `storeId`. Server Actions dengan Zod validation untuk mutasi data. Client component `ProductForm` digunakan ulang untuk create dan edit. Harga produk disimpan sebagai integer (rupiah tanpa desimal, mis. `50000` = Rp 50.000).

**Tech Stack:** Next.js 16 App Router, Prisma 6, Zod v4, Tailwind CSS v4, `useActionState` (React 19)

## Global Constraints

- Next.js 16: `params: Promise<{ storeId: string }>` — selalu `await params`
- Ownership check wajib di setiap page dan action: `store.ownerId !== session.userId` → `notFound()`
- `requireSession()` dari `@/features/auth/dal`; `getStoreById` dari `@/server/services/tenant.service`
- `slugify` dari `@/server/services/tenant.service` — reuse function ini untuk auto-generate slug
- Harga produk: integer rupiah (mis. `50000` = Rp 50.000). Tampilkan: `Rp ${price.toLocaleString("id-ID")}`
- Tidak ada `git commit` atau `git push` — user yang commit
- Tidak ada automated test — verifikasi via `npx tsc --noEmit` dan manual browser

---

## File Structure

```
Baru:
  server/services/product.service.ts                                    → semua query product + category
  app/(builder)/(dashboard)/stores/[storeId]/categories/page.tsx        → list + add + delete kategori
  app/(builder)/(dashboard)/stores/[storeId]/categories/actions.ts      → createCategory, deleteCategory
  app/(builder)/(dashboard)/stores/[storeId]/products/page.tsx          → list produk
  app/(builder)/(dashboard)/stores/[storeId]/products/new/page.tsx      → halaman tambah produk
  app/(builder)/(dashboard)/stores/[storeId]/products/new/actions.ts    → createProductAction
  app/(builder)/(dashboard)/stores/[storeId]/products/[productId]/page.tsx   → halaman edit produk
  app/(builder)/(dashboard)/stores/[storeId]/products/[productId]/actions.ts → updateProduct, deleteProduct
  features/builder/components/ProductForm.tsx                           → shared form create/edit
  app/(builder)/(dashboard)/stores/[storeId]/settings/page.tsx          → store settings
  app/(builder)/(dashboard)/stores/[storeId]/settings/actions.ts        → updateStoreSettings
```

---

### Task 1: product.service.ts

**Files:**
- Create: `server/services/product.service.ts`

**Interfaces:**
- Produces:
```typescript
import type { Category, Product, ProductImage } from "@prisma/client"
export type { Category, Product, ProductImage }
export type ProductWithCategory = Product & { category: Category | null }
export type ProductWithImages = Product & { category: Category | null; images: ProductImage[] }

export async function getCategories(storeId: string): Promise<Category[]>
export async function createCategory(input: { name: string; slug: string; storeId: string }): Promise<Category>
export async function deleteCategory(id: string, storeId: string): Promise<void>
export async function categorySlugExists(storeId: string, slug: string): Promise<boolean>

export async function getProducts(storeId: string): Promise<ProductWithCategory[]>
export async function getProductById(id: string, storeId: string): Promise<ProductWithImages | null>
export async function createProduct(input: {
  name: string; slug: string; description: string | null
  price: number; stock: number; published: boolean
  storeId: string; categoryId: string | null; imageUrl: string | null
}): Promise<Product>
export async function updateProduct(id: string, storeId: string, input: {
  name: string; slug: string; description: string | null
  price: number; stock: number; published: boolean
  categoryId: string | null; imageUrl: string | null
}): Promise<Product>
export async function deleteProduct(id: string, storeId: string): Promise<void>
export async function productSlugExists(storeId: string, slug: string, excludeId?: string): Promise<boolean>
```

- [ ] **Step 1: Buat `server/services/product.service.ts`**

```typescript
import "server-only"
import { prisma } from "@/lib/db/prisma"
import type { Category, Product, ProductImage } from "@prisma/client"

export type { Category, Product, ProductImage }
export type ProductWithCategory = Product & { category: Category | null }
export type ProductWithImages = Product & {
  category: Category | null
  images: ProductImage[]
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getCategories(storeId: string): Promise<Category[]> {
  return prisma.category.findMany({
    where: { storeId },
    orderBy: { name: "asc" },
  })
}

export async function createCategory(input: {
  name: string
  slug: string
  storeId: string
}): Promise<Category> {
  return prisma.category.create({ data: input })
}

export async function deleteCategory(id: string, storeId: string): Promise<void> {
  await prisma.category.delete({ where: { id, storeId } })
}

export async function categorySlugExists(
  storeId: string,
  slug: string,
): Promise<boolean> {
  const count = await prisma.category.count({ where: { storeId, slug } })
  return count > 0
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getProducts(storeId: string): Promise<ProductWithCategory[]> {
  return prisma.product.findMany({
    where: { storeId },
    include: { category: true },
    orderBy: { name: "asc" },
  })
}

export async function getProductById(
  id: string,
  storeId: string,
): Promise<ProductWithImages | null> {
  return prisma.product.findUnique({
    where: { id, storeId },
    include: { category: true, images: { orderBy: { order: "asc" } } },
  })
}

export async function createProduct(input: {
  name: string
  slug: string
  description: string | null
  price: number
  stock: number
  published: boolean
  storeId: string
  categoryId: string | null
  imageUrl: string | null
}): Promise<Product> {
  const { imageUrl, ...data } = input
  return prisma.product.create({
    data: {
      ...data,
      images: imageUrl
        ? { create: { url: imageUrl, order: 0 } }
        : undefined,
    },
  })
}

export async function updateProduct(
  id: string,
  storeId: string,
  input: {
    name: string
    slug: string
    description: string | null
    price: number
    stock: number
    published: boolean
    categoryId: string | null
    imageUrl: string | null
  },
): Promise<Product> {
  const { imageUrl, ...data } = input
  // Ganti semua gambar — hapus lama, buat baru
  await prisma.productImage.deleteMany({ where: { productId: id } })
  return prisma.product.update({
    where: { id, storeId },
    data: {
      ...data,
      images: imageUrl
        ? { create: { url: imageUrl, order: 0 } }
        : undefined,
    },
  })
}

export async function deleteProduct(id: string, storeId: string): Promise<void> {
  await prisma.product.delete({ where: { id, storeId } })
}

export async function productSlugExists(
  storeId: string,
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  const count = await prisma.product.count({
    where: { storeId, slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
  })
  return count > 0
}
```

- [ ] **Step 2: Verifikasi TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep "product.service"
```

Expected: 0 error.

---

### Task 2: Category management

**Files:**
- Create: `app/(builder)/(dashboard)/stores/[storeId]/categories/page.tsx`
- Create: `app/(builder)/(dashboard)/stores/[storeId]/categories/actions.ts`

**Interfaces:**
- Consumes: `getCategories`, `createCategory`, `deleteCategory`, `categorySlugExists` dari `@/server/services/product.service`; `slugify` dari `@/server/services/tenant.service`

- [ ] **Step 1: Buat `actions.ts`**

```typescript
"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireSession } from "@/features/auth/dal"
import { getStoreById, slugify } from "@/server/services/tenant.service"
import {
  createCategory,
  deleteCategory,
  categorySlugExists,
} from "@/server/services/product.service"
import { notFound } from "next/navigation"

const CategoryInput = z.object({
  name: z.string().trim().min(1, "Nama kategori wajib diisi.").max(100),
})

export type CategoryState = { error: string } | undefined

async function requireOwner(storeId: string) {
  const session = await requireSession()
  const store = await getStoreById(storeId)
  if (!store || store.ownerId !== session.userId) notFound()
  return store
}

export async function createCategoryAction(
  storeId: string,
  _prev: CategoryState,
  formData: FormData,
): Promise<CategoryState> {
  await requireOwner(storeId)

  const parsed = CategoryInput.safeParse({ name: formData.get("name") })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Input tidak valid." }

  const slug = slugify(parsed.data.name)
  if (!slug) return { error: "Nama menghasilkan slug kosong. Gunakan nama lain." }

  if (await categorySlugExists(storeId, slug)) {
    return { error: `Kategori "${parsed.data.name}" sudah ada.` }
  }

  await createCategory({ name: parsed.data.name, slug, storeId })
  revalidatePath(`/stores/${storeId}/categories`)
}

export async function deleteCategoryAction(
  storeId: string,
  categoryId: string,
): Promise<void> {
  await requireOwner(storeId)
  await deleteCategory(categoryId, storeId)
  revalidatePath(`/stores/${storeId}/categories`)
}
```

- [ ] **Step 2: Buat `page.tsx`**

```typescript
"use client"

import { useActionState } from "react"
import { Trash2 } from "lucide-react"
import type { Category } from "@/server/services/product.service"
import { createCategoryAction, deleteCategoryAction } from "./actions"
import type { CategoryState } from "./actions"

function CategoryList({
  categories,
  storeId,
}: {
  categories: Category[]
  storeId: string
}) {
  if (categories.length === 0) {
    return (
      <p className="text-sm text-gray-400 py-4">
        Belum ada kategori.
      </p>
    )
  }
  return (
    <ul className="divide-y divide-gray-100">
      {categories.map((cat) => (
        <li key={cat.id} className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium text-gray-900">{cat.name}</p>
            <p className="text-xs text-gray-400">{cat.slug}</p>
          </div>
          <form action={deleteCategoryAction.bind(null, storeId, cat.id)}>
            <button
              type="submit"
              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
              title="Hapus kategori"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </form>
        </li>
      ))}
    </ul>
  )
}

function AddCategoryForm({ storeId }: { storeId: string }) {
  const boundAction = createCategoryAction.bind(null, storeId)
  const [state, action, pending] = useActionState<CategoryState, FormData>(
    boundAction,
    undefined,
  )

  return (
    <form action={action} className="flex gap-2 mt-4">
      <div className="flex-1">
        {state?.error && (
          <p className="text-xs text-red-600 mb-1">{state.error}</p>
        )}
        <input
          name="name"
          type="text"
          placeholder="Nama kategori..."
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
      >
        {pending ? "..." : "Tambah"}
      </button>
    </form>
  )
}
```

> **Note:** File `page.tsx` ini adalah Client Component (`"use client"` di top). Tapi kita butuh fetch data di server. Solusi: buat `page.tsx` sebagai Server Component yang fetch data, lalu render Client Component untuk form.

Revisi — pisah menjadi dua bagian di file yang sama:

```typescript
// app/(builder)/(dashboard)/stores/[storeId]/categories/page.tsx
import { notFound } from "next/navigation"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { getCategories } from "@/server/services/product.service"
import { CategoryPageClient } from "./CategoryPageClient"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storeId: string }>
}) {
  const { storeId } = await params
  const store = await getStoreById(storeId)
  return { title: store ? `Kategori — ${store.name}` : "Kategori" }
}

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ storeId: string }>
}) {
  const { storeId } = await params
  const session = await requireSession()
  const store = await getStoreById(storeId)
  if (!store || store.ownerId !== session.userId) notFound()

  const categories = await getCategories(storeId)

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Kategori</h1>
        <p className="text-sm text-gray-400 mt-1">
          Kelola kategori produk untuk {store.name}
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <CategoryPageClient categories={categories} storeId={storeId} />
      </div>
    </div>
  )
}
```

Buat file terpisah untuk Client Component:

```typescript
// app/(builder)/(dashboard)/stores/[storeId]/categories/CategoryPageClient.tsx
"use client"

import { useActionState } from "react"
import { Trash2 } from "lucide-react"
import type { Category } from "@/server/services/product.service"
import { createCategoryAction, deleteCategoryAction } from "./actions"
import type { CategoryState } from "./actions"

export function CategoryPageClient({
  categories,
  storeId,
}: {
  categories: Category[]
  storeId: string
}) {
  const boundAction = createCategoryAction.bind(null, storeId)
  const [state, action, pending] = useActionState<CategoryState, FormData>(
    boundAction,
    undefined,
  )

  return (
    <>
      {categories.length === 0 ? (
        <p className="text-sm text-gray-400 py-2">Belum ada kategori.</p>
      ) : (
        <ul className="divide-y divide-gray-100 mb-4">
          {categories.map((cat) => (
            <li key={cat.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{cat.name}</p>
                <p className="text-xs text-gray-400">{cat.slug}</p>
              </div>
              <form action={deleteCategoryAction.bind(null, storeId, cat.id)}>
                <button
                  type="submit"
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                  title="Hapus kategori"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}

      <form action={action} className="flex gap-2 pt-4 border-t border-gray-100">
        <div className="flex-1">
          {state?.error && (
            <p className="text-xs text-red-600 mb-1">{state.error}</p>
          )}
          <input
            name="name"
            type="text"
            placeholder="Nama kategori baru..."
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {pending ? "..." : "Tambah"}
        </button>
      </form>
    </>
  )
}
```

**File yang dibuat di Task 2:**
- `app/(builder)/(dashboard)/stores/[storeId]/categories/actions.ts`
- `app/(builder)/(dashboard)/stores/[storeId]/categories/page.tsx`
- `app/(builder)/(dashboard)/stores/[storeId]/categories/CategoryPageClient.tsx`

- [ ] **Step 3: Verifikasi TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep "categories"
```

Expected: 0 error.

- [ ] **Step 4: Test manual di browser**

Buka `/stores/[storeId]/categories`. Tambah kategori "Pakaian" → slug `pakaian` muncul di list. Tambah kategori kedua "Sepatu". Hapus salah satu → hilang dari list.

---

### Task 3: Products list page

**Files:**
- Create: `app/(builder)/(dashboard)/stores/[storeId]/products/page.tsx`

**Interfaces:**
- Consumes: `getProducts`, `ProductWithCategory` dari `@/server/services/product.service`

- [ ] **Step 1: Buat `page.tsx`**

```typescript
import Link from "next/link"
import { notFound } from "next/navigation"
import { Plus } from "lucide-react"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { getProducts } from "@/server/services/product.service"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storeId: string }>
}) {
  const { storeId } = await params
  const store = await getStoreById(storeId)
  return { title: store ? `Produk — ${store.name}` : "Produk" }
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ storeId: string }>
}) {
  const { storeId } = await params
  const session = await requireSession()
  const store = await getStoreById(storeId)
  if (!store || store.ownerId !== session.userId) notFound()

  const products = await getProducts(storeId)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Produk</h1>
          <p className="text-sm text-gray-400 mt-1">
            {products.length} produk di {store.name}
          </p>
        </div>
        <Link
          href={`/stores/${storeId}/products/new`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Produk
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-gray-400 text-sm mb-4">Belum ada produk.</p>
          <Link
            href={`/stores/${storeId}/products/new`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Produk Pertama
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Produk</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Harga</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stok</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-400">{product.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {product.category?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900">
                    Rp {product.price.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-500">
                    {product.stock}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        product.published
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {product.published ? "Aktif" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/stores/${storeId}/products/${product.id}`}
                      className="text-indigo-600 hover:text-indigo-800 text-xs font-medium"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verifikasi TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep "products/page"
```

Expected: 0 error.

---

### Task 4: ProductForm component + Create product

**Files:**
- Create: `features/builder/components/ProductForm.tsx`
- Create: `app/(builder)/(dashboard)/stores/[storeId]/products/new/actions.ts`
- Create: `app/(builder)/(dashboard)/stores/[storeId]/products/new/page.tsx`

**Interfaces:**
- Consumes: `createProduct`, `productSlugExists`, `getCategories`, `Category` dari product.service; `slugify` dari tenant.service
- Produces: `ProductForm` component digunakan T5

- [ ] **Step 1: Buat `features/builder/components/ProductForm.tsx`**

```typescript
"use client"

import { useActionState, useEffect, useRef } from "react"
import type { Category } from "@/server/services/product.service"

export type ProductFormState = { error: string } | { success: true } | undefined

interface ProductFormProps {
  storeId: string
  categories: Category[]
  action: (prev: ProductFormState, formData: FormData) => Promise<ProductFormState>
  defaultValues?: {
    name?: string
    description?: string
    price?: number
    stock?: number
    published?: boolean
    categoryId?: string
    imageUrl?: string
  }
  submitLabel?: string
  extraActions?: React.ReactNode
}

export function ProductForm({
  categories,
  action,
  defaultValues = {},
  submitLabel = "Simpan",
  extraActions,
}: ProductFormProps) {
  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(
    action,
    undefined,
  )

  return (
    <form action={formAction} className="flex flex-col gap-5 max-w-2xl">
      {state && "error" in state && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          {state.error}
        </p>
      )}
      {state && "success" in state && (
        <p className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
          Produk berhasil disimpan.
        </p>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nama Produk <span className="text-red-500">*</span>
        </label>
        <input
          name="name"
          type="text"
          required
          defaultValue={defaultValues.name}
          placeholder="Kaos Polos Hitam"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Deskripsi
        </label>
        <textarea
          name="description"
          rows={3}
          defaultValue={defaultValues.description ?? ""}
          placeholder="Deskripsi produk..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Harga (Rp) <span className="text-red-500">*</span>
          </label>
          <input
            name="price"
            type="number"
            required
            min={0}
            defaultValue={defaultValues.price ?? 0}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stok <span className="text-red-500">*</span>
          </label>
          <input
            name="stock"
            type="number"
            required
            min={0}
            defaultValue={defaultValues.stock ?? 0}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Kategori
        </label>
        <select
          name="categoryId"
          defaultValue={defaultValues.categoryId ?? ""}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
        >
          <option value="">— Tanpa kategori —</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL Gambar Utama
        </label>
        <input
          name="imageUrl"
          type="url"
          defaultValue={defaultValues.imageUrl ?? ""}
          placeholder="https://..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
        <p className="text-xs text-gray-400 mt-1">Opsional. Paste URL gambar produk.</p>
      </div>

      <div className="flex items-center gap-3">
        <input
          id="published"
          name="published"
          type="checkbox"
          defaultChecked={defaultValues.published ?? false}
          className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
        />
        <label htmlFor="published" className="text-sm font-medium text-gray-700">
          Tampilkan di storefront (Aktif)
        </label>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="px-5 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {pending ? "Menyimpan..." : submitLabel}
        </button>
        {extraActions}
      </div>
    </form>
  )
}
```

- [ ] **Step 2: Buat `products/new/actions.ts`**

```typescript
"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { requireSession } from "@/features/auth/dal"
import { getStoreById, slugify } from "@/server/services/tenant.service"
import { createProduct, productSlugExists } from "@/server/services/product.service"
import { notFound } from "next/navigation"
import type { ProductFormState } from "@/features/builder/components/ProductForm"

const ProductInput = z.object({
  name: z.string().trim().min(1, "Nama produk wajib diisi.").max(200),
  description: z.string().trim().max(2000).optional(),
  price: z.coerce.number().int().min(0, "Harga tidak boleh negatif."),
  stock: z.coerce.number().int().min(0, "Stok tidak boleh negatif."),
  categoryId: z.string().optional(),
  imageUrl: z.string().url("URL gambar tidak valid.").optional().or(z.literal("")),
  published: z.string().optional(),
})

export async function createProductAction(
  storeId: string,
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const session = await requireSession()
  const store = await getStoreById(storeId)
  if (!store || store.ownerId !== session.userId) notFound()

  const raw = {
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    categoryId: formData.get("categoryId"),
    imageUrl: formData.get("imageUrl"),
    published: formData.get("published"),
  }

  const parsed = ProductInput.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid." }
  }

  const slug = slugify(parsed.data.name)
  if (!slug) return { error: "Nama menghasilkan slug kosong." }

  if (await productSlugExists(storeId, slug)) {
    return { error: `Produk dengan nama "${parsed.data.name}" sudah ada di store ini.` }
  }

  const product = await createProduct({
    name: parsed.data.name,
    slug,
    description: parsed.data.description || null,
    price: parsed.data.price,
    stock: parsed.data.stock,
    published: parsed.data.published === "on",
    storeId,
    categoryId: parsed.data.categoryId || null,
    imageUrl: parsed.data.imageUrl || null,
  })

  redirect(`/stores/${storeId}/products/${product.id}`)
}
```

- [ ] **Step 3: Buat `products/new/page.tsx`**

```typescript
import Link from "next/link"
import { notFound } from "next/navigation"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { getCategories } from "@/server/services/product.service"
import { ProductForm } from "@/features/builder/components/ProductForm"
import { createProductAction } from "./actions"

export const metadata = { title: "Tambah Produk" }

export default async function NewProductPage({
  params,
}: {
  params: Promise<{ storeId: string }>
}) {
  const { storeId } = await params
  const session = await requireSession()
  const store = await getStoreById(storeId)
  if (!store || store.ownerId !== session.userId) notFound()

  const categories = await getCategories(storeId)
  const action = createProductAction.bind(null, storeId)

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href={`/stores/${storeId}/products`}
          className="text-sm text-gray-400 hover:text-gray-700"
        >
          ← Produk
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 mt-2">Tambah Produk</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <ProductForm
          storeId={storeId}
          categories={categories}
          action={action}
          submitLabel="Tambah Produk"
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Verifikasi TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep -E "ProductForm|products/new"
```

Expected: 0 error.

- [ ] **Step 5: Test manual**

Buka `/stores/[storeId]/products/new`. Isi nama "Kaos Hitam", harga 50000, stok 10, centang Aktif → submit. Expected: redirect ke `/stores/[storeId]/products/[id]`. Buka `/stores/[storeId]/products` → produk muncul di tabel.

---

### Task 5: Edit product

**Files:**
- Create: `app/(builder)/(dashboard)/stores/[storeId]/products/[productId]/actions.ts`
- Create: `app/(builder)/(dashboard)/stores/[storeId]/products/[productId]/page.tsx`

**Interfaces:**
- Consumes: `ProductForm`, `ProductFormState` dari T4; `getProductById`, `updateProduct`, `deleteProduct`, `productSlugExists`, `getCategories` dari product.service

- [ ] **Step 1: Buat `[productId]/actions.ts`**

```typescript
"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { requireSession } from "@/features/auth/dal"
import { getStoreById, slugify } from "@/server/services/tenant.service"
import {
  updateProduct,
  deleteProduct,
  productSlugExists,
} from "@/server/services/product.service"
import { notFound } from "next/navigation"
import type { ProductFormState } from "@/features/builder/components/ProductForm"

const ProductInput = z.object({
  name: z.string().trim().min(1, "Nama produk wajib diisi.").max(200),
  description: z.string().trim().max(2000).optional(),
  price: z.coerce.number().int().min(0, "Harga tidak boleh negatif."),
  stock: z.coerce.number().int().min(0, "Stok tidak boleh negatif."),
  categoryId: z.string().optional(),
  imageUrl: z.string().url("URL gambar tidak valid.").optional().or(z.literal("")),
  published: z.string().optional(),
})

async function requireOwner(storeId: string) {
  const session = await requireSession()
  const store = await getStoreById(storeId)
  if (!store || store.ownerId !== session.userId) notFound()
  return store
}

export async function updateProductAction(
  storeId: string,
  productId: string,
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireOwner(storeId)

  const raw = {
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    categoryId: formData.get("categoryId"),
    imageUrl: formData.get("imageUrl"),
    published: formData.get("published"),
  }

  const parsed = ProductInput.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid." }
  }

  const slug = slugify(parsed.data.name)
  if (!slug) return { error: "Nama menghasilkan slug kosong." }

  if (await productSlugExists(storeId, slug, productId)) {
    return { error: `Produk lain dengan nama "${parsed.data.name}" sudah ada.` }
  }

  await updateProduct(productId, storeId, {
    name: parsed.data.name,
    slug,
    description: parsed.data.description || null,
    price: parsed.data.price,
    stock: parsed.data.stock,
    published: parsed.data.published === "on",
    categoryId: parsed.data.categoryId || null,
    imageUrl: parsed.data.imageUrl || null,
  })

  revalidatePath(`/stores/${storeId}/products`)
  return { success: true }
}

export async function deleteProductAction(
  storeId: string,
  productId: string,
): Promise<void> {
  await requireOwner(storeId)
  await deleteProduct(productId, storeId)
  redirect(`/stores/${storeId}/products`)
}
```

- [ ] **Step 2: Buat `[productId]/page.tsx`**

```typescript
import { notFound } from "next/navigation"
import Link from "next/link"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { getProductById, getCategories } from "@/server/services/product.service"
import { ProductForm } from "@/features/builder/components/ProductForm"
import { updateProductAction, deleteProductAction } from "./actions"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storeId: string; productId: string }>
}) {
  const { productId, storeId } = await params
  const product = await getProductById(productId, storeId)
  return { title: product ? `Edit — ${product.name}` : "Edit Produk" }
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ storeId: string; productId: string }>
}) {
  const { storeId, productId } = await params
  const session = await requireSession()
  const store = await getStoreById(storeId)
  if (!store || store.ownerId !== session.userId) notFound()

  const [product, categories] = await Promise.all([
    getProductById(productId, storeId),
    getCategories(storeId),
  ])
  if (!product) notFound()

  const updateAction = updateProductAction.bind(null, storeId, productId)
  const deleteAction = deleteProductAction.bind(null, storeId, productId)

  const firstImage = product.images[0]?.url ?? ""

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href={`/stores/${storeId}/products`}
          className="text-sm text-gray-400 hover:text-gray-700"
        >
          ← Produk
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 mt-2">
          Edit: {product.name}
        </h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <ProductForm
          storeId={storeId}
          categories={categories}
          action={updateAction}
          defaultValues={{
            name: product.name,
            description: product.description ?? "",
            price: product.price,
            stock: product.stock,
            published: product.published,
            categoryId: product.categoryId ?? "",
            imageUrl: firstImage,
          }}
          submitLabel="Simpan Perubahan"
          extraActions={
            <form action={deleteAction}>
              <button
                type="submit"
                className="px-5 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
                onClick={(e) => {
                  if (!confirm("Hapus produk ini? Tindakan tidak bisa dibatalkan.")) {
                    e.preventDefault()
                  }
                }}
              >
                Hapus Produk
              </button>
            </form>
          }
        />
      </div>
    </div>
  )
}
```

> **Note:** `onClick` di server-rendered button yang di dalam `"use client"` sudah aman — `ProductForm` adalah client component, jadi `extraActions` prop dirender sebagai JSX di client.

- [ ] **Step 3: Verifikasi TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep -E "productId|EditProduct"
```

Expected: 0 error.

- [ ] **Step 4: Test manual**

Klik "Edit" dari halaman list produk → form terisi dengan data produk. Edit nama → "Simpan Perubahan" → badge "Produk berhasil disimpan" muncul. Klik "Hapus Produk" → confirm dialog → redirect ke list produk, produk tidak ada.

---

### Task 6: Store settings

**Files:**
- Create: `app/(builder)/(dashboard)/stores/[storeId]/settings/page.tsx`
- Create: `app/(builder)/(dashboard)/stores/[storeId]/settings/actions.ts`
- Modify: `server/services/tenant.service.ts` (tambah `updateStoreName`)

**Interfaces:**
- Consumes: `getStoreById` dari tenant.service
- Produces: `updateStoreName(id, name)` di tenant.service

- [ ] **Step 1: Tambah `updateStoreName` ke `server/services/tenant.service.ts`**

Buka file, tambah fungsi di akhir:

```typescript
export async function updateStoreName(id: string, name: string): Promise<Store> {
  return prisma.store.update({ where: { id }, data: { name } })
}
```

- [ ] **Step 2: Buat `settings/actions.ts`**

```typescript
"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireSession } from "@/features/auth/dal"
import { getStoreById, updateStoreName } from "@/server/services/tenant.service"
import { notFound } from "next/navigation"

const SettingsInput = z.object({
  name: z.string().trim().min(1, "Nama store wajib diisi.").max(100),
})

export type SettingsState = { error: string } | { success: true } | undefined

export async function updateStoreSettingsAction(
  storeId: string,
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const session = await requireSession()
  const store = await getStoreById(storeId)
  if (!store || store.ownerId !== session.userId) notFound()

  const parsed = SettingsInput.safeParse({ name: formData.get("name") })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid." }
  }

  await updateStoreName(storeId, parsed.data.name)
  revalidatePath(`/stores/${storeId}/settings`)
  revalidatePath("/dashboard")
  return { success: true }
}
```

- [ ] **Step 3: Buat `settings/page.tsx`**

```typescript
import { notFound } from "next/navigation"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { SettingsForm } from "./SettingsForm"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storeId: string }>
}) {
  const { storeId } = await params
  const store = await getStoreById(storeId)
  return { title: store ? `Pengaturan — ${store.name}` : "Pengaturan" }
}

export default async function StoreSettingsPage({
  params,
}: {
  params: Promise<{ storeId: string }>
}) {
  const { storeId } = await params
  const session = await requireSession()
  const store = await getStoreById(storeId)
  if (!store || store.ownerId !== session.userId) notFound()

  return (
    <div className="p-6 max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Pengaturan Store</h1>
        <p className="text-sm text-gray-400 mt-1">{store.slug}.etalase.com</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SettingsForm storeId={storeId} defaultName={store.name} />
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Buat `settings/SettingsForm.tsx`**

```typescript
"use client"

import { useActionState } from "react"
import { updateStoreSettingsAction } from "./actions"
import type { SettingsState } from "./actions"

export function SettingsForm({
  storeId,
  defaultName,
}: {
  storeId: string
  defaultName: string
}) {
  const action = updateStoreSettingsAction.bind(null, storeId)
  const [state, formAction, pending] = useActionState<SettingsState, FormData>(
    action,
    undefined,
  )

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state && "error" in state && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{state.error}</p>
      )}
      {state && "success" in state && (
        <p className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
          Pengaturan berhasil disimpan.
        </p>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nama Store
        </label>
        <input
          name="name"
          type="text"
          required
          defaultValue={defaultName}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors w-fit"
      >
        {pending ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  )
}
```

- [ ] **Step 5: Verifikasi TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep "settings"
```

Expected: 0 error.

---

## Self-Review

### Spec coverage:
- ✅ `/stores/[storeId]/products` — list (T3)
- ✅ `/stores/[storeId]/products/new` — tambah (T4)
- ✅ `/stores/[storeId]/products/[id]` — edit (T5)
- ✅ `/stores/[storeId]/categories` — kelola (T2)
- ✅ `/stores/[storeId]/settings` — pengaturan store (T6)

### Placeholder scan: tidak ada TBD/TODO.

### Type consistency:
- `ProductFormState` didefinisikan di T4 `ProductForm.tsx`, diimport di T5 `actions.ts` ✅
- `createProductAction.bind(null, storeId)` → signature `(storeId, prev, formData)` → bind remove storeId → `(prev, formData)` sesuai `useActionState` ✅
- `updateProductAction.bind(null, storeId, productId)` → removes dua param pertama → `(prev, formData)` ✅
- `productSlugExists(storeId, slug, excludeId?)` → T5 calls `productSlugExists(storeId, slug, productId)` ✅
- `getProductById(id, storeId)` — konsisten antara T1, T5 ✅
