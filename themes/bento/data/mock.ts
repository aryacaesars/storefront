import type { CatalogProduct } from "@/features/storefront/catalog-types"

export interface MockProduct {
  id: string
  name: string
  subtitle: string
  price: number
  salePrice?: number
  badge?: "NEW" | "SALE"
  imageClass: string
}

export const TRENDING_PRODUCTS: MockProduct[] = [
  {
    id: "1",
    name: "Contour Desk Lamp",
    subtitle: "Matte Pearl",
    price: 189,
    badge: "NEW",
    imageClass: "bg-gradient-to-br from-[#b8c4e8] to-[#7a8fc8]",
  },
  {
    id: "2",
    name: "Soft-Touch Speaker",
    subtitle: "Cloud Grey",
    price: 249,
    imageClass: "bg-gradient-to-br from-[#c8d0dc] to-[#9aa8bc]",
  },
  {
    id: "3",
    name: "Ergo Mouse Pad",
    subtitle: "Slate",
    price: 48,
    salePrice: 38,
    badge: "SALE",
    imageClass: "bg-gradient-to-br from-[#d4dae4] to-[#a8b0c0]",
  },
  {
    id: "4",
    name: "Ceramic Planter",
    subtitle: "Mist",
    price: 72,
    imageClass: "bg-gradient-to-br from-[#bcc8dc] to-[#8a9ab8]",
  },
]

export function mockProductToCatalog(mock: MockProduct): CatalogProduct {
  return {
    ...mock,
    slug: mock.id,
    inStock: true,
  }
}

export const CATEGORIES = [
  {
    slug: "home-objects",
    label: "Home Objects",
    imageClass: "bg-gradient-to-br from-[#b0bdd4] to-[#8498bc]",
    large: true,
  },
  {
    slug: "tech-accessories",
    label: "Tech Accessories",
    imageClass: "bg-gradient-to-br from-[#c0c8d8] to-[#94a4bc]",
    large: false,
  },
  {
    slug: "desk-essentials",
    label: "Desk Essentials",
    imageClass: "bg-gradient-to-br from-[#ccd4e0] to-[#a0aec0]",
    large: false,
  },
] as const
