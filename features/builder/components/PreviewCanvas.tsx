"use client"

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { Minus, Plus, Maximize2 } from "lucide-react"
import { cn } from "@/lib/utils"

const DESKTOP_ARTBOARD = 1280
const MOBILE_ARTBOARD = 375
const MIN_ZOOM = 0.2
const MAX_ZOOM = 2
const ZOOM_STEP = 0.1

function clampZoom(z: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(z * 100) / 100))
}

interface PreviewCanvasProps {
  device: "desktop" | "mobile"
  children: React.ReactNode
  chrome?: React.ReactNode
  className?: string
}

/**
 * Canva-like zoomable artboard.
 * Desktop always lays out at a fixed 1280px width (not crushed by phone viewport);
 * the frame is visually scaled with CSS transform + scroll for pan.
 */
export function PreviewCanvas({
  device,
  children,
  chrome,
  className,
}: PreviewCanvasProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const artboardRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)
  const [contentH, setContentH] = useState(640)
  const artboardW = device === "mobile" ? MOBILE_ARTBOARD : DESKTOP_ARTBOARD

  const fitToViewport = useCallback(() => {
    const el = viewportRef.current
    if (!el) return
    const pad = 24
    const next = clampZoom((el.clientWidth - pad) / artboardW)
    setZoom(next)
    // Center horizontally after fit
    requestAnimationFrame(() => {
      const vp = viewportRef.current
      if (!vp) return
      const scaledW = artboardW * next
      vp.scrollLeft = Math.max(0, (scaledW - vp.clientWidth) / 2 + pad / 2)
      vp.scrollTop = 0
    })
  }, [artboardW])

  useLayoutEffect(() => {
    fitToViewport()
  }, [fitToViewport, device])

  useEffect(() => {
    const vp = viewportRef.current
    if (!vp) return
    const ro = new ResizeObserver(() => fitToViewport())
    ro.observe(vp)
    return () => ro.disconnect()
  }, [fitToViewport])

  useEffect(() => {
    const el = artboardRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      setContentH(el.offsetHeight)
    })
    ro.observe(el)
    setContentH(el.offsetHeight)
    return () => ro.disconnect()
  }, [device, children])

  // Ctrl / meta + wheel → zoom
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return
      e.preventDefault()
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
      setZoom((z) => clampZoom(z + delta))
    }
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [])

  // Pinch-to-zoom (2 fingers)
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return

    const pointers = new Map<number, { x: number; y: number }>()
    let lastDist = 0

    const dist = () => {
      const pts = [...pointers.values()]
      if (pts.length < 2) return 0
      return Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
    }

    const onDown = (e: PointerEvent) => {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
      if (pointers.size === 2) lastDist = dist()
    }
    const onMove = (e: PointerEvent) => {
      if (!pointers.has(e.pointerId)) return
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
      if (pointers.size === 2 && lastDist > 0) {
        const d = dist()
        const ratio = d / lastDist
        lastDist = d
        setZoom((z) => clampZoom(z * ratio))
      }
    }
    const onUp = (e: PointerEvent) => {
      pointers.delete(e.pointerId)
      if (pointers.size < 2) lastDist = 0
    }

    el.addEventListener("pointerdown", onDown)
    el.addEventListener("pointermove", onMove)
    el.addEventListener("pointerup", onUp)
    el.addEventListener("pointercancel", onUp)
    return () => {
      el.removeEventListener("pointerdown", onDown)
      el.removeEventListener("pointermove", onMove)
      el.removeEventListener("pointerup", onUp)
      el.removeEventListener("pointercancel", onUp)
    }
  }, [])

  const scaledW = artboardW * zoom
  const scaledH = contentH * zoom

  return (
    <div className={cn("relative flex min-h-0 flex-1 flex-col", className)}>
      <div
        ref={viewportRef}
        className="relative min-h-0 flex-1 overflow-auto overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        data-preview-viewport
      >
        <div
          className="relative mx-auto"
          style={{
            width: scaledW,
            height: scaledH,
            marginTop: 16,
            marginBottom: 64,
          }}
        >
          <div
            ref={artboardRef}
            data-preview-device={device}
            data-preview-artboard
            className="absolute left-0 top-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl"
            style={{
              width: artboardW,
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
            }}
          >
            {chrome}
            {children}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-0.5 rounded-full border border-gray-200 bg-white/95 px-1 py-1 shadow-lg backdrop-blur-sm md:bottom-4">
        <button
          type="button"
          aria-label="Zoom out"
          className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
          onClick={() => setZoom((z) => clampZoom(z - ZOOM_STEP))}
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Fit to screen"
          title="Fit to screen"
          className="pointer-events-auto min-w-[3.25rem] rounded-full px-2 py-1 text-center text-xs font-semibold tabular-nums text-gray-700 hover:bg-gray-100"
          onClick={fitToViewport}
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          type="button"
          aria-label="Zoom in"
          className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
          onClick={() => setZoom((z) => clampZoom(z + ZOOM_STEP))}
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Fit to screen"
          className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
          onClick={fitToViewport}
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

export { DESKTOP_ARTBOARD, MOBILE_ARTBOARD }
