export type GradientPreset = {
  id: string
  from: string
  to: string
  angle: number
}

/** Default solid swatches — layout mirip Canva (grayscale + accent rows). */
export const DEFAULT_SOLID_COLORS: string[] = [
  "#000000",
  "#545454",
  "#737373",
  "#a6a6a6",
  "#d9d9d9",
  "#ffffff",
  "#ff7162",
  "#ff8a80",
  "#ffb3ba",
  "#e0b0ff",
  "#c77dff",
  "#9b5de5",
  "#6a4c93",
  "#00c4b4",
  "#00e5ff",
  "#4fc3f7",
  "#2196f3",
  "#3f51b5",
  "#1a237e",
  "#00c853",
  "#aeea00",
  "#ffeb3b",
  "#ffcc80",
  "#ff9800",
  "#ff5722",
  "#e91e63",
  "#9c27b0",
  "#673ab7",
]

/** Named aliases for search (Try "blue" or "#00c4cc"). */
export const COLOR_SEARCH_ALIASES: Record<string, string[]> = {
  black: ["#000000"],
  white: ["#ffffff"],
  gray: ["#545454", "#737373", "#a6a6a6", "#d9d9d9"],
  grey: ["#545454", "#737373", "#a6a6a6", "#d9d9d9"],
  red: ["#ff7162", "#ff5722", "#e91e63"],
  orange: ["#ff9800", "#ffcc80"],
  yellow: ["#ffeb3b", "#aeea00"],
  green: ["#00c853", "#aeea00"],
  teal: ["#00c4b4"],
  cyan: ["#00e5ff", "#00c4cc"],
  blue: ["#2196f3", "#4fc3f7", "#3f51b5", "#1a237e", "#00c4cc"],
  purple: ["#9b5de5", "#9c27b0", "#673ab7", "#6a4c93"],
  pink: ["#ffb3ba", "#e91e63", "#ff8a80"],
}

export const DEFAULT_GRADIENTS: GradientPreset[] = [
  { id: "g1", from: "#1a1a1a", to: "#6b6b6b", angle: 135 },
  { id: "g2", from: "#9e9e9e", to: "#ffffff", angle: 135 },
  { id: "g3", from: "#c6ff00", to: "#76ff03", angle: 135 },
  { id: "g4", from: "#3e2723", to: "#8d6e63", angle: 135 },
  { id: "g5", from: "#7b1fa2", to: "#ffeb3b", angle: 135 },
  { id: "g6", from: "#0d47a1", to: "#42a5f5", angle: 180 },
  { id: "g7", from: "#1a237e", to: "#1565c0", angle: 180 },
  { id: "g8", from: "#b2fefa", to: "#90caf9", angle: 135 },
  { id: "g9", from: "#ff1744", to: "#ff9100", angle: 135 },
  { id: "g10", from: "#f48fb1", to: "#ce93d8", angle: 90 },
  { id: "g11", from: "#2979ff", to: "#d500f9", angle: 135 },
  { id: "g12", from: "#0d47a1", to: "#81d4fa", angle: 180 },
  { id: "g13", from: "#4a148c", to: "#80d8ff", angle: 135 },
  { id: "g14", from: "#00695c", to: "#00e5ff", angle: 135 },
  { id: "g15", from: "#6a1b9a", to: "#00c853", angle: 135 },
  { id: "g16", from: "#00897b", to: "#76ff03", angle: 90 },
  { id: "g17", from: "#00bcd4", to: "#c6ff00", angle: 135 },
  { id: "g18", from: "#ffeb3b", to: "#ff6d00", angle: 135 },
  { id: "g19", from: "#f48fb1", to: "#ffcc80", angle: 90 },
  { id: "g20", from: "#fff59d", to: "#f48fb1", angle: 135 },
  { id: "g21", from: "#7b1fa2", to: "#e53935", angle: 135 },
]

export type GradientStyle = {
  id: string
  label: string
  angle: number
}

/** Linear styles only — engine support `linear-gradient(angle, …)`. */
export const GRADIENT_STYLES: GradientStyle[] = [
  { id: "diag", label: "Diagonal", angle: 135 },
  { id: "vert", label: "Vertikal", angle: 180 },
  { id: "horiz", label: "Horizontal", angle: 90 },
  { id: "diag2", label: "Diagonal 2", angle: 225 },
  { id: "diag3", label: "Diagonal 3", angle: 45 },
]

export function gradientCss(from: string, to: string, angle: number): string {
  return `linear-gradient(${angle}deg, ${from}, ${to})`
}

export function filterSolidsByQuery(query: string, solids: string[]): string[] {
  const q = query.trim().toLowerCase()
  if (!q) return solids
  const aliasHits = new Set<string>()
  for (const [name, colors] of Object.entries(COLOR_SEARCH_ALIASES)) {
    if (name.includes(q) || q.includes(name)) {
      for (const c of colors) aliasHits.add(c.toLowerCase())
    }
  }
  return solids.filter((c) => {
    const lower = c.toLowerCase()
    return lower.includes(q.replace(/^#/, "")) || aliasHits.has(lower)
  })
}

export function filterGradientsByQuery(
  query: string,
  gradients: GradientPreset[],
): GradientPreset[] {
  const q = query.trim().toLowerCase()
  if (!q) return gradients
  return gradients.filter(
    (g) =>
      g.from.toLowerCase().includes(q.replace(/^#/, "")) ||
      g.to.toLowerCase().includes(q.replace(/^#/, "")),
  )
}
