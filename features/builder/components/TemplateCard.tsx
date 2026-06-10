import { CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type TemplateId = "minimalist" | "bold" | "fashion"

export interface TemplateCardProps {
  id: TemplateId
  name: string
  description: string
  active?: boolean
}

/* ── Thumbnail scenes ─────────────────────────────────────────── */

function MinimalistThumbnail() {
  return (
    <div className="relative w-full h-full bg-[#c9b89a] overflow-hidden flex items-center justify-center">
      {/* Warm gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#d4c4ad]/40 to-transparent" />

      {/* Floating document card */}
      <div className="relative z-10 w-44 h-32 bg-white rounded-xl shadow-xl p-3 rotate-[-4deg] translate-y-2">
        {/* Document top bar */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="w-20 h-2 bg-gray-200 rounded-full" />
          <div className="flex gap-1.5">
            {["bg-gray-200", "bg-gray-200", "bg-gray-200"].map((c, i) => (
              <div key={i} className={`w-7 h-2 ${c} rounded-full`} />
            ))}
          </div>
        </div>
        {/* Content lines */}
        <div className="flex flex-col gap-1.5 mb-3">
          <div className="w-full h-1.5 bg-gray-100 rounded-full" />
          <div className="w-5/6 h-1.5 bg-gray-100 rounded-full" />
          <div className="w-3/4 h-1.5 bg-gray-100 rounded-full" />
        </div>
        {/* Product row mock */}
        <div className="grid grid-cols-3 gap-1.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="w-full h-7 bg-gray-100 rounded" />
              <div className="w-4/5 h-1 bg-gray-200 rounded-full" />
              <div className="w-3/5 h-1 bg-gray-200 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Desk lamp silhouette */}
      <div className="absolute bottom-0 right-8 flex flex-col items-center">
        <div className="w-8 h-6 bg-gray-700/80 rounded-full -rotate-12 translate-y-1" />
        <div className="w-1 h-16 bg-gray-600/70 rounded-full" />
        <div className="w-8 h-2 bg-gray-700/70 rounded-full" />
      </div>

      {/* Plant silhouette */}
      <div className="absolute bottom-0 left-6">
        <div className="relative w-10">
          <div className="absolute -top-12 -left-1 w-5 h-14 bg-green-700/90 rounded-full rotate-[-15deg]" />
          <div className="absolute -top-10 left-3 w-4 h-12 bg-green-600/90 rounded-full rotate-[20deg]" />
          <div className="absolute -top-14 left-1 w-4 h-12 bg-green-800/80 rounded-full rotate-[-5deg]" />
          <div className="w-10 h-7 bg-[#8b5e3c] rounded-b-xl rounded-t-lg" />
        </div>
      </div>
    </div>
  )
}

function BoldThumbnail() {
  return (
    <div className="relative w-full h-full bg-[#0d0e10] overflow-hidden flex items-center justify-center">
      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Outer glow ring */}
      <div className="absolute w-52 h-52 rounded-full border border-blue-500/20 shadow-[0_0_60px_8px_rgba(59,130,246,0.08)]" />

      {/* Main circular tech object */}
      <div className="relative z-10 w-40 h-40 rounded-full bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 shadow-2xl flex items-center justify-center">
        {/* Inner rings */}
        <div className="absolute w-36 h-36 rounded-full border border-gray-600/50" />
        <div className="absolute w-28 h-28 rounded-full border border-gray-500/40" />
        {/* LED ring glow */}
        <div className="absolute w-32 h-32 rounded-full border-2 border-blue-500/60 shadow-[0_0_20px_4px_rgba(59,130,246,0.3)]" />
        {/* Center lens */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-600 to-gray-900 border border-gray-500/60 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-900 to-black border border-blue-800/50" />
        </div>
        {/* Hex pattern dots */}
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <div
            key={deg}
            className="absolute w-2 h-2 rounded-full bg-blue-400/30"
            style={{
              transform: `rotate(${deg}deg) translateY(-56px)`,
            }}
          />
        ))}
      </div>

      {/* Reflection */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-blue-900/10 to-transparent" />
    </div>
  )
}

function FashionThumbnail() {
  return (
    <div className="relative w-full h-full bg-[#d4a678] overflow-hidden flex items-center justify-center">
      {/* Warm gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#e8b894]/50 to-[#b87a50]/40" />

      {/* Smooth 3D blob shape */}
      <div className="relative z-10 flex items-center justify-center">
        {/* Main blob */}
        <div
          className="w-36 h-28 bg-gradient-to-br from-[#c88050] via-[#d49060] to-[#a86840] shadow-2xl"
          style={{
            borderRadius: "60% 40% 55% 45% / 50% 60% 40% 50%",
          }}
        />
        {/* Highlight */}
        <div
          className="absolute top-3 left-8 w-10 h-8 bg-white/20 blur-sm"
          style={{ borderRadius: "50% 50% 50% 50% / 60% 40% 60% 40%" }}
        />
      </div>

      {/* Shadow beneath blob */}
      <div className="absolute bottom-8 w-32 h-6 bg-black/20 rounded-full blur-md" />

      {/* Subtle floor plane */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#b87040]/40 to-transparent" />
    </div>
  )
}

const thumbnails: Record<TemplateId, React.ComponentType> = {
  minimalist: MinimalistThumbnail,
  bold: BoldThumbnail,
  fashion: FashionThumbnail,
}

/* ── Main component ───────────────────────────────────────────── */

export function TemplateCard({ id, name, description, active = false }: TemplateCardProps) {
  const Thumbnail = thumbnails[id]

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-200",
        active
          ? "border-indigo-600 ring-2 ring-indigo-600 shadow-lg shadow-indigo-100"
          : "border-gray-200 hover:border-gray-300 hover:shadow-md",
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Thumbnail />

        {active && (
          <Badge className="absolute top-3 right-3 bg-white text-indigo-700 border-indigo-200 shadow-sm gap-1 px-3 py-1">
            <CheckCircle2 className="w-3 h-3 fill-indigo-600 text-white" />
            TERPASANG
          </Badge>
        )}
      </div>

      {/* Body */}
      <CardContent className="pt-5 pb-3">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
      </CardContent>

      {/* Actions */}
      <CardFooter className="gap-3">
        {active ? (
          <>
            <Button variant="default" className="flex-1">
              Use this
            </Button>
            <Button variant="outline" className="flex-1">
              Preview
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" className="flex-1">
              Pilih Template
            </Button>
            <Button variant="outline" className="flex-1">
              Preview
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
