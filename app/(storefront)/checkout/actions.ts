"use server"

import { cookies, headers } from "next/headers"
import { prisma } from "@/lib/db/prisma"
import { stripe } from "@/lib/stripe"
import type { CartItem } from "@/lib/storefront/cart"
import { getCustomerSession } from "@/features/storefront/customer-dal"
import { getCustomerDefaultAddress } from "@/server/services/customer.service"

export type CheckoutState =
  | { error: string }
  | { ok: true; checkoutUrl: string }
  | undefined

/** Dilempar di dalam transaksi saat stok tak cukup (termasuk akibat race). */
class InsufficientStockError extends Error {
  constructor(public productName: string) {
    super("INSUFFICIENT_STOCK")
    this.name = "InsufficientStockError"
  }
}

export async function placeOrderAction(
  storeId: string,
  _prev: CheckoutState,
  _formData: FormData,
): Promise<CheckoutState> {
  const cookieStore = await cookies()
  const raw = cookieStore.get("sf_cart")?.value
  const cart: CartItem[] = raw ? (JSON.parse(raw) as CartItem[]) : []

  if (cart.length === 0) return { error: "Cart is empty." }

  const loggedIn = await getCustomerSession()
  if (!loggedIn || loggedIn.storeId !== storeId) {
    return { error: "Please sign in to checkout." }
  }

  const customer = await prisma.customer.findFirst({
    where: { id: loggedIn.customerId, storeId },
    select: { id: true, name: true, email: true, phone: true },
  })
  if (!customer) return { error: "Account not found." }
  if (!customer.name?.trim()) {
    return { error: "Complete your profile name on the Account page." }
  }
  if (!customer.phone?.trim()) {
    return { error: "Complete your phone number on the Account page." }
  }

  const address = await getCustomerDefaultAddress(customer.id)
  if (!address) {
    return { error: "Add a shipping address on the Account page." }
  }

  const productIds = cart.map((i) => i.productId)
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, storeId, published: true },
    select: { id: true, price: true, stock: true },
  })
  const productMap = new Map(products.map((p) => [p.id, p]))

  for (const item of cart) {
    const product = productMap.get(item.productId)
    if (!product) return { error: `Product "${item.name}" is unavailable.` }
    if (product.stock < item.quantity) return { error: `Insufficient stock for "${item.name}".` }
  }

  const total = cart.reduce((sum, item) => {
    const product = productMap.get(item.productId)
    return sum + (product?.price ?? item.price) * item.quantity
  }, 0)

  const customerId = customer.id

  // Buat order + kurangi stok ATOMIK dalam satu transaksi. Decrement pakai
  // guard `stock >= quantity` lewat updateMany — kalau count !== 1 berarti
  // stok keburu habis (race antar checkout berbarengan) → rollback semua.
  let order: { id: string }
  try {
    order = await prisma.$transaction(async (tx) => {
      for (const item of cart) {
        const updated = await tx.product.updateMany({
          where: {
            id: item.productId,
            storeId,
            published: true,
            stock: { gte: item.quantity },
          },
          data: { stock: { decrement: item.quantity } },
        })
        if (updated.count !== 1) {
          throw new InsufficientStockError(item.name)
        }
      }

      return tx.order.create({
        data: {
          storeId,
          customerId,
          status: "PENDING",
          total,
          stockDeducted: true,
          items: {
            create: cart.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: productMap.get(item.productId)?.price ?? item.price,
            })),
          },
        },
        select: { id: true },
      })
    })
  } catch (err) {
    if (err instanceof InsufficientStockError) {
      return { error: `Insufficient stock for "${err.productName}".` }
    }
    throw err
  }

  // URL absolut dari Host (browser hard-navigate ke Stripe lalu balik ke toko;
  // proxy inject tenant dengan benar karena navigasi dari browser).
  const hdrs = await headers()
  const host = hdrs.get("host") ?? ""
  const protocol = host.includes("localhost") ? "http" : "https"
  const origin = `${protocol}://${host}`
  const orderCode = order.id.slice(-8).toUpperCase()

  // Buat Stripe Checkout Session (hosted). metadata.orderId dipakai webhook
  // untuk menandai PAID. NOTE: cart cookie tidak dihapus di sini — dibersihkan
  // di halaman success setelah bayar (kalau batal, cart tetap utuh).
  let checkoutUrl: string
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: cart.map((item) => ({
        price_data: {
          currency: "idr",
          product_data: { name: item.name },
          // IDR di Stripe → unit_amount dalam sen (×100).
          unit_amount: (productMap.get(item.productId)?.price ?? item.price) * 100,
        },
        quantity: item.quantity,
      })),
      customer_email: customer.email,
      metadata: {
        orderId: order.id,
        customerPhone: customer.phone ?? "",
        shippingStreet: address.street,
        shippingCity: address.city,
        shippingProvince: address.province,
        shippingPostalCode: address.postalCode,
      },
      success_url: `${origin}/checkout/success?order=${orderCode}`,
      cancel_url: `${origin}/checkout`,
    })
    if (!session.url) throw new Error("no session url")
    checkoutUrl = session.url
  } catch (err) {
    console.error("[checkout] stripe session create failed:", err)
    // Gagal buat sesi bayar → rollback: kembalikan stok + hapus order.
    await prisma.$transaction(async (tx) => {
      for (const item of cart) {
        await tx.product.updateMany({
          where: { id: item.productId, storeId },
          data: { stock: { increment: item.quantity } },
        })
      }
      await tx.orderItem.deleteMany({ where: { orderId: order.id } })
      await tx.order.delete({ where: { id: order.id } })
    })
    return { error: "Failed to create payment session. Please try again." }
  }

  return { ok: true, checkoutUrl }
}
