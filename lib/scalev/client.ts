import "server-only";
import type { z } from "zod";

/**
 * Scalev API client — the ONLY door to Scalev (guide strict rule #1).
 * No component/page may fetch Scalev directly; everything goes through here
 * and MUST pass a Zod schema before returning.
 */

// ⚠️ ASSUMPTION: base URL + Bearer scheme. Confirm against sandbox week 1.
const BASE_URL =
  process.env.SCALEV_API_BASE?.trim() || "https://api.scalev.com";

export type ScalevErrorKind = "http" | "network" | "validation";

export class ScalevError extends Error {
  readonly status: number;
  readonly kind: ScalevErrorKind;
  readonly body: unknown;
  constructor(
    message: string,
    status: number,
    kind: ScalevErrorKind = "http",
    body?: unknown,
  ) {
    super(message);
    this.name = "ScalevError";
    this.status = status;
    this.kind = kind;
    this.body = body;
  }
}

interface ScalevFetchOptions<T> {
  /** Merchant/storefront token. ⚠️ ASSUMPTION: sent as `Authorization: Bearer`. */
  token?: string;
  method?: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  body?: unknown;
  /** Zod schema to validate the response against. Required (strict rule #1). */
  schema: z.ZodType<T>;
  /** Forwarded fetch init (e.g. next: { revalidate } for storefront ISR). */
  init?: RequestInit;
}

export async function scalevFetch<T>(
  path: string,
  opts: ScalevFetchOptions<T>,
): Promise<T> {
  const { token, method = "GET", body, schema, init } = opts;
  const url = `${BASE_URL}${path}`;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`; // ⚠️ confirm scheme
  if (body !== undefined) headers["Content-Type"] = "application/json";

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      // Commerce/identity data is always live, never persisted (strict rule #3).
      cache: "no-store",
      ...init,
    });
  } catch (e) {
    throw new ScalevError(
      `Network error calling Scalev ${method} ${path}: ${(e as Error).message}`,
      0,
      "network",
    );
  }

  const rawText = await res.text();
  let json: unknown;
  if (rawText) {
    try {
      json = JSON.parse(rawText);
    } catch {
      json = undefined; // non-JSON body; keep raw for the error path
    }
  }

  if (!res.ok) {
    throw new ScalevError(
      `Scalev ${method} ${path} failed (HTTP ${res.status})`,
      res.status,
      "http",
      json ?? rawText,
    );
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    // Loud failure on purpose. A mismatch on a 2xx response almost certainly
    // means the ASSUMPTION schema diverges from the real Scalev shape — the
    // prime suspects (validate week 1) are:
    //   1. an envelope, e.g. body wrapped in { data: {...} }
    //   2. a renamed key (e.g. `businesses` instead of `connected_businesses`)
    // Status is 502 (NOT the upstream 2xx) so callers don't misreport it as
    // a successful transport. Full raw body is attached for server-side logs.
    throw new ScalevError(
      `Scalev ${path} response did not match the assumed schema. ` +
        `Likely an envelope ({data:...}) or renamed key — confirm shape week 1 (see lib/scalev/schemas.ts). ` +
        `Zod: ${parsed.error.message}`,
      502,
      "validation",
      json,
    );
  }

  return parsed.data;
}

export { BASE_URL as SCALEV_BASE_URL };

interface ScalevStorefrontFetchOptions<T> {
  storeUniqueId: string;
  storefrontApiKey: string;
  method?: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  body?: unknown;
  schema: z.ZodType<T>;
  init?: RequestInit;
}

/** Public storefront routes — `X-Scalev-Storefront-Api-Key`, store `unique_id` in path. */
export async function scalevStorefrontFetch<T>(
  path: string,
  opts: ScalevStorefrontFetchOptions<T>,
): Promise<T> {
  const { storeUniqueId, storefrontApiKey, method = "GET", body, schema, init } =
    opts;
  const url = `${BASE_URL}/v3/stores/${encodeURIComponent(storeUniqueId)}${path}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
    "X-Scalev-Storefront-Api-Key": storefrontApiKey,
  };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
      ...init,
    });
  } catch (e) {
    throw new ScalevError(
      `Network error calling Scalev storefront ${method} ${path}: ${(e as Error).message}`,
      0,
      "network",
    );
  }

  const rawText = await res.text();
  let json: unknown;
  if (rawText) {
    try {
      json = JSON.parse(rawText);
    } catch {
      json = undefined;
    }
  }

  if (!res.ok) {
    throw new ScalevError(
      `Scalev storefront ${method} ${path} failed (HTTP ${res.status})`,
      res.status,
      "http",
      json ?? rawText,
    );
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    throw new ScalevError(
      `Scalev storefront ${path} response did not match schema. Zod: ${parsed.error.message}`,
      502,
      "validation",
      json,
    );
  }

  return parsed.data;
}
