import { z } from "zod";

/**
 * ⚠️ ASSUMPTION-ONLY DRAFT — NOT validated against the real Scalev API.
 * The guide (§6 + risk #1) says the /v3/me shape WAJIB divalidasi manual
 * Minggu 1 — JANGAN DITEBAK. Every field is a guess so we can build now and
 * swap later. Intentionally permissive: `.passthrough()` keeps unknown keys,
 * fields are `.optional()`/`.nullish()`.
 *
 * AFTER manual validation: tighten types (email(), enums), drop the hedged
 * alternative fields (name/full_name/username, stores/store), lock the
 * businesses array key name + envelope.
 */

// A store possibly embedded under a business (speculative; stores more likely
// live on GET /v3/business/stores).
export const BusinessStoreSchema = z
  .object({
    id: z.union([z.string(), z.number()]).optional(),
    name: z.string().optional(),
    slug: z.string().nullish(),
    domain: z.string().nullish(),
  })
  .passthrough();

// One connected business — drives platform Tenant creation.
export const ConnectedBusinessSchema = z
  .object({
    id: z.union([z.string(), z.number()]),
    name: z.string().optional(),
    // Guessed url-safe key for subdomain routing; may not exist on /v3/me.
    slug: z.string().nullish(),
    role: z.string().nullish(),
    is_owner: z.boolean().nullish(),
    currency: z.string().nullish(),
    country: z.string().nullish(),
    timezone: z.string().nullish(),
    // Only one of these (or neither) is likely real.
    stores: z.array(BusinessStoreSchema).optional(),
    store: BusinessStoreSchema.optional(),
  })
  .passthrough();

// Top-level GET /v3/me response (merchant identity).
export const MeResponseSchema = z
  .object({
    // ⚠️ Large 64-bit integer ids lose precision at JSON.parse (>2^53) BEFORE
    // Zod sees them. If Scalev ids can be big ints, confirm week 1 and tighten
    // to z.string() (keep as string end-to-end).
    id: z.union([z.string(), z.number()]),
    email: z.string().optional(), // not .email() yet — avoid rejecting sandbox values
    // Display name — hedged across likely key names; drop unused later.
    name: z.string().optional(),
    full_name: z.string().optional(),
    username: z.string().optional(),
    phone: z.string().nullish(),
    avatar_url: z.string().nullish(),
    status: z.string().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    // The field the guide names as the tenant basis.
    // ⚠️ REQUIRED ON PURPOSE (not .optional().default([])): the KEY NAME is the
    // prime suspect of the assumption. If Scalev calls it `businesses` /
    // `business_accounts` / nests it, this throws a loud Zod error in scalevFetch
    // (caught week 1) instead of silently defaulting to [] and telling the
    // merchant "no business connected". A genuinely empty array still passes.
    connected_businesses: z.array(ConnectedBusinessSchema),
  })
  .passthrough();

// If Scalev wraps the body (e.g. { data: {...} }), validate `.data` against
// MeResponseSchema instead. Delete whichever wrapper does not match reality.
export const MeResponseEnvelopeSchema = z
  .object({ data: MeResponseSchema })
  .passthrough();

export type MeResponse = z.infer<typeof MeResponseSchema>;
export type ConnectedBusiness = z.infer<typeof ConnectedBusinessSchema>;
export type BusinessStore = z.infer<typeof BusinessStoreSchema>;
