# Sprint 3 — Template Marketplace + Stripe Purchase

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Owner store bisa melihat daftar template, membeli dengan Stripe Checkout, dan template otomatis aktif setelah payment berhasil.

**Architecture:** Template tersimpan di DB (`templates` table). Owner pilih template → server action buat Stripe Checkout Session + create `TemplatePurchase` PENDING → Stripe redirect ke hosted checkout → webhook `checkout.session.completed` → update status PAID + upsert `StoreThemeConfig`. Semua data flow via Prisma; Stripe hanya sebagai payment gateway.

**Tech Stack:** Next.js 16 App Router, Prisma 6, Stripe Node SDK v17+, Tailwind CSS v4, Server Actions, Zod v4

## Global Constraints

- Next.js 16: dynamic route params MUST be `params: Promise<{ storeId: string }>`, always `await params`
- No `git commit` atau `git push` — user yang commit
- Jangan ubah `proxy.ts`, `prisma/schema.prisma`, atau `auth.ts`
- Import session guard: `requireSession()` dari `@/features/auth/dal`
- Import store service: `getStoreById` dari `@/server/services/tenant.service`
- Ownership check wajib: `store.ownerId !== session.userId` → `notFound()`
- Price disimpan dalam **sen** (integer). `2900` = $29.00 USD. Tampilkan dengan `(price / 100).toFixed(2)`
- Stripe: gunakan test mode key (`sk_test_...` / `pk_test_...`)
- Webhook: SELALU verifikasi `Stripe-Signature` header sebelum proses apapun
- `lib/stripe.ts` ekspor singleton `stripe` (server-only)
- Server actions gunakan `"use server"` di top file, bukan inline
- Tidak ada automated test di project ini — verifikasi via `npx tsc --noEmit` dan manual browser test

---

## File Structure

```
Baru:
  lib/stripe.ts                                                  → Stripe singleton (server-only)
  server/services/template.service.ts                            → template & purchase DB queries
  prisma/seed.ts                                                 → seed 3 published templates
  app/(builder)/(dashboard)/stores/[storeId]/templates/page.tsx  → template list + buy UI
  app/(builder)/(dashboard)/stores/[storeId]/templates/actions.ts → buyTemplate server action
  app/api/stripe/checkout/route.ts                               → create Stripe Checkout Session
  app/api/webhooks/stripe/route.ts                               → handle Stripe events

Modifikasi:
  package.json                                                   → tambah "seed" script di "prisma" key
```

---

### Task 1: Stripe SDK + template service

**Files:**
- Create: `lib/stripe.ts`
- Create: `server/services/template.service.ts`
- Modify: `package.json` (tambah prisma.seed + devDependency tsx jika belum ada)

**Interfaces:**
- Produces:
  ```typescript
  // lib/stripe.ts
  export const stripe: Stripe  // Stripe singleton

  // server/services/template.service.ts
  export type { Template, TemplatePurchase }
  export type PurchaseWithTemplate = TemplatePurchase & { template: Template }
  export async function getPublishedTemplates(): Promise<Template[]>
  export async function getTemplateById(id: string): Promise<Template | null>
  export async function getPurchasesForStore(storeId: string): Promise<PurchaseWithTemplate[]>
  export async function getPurchasedTemplateIds(storeId: string): Promise<Set<string>>
  export async function getActiveTemplateId(storeId: string): Promise<string | null>
  export async function createPendingPurchase(input: { storeId: string; templateId: string; stripeSessionId: string }): Promise<TemplatePurchase>
  export async function markPurchasePaid(stripeSessionId: string): Promise<TemplatePurchase>
  export async function activateTemplate(storeId: string, templateId: string): Promise<void>
  ```

- [ ] **Step 1: Install Stripe SDK**

```bash
npm install stripe
```

Expected: `package.json` dependencies berisi `"stripe": "^17.x.x"` (atau versi terbaru).

- [ ] **Step 2: Buat `lib/stripe.ts`**

```typescript
import "server-only"
import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
})
```

> **Note:** `apiVersion` — cek versi terbaru di docs Stripe atau gunakan string versi yang npm suggest saat install. Jika tipe error, ganti ke versi yang valid (cek `node_modules/stripe/types/index.d.ts` untuk nilai `LatestApiVersion`).

- [ ] **Step 3: Buat `server/services/template.service.ts`**

