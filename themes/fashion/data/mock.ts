export interface MockFashionProduct {
  id: string
  name: string
  price: number
  badge?: "NEW" | "SALE"
  imageClass: string
}

export interface MockCategory {
  slug: string
  label: string
  cta: string
  imageClass: string
}

export interface MockGalleryImage {
  imageClass: string
  alt: string
}

export const FEATURED_PRODUCTS: MockFashionProduct[] = [
  {
    id: "1",
    name: "Wool Overcoat",
    price: 420,
    imageClass: "bg-gradient-to-b from-stone-300 to-stone-400",
  },
  {
    id: "2",
    name: "Silk Essential",
    price: 185,
    imageClass: "bg-gradient-to-b from-amber-100 to-stone-300",
  },
  {
    id: "3",
    name: "Soft Loafers",
    price: 240,
    imageClass: "bg-gradient-to-b from-zinc-700 to-zinc-900",
  },
  {
    id: "4",
    name: "Luna Handbag",
    price: 590,
    badge: "NEW",
    imageClass: "bg-gradient-to-b from-stone-200 to-amber-100",
  },
]

export const CATEGORIES: MockCategory[] = [
  {
    slug: "new-collection",
    label: "New Collection",
    cta: "SHOP NOW",
    imageClass: "bg-gradient-to-br from-stone-200 to-stone-400",
  },
  {
    slug: "best-sellers",
    label: "Best Sellers",
    cta: "EXPLORE",
    imageClass: "bg-gradient-to-br from-amber-100 via-stone-300 to-stone-500",
  },
  {
    slug: "jewelry",
    label: "Jewelry",
    cta: "DISCOVER",
    imageClass: "bg-gradient-to-br from-zinc-700 to-zinc-900",
  },
]

export const COMMUNITY_IMAGES: MockGalleryImage[] = [
  { imageClass: "bg-gradient-to-br from-amber-100 to-stone-300", alt: "Linen texture" },
  { imageClass: "bg-gradient-to-br from-stone-400 to-stone-600", alt: "Street style" },
  { imageClass: "bg-gradient-to-br from-amber-50 to-stone-200", alt: "Morning ritual" },
  { imageClass: "bg-gradient-to-br from-stone-300 to-amber-200", alt: "Interior detail" },
  { imageClass: "bg-gradient-to-br from-amber-600 to-amber-800", alt: "Golden hour" },
  { imageClass: "bg-gradient-to-br from-zinc-600 to-zinc-800", alt: "Watch detail" },
]

// ── Shop All data ──────────────────────────────────────────────────────────────

export interface MockShopProduct {
  id: string
  name: string
  price: number
  category: "Apparel" | "Accessories" | "Footwear" | "Objects"
  material: string[]
  imageClass: string
  badge?: "NEW ARRIVAL" | "LIMITED EDITION"
}

export const SHOP_PRODUCTS: MockShopProduct[] = [
  {
    id: "sp-1",
    name: "Architectural Knit Sweater",
    price: 420,
    category: "Apparel",
    material: ["Cashmere"],
    imageClass: "bg-gradient-to-b from-zinc-500 to-zinc-700",
    badge: "NEW ARRIVAL",
  },
  {
    id: "sp-2",
    name: "Vault Leather Tote",
    price: 850,
    category: "Accessories",
    material: ["Silk"],
    imageClass: "bg-gradient-to-b from-zinc-800 to-zinc-950",
  },
  {
    id: "sp-3",
    name: "Tailored Wool Overcoat",
    price: 1200,
    category: "Apparel",
    material: ["Linen"],
    imageClass: "bg-gradient-to-b from-stone-100 to-stone-300",
  },
  {
    id: "sp-4",
    name: "Essential Loafer",
    price: 380,
    category: "Footwear",
    material: ["Organic Cotton"],
    imageClass: "bg-gradient-to-b from-amber-600 to-amber-800",
  },
  {
    id: "sp-5",
    name: "Horizon Series Watch",
    price: 550,
    category: "Objects",
    material: ["Silk"],
    imageClass: "bg-gradient-to-br from-zinc-300 to-zinc-500",
  },
  {
    id: "sp-6",
    name: "Occasion Blazer",
    price: 690,
    category: "Apparel",
    material: ["Cashmere", "Linen"],
    imageClass: "bg-gradient-to-b from-blue-800 to-blue-950",
    badge: "LIMITED EDITION",
  },
]

export function mockShopToCatalog(mock: MockShopProduct): import("@/features/storefront/catalog-types").CatalogProduct {
  return {
    id: mock.id,
    slug: mock.id,
    name: mock.name,
    subtitle: mock.category,
    price: mock.price,
    imageClass: mock.imageClass,
    inStock: true,
    description: `Materials: ${mock.material.join(", ")}.`,
  }
}

export const FILTER_CATEGORIES = [
  { label: "Apparel",     count: 24 },
  { label: "Accessories", count: 12 },
  { label: "Footwear",    count: 8  },
  { label: "Objects",     count: 16 },
]

