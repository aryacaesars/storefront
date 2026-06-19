import { z } from "zod";

/** Cursor-paginated list envelope used by many v3 endpoints. */
export const PaginatedListSchema = z
  .object({
    data: z.array(z.unknown()),
    is_paginated: z.boolean().nullish(),
    has_next: z.boolean().nullish(),
    has_previous: z.boolean().nullish(),
    next_cursor: z.string().nullish(),
    previous_cursor: z.string().nullish(),
    page_size: z.number().nullish(),
  })
  .passthrough();

export const SimplifiedStoreSchema = z
  .object({
    id: z.union([z.number(), z.string()]),
    unique_id: z.string().nullish(),
    name: z.string().nullish(),
    is_active: z.boolean().nullish(),
    is_public: z.boolean().nullish(),
    logo: z.string().nullish(),
  })
  .passthrough();

export const SimplifiedStoreListSchema = PaginatedListSchema.extend({
  data: z.array(SimplifiedStoreSchema),
});

export type SimplifiedStore = z.infer<typeof SimplifiedStoreSchema>;

export const StorefrontPublicApiKeySchema = z
  .object({
    id: z.string(),
    token: z.string().nullish(),
    status: z.enum(["active", "revoked"]).nullish(),
    store_id: z.union([z.number(), z.string()]).nullish(),
  })
  .passthrough();

export const StorefrontPublicApiKeyListSchema = z
  .object({
    data: z.array(StorefrontPublicApiKeySchema),
    is_paginated: z.boolean().nullish(),
  })
  .passthrough();

export const StorefrontAllowedOriginSchema = z
  .object({
    id: z.string(),
    origin: z.string(),
    status: z.enum(["active", "revoked"]).nullish(),
    store_id: z.union([z.number(), z.string()]).nullish(),
  })
  .passthrough();

const priceValue = z.union([z.number(), z.string()]);

export const StorefrontPriceRangeSchema = z
  .object({
    min: priceValue.nullish(),
    max: priceValue.nullish(),
  })
  .passthrough()
  .nullish();

export const StorefrontProductCardSchema = z
  .object({
    id: z.union([z.number(), z.string()]),
    slug: z.string(),
    name: z.string(),
    description: z.string().nullish(),
    entity_type: z.literal("product"),
    item_type: z.string().nullish(),
    in_stock: z.boolean().nullish(),
    price_range: StorefrontPriceRangeSchema,
    images: z.array(z.string()).nullish(),
  })
  .passthrough();

export const StorefrontBundleCardSchema = z
  .object({
    entity_type: z.literal("bundle_price_option"),
  })
  .passthrough();

export const StorefrontItemCardSchema = z.union([
  StorefrontProductCardSchema,
  StorefrontBundleCardSchema,
  z.object({ entity_type: z.string().optional() }).passthrough(),
]);

export const StorefrontItemListSchema = PaginatedListSchema.extend({
  data: z.array(StorefrontItemCardSchema),
});

export const StorefrontVariantSchema = z
  .object({
    id: z.union([z.number(), z.string()]),
    sku: z.string().nullish(),
    name: z.string().nullish(),
    fullname: z.string().nullish(),
    price: priceValue.nullish(),
    images: z.array(z.string()).nullish(),
    option1_value: z.string().nullish(),
    option2_value: z.string().nullish(),
    option3_value: z.string().nullish(),
    in_stock: z.boolean().nullish(),
    is_active: z.boolean().nullish(),
  })
  .passthrough();

export const StorefrontProductDetailSchema = StorefrontProductCardSchema.extend({
  rich_description: z.string().nullish(),
  variants: z.array(StorefrontVariantSchema).nullish(),
});

export type StorefrontProductCard = z.infer<typeof StorefrontProductCardSchema>;
export type StorefrontProductDetail = z.infer<typeof StorefrontProductDetailSchema>;

export const StoreProductSchema = z
  .object({
    id: z.union([z.number(), z.string()]),
    is_visible: z.boolean().nullish(),
    name: z.string().nullish(),
    display: z.string().nullish(),
    variants: z
      .array(
        z
          .object({
            id: z.union([z.number(), z.string()]),
            price: z.number().nullish(),
          })
          .passthrough(),
      )
      .nullish(),
  })
  .passthrough();

export const StoreProductListSchema = PaginatedListSchema.extend({
  data: z.array(StoreProductSchema),
});
