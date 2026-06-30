"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import type { CartItem } from "@/lib/storefront/cart"

const CART_COOKIE = "sf_cart"

async function readCartItems(): Promise<CartItem[]> {
  const store = await cookies()
  const raw = store.get(CART_COOKIE)?.value
  if (!raw) return []
  try {
    return JSON.parse(raw) as CartItem[]
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

export async function addToCart(
  productId: string,
  slug: string,
  name: string,
  price: number,
  imageUrl?: string,
): Promise<void> {
  const items = await readCartItems()
  const existing = items.find((i) => i.slug === slug)
  if (existing) {
    existing.quantity += 1
  } else {
    items.push({ productId, slug, name, price, quantity: 1, imageUrl })
  }
  await writeCartItems(items)
  revalidatePath("/cart")
}

export async function removeFromCart(slug: string): Promise<void> {
  const items = await readCartItems()
  await writeCartItems(items.filter((i) => i.slug !== slug))
  revalidatePath("/cart")
}

export async function updateQuantity(slug: string, quantity: number): Promise<void> {
  const items = await readCartItems()
  if (quantity <= 0) {
    await writeCartItems(items.filter((i) => i.slug !== slug))
  } else {
    const item = items.find((i) => i.slug === slug)
    if (item) item.quantity = quantity
    await writeCartItems(items)
  }
  revalidatePath("/cart")
}

export async function clearCart(): Promise<void> {
  const store = await cookies()
  store.delete(CART_COOKIE)
}
