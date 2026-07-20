"use client"

import { forwardRef, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  Droplet,
  Pipette,
  Plus,
  Search,
  SquareStack,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  hexToHsv,
  hsvToHex,
  hueToCss,
  normalizeHex,
  toPickerHex,
} from "./color-utils"
import {
  DEFAULT_GRADIENTS,
  DEFAULT_SOLID_COLORS,
  GRADIENT_STYLES,
  filterGradientsByQuery,
  filterSolidsByQuery,
  gradientCss,
  type GradientPreset,
} from "./presets"

export type ColorMode = "solid" | "gradient"

export type ColorTarget = {
  id: string
  label: string
  /** Solid / gradient start */
  color: string
  /** Gradient end — only when allowGradient */
  color2?: string
  mode?: ColorMode
  angle?: number
  allowGradient?: boolean
}

type PickerPopover = {
  stop: "start" | "end"
  /** Di mode gradient: false = tampilkan overview stops+style dulu */
  editingStop: boolean
  top: number
  left: number
  /** Popover muncul di bawah atau di atas trigger */
  placement: "bottom" | "top"
} | null

const POPOVER_WIDTH = 288
const POPOVER_EST_HEIGHT = 380

function computePopoverPosition(anchor: HTMLElement | null): {
  top: number
  left: number
  placement: "bottom" | "top"
} {
  if (!anchor) {
    return { top: 0, left: 8, placement: "bottom" }
  }
  const rect = anchor.getBoundingClientRect()
  const left = Math.min(
    Math.max(8, rect.left),
    window.innerWidth - POPOVER_WIDTH - 8,
  )
  const spaceBelow = window.innerHeight - rect.bottom - 8
  if (spaceBelow >= POPOVER_EST_HEIGHT || spaceBelow >= rect.top) {
    return { top: rect.bottom + 8, left, placement: "bottom" }
  }
  return {
    top: Math.max(8, rect.top - 8 - POPOVER_EST_HEIGHT),
    left,
    placement: "top",
  }
}

interface CanvaColorChromeProps {
  title?: string
  targets: ColorTarget[]
  designColors?: string[]
  onChangeTarget: (
    targetId: string,
    patch: {
      color?: string
      color2?: string
      mode?: ColorMode
      angle?: number
    },
  ) => void
  onClose?: () => void
  emptyMessage?: string
}

