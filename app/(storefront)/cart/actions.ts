"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db/prisma"
import { cartLineKey, normalizeCartItem, type CartItem } from "@/lib/storefront/cart"

const CART_COOKIE = "sf_cart"

async function readCartItems(): Promise<CartItem[]> {
  const store = await cookies()
  const raw = store.get(CART_COOKIE)?.value
  if (!raw) return []
  try {
    return (JSON.parse(raw) as CartItem[]).map(normalizeCartItem)
  } catch {
    return []
  }
}

async function writeCartItems(items: CartItem[]): Promise<void> {
  const store = await cookies()
  store.set(CART_COOKIE, JSON.stringify(items), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function addToCart(input: {
  productId: string
  slug: string
  name: string
  price: number
  imageUrl?: string
  variantId?: string
  variantLabel?: string
  quantity?: number
}): Promise<void> {
  const qty = Math.max(1, Math.floor(input.quantity ?? 1))
  const lineKey = cartLineKey(input.productId, input.variantId)
  const displayName = input.variantLabel
    ? `${input.name} (${input.variantLabel})`
    : input.name

  let items = await readCartItems()

  // Prune stale lines for this product whose selected variant no longer exists in the DB.
  // Without this, re-adding a product after its variant was deleted leaves the dead variant
  // line alongside the newly added line.
  const staleVariantIds = items
    .filter((i) => i.productId === input.productId && i.variantId && i.variantId !== input.variantId)
    .map((i) => i.variantId as string)
  if (staleVariantIds.length > 0) {
    const liveVariants = await prisma.productVariant.findMany({
      where: { id: { in: staleVariantIds }, productId: input.productId },
      select: { id: true },
    })
    const liveVariantIds = new Set(liveVariants.map((v) => v.id))
    items = items.filter(
      (i) =>
        i.productId !== input.productId ||
        !i.variantId ||
        i.variantId === input.variantId ||
        liveVariantIds.has(i.variantId),
    )
  }

  const existing = items.find((i) => i.lineKey === lineKey)
  if (existing) {
    existing.quantity += qty
  } else if (input.variantId) {
    // If user selects a variant but there's an existing cart line for the same product
    // without a variant (legacy/problematic), convert that line into the variant line
    const legacyIndex = items.findIndex(
      (i) => i.productId === input.productId && !i.variantId,
    )
    if (legacyIndex !== -1) {
      const legacy = items[legacyIndex]
      legacy.variantId = input.variantId
      legacy.variantLabel = input.variantLabel
      legacy.name = displayName
      legacy.price = input.price
      // Replace legacy quantity with the newly selected quantity
      legacy.quantity = qty
      legacy.lineKey = lineKey
      // ensure no other item now duplicates the new lineKey
      // (we already checked existing === undefined)
    } else {
      items.push({
        productId: input.productId,
        lineKey,
        slug: input.slug,
        name: displayName,
        price: input.price,
        quantity: qty,
        imageUrl: input.imageUrl,
        variantId: input.variantId,
        variantLabel: input.variantLabel,
      })
    }
  } else {
    items.push({
      productId: input.productId,
      lineKey,
      slug: input.slug,
      name: displayName,
      price: input.price,
      quantity: qty,
      imageUrl: input.imageUrl,
      variantId: input.variantId,
      variantLabel: input.variantLabel,
    })
  }
  await writeCartItems(items)
  revalidatePath("/cart")
  revalidatePath("/checkout")
}

export async function removeFromCart(lineKey: string): Promise<void> {
  const items = await readCartItems()
  await writeCartItems(items.filter((i) => i.lineKey !== lineKey))
  revalidatePath("/cart")
  revalidatePath("/checkout")
}

export async function updateQuantity(lineKey: string, quantity: number): Promise<void> {
  const items = await readCartItems()
  if (quantity <= 0) {
    await writeCartItems(items.filter((i) => i.lineKey !== lineKey))
  } else {
    const item = items.find((i) => i.lineKey === lineKey)
    if (item) item.quantity = quantity
    await writeCartItems(items)
  }
  revalidatePath("/cart")
  revalidatePath("/checkout")
}

export async function clearCart(): Promise<void> {
  const store = await cookies()
  store.delete(CART_COOKIE)
}