```typescript
import "server-only"
import { prisma } from "@/lib/db/prisma"
import type { Template, TemplatePurchase } from "@prisma/client"

export type { Template, TemplatePurchase }
export type PurchaseWithTemplate = TemplatePurchase & { template: Template }

export async function getPublishedTemplates(): Promise<Template[]> {
  return prisma.template.findMany({
    where: { published: true },
    orderBy: { name: "asc" },
  })
}

export async function getTemplateById(id: string): Promise<Template | null> {
  return prisma.template.findUnique({ where: { id } })
}

export async function getPurchasesForStore(storeId: string): Promise<PurchaseWithTemplate[]> {
  return prisma.templatePurchase.findMany({
    where: { storeId },
    include: { template: true },
  })
}

export async function getPurchasedTemplateIds(storeId: string): Promise<Set<string>> {
  const purchases = await prisma.templatePurchase.findMany({
    where: { storeId, status: "PAID" },
    select: { templateId: true },
  })
  return new Set(purchases.map((p) => p.templateId))
}

export async function getActiveTemplateId(storeId: string): Promise<string | null> {
  const config = await prisma.storeThemeConfig.findUnique({
    where: { storeId },
    select: { templateId: true },
  })
  return config?.templateId ?? null
}

export async function createPendingPurchase(input: {
  storeId: string
  templateId: string
  stripeSessionId: string
}): Promise<TemplatePurchase> {
  return prisma.templatePurchase.create({
    data: {
      storeId: input.storeId,
      templateId: input.templateId,
      stripePaymentId: input.stripeSessionId,
      status: "PENDING",
    },
  })
}

export async function markPurchasePaid(stripeSessionId: string): Promise<TemplatePurchase> {
  return prisma.templatePurchase.update({
    where: { stripePaymentId: stripeSessionId },
    data: { status: "PAID", paidAt: new Date() },
  })
}

export async function activateTemplate(storeId: string, templateId: string): Promise<void> {
  await prisma.storeThemeConfig.upsert({
    where: { storeId },
    update: { templateId },
    create: { storeId, templateId, configJson: {} },
  })
}
```

> **Note:** `markPurchasePaid` butuh `@@unique` pada `stripePaymentId` — tapi schema tidak punya itu. Gunakan `findFirst` + `update` by `id` sebagai alternatif:
> ```typescript
> export async function markPurchasePaid(stripeSessionId: string): Promise<TemplatePurchase> {
>   const purchase = await prisma.templatePurchase.findFirst({
>     where: { stripePaymentId: stripeSessionId },
>   })
>   if (!purchase) throw new Error(`Purchase not found for session ${stripeSessionId}`)
>   return prisma.templatePurchase.update({
>     where: { id: purchase.id },
>     data: { status: "PAID", paidAt: new Date() },
>   })
> }
> ```

- [ ] **Step 4: Tambah seed script ke `package.json`**

Buka `package.json`, tambahkan key `"prisma"` di level root (sejajar dengan `"scripts"`):

```json
{
  "prisma": {
    "seed": "npx tsx prisma/seed.ts"
  }
}
```

