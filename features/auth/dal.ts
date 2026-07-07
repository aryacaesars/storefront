import "server-only"
import { cache } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import type { SessionData } from "./types"

/**
 * Data Access Layer — the single secure choke point for auth (Next.js 16
 * pattern). Do auth checks HERE (close to data), NOT in layouts (layouts don't
 * re-render on navigation). `cache` memoizes per render pass so calling this in
 * page + components doesn't re-decrypt repeatedly.
 */

/** Returns the session, or null if unauthenticated. No redirect. */
export const getSession = cache(async (): Promise<SessionData | null> => {
  const session = await auth()
  if (!session?.user?.id) return null
  return {
    userId: session.user.id,
    email: session.user.email ?? "",
    name: session.user.name ?? null,
    role: session.user.role,
  }
})

/** Require a session; redirect to /login if absent. Use in protected pages. */
export async function requireSession(): Promise<SessionData> {
  const session = await getSession()
  if (!session) redirect("/login")
  return session
}

/** Require ADMIN role; redirect to /dashboard if not admin. */
export async function requireAdmin(): Promise<SessionData> {
  const session = await requireSession()
  if (session.role !== "ADMIN") redirect("/dashboard")
  return session
}
