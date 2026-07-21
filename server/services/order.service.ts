import "server-only"
import { prisma } from "@/lib/db/prisma"
import type { Order, OrderItem, Customer, OrderStatus } from "@prisma/client"
import { syncProductStockFromVariants } from "@/server/services/product.service"

export type { Order, OrderItem, Customer, OrderStatus }

export type OrderWithCustomer = Order & { customer: Customer }
export type CustomerWithStats = Customer & { _count: { orders: number }; totalSpent: number }

export type StoreDashboardStats = {
  totalProducts: number
  totalCategories: number
  totalOrders: number
  totalCustomers: number
  totalSoldItems: number
  revenueTotal: number
  revenueByMonth: number[]
  activeTemplate: string | null
}

export async function getStoreDashboardStats(storeId: string): Promise<StoreDashboardStats> {
  const [
    totalProducts,
    totalCategories,
    totalOrders,
    totalCustomers,
    revenueResult,
    soldItemsResult,
    paidOrders,
    themeConfig,
  ] =
    await Promise.all([
      prisma.product.count({ where: { storeId, published: true } }),
      prisma.category.count({ where: { storeId } }),
      prisma.order.count({ where: { storeId } }),
      prisma.customer.count({ where: { storeId } }),
      prisma.order.aggregate({
        where: { storeId, status: "PAID" },
        _sum: { total: true },
      }),
      prisma.orderItem.aggregate({
        where: { order: { storeId, status: "PAID" } },
        _sum: { quantity: true },
      }),
      prisma.order.findMany({
        where: { storeId, status: "PAID" },
        select: { total: true, createdAt: true },
      }),
      prisma.storeThemeConfig.findUnique({
        where: { storeId },
        select: { templateId: true },
      }),
    ])

  // Last 7 months revenue trend (oldest -> latest), derived in app layer.
  const now = new Date()
  const monthKeys = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (6 - index), 1)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
  })
  const monthRevenueMap = new Map(monthKeys.map((key) => [key, 0]))
  for (const order of paidOrders) {
    const key = `${order.createdAt.getFullYear()}-${String(order.createdAt.getMonth() + 1).padStart(2, "0")}`
    if (monthRevenueMap.has(key)) {
      monthRevenueMap.set(key, (monthRevenueMap.get(key) ?? 0) + order.total)
    }
  }

  return {
    totalProducts,
    totalCategories,
    totalOrders,
    totalCustomers,
    totalSoldItems: soldItemsResult._sum.quantity ?? 0,
    revenueTotal: revenueResult._sum.total ?? 0,
    revenueByMonth: monthKeys.map((key) => monthRevenueMap.get(key) ?? 0),
    activeTemplate: themeConfig?.templateId ?? null,
  }
}

export async function getOrders(storeId: string): Promise<OrderWithCustomer[]> {
  return prisma.order.findMany({
    where: { storeId },
    include: { customer: true },
    orderBy: { createdAt: "desc" },
  })
}

export async function getCustomers(storeId: string): Promise<CustomerWithStats[]> {
  const customers = await prisma.customer.findMany({
    where: { storeId, passwordHash: { not: null } },
    include: { _count: { select: { orders: true } } },
    orderBy: { createdAt: "desc" },
  })

  const customerIds = customers.map((c) => c.id)
  const spending = await prisma.order.groupBy({
    by: ["customerId"],
    where: { storeId, customerId: { in: customerIds }, status: "PAID" },
    _sum: { total: true },
  })
  const spendMap = new Map(spending.map((s) => [s.customerId, s._sum.total ?? 0]))

  return customers.map((c) => ({ ...c, totalSpent: spendMap.get(c.id) ?? 0 }))
}

/**
 * Tandai order PAID dari webhook Stripe (idempotent: hanya order yang masih
 * PENDING yang diubah — jangan menghidupkan order yang sudah CANCELLED).
 */
export async function markOrderPaid(orderId: string, stripePaymentId: string): Promise<void> {
  await prisma.order.updateMany({
    where: { id: orderId, status: "PENDING" },
    data: { status: "PAID", stripePaymentId },
  })
}

/** Detail order untuk dashboard owner: customer + line item + foto produk. */
export async function getOrderById(orderId: string, storeId: string) {
  return prisma.order.findFirst({
    where: { id: orderId, storeId },
    include: {
      customer: { include: { addresses: true } },
      items: {
        include: {
          product: {
            select: { name: true, slug: true, images: { orderBy: { order: "asc" }, take: 1 } },
          },
        },
      },
    },
  })
}

/** Detail pelanggan terdaftar (punya akun storefront), bukan guest checkout. */
export async function getCustomerById(customerId: string, storeId: string) {
  return prisma.customer.findFirst({
    where: { id: customerId, storeId, passwordHash: { not: null } },
    include: {
      addresses: true,
      orders: {
        orderBy: { createdAt: "desc" },
        include: { items: { select: { quantity: true } } },
      },
    },
  })
}

/**
 * Transisi status yang diizinkan. Maju linear (PENDING→PAID→SHIPPED→DONE),
 * dan order aktif apa pun bisa dibatalkan. DONE & CANCELLED final.
 */
export const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["PAID", "SHIPPED", "CANCELLED"],
  PAID: ["SHIPPED", "DONE", "CANCELLED"],
  SHIPPED: ["DONE", "CANCELLED"],
  DONE: [],
  CANCELLED: [],
}

export type UpdateStatusResult = { ok: true } | { ok: false; error: string }

/**
 * Ubah status order dengan validasi transisi. Saat dibatalkan, stok produk
 * dikembalikan (order mengurangi stok saat dibuat) — atomik dalam transaksi.
 */
export async function updateOrderStatus(
  orderId: string,
  storeId: string,
  next: OrderStatus,
): Promise<UpdateStatusResult> {
  const order = await prisma.order.findFirst({
    where: { id: orderId, storeId },
    select: {
      id: true,
      status: true,
      stockDeducted: true,
      items: {
        select: { productId: true, variantId: true, quantity: true },
      },
    },
  })
  if (!order) return { ok: false, error: "Order tidak ditemukan." }
  if (order.status === next) return { ok: true }
  if (!ALLOWED_TRANSITIONS[order.status].includes(next)) {
    return { ok: false, error: `Tidak bisa ubah status dari ${order.status} ke ${next}.` }
  }

  // Restore stok HANYA kalau order ini memang pernah memotong stok. Order lama
  // (sebelum fitur decrement) punya stockDeducted=false → cancel tak menambah
  // stok, mencegah inflasi. Clear flag setelah restore agar tak dobel.
  const shouldRestore = next === "CANCELLED" && order.stockDeducted

  await prisma.$transaction(async (tx) => {
    if (shouldRestore) {
      for (const item of order.items) {
        if (item.variantId) {
          await tx.productVariant.updateMany({
            where: { id: item.variantId, productId: item.productId },
            data: { stock: { increment: item.quantity } },
          })
          await syncProductStockFromVariants(tx, item.productId, storeId)
          continue
        }
        await tx.product.updateMany({
          where: { id: item.productId, storeId },
          data: { stock: { increment: item.quantity } },
        })
      }
    }
    await tx.order.update({
      where: { id: orderId },
      data: { status: next, ...(shouldRestore ? { stockDeducted: false } : {}) },
    })
  })

  return { ok: true }
}
