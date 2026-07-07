import { prisma } from "@/lib/db/prisma"
import { hashPassword, verifyPassword } from "@/lib/auth/password"

export class CustomerAuthError extends Error {
  constructor(public code: "EMAIL_TAKEN" | "INVALID_CREDENTIALS") {
    super(code)
    this.name = "CustomerAuthError"
  }
}

/**
 * Register a customer for a store. If a guest customer (no passwordHash) already
 * exists with this email, claim that account by setting the password. If a
 * password-bearing account already exists, throw EMAIL_TAKEN.
 */
export async function registerCustomer(input: {
  storeId: string
  email: string
  name: string
  password: string
}): Promise<{ id: string; storeId: string }> {
  const email = input.email.trim().toLowerCase()
  const existing = await prisma.customer.findUnique({
    where: { storeId_email: { storeId: input.storeId, email } },
    select: { id: true, passwordHash: true },
  })

  const passwordHash = await hashPassword(input.password)

  if (existing) {
    if (existing.passwordHash) throw new CustomerAuthError("EMAIL_TAKEN")
    const claimed = await prisma.customer.update({
      where: { id: existing.id },
      data: { passwordHash, name: input.name },
      select: { id: true, storeId: true },
    })
    return claimed
  }

  const created = await prisma.customer.create({
    data: { storeId: input.storeId, email, name: input.name, passwordHash },
    select: { id: true, storeId: true },
  })
  return created
}

/** Verify credentials; returns the customer id/storeId or throws INVALID_CREDENTIALS. */
export async function authenticateCustomer(input: {
  storeId: string
  email: string
  password: string
}): Promise<{ id: string; storeId: string }> {
  const email = input.email.trim().toLowerCase()
  const customer = await prisma.customer.findUnique({
    where: { storeId_email: { storeId: input.storeId, email } },
    select: { id: true, storeId: true, passwordHash: true },
  })
  if (!customer || !customer.passwordHash) {
    throw new CustomerAuthError("INVALID_CREDENTIALS")
  }
  const ok = await verifyPassword(input.password, customer.passwordHash)
  if (!ok) throw new CustomerAuthError("INVALID_CREDENTIALS")
  return { id: customer.id, storeId: customer.storeId }
}

/** Customer profile + their orders (newest first) for the account page. */
export async function getCustomerWithOrders(customerId: string, storeId: string) {
  return prisma.customer.findFirst({
    where: { id: customerId, storeId },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: {
          items: { include: { product: { select: { name: true } } } },
        },
      },
    },
  })
}

/** A single order owned by the customer, with line items + product image. */
export async function getCustomerOrder(orderId: string, customerId: string, storeId: string) {
  return prisma.order.findFirst({
    where: { id: orderId, customerId, storeId },
    include: {
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

/** The customer's default shipping address (or the most recent), if any. */
export async function getCustomerDefaultAddress(customerId: string) {
  return prisma.address.findFirst({
    where: { customerId },
    orderBy: [{ isDefault: "desc" }, { id: "desc" }],
  })
}

/** Create a default address for a customer if they have none yet. */
export async function ensureCustomerAddress(input: {
  customerId: string
  street: string
  city: string
  province: string
  postalCode: string
}): Promise<void> {
  const existing = await prisma.address.findFirst({ where: { customerId: input.customerId } })
  if (existing) return
  await prisma.address.create({
    data: {
      customerId: input.customerId,
      street: input.street,
      city: input.city,
      province: input.province,
      postalCode: input.postalCode,
      isDefault: true,
    },
  })
}
