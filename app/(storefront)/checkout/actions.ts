"use server"

import { cookies, headers } from "next/headers"
import { prisma } from "@/lib/db/prisma"
import { stripe } from "@/lib/stripe"
import { normalizeCartItem, type CartItem } from "@/lib/storefront/cart"
import { getCustomerSession } from "@/features/storefront/customer-dal"
import { getCustomerDefaultAddress } from "@/server/services/customer.service"
import { syncProductStockFromVariants } from "@/server/services/product.service"

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

type ResolvedLine = {
  item: CartItem
  unitPrice: number
  variantLabel?: string
}

export async function placeOrderAction(
  storeId: string,
  _prev: CheckoutState,
  _formData: FormData,
): Promise<CheckoutState> {
  const cookieStore = await cookies()
  const raw = cookieStore.get("sf_cart")?.value
  const cart: CartItem[] = raw
    ? (JSON.parse(raw) as CartItem[]).map(normalizeCartItem)
    : []

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

  const productIds = [...new Set(cart.map((i) => i.productId))]
  const variantIds = [
    ...new Set(cart.map((i) => i.variantId).filter(Boolean) as string[]),
  ]

  const [products, variants] = await Promise.all([
    prisma.product.findMany({
      where: { id: { in: productIds }, storeId, published: true },
      select: { id: true, price: true, stock: true },
    }),
    variantIds.length > 0
      ? prisma.productVariant.findMany({
          where: {
            id: { in: variantIds },
            product: { storeId, published: true },
          },
          select: {
            id: true,
            productId: true,
            price: true,
            stock: true,
            label: true,
          },
        })
      : Promise.resolve([]),
  ])

  const productMap = new Map(products.map((p) => [p.id, p]))
  const variantMap = new Map(variants.map((v) => [v.id, v]))
  // Detect if any product now has variants; if so and the cart item doesn't have a variant selected,
  // block checkout to force user choose a variant.
  const allVariants = await prisma.productVariant.findMany({
    where: { productId: { in: productIds }, product: { storeId, published: true } },
    select: { productId: true },
  })
  const productHasVariants = new Map<string, boolean>()
  for (const v of allVariants) productHasVariants.set(v.productId, true)

  const resolvedLines: ResolvedLine[] = []

  for (const item of cart) {
    const product = productMap.get(item.productId)
    if (!product) return { error: `Product "${item.name}" is unavailable.` }

    if (!item.variantId && productHasVariants.get(item.productId)) {
      return { error: `Product "${item.name}" now has variants — please select a variant before checkout.` }
    }

    if (item.variantId) {
      const variant = variantMap.get(item.variantId)
      if (!variant || variant.productId !== item.productId) {
        return { error: `Variant for "${item.name}" is unavailable.` }
      }
      if (variant.stock < item.quantity) {
        return { error: `Insufficient stock for "${item.name}".` }
      }
      const unitPrice = item.price ?? variant.price
      if (item.price !== undefined && item.price !== variant.price) {
        console.warn(
          `[checkout] cart price differs from variant price for ${item.name}: cart=${item.price} db=${variant.price}`,
        )
      }
      resolvedLines.push({
        item,
        unitPrice,
        variantLabel: variant.label,
      })
      continue
    }

    if (product.stock < item.quantity) {
      return { error: `Insufficient stock for "${item.name}".` }
    }
    const unitPrice = item.price ?? product.price
    if (item.price !== undefined && item.price !== product.price) {
      console.warn(
        `[checkout] cart price differs from product price for ${item.name}: cart=${item.price} db=${product.price}`,
      )
    }
    resolvedLines.push({
      item,
      unitPrice,
    })
  }

  const total = resolvedLines.reduce(
    (sum, line) => sum + line.unitPrice * line.item.quantity,
    0,
  )

  const customerId = customer.id

  let order: { id: string }
  try {
    order = await prisma.$transaction(async (tx) => {
      for (const line of resolvedLines) {
        if (line.item.variantId) {
          const updated = await tx.productVariant.updateMany({
            where: {
              id: line.item.variantId,
              productId: line.item.productId,
              stock: { gte: line.item.quantity },
            },
            data: { stock: { decrement: line.item.quantity } },
          })
          if (updated.count !== 1) {
            throw new InsufficientStockError(line.item.name)
          }
          await syncProductStockFromVariants(tx, line.item.productId, storeId)
          continue
        }

        const updated = await tx.product.updateMany({
          where: {
            id: line.item.productId,
            storeId,
            published: true,
            stock: { gte: line.item.quantity },
          },
          data: { stock: { decrement: line.item.quantity } },
        })
        if (updated.count !== 1) {
          throw new InsufficientStockError(line.item.name)
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
            create: resolvedLines.map((line) => ({
              productId: line.item.productId,
              variantId: line.item.variantId ?? null,
              variantLabel: line.variantLabel ?? line.item.variantLabel ?? null,
              quantity: line.item.quantity,
              price: line.unitPrice,
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

  const hdrs = await headers()
  const host = hdrs.get("host") ?? ""
  const protocol = host.includes("localhost") ? "http" : "https"
  const origin = `${protocol}://${host}`
  const orderCode = order.id.slice(-8).toUpperCase()

  let checkoutUrl: string
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: resolvedLines.map((line) => ({
        price_data: {
          currency: "idr",
          product_data: { name: line.item.name },
          unit_amount: line.unitPrice * 100,
        },
        quantity: line.item.quantity,
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
    await prisma.$transaction(async (tx) => {
      for (const line of resolvedLines) {
        if (line.item.variantId) {
          await tx.productVariant.updateMany({
            where: { id: line.item.variantId, productId: line.item.productId },
            data: { stock: { increment: line.item.quantity } },
          })
          await syncProductStockFromVariants(tx, line.item.productId, storeId)
          continue
        }
        await tx.product.updateMany({
          where: { id: line.item.productId, storeId },
          data: { stock: { increment: line.item.quantity } },
        })
      }
      await tx.orderItem.deleteMany({ where: { orderId: order.id } })
      await tx.order.delete({ where: { id: order.id } })
    })
    return { error: "Failed to create payment session. Please try again." }
  }

  return { ok: true, checkoutUrl }
}