export function CanvaColorChrome({
  title = "Color",
  targets,
  designColors = [],
  onChangeTarget,
  onClose,
  emptyMessage = "Select an element on the canvas to adjust its color.",
}: CanvaColorChromeProps) {
  const [query, setQuery] = useState("")
  const [popover, setPopover] = useState<PickerPopover>(null)
  const [activeTargetId, setActiveTargetId] = useState(targets[0]?.id ?? "")
  const [showAllSolids, setShowAllSolids] = useState(false)
  const [showAllGradients, setShowAllGradients] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  // Keep active target in sync when selection changes
  const firstId = targets[0]?.id ?? ""
  if (activeTargetId && !targets.some((t) => t.id === activeTargetId) && firstId) {
    setActiveTargetId(firstId)
    setPopover(null)
  } else if (!activeTargetId && firstId) {
    setActiveTargetId(firstId)
  }

  const active = targets.find((t) => t.id === activeTargetId) ?? targets[0]
  const solids = filterSolidsByQuery(query, DEFAULT_SOLID_COLORS)
  const gradients = filterGradientsByQuery(query, DEFAULT_GRADIENTS)
  const visibleSolids = showAllSolids ? solids : solids.slice(0, 21)
  const visibleGradients = showAllGradients ? gradients : gradients.slice(0, 21)

  const uniqueDesign = Array.from(
    new Set(
      [
        ...designColors,
        ...targets.map((t: ColorTarget) => t.color),
        ...targets.flatMap((t: ColorTarget) => (t.color2 ? [t.color2] : [])),
      ]
        .map((c) => normalizeHex(c) ?? c.toLowerCase())
        .filter(Boolean),
    ),
  ).slice(0, 12)

  const openPopover = (opts?: { stop?: "start" | "end"; editingStop?: boolean }) => {
    if (!active) return
    const isGradient =
      (active.mode ?? "solid") === "gradient" && Boolean(active.allowGradient)
    const pos = computePopoverPosition(triggerRef.current)
    setPopover({
      stop: opts?.stop ?? "start",
      editingStop: opts?.editingStop ?? !isGradient,
      ...pos,
    })
  }

  // Close popover on outside click / Escape
  useEffect(() => {
    if (!popover) return
    const onPointer = (e: PointerEvent) => {
      const t = e.target as Node
      if (popoverRef.current?.contains(t)) return
      if (triggerRef.current?.contains(t)) return
      setPopover(null)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPopover(null)
    }
    window.addEventListener("pointerdown", onPointer)
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("pointerdown", onPointer)
      window.removeEventListener("keydown", onKey)
    }
  }, [popover])

  if (targets.length === 0) {
    return (
      <div className="flex flex-col">
        <PanelHeader title={title} onClose={onClose} />
        <div className="px-4 py-10 text-center text-sm text-gray-500">{emptyMessage}</div>
      </div>
    )
  }

  const isGradient =
    Boolean(active?.allowGradient) && (active?.mode ?? "solid") === "gradient"
  const popoverHex =
    popover?.stop === "end"
      ? toPickerHex(active?.color2 || active?.color || "#000000")
      : toPickerHex(active?.color || "#000000")
  const showSolidInPopover = !isGradient || Boolean(popover?.editingStop)

  return (
    <div className="relative flex flex-col">
      <PanelHeader title={title} onClose={onClose} />
      <div className="px-4 pb-8">
        <div className="relative mb-5">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Try "blue" or "#00c4cc"'
            className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
          />
        </div>

        {/* Document / target colors */}
        <section className="mb-6">
          <SectionTitle
            icon={<SquareStack className="h-3.5 w-3.5" />}
            label={targets.length === 1 ? targets[0].label : "Document colors"}
          />
          {targets.length > 1 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {targets.map((t: ColorTarget) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setActiveTargetId(t.id)
                    setPopover(null)
                  }}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                    activeTargetId === t.id
                      ? "bg-violet-100 text-violet-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
          <div ref={triggerRef} className="relative mb-2 flex items-center gap-2">
            <AddColorButton
              active={Boolean(popover)}
              onClick={() => {
                if (popover) setPopover(null)
                else openPopover({ editingStop: true })
              }}
            />
            <EyedropperButton
              onPick={(hex) => {
                if (!active) return
                onChangeTarget(active.id, { color: hex, mode: "solid" })
              }}
            />
            {active && (
              <Swatch
                color={
                  (active.mode ?? "solid") === "gradient"
                    ? undefined
                    : active.color
                }
                gradient={
                  (active.mode ?? "solid") === "gradient"
                    ? gradientCss(
                        toPickerHex(active.color),
                        toPickerHex(active.color2 || active.color),
                        active.angle ?? 135,
                      )
                    : undefined
                }
                selected
                onClick={() => openPopover()}
              />
            )}
          </div>

          <AnimatePresence>
            {popover && active && (
              <ColorPickerPopover
                key="color-picker-popover"
                ref={popoverRef}
                anchorRef={triggerRef}
                top={popover.top}
                left={popover.left}
                placement={popover.placement}
                mode={active.mode ?? "solid"}
                allowGradient={Boolean(active.allowGradient)}
                showSolidEditor={showSolidInPopover}
                solidValue={popoverHex}
                from={toPickerHex(active.color)}
                to={toPickerHex(active.color2 || active.color)}
                angle={active.angle ?? 135}
                onClose={() => setPopover(null)}
                onPositionChange={(pos) =>
                  setPopover((prev) => (prev ? { ...prev, ...pos } : prev))
                }
                onModeChange={(mode) => {
                  onChangeTarget(active.id, {
                    mode,
                    ...(mode === "gradient"
                      ? {
                          color: active.color || "#cccccc",
                          color2: active.color2 || active.color || "#999999",
                          angle: active.angle ?? 135,
                        }
                      : {}),
                  })
                  setPopover((prev) =>
                    prev
                      ? {
                          ...prev,
                          stop: "start",
                          editingStop: mode === "solid",
                        }
                      : prev,
                  )
                }}
                onSolidChange={(hex) => {
                  if (popover.stop === "end") {
                    onChangeTarget(active.id, {
                      color2: hex,
                      mode: isGradient ? "gradient" : "solid",
                      color: active.color || "#cccccc",
                    })
                  } else {
                    onChangeTarget(active.id, {
                      color: hex,
                      ...(isGradient
                        ? { mode: "gradient" as const }
                        : { mode: "solid" as const }),
                    })
                  }
                }}
                onSelectStop={(stop) =>
                  setPopover((prev) =>
                    prev ? { ...prev, stop, editingStop: true } : prev,
                  )
                }
                onChangeAngle={(angle) =>
                  onChangeTarget(active.id, { angle, mode: "gradient" })
                }
              />
            )}
          </AnimatePresence>
          {uniqueDesign.length > 0 && (
            <>
              <p className="mb-2 text-xs text-gray-500">Colors in this design</p>
              <div className="flex flex-wrap gap-2">
                {uniqueDesign.map((c) => (
                  <Swatch
                    key={c}
                    color={c}
                    onClick={() => {
                      if (!active) return
                      onChangeTarget(active.id, { color: c, mode: "solid" })
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </section>

        {/* Brand kit placeholder */}
        <section className="mb-6">
          <SectionTitle
            icon={<Droplet className="h-3.5 w-3.5" />}
            label="Brand Kit"
          />
          <p className="py-3 text-center text-xs text-gray-400">
            No brand colors set for this Brand Kit
          </p>
        </section>

        {/* Default solids */}
        <section className="mb-6">
          <div className="mb-2.5 flex items-center justify-between">
            <SectionTitle
              icon={<Droplet className="h-3.5 w-3.5" />}
              label="Default solid colors"
              className="mb-0"
            />
            {solids.length > 21 && (
              <button
                type="button"
                onClick={() => setShowAllSolids((v) => !v)}
                className="text-xs text-gray-500 hover:text-gray-800"
              >
                {showAllSolids ? "See less" : "See all"}
              </button>
            )}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {visibleSolids.map((c) => (
              <Swatch
                key={c}
                color={c}
                selected={
                  active?.mode !== "gradient" &&
                  toPickerHex(active?.color ?? "") === toPickerHex(c)
                }
                onClick={() => {
                  if (!active) return
                  onChangeTarget(active.id, { color: c, mode: "solid" })
                }}
              />
            ))}
          </div>
        </section>

        {/* Default gradients — only if active target allows */}
        {active?.allowGradient && (
          <section>
            <div className="mb-2.5 flex items-center justify-between">
              <SectionTitle
                icon={
                  <span
                    className="inline-block h-3.5 w-3.5 rounded-sm"
                    style={{
                      background: "linear-gradient(180deg, #111, #eee)",
                    }}
                  />
                }
                label="Default gradient colors"
                className="mb-0"
              />
              {gradients.length > 21 && (
                <button
                  type="button"
                  onClick={() => setShowAllGradients((v) => !v)}
                  className="text-xs text-gray-500 hover:text-gray-800"
                >
                  {showAllGradients ? "See less" : "See all"}
                </button>
              )}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {visibleGradients.map((g) => (
                <GradientSwatch
                  key={g.id}
                  preset={g}
                  selected={
                    active?.mode === "gradient" &&
                    toPickerHex(active.color) === toPickerHex(g.from) &&
                    toPickerHex(active.color2 || "") === toPickerHex(g.to)
                  }
                  onClick={() => {
                    onChangeTarget(active.id, {
                      color: g.from,
                      color2: g.to,
                      mode: "gradient",
                      angle: g.angle,
                    })
                  }}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function PanelHeader({
  title,
  onClose,
  onBack,
}: {
  title: string
  onClose?: () => void
  onBack?: () => void
}) {
  return (
    <div className="flex shrink-0 items-center justify-between px-4 pb-3 pt-4">
      <div className="flex items-center gap-2">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mr-1 text-xs font-medium text-violet-600 hover:text-violet-800"
          >
            ← Back
          </button>
        )}
        <h2 className="text-base font-bold text-gray-900">{title}</h2>
      </div>
      <div className="flex items-center gap-1">
        {onClose && (
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

function SectionTitle({
  icon,
  label,
  className,
}: {
  icon: React.ReactNode
  label: string
  className?: string
}) {
  return (
    <div className={cn("mb-2.5 flex items-center gap-2", className)}>
      <span className="text-gray-700">{icon}</span>
      <span className="text-sm font-semibold text-gray-900">{label}</span>
    </div>
  )
}

function Swatch({
  color,
  gradient,
  selected,
  onClick,
  size = "md",
}: {
  color?: string
  gradient?: string
  selected?: boolean
  onClick?: () => void
  size?: "md" | "lg"
}) {
  const dim = size === "lg" ? "h-9 w-9" : "h-8 w-8"
  const isLight =
    color &&
    (() => {
      const n = toPickerHex(color)
      const r = parseInt(n.slice(1, 3), 16)
      const g = parseInt(n.slice(3, 5), 16)
      const b = parseInt(n.slice(5, 7), 16)
      return (r * 299 + g * 587 + b * 114) / 1000 > 220
    })()

  return (
    <button
      type="button"
      aria-label={color ? `Color ${color}` : "Gradient"}
      onClick={onClick}
      className={cn(
        dim,
        "rounded-full transition-transform hover:scale-110",
        selected && "ring-2 ring-violet-500 ring-offset-2",
        isLight && "border border-gray-200",
      )}
      style={{
        backgroundColor: gradient ? undefined : color,
        backgroundImage: gradient,
      }}
    />
  )
}

function GradientSwatch({
  preset,
  selected,
  onClick,
}: {
  preset: GradientPreset
  selected?: boolean
  onClick?: () => void
}) {
  return (
    <Swatch
      gradient={gradientCss(preset.from, preset.to, preset.angle)}
      selected={selected}
      onClick={onClick}
    />
  )
}

function AddColorButton({
  onClick,
  active,
}: {
  onClick: () => void
  active?: boolean
}) {
  return (
    <button
      type="button"
      aria-label="Add custom color"
      aria-expanded={active}
      onClick={onClick}
      className={cn(
        "relative flex h-8 w-8 items-center justify-center rounded-full",
        active && "ring-2 ring-violet-500 ring-offset-2",
      )}
      style={{
        background:
          "conic-gradient(from 180deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
      }}
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-sm">
        <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
      </span>
    </button>
  )
}

const ColorPickerPopover = forwardRef<
  HTMLDivElement,
  {
    anchorRef: React.RefObject<HTMLDivElement | null>
    top: number
    left: number
    placement: "bottom" | "top"
    mode: ColorMode
    allowGradient: boolean
    showSolidEditor: boolean
    solidValue: string
    from: string
    to: string
    angle: number
    onClose: () => void
    onPositionChange: (pos: {
      top: number
      left: number
      placement: "bottom" | "top"
    }) => void
    onModeChange: (mode: ColorMode) => void
    onSolidChange: (hex: string) => void
    onSelectStop: (stop: "start" | "end") => void
    onChangeAngle: (angle: number) => void
  }
>(function ColorPickerPopover(
  {
    anchorRef,
    top,
    left,
    placement,
    mode,
    allowGradient,
    showSolidEditor,
    solidValue,
    from,
    to,
    angle,
    onClose,
    onPositionChange,
    onModeChange,
    onSolidChange,
    onSelectStop,
    onChangeAngle,
  },
  ref,
) {
  // Reposition on scroll/resize tanpa flash — sync sebelum paint.
  useLayoutEffect(() => {
    const update = () => {
      onPositionChange(computePopoverPosition(anchorRef.current))
    }
    window.addEventListener("resize", update)
    window.addEventListener("scroll", update, true)
    return () => {
      window.removeEventListener("resize", update)
      window.removeEventListener("scroll", update, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- anchor only; onPositionChange is stable enough via functional setState
  }, [anchorRef])

  const yFrom = placement === "bottom" ? -6 : 6

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-label="Color picker"
      className="fixed z-300 w-72 origin-top overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 shadow-xl"
      style={{ top, left, originY: placement === "bottom" ? 0 : 1 }}
      initial={{ opacity: 0, y: yFrom, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: yFrom, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 420, damping: 32, mass: 0.7 }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500">Custom color</span>
        <button
          type="button"
          aria-label="Close picker"
          onClick={onClose}
          className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <PickerTabs
        mode={mode}
        allowGradient={allowGradient}
        onModeChange={onModeChange}
      />
      <AnimatePresence mode="wait" initial={false}>
        {showSolidEditor ? (
          <motion.div
            key="solid"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <SolidPicker value={solidValue} onChange={onSolidChange} />
          </motion.div>
        ) : (
          <motion.div
            key="gradient"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <GradientOverview
              from={from}
              to={to}
              angle={angle}
              onSelectStop={onSelectStop}
              onChangeAngle={onChangeAngle}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
})

function EyedropperButton({ onPick }: { onPick: (hex: string) => void }) {
  const supported =
    typeof window !== "undefined" && "EyeDropper" in window

  return (
    <button
      type="button"
      aria-label="Eyedropper"
      disabled={!supported}
      title={supported ? "Pick a color from the screen" : "Eyedropper is not supported in this browser"}
      onClick={async () => {
        try {
          // EyeDropper is Chromium-only
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const dropper = new (window as any).EyeDropper()
          const result = await dropper.open()
          const hex = normalizeHex(result.sRGBHex)
          if (hex) onPick(hex)
        } catch {
          // user cancelled
        }
      }}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Pipette className="h-3.5 w-3.5" />
    </button>
  )
}

function PickerTabs({
  mode,
  allowGradient,
  onModeChange,
}: {
  mode: ColorMode
  allowGradient: boolean
  onModeChange: (mode: ColorMode) => void
}) {
  return (
    <div className="relative mb-4 flex gap-5 border-b border-gray-200">
      <button
        type="button"
        onClick={() => onModeChange("solid")}
        className={cn(
          "relative pb-2.5 text-sm font-semibold transition-colors duration-200",
          mode === "solid" ? "text-gray-900" : "text-gray-400 hover:text-gray-600",
        )}
      >
        Solid color
        {mode === "solid" && (
          <motion.span
            layoutId="color-picker-tab"
            className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-violet-600"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
      </button>
      {allowGradient && (
        <button
          type="button"
          onClick={() => onModeChange("gradient")}
          className={cn(
            "relative pb-2.5 text-sm font-semibold transition-colors duration-200",
            mode === "gradient"
              ? "text-gray-900"
              : "text-gray-400 hover:text-gray-600",
          )}
        >
          Gradient
          {mode === "gradient" && (
            <motion.span
              layoutId="color-picker-tab"
              className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-violet-600"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
        </button>
      )}
    </div>
  )
}

function SolidPicker({
  value,
  onChange,
}: {
  value: string
  onChange: (hex: string) => void
}) {
  const hsv = hexToHsv(value)
  const [hue, setHue] = useState(hsv.h || 0)
  const [sat, setSat] = useState(hsv.s)
  const [val, setVal] = useState(hsv.v)
  const [draft, setDraft] = useState(toPickerHex(value).toUpperCase())
  const dragging = useRef(false)
  const lastSynced = useRef(value)

  // Sync dari luar hanya saat tidak sedang drag — biar thumb tidak loncat.
  useEffect(() => {
    if (dragging.current) return
    if (lastSynced.current === value) return
    lastSynced.current = value
    const next = hexToHsv(value)
    setHue(next.h || 0)
    setSat(next.s)
    setVal(next.v)
    setDraft(toPickerHex(value).toUpperCase())
  }, [value])

  const commitHsv = (h: number, s: number, v: number) => {
    setHue(h)
    setSat(s)
    setVal(v)
    const hex = hsvToHex(h, s, v)
    lastSynced.current = hex
    setDraft(hex.toUpperCase())
    onChange(hex)
  }

  const commitDraft = () => {
    const next = normalizeHex(draft)
    if (next) {
      lastSynced.current = next
      onChange(next)
    } else setDraft(toPickerHex(value).toUpperCase())
  }

  return (
    <div className="space-y-4">
      <SvPad
        hue={hue}
        sat={sat}
        val={val}
        onDragChange={(s, v) => {
          dragging.current = true
          commitHsv(hue, s, v)
        }}
        onDragEnd={() => {
          dragging.current = false
        }}
      />
      <HueSlider
        hue={hue}
        onDragChange={(h) => {
          dragging.current = true
          commitHsv(h, sat, val)
        }}
        onDragEnd={() => {
          dragging.current = false
        }}
      />
      <div className="flex items-center gap-2">
        <div className="flex h-10 flex-1 items-center gap-2 rounded-lg border border-gray-200 px-2.5 transition-colors focus-within:border-violet-300">
          <span
            className="h-5 w-5 shrink-0 rounded-full border border-gray-200 transition-[background-color] duration-75"
            style={{ backgroundColor: hsvToHex(hue, sat, val) }}
          />
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value.toUpperCase())}
            onBlur={commitDraft}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                commitDraft()
              }
            }}
            className="w-full bg-transparent font-mono text-sm text-gray-800 outline-none"
          />
        </div>
        <EyedropperButton onPick={onChange} />
      </div>
    </div>
  )
}

function GradientOverview({
  from,
  to,
  angle,
  onSelectStop,
  onChangeAngle,
}: {
  from: string
  to: string
  angle: number
  onSelectStop: (stop: "start" | "end") => void
  onChangeAngle: (angle: number) => void
}) {
  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2.5 text-sm font-semibold text-gray-900">
          Gradient colors
        </p>
        <div className="flex items-center gap-2">
          <Swatch color={from} size="lg" onClick={() => onSelectStop("start")} />
          <Swatch color={to} size="lg" onClick={() => onSelectStop("end")} />
          <AddColorButton onClick={() => onSelectStop("end")} />
        </div>
      </div>

      <div>
        <p className="mb-2.5 text-sm font-semibold text-gray-900">Style</p>
        <div className="flex gap-2">
          {GRADIENT_STYLES.map((style) => (
            <button
              key={style.id}
              type="button"
              title={style.label}
              onClick={() => onChangeAngle(style.angle)}
              className={cn(
                "h-10 w-10 rounded-lg border-2 transition-colors",
                Math.abs(angle - style.angle) < 2
                  ? "border-violet-500"
                  : "border-transparent hover:border-gray-200",
              )}
              style={{ background: gradientCss(from, to, style.angle) }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function SvPad({
  hue,
  sat,
  val,
  onDragChange,
  onDragEnd,
}: {
  hue: number
  sat: number
  val: number
  onDragChange: (s: number, v: number) => void
  onDragEnd?: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const updateFromEvent = useCallback(
    (clientX: number, clientY: number) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const s = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
      const v = Math.min(1, Math.max(0, 1 - (clientY - rect.top) / rect.height))
      onDragChange(s, v)
    },
    [onDragChange],
  )

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return
      updateFromEvent(e.clientX, e.clientY)
    }
    const onUp = () => {
      if (!dragging.current) return
      dragging.current = false
      onDragEnd?.()
    }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }
  }, [updateFromEvent, onDragEnd])

  return (
    <div
      ref={ref}
      role="slider"
      aria-label="Saturation and brightness"
      tabIndex={0}
      onPointerDown={(e) => {
        dragging.current = true
        e.currentTarget.setPointerCapture(e.pointerId)
        updateFromEvent(e.clientX, e.clientY)
      }}
      className="relative h-44 w-full cursor-crosshair overflow-hidden rounded-xl"
      style={{
        backgroundColor: hueToCss(hue),
        backgroundImage:
          "linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent)",
      }}
    >
      <span
        className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md will-change-transform"
        style={{
          left: `${sat * 100}%`,
          top: `${(1 - val) * 100}%`,
          backgroundColor: hsvToHex(hue, sat, val),
        }}
      />
    </div>
  )
}

function HueSlider({
  hue,
  onDragChange,
  onDragEnd,
}: {
  hue: number
  onDragChange: (h: number) => void
  onDragEnd?: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const updateFromEvent = useCallback(
    (clientX: number) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const t = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
      onDragChange(t * 360)
    },
    [onDragChange],
  )

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return
      updateFromEvent(e.clientX)
    }
    const onUp = () => {
      if (!dragging.current) return
      dragging.current = false
      onDragEnd?.()
    }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }
  }, [updateFromEvent, onDragEnd])

  return (
    <div
      ref={ref}
      role="slider"
      aria-label="Hue"
      tabIndex={0}
      onPointerDown={(e) => {
        dragging.current = true
        e.currentTarget.setPointerCapture(e.pointerId)
        updateFromEvent(e.clientX)
      }}
      className="relative h-3 w-full cursor-pointer rounded-full"
      style={{
        background:
          "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
      }}
    >
      <span
        className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md will-change-transform"
        style={{
          left: `${(hue / 360) * 100}%`,
          backgroundColor: hueToCss(hue),
        }}
      />
    </div>
  )
}
