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
 * Only page content scales. Fit-to-width runs on device change / explicit fit —
 * never on every layout twitch (selection, toolbar), so zoom + scroll stay put.
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
  /** True until user pinches / +/- ; then resize must not steal their zoom. */
  const fitModeRef = useRef(true)
  const artboardW = device === "mobile" ? MOBILE_ARTBOARD : DESKTOP_ARTBOARD
  const lastViewportW = useRef(0)

  const applyFitZoom = useCallback(
    (opts?: { resetScrollY?: boolean }) => {
      const el = viewportRef.current
      if (!el) return
      const pad = 24
      const next = clampZoom((el.clientWidth - pad) / artboardW)
      fitModeRef.current = true
      setZoom(next)
      lastViewportW.current = el.clientWidth
      requestAnimationFrame(() => {
        const vp = viewportRef.current
        if (!vp) return
        const scaledW = artboardW * next
        vp.scrollLeft = Math.max(0, (scaledW - vp.clientWidth) / 2 + pad / 2)
        if (opts?.resetScrollY) vp.scrollTop = 0
      })
    },
    [artboardW],
  )

  const fitToViewport = useCallback(() => {
    applyFitZoom({ resetScrollY: false })
  }, [applyFitZoom])

  // Device change → fresh fit + jump to top (intentional)
  useLayoutEffect(() => {
    applyFitZoom({ resetScrollY: true })
  }, [applyFitZoom, device])

  // Viewport resize: re-fit only while still in fit-mode AND width actually changed.
  // Never reset scrollY — that was jumping back to hero on select/toolbar.
  useEffect(() => {
    const vp = viewportRef.current
    if (!vp) return
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? vp.clientWidth
      if (Math.abs(w - lastViewportW.current) < 1) return
      lastViewportW.current = w
      if (!fitModeRef.current) return
      const pad = 24
      const next = clampZoom((w - pad) / artboardW)
      setZoom(next)
      requestAnimationFrame(() => {
        const el = viewportRef.current
        if (!el) return
        const scaledW = artboardW * next
        el.scrollLeft = Math.max(0, (scaledW - el.clientWidth) / 2 + pad / 2)
      })
    })
    ro.observe(vp)
    return () => ro.disconnect()
  }, [artboardW])

  useEffect(() => {
    const el = artboardRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      setContentH(el.offsetHeight)
    })
    ro.observe(el)
    setContentH(el.offsetHeight)
    return () => ro.disconnect()
  }, [device])

  const bumpZoom = useCallback((next: number | ((z: number) => number)) => {
    fitModeRef.current = false
    setZoom((z) =>
      clampZoom(typeof next === "function" ? next(z) : next),
    )
  }, [])

  // Ctrl / meta + wheel → canvas zoom only
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return
      e.preventDefault()
      e.stopPropagation()
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
      bumpZoom((z) => z + delta)
    }
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [bumpZoom])

  // Pinch-to-zoom; block browser page zoom
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
        bumpZoom((z) => z * ratio)
      }
    }
    const onUp = (e: PointerEvent) => {
      pointers.delete(e.pointerId)
      if (pointers.size < 2) lastDist = 0
    }

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length >= 2) e.preventDefault()
    }

    el.addEventListener("pointerdown", onDown)
    el.addEventListener("pointermove", onMove)
    el.addEventListener("pointerup", onUp)
    el.addEventListener("pointercancel", onUp)
    el.addEventListener("touchmove", onTouchMove, { passive: false })
    return () => {
      el.removeEventListener("pointerdown", onDown)
      el.removeEventListener("pointermove", onMove)
      el.removeEventListener("pointerup", onUp)
      el.removeEventListener("pointercancel", onUp)
      el.removeEventListener("touchmove", onTouchMove)
    }
  }, [bumpZoom])

  const scaledW = artboardW * zoom
  const scaledH = contentH * zoom

  return (
    <div
      className={cn("relative flex min-h-0 flex-1 flex-col", className)}
      data-preview-canvas
    >
      <div
        ref={viewportRef}
        className="relative min-h-0 flex-1 touch-none overflow-auto overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        data-preview-viewport
      >
        <div
          className="relative mx-auto"
          style={{
            width: scaledW,
            marginTop: 16,
            marginBottom: 64,
          }}
        >
          {chrome ? (
            <div
              className="overflow-hidden rounded-t-xl border border-b-0 border-gray-200 bg-gray-50"
              data-preview-chrome
            >
              {chrome}
            </div>
          ) : null}

          <div
            className="relative overflow-hidden rounded-b-xl border border-gray-200 bg-white shadow-xl"
            style={{
              width: scaledW,
              height: scaledH,
              borderTopLeftRadius: chrome ? 0 : undefined,
              borderTopRightRadius: chrome ? 0 : undefined,
              borderTopWidth: chrome ? 0 : undefined,
            }}
          >
            <div
              ref={artboardRef}
              data-preview-device={device}
              data-preview-artboard
              className="absolute left-0 top-0 origin-top-left"
              style={{
                width: artboardW,
                transform: `scale(${zoom})`,
                transformOrigin: "top left",
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-0.5 rounded-full border border-gray-200 bg-white/95 px-1 py-1 shadow-lg backdrop-blur-sm md:bottom-4"
        data-builder-chrome
      >
        <button
          type="button"
          aria-label="Zoom out"
          className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
          onClick={() => bumpZoom((z) => z - ZOOM_STEP)}
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
          onClick={() => bumpZoom((z) => z + ZOOM_STEP)}
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

/**
 * Scroll a section/element into the preview viewport, accounting for CSS scale.
 * Native scrollIntoView is unreliable inside transform: scale().
 */
export function scrollPreviewIntoView(
  root: ParentNode,
  target: HTMLElement,
  opts?: { behavior?: ScrollBehavior; block?: "center" | "nearest" },
) {
  const viewport = root.querySelector<HTMLElement>("[data-preview-viewport]")
  if (!viewport) {
    target.scrollIntoView({
      behavior: opts?.behavior ?? "smooth",
      block: opts?.block ?? "center",
    })
    return
  }

  const elRect = target.getBoundingClientRect()
  const vpRect = viewport.getBoundingClientRect()
  const block = opts?.block ?? "center"

  let deltaY = 0
  if (block === "center") {
    const elMid = elRect.top + elRect.height / 2
    const vpMid = vpRect.top + vpRect.height / 2
    deltaY = elMid - vpMid
  } else {
    if (elRect.top < vpRect.top) deltaY = elRect.top - vpRect.top - 16
    else if (elRect.bottom > vpRect.bottom)
      deltaY = elRect.bottom - vpRect.bottom + 16
  }

  if (Math.abs(deltaY) < 2) return

  viewport.scrollTo({
    top: viewport.scrollTop + deltaY,
    behavior: opts?.behavior ?? "smooth",
  })
}
