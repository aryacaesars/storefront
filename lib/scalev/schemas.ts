import { z } from "zod";

/**
 * ✅ VALIDATED against the real Scalev API (week-1, GET /v3/me — docs:
 * https://docs.scalev.com/api-reference/identity/get-authenticated-identity).
 *
 * Real shape differs from the earlier assumption draft:
 *  - identity fields are NESTED under `user` (not top-level id/email/name)
 *  - the response is NOT enveloped (no { data: ... } wrapper)
 *  - a business is keyed by `unique_id` (string) + `username`; there is NO
 *    numeric business id, slug, currency, or embedded store on /v3/me
 *  - new top-level fields: `auth_method`, `oauth_application`
 *
 * Still `.passthrough()` + tolerant nullability so sandbox quirks don't reject.
 */

// connected_businesses[] item. `unique_id` is the business key (b_uid for
// business-scoped routes); `username` is the url-safe handle (subdomain basis).
export const ConnectedBusinessSchema = z
  .object({
    unique_id: z.string().nullish(),
    username: z.string().nullish(),
    name: z.string().nullish(),
    is_enabled: z.boolean().nullish(),
    scopes: z.array(z.string()).nullish(),
  })
  .passthrough();

// The authenticated user. Null for non-user auth contexts (e.g. app login).
export const ScalevUserSchema = z
  .object({
    // ⚠️ id is a JSON number in docs (e.g. 123). If ids can exceed 2^53,
    // precision is lost at JSON.parse before Zod — keep as union, stringify
    // downstream. Confirm max id size with Scalev if it matters.
    id: z.union([z.string(), z.number()]).nullish(),
    unique_id: z.string().nullish(),
    email: z.string().nullish(),
    phone: z.string().nullish(),
    fullname: z.string().nullish(),
    avatar: z.string().nullish(),
  })
  .passthrough();

// oauth_application — present when auth_method = "oauth". Not used by MVP token
// connect, but kept so the shape validates instead of being stripped.
export const OAuthApplicationSchema = z
  .object({
    id: z.union([z.string(), z.number()]).nullish(),
    client_id: z.string().nullish(),
    name: z.string().nullish(),
    homepage_url: z.string().nullish(),
  })
  .passthrough();

// Top-level GET /v3/me response (AuthenticatedIdentity, no envelope).
export const MeResponseSchema = z
  .object({
    // "oauth" | "api_key" | "app_login" | null — kept as string (not enum) so
    // an unknown method from sandbox doesn't reject a valid login.
    auth_method: z.string().nullish(),
    user: ScalevUserSchema.nullish(),
    oauth_application: OAuthApplicationSchema.nullish(),
    // Drives tenant creation. Kept REQUIRED (not defaulted) so a renamed key
    // throws loud in scalevFetch instead of silently logging in with 0 stores.
    // A genuinely empty array still passes.
    connected_businesses: z.array(ConnectedBusinessSchema),
  })
  .passthrough();

export type MeResponse = z.infer<typeof MeResponseSchema>;
export type ScalevUser = z.infer<typeof ScalevUserSchema>;
export type ConnectedBusiness = z.infer<typeof ConnectedBusinessSchema>;
