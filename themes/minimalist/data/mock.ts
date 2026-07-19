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

export function mockProductToCatalog(mock: MockProduct): CatalogProduct {
  return {
    ...mock,
    slug: mock.id,
    inStock: true,
  }
}

export const TRENDING_PRODUCTS: MockProduct[] = [
  {
    id: "1",
    name: "Wool-blend Coat",
    subtitle: "Midnight Navy",
    price: 2495000,
    badge: "NEW",
    imageClass: "bg-gradient-to-br from-slate-700 to-slate-900",
    imageUrl: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80&auto=format",
  },
  {
    id: "2",
    name: "Cashmere Sweater",
    subtitle: "Cloud Grey",
    price: 1195000,
    imageClass: "bg-gradient-to-br from-stone-300 to-stone-400",
    imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80&auto=format",
  },
  {
    id: "3",
    name: "Organic Cotton Tee",
    subtitle: "Ecru",
    price: 349000,
    salePrice: 279000,
    badge: "SALE",
    imageClass: "bg-gradient-to-br from-neutral-200 to-neutral-300",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80&auto=format",
  },
  {
    id: "4",
    name: "Everyday Tees Set",
    subtitle: "Sage / White",
    price: 649000,
    imageClass: "bg-gradient-to-br from-zinc-800 to-zinc-900",
    imageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80&auto=format",
  },
  {
    id: "5",
    name: "Leather Tote",
    subtitle: "Chestnut",
    price: 1850000,
    imageClass: "bg-gradient-to-br from-stone-300 to-stone-400",
    imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80&auto=format",
  },
  {
    id: "6",
    name: "Canvas Sneakers",
    subtitle: "Off-White",
    price: 1099000,
    imageClass: "bg-gradient-to-br from-neutral-200 to-neutral-300",
    imageUrl: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80&auto=format",
  },
  {
    id: "7",
    name: "Weekend Backpack",
    subtitle: "Slate",
    price: 1299000,
    imageClass: "bg-gradient-to-br from-slate-700 to-slate-900",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80&auto=format",
  },
  {
    id: "8",
    name: "Classic Sunglasses",
    subtitle: "Tortoise",
    price: 899000,
    badge: "NEW",
    imageClass: "bg-gradient-to-br from-zinc-800 to-zinc-900",
    imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80&auto=format",
  },
]

export const CATEGORIES = [
  {
    slug: "ready-to-wear",
    label: "Ready to Wear",
    imageClass: "bg-gradient-to-br from-stone-400 to-stone-600",
    large: true,
  },
  {
    slug: "accessories",
    label: "Accessories",
    imageClass: "bg-gradient-to-br from-emerald-700 to-emerald-900",
    large: false,
  },
  {
    slug: "footwear",
    label: "Footwear",
    imageClass: "bg-gradient-to-br from-neutral-300 to-neutral-500",
    large: false,
  },
] as const
