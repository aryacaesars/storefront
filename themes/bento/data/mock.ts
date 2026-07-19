import type { CatalogProduct } from "@/features/storefront/catalog-types"

export interface MockProduct {
  id: string
  name: string
  subtitle: string
  price: number
  salePrice?: number
  badge?: "NEW" | "SALE"
  imageClass: string
  imageUrl?: string
}

export const TRENDING_PRODUCTS: MockProduct[] = [
  {
    id: "1",
    name: "Acoustic Headphones",
    subtitle: "Matte Black",
    price: 1299000,
    badge: "NEW",
    imageClass: "bg-gradient-to-br from-[#b8c4e8] to-[#7a8fc8]",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80&auto=format",
  },
  {
    id: "2",
    name: "Pulse Smartwatch",
    subtitle: "Graphite",
    price: 2450000,
    imageClass: "bg-gradient-to-br from-[#c8d0dc] to-[#9aa8bc]",
    imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80&auto=format",
  },
  {
    id: "3",
    name: "Slate Tablet",
    subtitle: "Wi-Fi 128GB",
    price: 4499000,
    salePrice: 3999000,
    badge: "SALE",
    imageClass: "bg-gradient-to-br from-[#d4dae4] to-[#a8b0c0]",
    imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80&auto=format",
  },
  {
    id: "4",
    name: "Ceramic Planter",
    subtitle: "Mist",
    price: 249000,
    imageClass: "bg-gradient-to-br from-[#bcc8dc] to-[#8a9ab8]",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80&auto=format",
  },
  {
    id: "5",
    name: "Studio Earbuds",
    subtitle: "Pearl White",
    price: 899000,
    imageClass: "bg-gradient-to-br from-[#b8c4e8] to-[#7a8fc8]",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80&auto=format",
  },
  {
    id: "6",
    name: "Heritage Watch",
    subtitle: "Tan Leather",
    price: 2150000,
    imageClass: "bg-gradient-to-br from-[#c8d0dc] to-[#9aa8bc]",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80&auto=format",
  },
  {
    id: "7",
    name: "Compact Camera",
    subtitle: "Onyx",
    price: 5750000,
    badge: "NEW",
    imageClass: "bg-gradient-to-br from-[#d4dae4] to-[#a8b0c0]",
    imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80&auto=format",
  },
  {
    id: "8",
    name: "Desk Essentials Kit",
    subtitle: "Walnut",
    price: 1150000,
    imageClass: "bg-gradient-to-br from-[#bcc8dc] to-[#8a9ab8]",
    imageUrl: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80&auto=format",
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
