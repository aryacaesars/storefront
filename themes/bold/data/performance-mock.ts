export interface MockCollection {
  slug: string
  name: string
  description?: string
  cta: string
  imageClass: string
  large?: boolean
}

export interface MockTrendingProduct {
  id: string
  name: string
  price: number
  badge?: "NEW" | "LIMITED"
  imageClass: string
}

export const FEATURED_COLLECTIONS: MockCollection[] = [
  {
    slug: "tech-series",
    name: "The Tech Series",
    description: "Laser-cut precision meeting sweat-wicking innovation.",
    cta: "Discover Tech",
    imageClass: "bg-gradient-to-br from-zinc-800 to-zinc-950",
    large: true,
  },
  {
    slug: "elite-footwear",
    name: "Elite Footwear",
    cta: "Shop Now",
    imageClass: "bg-gradient-to-br from-teal-900 to-zinc-900",
  },
  {
    slug: "compression-lab",
    name: "Compression Lab",
    cta: "Explore Gear",
    imageClass: "bg-gradient-to-br from-emerald-900 to-zinc-950",
  },
]

export const NEW_ARRIVALS: MockTrendingProduct[] = [
  {
    id: "n1",
    name: "Velocity Core Tee",
    price: 75,
    badge: "NEW",
    imageClass: "bg-gradient-to-br from-teal-900 to-zinc-900",
  },
  {
    id: "n2",
    name: "Elite Compression Short",
    price: 95,
    badge: "NEW",
    imageClass: "bg-gradient-to-br from-zinc-700 to-zinc-950",
  },
  {
    id: "n3",
    name: "Thermal Mid Layer",
    price: 145,
    badge: "NEW",
    imageClass: "bg-gradient-to-br from-zinc-800 to-teal-950",
  },
  {
    id: "n4",
    name: "Performance Cap",
    price: 45,
    badge: "NEW",
    imageClass: "bg-gradient-to-br from-zinc-600 to-zinc-900",
  },
]

export const TRENDING_PRODUCTS: MockTrendingProduct[] = [
  {
    id: "1",
    name: "Aero-Knit Tee 2.0",
    price: 85,
    badge: "NEW",
    imageClass: "bg-gradient-to-br from-zinc-700 to-zinc-900",
  },
  {
    id: "2",
    name: "Momentum Tights",
    price: 110,
    imageClass: "bg-gradient-to-br from-zinc-600 to-zinc-800",
  },
  {
    id: "3",
    name: "Velocity Runner X",
    price: 160,
    imageClass: "bg-gradient-to-br from-zinc-800 to-zinc-950",
  },
  {
    id: "4",
    name: "Apex Shield Jacket",
    price: 195,
    badge: "LIMITED",
    imageClass: "bg-gradient-to-br from-teal-900 to-zinc-900",
  },
]
