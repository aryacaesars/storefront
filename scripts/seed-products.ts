/**
 * Bulk seed produk ke satu toko.
 *
 * Usage:
 *   npx tsx scripts/seed-products.ts --store=ganteng
 *   npx tsx scripts/seed-products.ts --store=ganteng --count=40
 *   npx tsx scripts/seed-products.ts --store=cmrrpo95d0001jv045xf703ku --draft
 *
 * Flags:
 *   --store=<slug|id>   wajib — target toko
 *   --count=<n>         jumlah produk (default 24)
 *   --draft             simpan unpublished (default: published)
 *   --clear             hapus semua produk + kategori toko dulu
 */

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const CATEGORIES = [
  { name: "New Arrivals", slug: "new-arrivals" },
  { name: "Best Sellers", slug: "best-sellers" },
  { name: "Accessories", slug: "accessories" },
  { name: "Sale", slug: "sale" },
] as const

const PRODUCT_NAMES = [
  "Classic Tee",
  "Oversized Hoodie",
  "Linen Shirt",
  "Cargo Pants",
  "Denim Jacket",
  "Ribbed Tank",
  "Wide Leg Trousers",
  "Knit Cardigan",
  "Everyday Cap",
  "Canvas Tote",
  "Leather Belt",
  "Minimal Sneakers",
  "Wool Beanie",
  "Sport Shorts",
  "Relaxed Chinos",
  "Boxy Crewneck",
  "Structured Blazer",
  "Slip-on Loafers",
  "Mesh Runner",
  "Quilted Vest",
  "Pocket Shirt",
  "Track Jacket",
  "Soft Scarf",
  "Utility Bag",
  "Corduroy Pants",
  "Half-zip Pullover",
  "Piqué Polo",
  "Cropped Sweater",
  "Ankle Boots",
  "Daily Socks Pack",
]

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

function parseArgs(argv: string[]) {
  let store: string | null = null
  let count = 24
  let published = true
  let clear = false

  for (const arg of argv) {
    if (arg.startsWith("--store=")) store = arg.slice("--store=".length).trim()
    else if (arg.startsWith("--count=")) {
      const n = Number(arg.slice("--count=".length))
      if (!Number.isFinite(n) || n < 1) throw new Error("--count harus angka >= 1")
      count = Math.floor(n)
    } else if (arg === "--draft") published = false
    else if (arg === "--clear") clear = true
    else if (arg === "--help" || arg === "-h") {
      console.log(`Usage: npx tsx scripts/seed-products.ts --store=<slug|id> [--count=24] [--draft] [--clear]`)
      process.exit(0)
    }
  }

  if (!store) {
    throw new Error("Wajib: --store=<slug|id>\nContoh: npx tsx scripts/seed-products.ts --store=ganteng")
  }

  return { store, count, published, clear }
}

function pickName(i: number): string {
  const base = PRODUCT_NAMES[i % PRODUCT_NAMES.length]
  const round = Math.floor(i / PRODUCT_NAMES.length)
  return round === 0 ? base : `${base} ${round + 1}`
}

function priceFor(i: number): number {
  // Rp 49.000 – Rp 499.000, kelipatan 1000
  const base = 49_000 + (i % 18) * 25_000
  return base + (i % 3) * 1_000
}

function stockFor(i: number): number {
  return 5 + (i % 20) * 3
}

function imageUrl(seed: string): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/1000`
}

async function resolveStore(storeKey: string) {
  const bySlug = await prisma.store.findUnique({ where: { slug: storeKey } })
  if (bySlug) return bySlug
  const byId = await prisma.store.findUnique({ where: { id: storeKey } })
  if (byId) return byId
  return null
}

async function main() {
  const { store: storeKey, count, published, clear } = parseArgs(process.argv.slice(2))

  const store = await resolveStore(storeKey)
  if (!store) {
    const list = await prisma.store.findMany({ select: { id: true, name: true, slug: true }, take: 20 })
    console.error(`Toko tidak ditemukan: "${storeKey}"`)
    if (list.length) {
      console.error("Toko yang ada:")
      for (const s of list) console.error(`  - ${s.slug} (${s.name})  id=${s.id}`)
    }
    process.exit(1)
  }

  console.log(`Target: ${store.name} (slug=${store.slug}, id=${store.id})`)
  console.log(`Count: ${count} | published: ${published} | clear: ${clear}`)

  if (clear) {
    const products = await prisma.product.findMany({
      where: { storeId: store.id },
      select: { id: true },
    })
    const ids = products.map((p) => p.id)
    if (ids.length) {
      await prisma.productImage.deleteMany({ where: { productId: { in: ids } } })
      await prisma.orderItem.deleteMany({ where: { productId: { in: ids } } }).catch(() => {
        // orderItem mungkin tidak ada / FK berbeda — ignore bila kosong
      })
      await prisma.product.deleteMany({ where: { storeId: store.id } })
    }
    await prisma.category.deleteMany({ where: { storeId: store.id } })
    console.log(`Cleared products + categories for ${store.slug}`)
  }

  const categoryIds: string[] = []
  for (const cat of CATEGORIES) {
    const row = await prisma.category.upsert({
      where: { storeId_slug: { storeId: store.id, slug: cat.slug } },
      update: { name: cat.name },
      create: { storeId: store.id, name: cat.name, slug: cat.slug },
    })
    categoryIds.push(row.id)
  }
  console.log(`Categories ready: ${CATEGORIES.map((c) => c.name).join(", ")}`)

  let created = 0
  let skipped = 0

  for (let i = 0; i < count; i++) {
    const name = pickName(i)
    let slug = slugify(name)
    if (!slug) slug = `product-${i + 1}`

    const exists = await prisma.product.findUnique({
      where: { storeId_slug: { storeId: store.id, slug } },
      select: { id: true },
    })
    if (exists) {
      skipped++
      continue
    }

    const categoryId = categoryIds[i % categoryIds.length] ?? null
    const seed = `${store.slug}-${slug}-${i}`

    await prisma.product.create({
      data: {
        name,
        slug,
        description: `${name} — produk sample untuk demo storefront. Bahan nyaman, ready stock.`,
        price: priceFor(i),
        stock: stockFor(i),
        published,
        storeId: store.id,
        categoryId,
        images: {
          create: { url: imageUrl(seed), order: 0 },
        },
      },
    })
    created++
  }

  console.log(`Done. created=${created} skipped=${skipped} (slug already exists)`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
