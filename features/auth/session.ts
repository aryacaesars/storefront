import "server-only";
import { cookies } from "next/headers";
import { EncryptJWT, jwtDecrypt } from "jose";
import { createHash } from "node:crypto";
import type { SessionData } from "./types";

/**
 * Stateless session: payload encrypted into an httpOnly cookie (JWE A256GCM).
 * Encrypted (not just signed) because the payload carries the Scalev token.
 * Swap to DB-backed sessions (Prisma MerchantSession) later — interface stays.
 *
 * Next.js 16: `cookies()` is async; `.set()`/`.delete()` only work inside a
 * Server Action or Route Handler, never during Server Component render.
 */

const COOKIE_NAME = "sf_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

/** Derive a fixed 32-byte key (A256GCM) from SESSION_SECRET. */
function getKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET missing or too short (need >= 32 chars of high entropy) — " +
        "generate with `openssl rand -base64 48` and set it in .env.local",
    );
  }
  return new Uint8Array(createHash("sha256").update(secret).digest());
}

async function encryptSession(payload: SessionData): Promise<string> {
  return new EncryptJWT({ ...payload })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .encrypt(getKey());
}

async function decryptSession(token: string | undefined): Promise<SessionData | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtDecrypt(token, getKey());
    const p = payload as Record<string, unknown>;
    // Guard required fields (cookie could be stale/forged after a secret rotation).
    if (
      typeof p.merchantId !== "string" ||
      typeof p.tenantId !== "string" ||
      typeof p.scalevToken !== "string"
    ) {
      return null;
    }
    return {
      merchantId: p.merchantId,
      displayName: typeof p.displayName === "string" ? p.displayName : "",
      tenantId: p.tenantId,
      tenantSlug: typeof p.tenantSlug === "string" ? p.tenantSlug : "",
      scalevToken: p.scalevToken,
    };
  } catch {
    return null; // expired / tampered / wrong key
  }
}

/** Write the session cookie. Call ONLY from a Server Action / Route Handler. */
export async function setSessionCookie(payload: SessionData): Promise<void> {
  const token = await encryptSession(payload);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE_SECONDS,
    path: "/",
  });
}

/** Read + decrypt the session cookie. Safe in Server Components (read-only). */
export async function readSessionCookie(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  return decryptSession(cookieStore.get(COOKIE_NAME)?.value);
}

/** Clear the session cookie. Call ONLY from a Server Action / Route Handler. */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
