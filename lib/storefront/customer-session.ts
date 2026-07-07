import "server-only"
import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"

const COOKIE = "sf_customer_session"
const MAX_AGE = 60 * 60 * 24 * 30 // 30 days

function secret(): Uint8Array {
  const value = process.env.SESSION_SECRET
  if (!value) throw new Error("SESSION_SECRET is not set")
  return new TextEncoder().encode(value)
}

export type CustomerSessionPayload = {
  customerId: string
  storeId: string
}

/** Sign a session JWT and set the httpOnly cookie. */
export async function createCustomerSession(payload: CustomerSessionPayload): Promise<void> {
  const token = await new SignJWT({ customerId: payload.customerId, storeId: payload.storeId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret())

  const store = await cookies()
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE,
  })
}

/** Read + verify the session cookie. Returns null if missing/invalid/expired. */
export async function readCustomerSession(): Promise<CustomerSessionPayload | null> {
  const store = await cookies()
  const token = store.get(COOKIE)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret())
    if (typeof payload.customerId !== "string" || typeof payload.storeId !== "string") {
      return null
    }
    return { customerId: payload.customerId, storeId: payload.storeId }
  } catch {
    return null
  }
}

/** Clear the session cookie (logout). */
export async function clearCustomerSession(): Promise<void> {
  const store = await cookies()
  store.delete(COOKIE)
}
