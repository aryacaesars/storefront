/**
 * Data stored in the encrypted (JWE) session cookie. Kept minimal.
 * NOTE: `scalevToken` is sensitive — that's why the cookie is ENCRYPTED, not
 * just signed. Never expose this object to a Client Component.
 */
export interface SessionData {
  merchantId: string;
  displayName: string;
  tenantId: string;
  tenantSlug: string;
  scalevToken: string;
}

/** Payload shape persisted in the cookie (mirror of SessionData). */
export type SessionPayload = SessionData;

/** Return state of the login Server Action (consumed by useActionState). */
export type LoginFormState = { error: string } | undefined;
