/** View model shared between storefront themes and Scalev catalog mapper. */
export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  salePrice?: number;
  badge?: "NEW" | "SALE";
  imageUrl?: string;
  /** CSS gradient fallback when no image from Scalev. */
  imageClass: string;
  description?: string;
  inStock: boolean;
};

const FALLBACK_GRADIENTS = [
  "bg-gradient-to-br from-stone-200 to-stone-400",
  "bg-gradient-to-br from-neutral-200 to-neutral-500",
  "bg-gradient-to-br from-zinc-200 to-zinc-400",
  "bg-gradient-to-br from-slate-200 to-slate-500",
] as const;

function parsePrice(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return 0;
}

function gradientForId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash + id.charCodeAt(i)) % 997;
  return FALLBACK_GRADIENTS[hash % FALLBACK_GRADIENTS.length];
}

export function formatIdr(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function mapStorefrontProductCard(
  item: {
    id: unknown;
    slug: string;
    name: string;
    description?: string | null;
    in_stock?: boolean | null;
    price_range?: { min?: unknown; max?: unknown } | null;
    images?: string[] | null;
    created_at?: string | null;
  },
): CatalogProduct {
  const id = String(item.id);
  const min = parsePrice(item.price_range?.min);
  const max = parsePrice(item.price_range?.max);
  const hasSale = max > min && min > 0;

  return {
    id,
    slug: item.slug,
    name: item.name,
    subtitle: item.description?.trim() || "Scalev catalog",
    price: hasSale ? max : min || max,
    salePrice: hasSale ? min : undefined,
    imageUrl: item.images?.[0] ?? undefined,
    imageClass: gradientForId(id),
    description: item.description ?? undefined,
    inStock: item.in_stock !== false,
    badge: item.created_at ? undefined : undefined,
  };
}

export function mapStorefrontProductDetail(
  item: Parameters<typeof mapStorefrontProductCard>[0] & {
    rich_description?: string | null;
    variants?: Array<{
      price?: unknown;
      images?: string[] | null;
      fullname?: string | null;
      name?: string | null;
    }> | null;
  },
): CatalogProduct {
  const base = mapStorefrontProductCard(item);
  const firstVariant = item.variants?.[0];
  const variantPrice = firstVariant ? parsePrice(firstVariant.price) : 0;

  return {
    ...base,
    subtitle:
      firstVariant?.fullname?.trim() ||
      firstVariant?.name?.trim() ||
      base.name,
    price: variantPrice || base.price,
    salePrice: undefined,
    imageUrl: base.imageUrl ?? firstVariant?.images?.[0],
    description:
      item.rich_description?.trim() ||
      item.description?.trim() ||
      base.description,
  };
}
