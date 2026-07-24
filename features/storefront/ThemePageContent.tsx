import type { ReactNode } from "react"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { PAGE_LABELS } from "@/themes/engine/manifest"
import { resolveThemePage } from "@/themes/engine/resolve-page"
import type { PageType } from "@/themes/engine/resolve-page"
import { getStorefrontThemeConfig } from "@/features/storefront/theme-config"
import { getTenantSubdomain } from "@/features/tenant/resolve-tenant"
import {
  getCatalogCategoryBySlug,
  getCatalogProductBySlug,
  getCatalogProductsByCategorySlug,
  getCatalogProductsForTenant,
  getFilteredCatalogProductsForTenant,
  parseCatalogSearchParams,
} from "@/features/storefront/catalog"
import type { CatalogListFilters } from "@/features/storefront/catalog-types"
import { getStoreBySlug } from "@/server/services/tenant.service"
import { getCustomerSession } from "@/features/storefront/customer-dal"
import { getCustomerDefaultAddress } from "@/server/services/customer.service"
import { prisma } from "@/lib/db/prisma"
import { normalizeCartItem, type CartItem } from "@/lib/storefront/cart"
import type { ThemePageProps } from "@/themes/engine/page-props"
import type { StorefrontCategory } from "@/features/storefront/catalog-types"

interface ThemePageContentProps {
  pageType: PageType
  fallbackTitle: string
  slug?: string
  searchParams?: Record<string, string | string[] | undefined>
}

const CATALOG_LIST_PAGES: PageType[] = [
  "productList",
  "allProducts",
  "shop",
  "newArrivals",
  "collections",
]

export async function ThemePageContent({
  pageType,
  fallbackTitle,
  slug,
  searchParams,
}: ThemePageContentProps): Promise<ReactNode> {
  const tenantSlug = await getTenantSubdomain()
  const config = await getStorefrontThemeConfig(tenantSlug)
  const PageComponent = resolveThemePage(config.templateId, pageType)

  let products: Awaited<ReturnType<typeof getCatalogProductsForTenant>> = []
  let product: Awaited<ReturnType<typeof getCatalogProductBySlug>> = null
  let category: ThemePageProps["category"] = undefined
  let categories: StorefrontCategory[] = []
  let priceBounds: { min: number; max: number } | null = null
  let catalogFilters: CatalogListFilters = {}
  let cart: CartItem[] = []
  let storeId: string | undefined
  let checkoutPrefill: ThemePageProps["checkoutPrefill"] = null
  let checkoutCustomer: ThemePageProps["checkoutCustomer"] = null
  let checkoutAddress: ThemePageProps["checkoutAddress"] = null

  if (CATALOG_LIST_PAGES.includes(pageType)) {
    catalogFilters = parseCatalogSearchParams(searchParams)
    const filtered = await getFilteredCatalogProductsForTenant(
      tenantSlug,
      catalogFilters,
    )
    products = filtered.products
    categories = filtered.categories
    priceBounds = filtered.priceBounds
  }
  if (pageType === "productDetail" && slug) {
    const [detail, catalog] = await Promise.all([
      getCatalogProductBySlug(tenantSlug, slug),
      getCatalogProductsForTenant(tenantSlug),
    ])
    product = detail
    products = catalog
    // Live tenant + slug tidak ada → App Router not-found
    if (tenantSlug && !detail) notFound()
  }
  if (pageType === "collection" && slug && tenantSlug) {
    const [cat, catProducts] = await Promise.all([
      getCatalogCategoryBySlug(tenantSlug, slug),
      getCatalogProductsByCategorySlug(tenantSlug, slug),
    ])
    category = cat
    products = catProducts
  }
  if (pageType === "cart" || pageType === "checkout") {
    const cookieStore = await cookies()
    const raw = cookieStore.get("sf_cart")?.value
    if (raw) {
      try {
        cart = (JSON.parse(raw) as CartItem[]).map(normalizeCartItem)
      } catch {
        cart = []
      }
    }
    // Annotate cart items with current DB state to surface warnings in UI
    if (cart.length > 0) {
      const productIds = [...new Set(cart.map((i) => i.productId))]
      const variantIds = [
        ...new Set(cart.map((i) => i.variantId).filter(Boolean) as string[]),
      ]
      const [products, variants] = await Promise.all([
        prisma.product.findMany({
          where: { id: { in: productIds } },
          select: {
            id: true,
            price: true,
            images: { select: { url: true }, orderBy: { order: "asc" } },
          },
        }),
        variantIds.length
          ? prisma.productVariant.findMany({
              where: { id: { in: variantIds } },
              select: { id: true, productId: true, price: true, imageUrl: true },
            })
          : Promise.resolve([]),
      ])
      const productMap = new Map(products.map((p) => [p.id, p]))
      const variantMap = new Map(variants.map((v) => [v.id, v]))
      // also detect if product has any variants at all
      const allVariants = await prisma.productVariant.findMany({
        where: { productId: { in: productIds } },
        select: { id: true, productId: true },
      })
      const productHasVariants = new Map<string, boolean>()
      for (const v of allVariants) productHasVariants.set(v.productId, true)

      cart = cart.map((item) => {
        const prod = productMap.get(item.productId)
        const variant = item.variantId ? variantMap.get(item.variantId) : undefined
        const needsVariantSelection = !!productHasVariants.get(item.productId) && !item.variantId
        // variantId di cart tapi record varian sudah dihapus dari master produk
        const variantUnavailable = !!item.variantId && !variant
        // Harga DB selalu otoritatif; snapshot cart di-override dengan harga terkini.
        let price = item.price
        if (variant) {
          price = variant.price
        } else if (prod && !variantUnavailable) {
          price = prod.price
        }
        // Prefer variant image, then product primary image, then existing cart image
        const preferredImage = variant?.imageUrl ?? prod?.images?.[0]?.url ?? item.imageUrl
        return { ...item, needsVariantSelection, variantUnavailable, price, imageUrl: preferredImage }
      })
    }
    if (tenantSlug) {
      const store = await getStoreBySlug(tenantSlug)
      storeId = store?.id
    }
    if (pageType === "checkout") {
      const customer = await getCustomerSession()
      if (customer) {
        const address = await getCustomerDefaultAddress(customer.customerId)
        checkoutCustomer = {
          name: customer.name ?? "",
          email: customer.email,
          phone: customer.phone ?? "",
        }
        checkoutAddress = address
          ? {
              id: address.id,
              label: address.label,
              street: address.street,
              city: address.city,
              province: address.province,
              postalCode: address.postalCode,
            }
          : null
        checkoutPrefill = {
          name: customer.name ?? "",
          email: customer.email,
          phone: customer.phone ?? "",
          street: address?.street ?? "",
          city: address?.city ?? "",
          province: address?.province ?? "",
          postalCode: address?.postalCode ?? "",
        }
      }
    }
  }

  if (!PageComponent) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1
          className="text-3xl font-semibold text-[var(--theme-text)]"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          {PAGE_LABELS[pageType] ?? fallbackTitle}
        </h1>
        <p className="mt-4 text-sm text-[var(--theme-muted)]">Coming soon.</p>
      </div>
    )
  }

  return (
    <PageComponent
      config={config}
      slug={slug}
      products={products}
      product={product}
      category={category}
      categories={categories}
      priceBounds={priceBounds}
      catalogFilters={catalogFilters}
      cart={cart}
      storeId={storeId}
      checkoutCustomer={checkoutCustomer}
      checkoutAddress={checkoutAddress}
      checkoutPrefill={checkoutPrefill}
    />
  )
}
