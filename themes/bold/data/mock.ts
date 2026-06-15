export interface MockStat {
  value: string
  label: string
}

export interface MockPillar {
  number: string
  title: string
  description: string
}

export interface MockTeamMember {
  name: string
  role: string
  imageClass: string
}

export const STATS: MockStat[] = [
  { value: "42+", label: "World Records Broken" },
  { value: "12.8k", label: "Athletes Equipped" },
  { value: "0%", label: "Compromise Accepted" },
  { value: "14", label: "Proprietary Patents" },
]

export const PILLARS: MockPillar[] = [
  {
    number: "01 / INTEGRITY",
    title: "INTEGRITY",
    description:
      "We never substitute quality for convenience. Our materials are sourced from the most advanced technical mills on the planet.",
  },
  {
    number: "02 / VELOCITY",
    title: "VELOCITY",
    description:
      "Innovation waits for no one. We iterate weekly, pushing the boundaries of what athletic apparel can achieve.",
  },
  {
    number: "03 / PRECISION",
    title: "PRECISION",
    description:
      "Measurements to the millimeter. Every seam is laser-bonded for zero-friction movement and ultimate durability.",
  },
]

export interface MockProduct {
  id: string
  name: string
  category: string
  price: number
  originalPrice?: number
  badge?: "NEW RELEASE" | "SALE" | "LIMITED"
  imageClass: string
}

export const PRODUCTS: MockProduct[] = [
  {
    id: "1",
    name: "Apex Velocity 01",
    category: "RUNNING / ELITE",
    price: 180,
    badge: "NEW RELEASE",
    imageClass: "bg-gradient-to-br from-red-600 to-red-900",
  },
  {
    id: "2",
    name: "Storm-Lite Shell",
    category: "APPAREL / TECH",
    price: 210,
    originalPrice: 295,
    badge: "SALE",
    imageClass: "bg-gradient-to-br from-zinc-600 to-zinc-900",
  },
  {
    id: "3",
    name: "Kinetic Core Short",
    category: "TRAINING / PRO",
    price: 75,
    imageClass: "bg-gradient-to-br from-teal-700 to-teal-900",
  },
  {
    id: "4",
    name: "Titan Pulse V2",
    category: "GEAR / DIGITAL",
    price: 450,
    imageClass: "bg-gradient-to-br from-slate-700 to-slate-900",
  },
  {
    id: "5",
    name: "Aero-Cool Tee",
    category: "ESSENTIAL / TECH",
    price: 55,
    imageClass: "bg-gradient-to-br from-zinc-100 to-zinc-300",
  },
  {
    id: "6",
    name: "Trail Master Vest",
    category: "RUNNING / ELITE",
    price: 125,
    imageClass: "bg-gradient-to-br from-teal-600 to-teal-800",
  },
  {
    id: "7",
    name: "Hyper-Lift Trainer",
    category: "TRAINING / ELITE",
    price: 165,
    imageClass: "bg-gradient-to-br from-emerald-700 to-slate-900",
  },
  {
    id: "8",
    name: "Carbon Flux Insole",
    category: "ACCESSORIES / PRO",
    price: 110,
    badge: "LIMITED",
    imageClass: "bg-gradient-to-br from-zinc-900 to-black",
  },
]

export interface MockNewArrival {
  id: string
  name: string
  category: string
  price: number
  isNewArrival: true
  badge?: "NEW ARRIVAL" | "BEST SELLER" | "LOW STOCK"
  imageClass: string
}

