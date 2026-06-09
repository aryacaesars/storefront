import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Scalev OAuth connect callback — RESERVED FOR FUTURE.
 *
 * MVP auth uses token connect (features/auth/actions.ts → loginAction), not
 * OAuth, because Scalev's OAuth authorize/token endpoints are unconfirmed
 * (guide risk #1 — jangan ditebak).
 *
 * When OAuth is confirmed, implement here:
 *   1. read `code` (+ validate `state`) from request.nextUrl.searchParams
 *   2. exchange code -> access token at Scalev's token endpoint
 *   3. getMe(token) -> resolveTenantFromIdentity -> setSessionCookie
 *   4. redirect('/dashboard')
 */
export async function GET(_req: NextRequest) {
  return NextResponse.json(
    { error: "Scalev OAuth callback not implemented. MVP uses token connect." },
    { status: 501 },
  );
}
