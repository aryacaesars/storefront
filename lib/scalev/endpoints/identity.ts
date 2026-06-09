import "server-only";
import { scalevFetch } from "../client";
import { MeResponseSchema, type MeResponse } from "../schemas";

/**
 * GET /v3/me — merchant identity + connected_businesses (basis for tenant).
 * ⚠️ Response shape is an ASSUMPTION (see schemas.ts) — validate week 1.
 */
export async function getMe(token: string): Promise<MeResponse> {
  return scalevFetch("/v3/me", { token, schema: MeResponseSchema });
}