export const NEW_ARRIVALS: MockNewArrival[] = [
  {
    id: "na1",
    name: "M1-Vortex Jacket",
    category: "TECH SERIES",
    price: 285,
    isNewArrival: true,
    badge: "NEW ARRIVAL",
    imageClass: "bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-950",
  },
  {
    id: "na2",
    name: "Kinetic Layer 2.0",
    category: "ELITE PERFORMANCE",
    price: 120,
    isNewArrival: true,
    imageClass: "bg-gradient-to-br from-zinc-900 to-black",
  },
  {
    id: "na3",
    name: "Titan Flight Runner",
    category: "FOOTWEAR",
    price: 195,
    isNewArrival: true,
    badge: "BEST SELLER",
    imageClass: "bg-gradient-to-br from-teal-900 to-slate-950",
  },
  {
    id: "na4",
    name: "Omni-Modular Pack",
    category: "ACCESSORIES",
    price: 145,
    isNewArrival: true,
    imageClass: "bg-gradient-to-br from-zinc-800 to-zinc-950",
  },
  {
    id: "na5",
    name: "Void-Shield Hoodie",
    category: "TECH SERIES",
    price: 165,
    isNewArrival: true,
    imageClass: "bg-gradient-to-br from-[#0D4A3E] to-zinc-900",
  },
  {
    id: "na6",
    name: "Apex Tapered Joggers",
    category: "TECH SERIES",
    price: 135,
    isNewArrival: true,
    badge: "LOW STOCK",
    imageClass: "bg-gradient-to-br from-zinc-600 to-zinc-900",
  },
]

export interface MockProductDetail {
  id: string
  seriesLabel: string
  name: string
  rating: number
  reviewCount: number
  price: number
  badge?: string
  colors: Array<{ name: string; hex: string }>
  sizes: number[]
  defaultColor: string
  defaultSize: number
  thumbnails: Array<{ imageClass: string; alt: string }>
  mainImageClass: string
}

export const KINETIC_ELITE_V2: MockProductDetail = {
  id: "kinetic-elite-v2",
  seriesLabel: "TECH SERIES // 004",
  name: "KINETIC ELITE V2",
  rating: 4.5,
  reviewCount: 128,
  price: 240,
  badge: "NEW RELEASE",
  colors: [
    { name: "Emerald Core", hex: "#0D4A3E" },
    { name: "Obsidian Black", hex: "#0a0a0a" },
    { name: "Steel Grey", hex: "#9ca3af" },
  ],
  defaultColor: "Emerald Core",
  defaultSize: 9,
  sizes: [7, 8, 9, 10, 11, 12, 13, 14],
  thumbnails: [
    { imageClass: "bg-gradient-to-br from-teal-800 to-teal-950", alt: "Front view" },
    { imageClass: "bg-gradient-to-br from-teal-700 to-slate-900", alt: "Side view" },
    { imageClass: "bg-gradient-to-br from-slate-700 to-teal-900", alt: "Top view" },
    { imageClass: "bg-gradient-to-br from-zinc-800 to-teal-950", alt: "Sole view" },
  ],
  mainImageClass: "bg-gradient-to-br from-teal-800 via-teal-900 to-slate-950",
}

export const RELATED_PRODUCTS: MockProduct[] = [
  {
    id: "rel1",
    name: "Momentum Core Tee",
    category: "APPAREL",
    price: 65,
    imageClass: "bg-gradient-to-br from-zinc-700 to-zinc-900",
  },
  {
    id: "rel2",
    name: 'Velocity 5" Shorts',
    category: "TRAINING",
    price: 85,
    imageClass: "bg-gradient-to-br from-teal-800 to-teal-950",
  },
  {
    id: "rel3",
    name: "Grip-Stay Performance Socks",
    category: "ACCESSORIES",
    price: 22,
    imageClass: "bg-gradient-to-br from-teal-600 to-slate-800",
  },
  {
    id: "rel4",
    name: "Kinetic Lite V1",
    category: "FOOTWEAR",
    price: 180,
    imageClass: "bg-gradient-to-br from-zinc-400 to-zinc-600",
  },
]

export const TEAM_MEMBERS: MockTeamMember[] = [
  {
    name: "Elias Vance",
    role: "Founder & Chief Engineer",
    imageClass: "bg-gradient-to-br from-zinc-600 to-zinc-800",
  },
  {
    name: "Dr. Sarah Chen",
    role: "Head of Biomechanics",
    imageClass: "bg-gradient-to-br from-slate-500 to-slate-700",
  },
  {
    name: "Marcus Krohl",
    role: "Principal Product Designer",
    imageClass: "bg-gradient-to-br from-neutral-600 to-neutral-800",
  },
]
