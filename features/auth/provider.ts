import "server-only";
import { getMe } from "@/lib/scalev/endpoints/identity";
import type { MeResponse } from "@/lib/scalev/schemas";
import {
  looksLikeScalevApiKey,
  normalizeScalevToken,
} from "@/features/auth/normalize-token";

/**
 * Provider-agnostic auth. Concrete impl now = token connect (merchant pastes a
 * Scalev API token, validated via GET /v3/me). OAuth redirect connect can be
 * added later as another AuthProvider without touching callers.
 */

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export interface AuthResult {
  token: string;
  identity: MeResponse;
}

export interface AuthProvider {
  readonly id: string;
  authenticate(input: { token: string }): Promise<AuthResult>;
}

/** Merchant supplies a Scalev token; we validate it by calling /v3/me. */
class TokenAuthProvider implements AuthProvider {
  readonly id = "scalev-token";

  async authenticate(input: { token: string }): Promise<AuthResult> {
    const token = normalizeScalevToken(input.token ?? "");
    if (!token) throw new AuthError("Token kosong.");
    if (!looksLikeScalevApiKey(token)) {
      throw new AuthError(
        "Format token tidak dikenali. Paste API Key Scalev (awalan sk_ atau rk_) dari Settings → Developers → API Keys — bukan password akun atau storefront key (sfpk_).",
      );
    }
    const identity = await getMe(token); // throws ScalevError on invalid/expired
    return { token, identity };
  }
}

// TODO(milestone: Domain/OAuth): implement OAuthScalevProvider — authorization-code
// connect. Wire its callback in app/api/auth/scalev/route.ts once Scalev OAuth
// endpoints are confirmed (guide risk #1). Then switch getAuthProvider() by env.

let _provider: AuthProvider | null = null;

export function getAuthProvider(): AuthProvider {
  if (!_provider) _provider = new TokenAuthProvider();
  return _provider;
}
