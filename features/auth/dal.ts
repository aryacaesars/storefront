import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { readSessionCookie } from "./session";
import type { SessionData } from "./types";

/**
 * Data Access Layer — the single secure choke point for auth (Next.js 16
 * pattern). Do auth checks HERE (close to data), NOT in layouts (layouts don't
 * re-render on navigation). `cache` memoizes per render pass so calling this in
 * page + components doesn't re-decrypt repeatedly.
 */

/** Returns the session, or null if unauthenticated. No redirect. */
export const getSession = cache(async (): Promise<SessionData | null> => {
  return readSessionCookie();
});

/** Require a session; redirect to /login if absent. Use in protected pages. */
export async function requireSession(): Promise<SessionData> {
  const session = await getSession();
  if (!session) redirect("/login"); // throws — narrows session below
  return session;
}
