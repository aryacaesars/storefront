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
    name: "Wool-blend Coat",
    subtitle: "Midnight Navy",
    price: 495,
    badge: "NEW",
    imageClass: "bg-gradient-to-br from-slate-700 to-slate-900",
  },
  {
    id: "2",
    name: "Cashmere Sweater",
    subtitle: "Cloud Grey",
    price: 195,
    imageClass: "bg-gradient-to-br from-stone-300 to-stone-400",
  },
  {
    id: "3",
    name: "Tailored Trousers",
    subtitle: "Ivory",
    price: 220,
    salePrice: 176,
    badge: "SALE",
    imageClass: "bg-gradient-to-br from-neutral-200 to-neutral-300",
  },
  {
    id: "4",
    name: "Organic Cotton Tee",
    subtitle: "Obsidian",
    price: 65,
    imageClass: "bg-gradient-to-br from-zinc-800 to-zinc-900",
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