export const FILTER_MATERIALS = ["Silk", "Cashmere", "Linen", "Organic Cotton"]

export const FILTER_COLORS = [
  { label: "Black",  value: "#1C1C1A" },
  { label: "Cream",  value: "#F5F0E8" },
  { label: "Stone",  value: "#9C8F7E" },
  { label: "Forest", value: "#2D4A3E" },
  { label: "Navy",   value: "#1E2D4A" },
]

// ── Collections / Jewelry data ─────────────────────────────────────────────────

export interface MockJewelryProduct {
  id: string
  name: string
  price: number
  badge?: "NEW ARRIVAL"
  imageClass: string
}

export const JEWELRY_PRODUCTS: MockJewelryProduct[] = [
  {
    id: "j-1",
    name: "Aura Link Necklace",
    price: 1250,
    badge: "NEW ARRIVAL",
    imageClass: "bg-gradient-to-br from-amber-200 via-yellow-300 to-amber-400",
  },
  {
    id: "j-2",
    name: "Solstice Diamond Ring",
    price: 2800,
    imageClass: "bg-gradient-to-br from-stone-100 to-stone-300",
  },
  {
    id: "j-3",
    name: "Arc Stud Earrings",
    price: 450,
    imageClass: "bg-gradient-to-br from-rose-100 via-amber-100 to-stone-200",
  },
  {
    id: "j-4",
    name: "Etheria Pearl Choker",
    price: 890,
    imageClass: "bg-gradient-to-br from-amber-100 via-yellow-200 to-stone-100",
  },
  {
    id: "j-5",
    name: "Horizon Bold Cuff",
    price: 1600,
    imageClass: "bg-gradient-to-br from-amber-500 via-yellow-600 to-amber-700",
  },
  {
    id: "j-6",
    name: "Stackable Unity Set",
    price: 2200,
    imageClass: "bg-gradient-to-br from-amber-300 via-stone-400 to-amber-500",
  },
]

export const JEWELRY_MATERIALS = [
  "18k Yellow Gold",
  "14k White Gold",
  "Rose Gold",
  "Sterling Silver",
]

export const JEWELRY_GEMSTONES = [
  "Lab-Grown Diamonds",
  "Freshwater Pearl",
  "Blue Sapphire",
]

export const JEWELRY_PRICE_RANGES = [
  { label: "Under $500",    value: "under-500"   },
  { label: "$500 — $1,500", value: "500-1500"    },
  { label: "$1,500 +",      value: "above-1500"  },
]

// ── About page data ────────────────────────────────────────────────────────────

export interface MockTeamMember {
  id: string
  name: string
  role: string
  imageClass: string
}

export const TEAM_MEMBERS_FASHION: MockTeamMember[] = [
  {
    id: "t-1",
    name: "Julian Vance",
    role: "Creative Director",
    imageClass: "bg-gradient-to-b from-zinc-400 to-zinc-700",
  },
  {
    id: "t-2",
    name: "Elena Rossi",
    role: "Head of Sustainability",
    imageClass: "bg-gradient-to-b from-zinc-200 to-zinc-500",
  },
  {
    id: "t-3",
    name: "Marcus Thorne",
    role: "Master Tailor",
    imageClass: "bg-gradient-to-b from-stone-300 to-zinc-600",
  },
  {
    id: "t-4",
    name: "Sofia Chen",
    role: "Chief Operations",
    imageClass: "bg-gradient-to-b from-zinc-500 to-zinc-800",
  },
]

export const BRAND_VALUES = [
  {
    icon: "RotateCcw" as const,
    title: "Honest Sourcing",
    body: "We partner only with family-owned mills that respect both the land and the hands that harvest.",
  },
  {
    icon: "Scissors" as const,
    title: "Architectural Cut",
    body: "Our patterns are drafted with mathematical precision to ensure freedom of movement and silhouette.",
  },
  {
    icon: "Timer" as const,
    title: "Timeless Durability",
    body: "Designed to outlast the cycle of fast fashion. Built for a lifetime, not a season.",
  },
]

// ── Contact page data ──────────────────────────────────────────────────────────

export const FAQ_ITEMS = [
  {
    id: "faq-1",
    question: "Global Shipping",
    answer:
      "We ship to over 60 countries worldwide. Standard delivery takes 5–10 business days. Express options are available at checkout. All orders are carefully packaged in our signature Luna Soft materials.",
  },
  {
    id: "faq-2",
    question: "Curated Returns",
    answer:
      "We accept returns within 21 days of delivery for unworn items in original condition. Please contact our concierge team to initiate the process. Bespoke or monogrammed pieces are final sale.",
  },
  {
    id: "faq-3",
    question: "Sustainability & Ethics",
    answer:
      "Every Luna Soft piece is made in partnership with certified ethical mills. We use only sustainably sourced natural fibres and ensure fair wages throughout our supply chain. Our packaging is 100% biodegradable.",
  },
]
