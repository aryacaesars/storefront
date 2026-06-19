import "server-only";
import { scalevFetch, scalevStorefrontFetch } from "../client";
import {
  SimplifiedStoreListSchema,
  StorefrontItemListSchema,
  StorefrontProductDetailSchema,
  StorefrontPublicApiKeyListSchema,
  StorefrontPublicApiKeySchema,
  StorefrontAllowedOriginSchema,
  StoreProductListSchema,
  type SimplifiedStore,
} from "../schemas-storefront";

/** GET /v3/stores/simplified — pick a store to bind catalog. */
export async function listSimplifiedStores(
  token: string,
): Promise<SimplifiedStore[]> {
  const res = await scalevFetch("/v3/stores/simplified?page_size=25", {
    token,
    schema: SimplifiedStoreListSchema,
  });
  return res.data;
}

/** POST /v3/stores/{numeric_id}/public-api-keys — returns token once. */
export async function createStorefrontPublicApiKey(
  token: string,
  storeNumericId: number,
): Promise<string> {
  const res = await scalevFetch(
    `/v3/stores/${storeNumericId}/public-api-keys`,
    {
      token,
      method: "POST",
      schema: StorefrontPublicApiKeySchema,
    },
  );
  if (!res.token) {
    throw new Error("Scalev did not return a storefront API key token.");
  }
  return res.token;
}

/** GET existing keys — listed keys omit raw token; use create when missing. */
export async function listStorefrontPublicApiKeys(
  token: string,
  storeNumericId: number,
) {
  return scalevFetch(`/v3/stores/${storeNumericId}/public-api-keys`, {
    token,
    schema: StorefrontPublicApiKeyListSchema,
  });
}

/** POST allowed browser origin for CORS (tenant subdomain). */
export async function registerStorefrontAllowedOrigin(
  token: string,
  storeNumericId: number,
  origin: string,
) {
  return scalevFetch(
    `/v3/stores/${storeNumericId}/storefront/allowed-origins`,
    {
      token,
      method: "POST",
      body: { origin },
      schema: StorefrontAllowedOriginSchema,
    },
  );
}

/** Business-scoped product count preview during connect. */
export async function listStoreProducts(
  token: string,
  storeNumericId: number,
) {
  return scalevFetch(
    `/v3/stores/${storeNumericId}/products?page_size=25`,
    {
      token,
      schema: StoreProductListSchema,
    },
  );
}

/** Public catalog feed for storefront pages. */
export async function listStorefrontItems(
  storeUniqueId: string,
  storefrontApiKey: string,
  opts?: { pageSize?: number },
) {
  const qs = opts?.pageSize ? `?page_size=${opts.pageSize}` : "";
  return scalevStorefrontFetch(`/public/items${qs}`, {
    storeUniqueId,
    storefrontApiKey,
    schema: StorefrontItemListSchema,
    init: { next: { revalidate: 60 } },
  });
}

export async function getStorefrontProductBySlug(
  storeUniqueId: string,
  storefrontApiKey: string,
  slug: string,
) {
  return scalevStorefrontFetch(
    `/public/products/${encodeURIComponent(slug)}`,
    {
      storeUniqueId,
      storefrontApiKey,
      schema: StorefrontProductDetailSchema,
      init: { next: { revalidate: 60 } },
    },
  );
}