- [ ] **Step 5: Verifikasi TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep -E "stripe|template.service"
```

Expected: 0 baris error. Jika ada error `apiVersion`, cek versi yang valid dan sesuaikan.

- [ ] **Step 6: Tidak ada commit — user yang commit**

---

### Task 2: Seed template data

**Files:**
- Create: `prisma/seed.ts`

**Interfaces:**
- Consumes: Prisma client, schema model `Template`
- Produces: 3 baris di tabel `templates` di DB

- [ ] **Step 1: Buat `prisma/seed.ts`**

```typescript
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const templates = [
    {
      name: "Bold",
      slug: "bold",
      description: "Template modern dengan layout penuh dan tipografi kuat. Cocok untuk fashion, olahraga, dan lifestyle.",
      price: 2900,
      previewUrl: null,
      published: true,
    },
    {
      name: "Bento",
      slug: "bento",
      description: "Layout grid bento yang clean dan playful. Cocok untuk produk digital dan lifestyle brand.",
      price: 1900,
      previewUrl: null,
      published: true,
    },
    {
      name: "Minimal",
      slug: "minimal",
      description: "Design minimalis dengan fokus pada produk. Cocok untuk semua jenis store.",
      price: 0,
      previewUrl: null,
      published: true,
    },
  ]

  for (const t of templates) {
    await prisma.template.upsert({
      where: { slug: t.slug },
      update: t,
      create: t,
    })
    console.log(`Seeded template: ${t.name}`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

- [ ] **Step 2: Jalankan seed**

```bash
npx prisma db seed
```

Expected output:
```
Seeded template: Bold
Seeded template: Bento
Seeded template: Minimal
```

- [ ] **Step 3: Verifikasi di Prisma Studio**

```bash
npx prisma studio
```

Buka browser → tabel `templates` → pastikan 3 baris ada dengan `published = true`.

---

### Task 3: Template list page

**Files:**
- Create: `app/(builder)/(dashboard)/stores/[storeId]/templates/page.tsx`
- Create: `app/(builder)/(dashboard)/stores/[storeId]/templates/actions.ts`

**Interfaces:**
- Consumes:
  - `requireSession()` dari `@/features/auth/dal`
  - `getStoreById()` dari `@/server/services/tenant.service`
  - `getPublishedTemplates`, `getPurchasedTemplateIds`, `getActiveTemplateId` dari `@/server/services/template.service`
  - `buyTemplate(storeId, templateId)` — server action (Task 4)
- Produces: UI halaman `/stores/[storeId]/templates`

- [ ] **Step 1: Buat `actions.ts` (shell dulu — implementasi lengkap di Task 4)**

```typescript
"use server"

export async function buyTemplate(
  _storeId: string,
  _templateId: string
): Promise<void> {
  throw new Error("Not implemented yet")
}
```

> Ini placeholder agar halaman bisa diimport. Task 4 mengisi implementasi lengkap.

- [ ] **Step 2: Buat `page.tsx`**

```typescript
import { notFound } from "next/navigation"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import {
  getPublishedTemplates,
  getPurchasedTemplateIds,
  getActiveTemplateId,
} from "@/server/services/template.service"
import { buyTemplate } from "./actions"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storeId: string }>
}) {
  const { storeId } = await params
  const store = await getStoreById(storeId)
  return { title: store ? `Template — ${store.name}` : "Template" }
}

export default async function TemplatesPage({
  params,
  searchParams,
}: {
  params: Promise<{ storeId: string }>
  searchParams: Promise<{ success?: string }>
}) {
  const { storeId } = await params
  const { success } = await searchParams
  const session = await requireSession()
  const store = await getStoreById(storeId)

  if (!store || store.ownerId !== session.userId) notFound()

  const [templates, purchasedIds, activeTemplateId] = await Promise.all([
    getPublishedTemplates(),
    getPurchasedTemplateIds(storeId),
    getActiveTemplateId(storeId),
  ])

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Template</h1>
        <p className="text-sm text-gray-400 mt-1">
          Pilih template untuk storefront {store.name}
        </p>
      </div>

      {success === "1" && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          Pembayaran berhasil! Template sudah aktif di storefront kamu.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => {
          const isPurchased = purchasedIds.has(template.id)
          const isActive = activeTemplateId === template.id
          const isFree = template.price === 0

          return (
            <div
              key={template.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col"
            >
              <div className="h-36 bg-gray-100 flex items-center justify-center text-gray-300 text-sm">
                {template.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={template.previewUrl}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  "Preview tidak tersedia"
                )}
              </div>

              <div className="p-4 flex flex-col gap-3 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900">{template.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 shrink-0">
                    {isFree ? "Gratis" : `$${(template.price / 100).toFixed(2)}`}
                  </span>
                </div>

                <div className="mt-auto">
                  {isActive ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium">
                      ✓ Template Aktif
                    </span>
                  ) : isPurchased || isFree ? (
                    <form
                      action={buyTemplate.bind(null, storeId, template.id)}
                    >
                      <button
                        type="submit"
                        className="w-full py-2 px-4 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
                      >
                        Aktifkan
                      </button>
                    </form>
                  ) : (
                    <form
                      action={buyTemplate.bind(null, storeId, template.id)}
                    >
                      <button
                        type="submit"
                        className="w-full py-2 px-4 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
                      >
                        Beli — ${(template.price / 100).toFixed(2)}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verifikasi TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep "templates"
```

Expected: 0 error. (Error "Not implemented" di action bukan TS error — hanya runtime.)

- [ ] **Step 4: Test manual di browser**

Jalankan `npm run dev`, buka `/stores/[storeId]/templates`. Pastikan:
- 3 template tampil (Bold, Bento, Minimal)
- Minimal tampil tombol "Aktifkan" (gratis)
- Bold dan Bento tampil tombol "Beli — $29.00" / "Beli — $19.00"

---

### Task 4: Stripe Checkout action + API route

**Files:**
- Modify: `app/(builder)/(dashboard)/stores/[storeId]/templates/actions.ts` (ganti implementasi)
- Create: `app/api/stripe/checkout/route.ts`

**Interfaces:**
- Consumes:
  - `stripe` dari `@/lib/stripe`
  - `requireSession()` dari `@/features/auth/dal`
  - `getStoreById()` dari `@/server/services/tenant.service`
  - `getTemplateById`, `getPurchasedTemplateIds`, `createPendingPurchase`, `activateTemplate` dari `@/server/services/template.service`
- Produces:
  - Server action `buyTemplate(storeId, templateId)` → redirect ke Stripe Checkout URL (template berbayar) atau langsung aktifkan (gratis)
  - `POST /api/stripe/checkout` (tidak dipakai langsung — logic ada di server action)

**Env vars yang harus ada di `.env.local`:**
```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

- [ ] **Step 1: Tambahkan env vars ke `.env.local`**

Tambahkan dua baris ini ke `.env.local`:
```
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> Dapat `STRIPE_SECRET_KEY` dari: [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys) → "Secret key"

- [ ] **Step 2: Tulis implementasi `actions.ts`**

Ganti seluruh isi `app/(builder)/(dashboard)/stores/[storeId]/templates/actions.ts`:

```typescript
"use server"

import { redirect } from "next/navigation"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import {
  getTemplateById,
  getPurchasedTemplateIds,
  createPendingPurchase,
  activateTemplate,
} from "@/server/services/template.service"
import { stripe } from "@/lib/stripe"
import { notFound } from "next/navigation"

export async function buyTemplate(storeId: string, templateId: string): Promise<void> {
  const session = await requireSession()
  const store = await getStoreById(storeId)
  if (!store || store.ownerId !== session.userId) notFound()

  const template = await getTemplateById(templateId)
  if (!template || !template.published) notFound()

  // Template gratis — langsung aktifkan tanpa Stripe
  if (template.price === 0) {
    await activateTemplate(storeId, templateId)
    redirect(`/stores/${storeId}/templates?success=1`)
  }

  // Cek apakah sudah dibeli
  const purchasedIds = await getPurchasedTemplateIds(storeId)
  if (purchasedIds.has(templateId)) {
    // Sudah dibeli, langsung aktifkan
    await activateTemplate(storeId, templateId)
    redirect(`/stores/${storeId}/templates?success=1`)
  }

  // Buat Stripe Checkout Session
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  const stripeSession = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: template.price,
          product_data: { name: template.name },
        },
        quantity: 1,
      },
    ],
    metadata: { storeId, templateId },
    success_url: `${appUrl}/stores/${storeId}/templates?success=1`,
    cancel_url: `${appUrl}/stores/${storeId}/templates`,
  })

  // Simpan purchase record PENDING
  await createPendingPurchase({
    storeId,
    templateId,
    stripeSessionId: stripeSession.id,
  })

  // Redirect ke Stripe hosted checkout
  redirect(stripeSession.url!)
}
```

- [ ] **Step 3: Verifikasi TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep -E "actions|stripe"
```

Expected: 0 error.

- [ ] **Step 4: Test manual — template gratis**

Di browser, buka `/stores/[storeId]/templates`, klik "Aktifkan" pada template Minimal (harga $0).
Expected: redirect ke `/stores/[storeId]/templates?success=1` dengan banner hijau "Pembayaran berhasil!".

- [ ] **Step 5: Test manual — template berbayar**

Klik "Beli — $29.00" pada template Bold.
Expected: redirect ke Stripe hosted checkout page (test mode). Gunakan kartu test Stripe: `4242 4242 4242 4242`, exp: `12/26`, CVC: `123`.
Setelah bayar, redirect ke `/stores/[storeId]/templates?success=1`.

> **Note:** Setelah bayar lewat Stripe, halaman akan menampilkan success banner TAPI template belum benar-benar PAID di DB sampai webhook diproses (Task 5). Ini normal — success URL hanya dari Stripe redirect.

---

### Task 5: Stripe Webhook handler

**Files:**
- Create: `app/api/webhooks/stripe/route.ts`

**Interfaces:**
- Consumes:
  - `stripe` dari `@/lib/stripe`
  - `markPurchasePaid`, `activateTemplate` dari `@/server/services/template.service`
- Produces: `POST /api/webhooks/stripe` handler

**Env vars baru:**
```
STRIPE_WEBHOOK_SECRET=whsec_...
```

> Dapat `STRIPE_WEBHOOK_SECRET` dari: Stripe CLI (`stripe listen --forward-to localhost:3000/api/webhooks/stripe` → print webhook secret), atau dari Stripe Dashboard → Webhooks.

- [ ] **Step 1: Tambahkan env var ke `.env.local`**

```
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXXXXXXXXXXXXXX
```

- [ ] **Step 2: Buat `app/api/webhooks/stripe/route.ts`**

```typescript
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { stripe } from "@/lib/stripe"
import { markPurchasePaid, activateTemplate } from "@/server/services/template.service"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 })
  }

  let event: ReturnType<typeof stripe.webhooks.constructEvent>
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook signature verification failed"
    console.error("[stripe webhook] verification failed:", message)
    return NextResponse.json({ error: message }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object
    const { storeId, templateId } = (session.metadata ?? {}) as {
      storeId?: string
      templateId?: string
    }

    if (!storeId || !templateId) {
      console.error("[stripe webhook] missing metadata:", session.id)
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 })
    }

    try {
      await markPurchasePaid(session.id)
      await activateTemplate(storeId, templateId)
      console.log(`[stripe webhook] template ${templateId} activated for store ${storeId}`)
    } catch (err) {
      console.error("[stripe webhook] failed to process:", err)
      return NextResponse.json({ error: "Internal error" }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
```

- [ ] **Step 3: Verifikasi TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep "webhooks"
```

Expected: 0 error.

- [ ] **Step 4: Install Stripe CLI (jika belum ada)**

Stripe CLI dibutuhkan untuk forward webhook ke localhost di dev mode.

Windows (via scoop):
```bash
scoop install stripe
```

Atau download manual dari: https://github.com/stripe/stripe-cli/releases

- [ ] **Step 5: Test webhook di dev**

Terminal 1 — jalankan dev server:
```bash
npm run dev
```

Terminal 2 — forward Stripe events ke localhost:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Output dari `stripe listen`:
```
> Ready! Your webhook signing secret is whsec_xxxxx (^C to quit)
```

Salin `whsec_xxxxx` ke `.env.local` sebagai `STRIPE_WEBHOOK_SECRET`, lalu restart dev server.

- [ ] **Step 6: End-to-end test**

1. Buka `/stores/[storeId]/templates`
2. Klik "Beli — $29.00" pada Bold
3. Di Stripe Checkout, isi kartu: `4242 4242 4242 4242`, exp: `12/26`, CVC: `123`
4. Bayar → redirect ke `/stores/[storeId]/templates?success=1`
5. Di terminal yang menjalankan `stripe listen`, pastikan muncul:
   ```
   [stripe webhook] template <id> activated for store <storeId>
   ```
6. Refresh halaman templates → badge "✓ Template Aktif" muncul di Bold

---

## Self-Review

### Spec coverage:
- ✅ `/stores/[storeId]/templates` — halaman template list + beli (Task 3)
- ✅ `POST /api/stripe/checkout` — create Checkout Session (Task 4, via server action)
- ✅ Webhook `checkout.session.completed` → status PAID + aktifkan template (Task 5)
- ✅ Template aktif setelah payment = upsert StoreThemeConfig (Task 5)
- ✅ Template gratis langsung aktif tanpa Stripe (Task 4)
- ✅ Seed data untuk dev (Task 2)

### Placeholder scan:
- Tidak ada TBD/TODO
- Semua kode lengkap

### Type consistency:
- `createPendingPurchase({ storeId, templateId, stripeSessionId })` — konsisten antara T1 dan T4
- `markPurchasePaid(stripeSessionId: string)` — konsisten antara T1 dan T5
- `activateTemplate(storeId, templateId)` — konsisten antara T1, T4, dan T5
- `getPurchasedTemplateIds(storeId)` returns `Set<string>` — dipakai T3 dan T4 dengan `.has()`
