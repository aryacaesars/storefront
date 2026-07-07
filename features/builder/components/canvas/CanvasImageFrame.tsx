"use client"

import { useRef } from "react"
import { cn } from "@/lib/utils"
import {
  MAX_IMG_SCALE,
  MIN_IMG_SCALE,
  type CategoryImage,
} from "@/themes/bento/sections/category-grid-layout"

interface CanvasImageFrameProps {
  image: CategoryImage
  /**
   * When true: drag-to-pan inside box, corner group = rotate (outer) / zoom (inner),
   * edge handles = not applicable (no separate width/height).
   */
  interactive: boolean
  onChange: (patch: Record<string, unknown>) => void
}

/** Curved two-headed arrow cursors — one per corner, curve faces inward toward that corner. */
const ROTATE_CURSOR_TL = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M5 19 Q5 5 19 5' fill='none' stroke='white' stroke-width='3.5' stroke-linecap='round'/%3E%3Cpath d='M5 19 Q5 5 19 5' fill='none' stroke='black' stroke-width='2' stroke-linecap='round'/%3E%3Cpolygon points='22,5 18,2 18,8' fill='black'/%3E%3Cpolygon points='5,22 2,18 8,18' fill='black'/%3E%3C/svg%3E") 12 12, crosshair`
const ROTATE_CURSOR_TR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M19 19 Q19 5 5 5' fill='none' stroke='white' stroke-width='3.5' stroke-linecap='round'/%3E%3Cpath d='M19 19 Q19 5 5 5' fill='none' stroke='black' stroke-width='2' stroke-linecap='round'/%3E%3Cpolygon points='2,5 6,2 6,8' fill='black'/%3E%3Cpolygon points='19,22 16,18 22,18' fill='black'/%3E%3C/svg%3E") 12 12, crosshair`
const ROTATE_CURSOR_BL = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M5 5 Q5 19 19 19' fill='none' stroke='white' stroke-width='3.5' stroke-linecap='round'/%3E%3Cpath d='M5 5 Q5 19 19 19' fill='none' stroke='black' stroke-width='2' stroke-linecap='round'/%3E%3Cpolygon points='22,19 18,16 18,22' fill='black'/%3E%3Cpolygon points='5,2 2,6 8,6' fill='black'/%3E%3C/svg%3E") 12 12, crosshair`
const ROTATE_CURSOR_BR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M19 5 Q19 19 5 19' fill='none' stroke='white' stroke-width='3.5' stroke-linecap='round'/%3E%3Cpath d='M19 5 Q19 19 5 19' fill='none' stroke='black' stroke-width='2' stroke-linecap='round'/%3E%3Cpolygon points='2,19 6,16 6,22' fill='black'/%3E%3Cpolygon points='19,2 16,6 22,6' fill='black'/%3E%3C/svg%3E") 12 12, crosshair`

function clampScale(value: number): number {
  return Math.min(MAX_IMG_SCALE, Math.max(MIN_IMG_SCALE, value))
}

/**
 * CanvasImageFrame — image inside a fixed card slot.
 *
 * Since the container is overflow-hidden (clips zoomed image to the card),
 * "outside corner" rotation zones must live INSIDE the box at each corner.
 * Each corner is a 28×28 hit group:
 *   - Outer ring of the group → crosshair cursor → rotate
 *   - Visible 10×10 handle at the corner tip → resize cursor → zoom
 * The image center area responds to drag → pan.
 */
export function CanvasImageFrame({ image, interactive, onChange }: CanvasImageFrameProps) {
  const stateRef = useRef({ image, onChange })
  stateRef.current = { image, onChange }
  const containerRef = useRef<HTMLDivElement>(null)

  // ── Pan ─────────────────────────────────────────────────────────────────────

  function startPan(event: React.PointerEvent<HTMLImageElement>) {
    event.preventDefault()
    event.stopPropagation()
    const startX = event.clientX
    const startY = event.clientY
    const { x: originX, y: originY } = stateRef.current.image
    const frame = event.currentTarget.parentElement?.parentElement
    const width = frame?.clientWidth || 1
    const height = frame?.clientHeight || 1

    function onMove(e: PointerEvent) {
      stateRef.current.onChange({
        imgX: Math.round(originX + ((e.clientX - startX) / width) * 100),
        imgY: Math.round(originY + ((e.clientY - startY) / height) * 100),
      })
    }
    function onUp() {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
  }

  // ── Rotate ──────────────────────────────────────────────────────────────────

  function startRotate(event: React.PointerEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const startAngle = Math.atan2(event.clientY - cy, event.clientX - cx)
    const startRotation = stateRef.current.image.rotation

    function onMove(e: PointerEvent) {
      const angle = Math.atan2(e.clientY - cy, e.clientX - cx)
      stateRef.current.onChange({ imgRotation: Math.round(startRotation + (angle - startAngle) * (180 / Math.PI)) })
    }
    function onUp() {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
  }

  // ── Zoom (corner scale) ──────────────────────────────────────────────────────
  // flipX/flipY ensures dragging away from center = zoom in on all four corners.

  function makeScaleHandler(flipX: 1 | -1, flipY: 1 | -1) {
    return function (event: React.PointerEvent<HTMLButtonElement>) {
      event.preventDefault()
      event.stopPropagation()
      const startScaleVal = stateRef.current.image.scale
      const startX = event.clientX
      const startY = event.clientY

      function onMove(e: PointerEvent) {
        const delta = (e.clientX - startX) * flipX + (e.clientY - startY) * flipY
        stateRef.current.onChange({ imgScale: clampScale(Math.round(startScaleVal + delta * 0.35)) })
      }
      function onUp() {
        window.removeEventListener("pointermove", onMove)
        window.removeEventListener("pointerup", onUp)
      }
      window.addEventListener("pointermove", onMove)
      window.addEventListener("pointerup", onUp)
    }
  }

  if (!image.url) return null

  const scaleTL = makeScaleHandler(-1, -1)
  const scaleTR = makeScaleHandler(1, -1)
  const scaleBL = makeScaleHandler(-1, 1)
  const scaleBR = makeScaleHandler(1, 1)

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute inset-0 z-1 overflow-hidden",
        interactive && "pointer-events-auto",
      )}
    >
      {/* Pan + image */}
      <div
        className="flex h-full w-full items-center justify-center p-4"
        style={{ transform: `translate(${image.x}%, ${image.y}%)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.url}
          alt=""
          draggable={false}
          onPointerDown={interactive ? startPan : undefined}
          className={cn(
            "max-h-full max-w-full select-none object-contain",
            interactive ? "cursor-move touch-none" : "pointer-events-none",
          )}
          style={{
            transform: `scale(${(image.scale / 100) * image.sliderScale}) rotate(${image.rotation}deg)`,
            transformOrigin: "center center",
          }}
        />
      </div>

      {interactive && (
        <>
          {/* Bounding box border */}
          <div className="pointer-events-none absolute inset-0 z-20 border-2 border-blue-400/80" />

          {/* Status badge */}
          <div className="pointer-events-none absolute bottom-2 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-sm bg-blue-500 px-2 py-0.5 text-[10px] font-semibold text-white">
            {Math.round(image.scale * image.sliderScale)}% · {image.rotation > 0 ? `+${image.rotation}` : image.rotation}°
          </div>

          {/*
            Corner groups — 28×28 hit area at each box corner (inside overflow).
            Rotation zone fills the group (outer ring gets clicked when not on handle).
            Visible 10×10 handle sits at the corner tip.
            z-30 > image z-auto, so corners intercept before pan.
          */}

          {/* Top-left */}
          <div className="absolute left-0 top-0 z-30 h-7 w-7">
            <button type="button" aria-label="Putar" onPointerDown={startRotate}
              className="absolute inset-0"
              style={{ cursor: ROTATE_CURSOR_TL }} />
            <button type="button" aria-label="Zoom" onPointerDown={scaleTL}
              className="absolute left-0 top-0 h-2.5 w-2.5 cursor-nwse-resize rounded-[1px] border-2 border-blue-500 bg-white shadow" />
          </div>

          {/* Top-right */}
          <div className="absolute right-0 top-0 z-30 h-7 w-7">
            <button type="button" aria-label="Putar" onPointerDown={startRotate}
              className="absolute inset-0"
              style={{ cursor: ROTATE_CURSOR_TR }} />
            <button type="button" aria-label="Zoom" onPointerDown={scaleTR}
              className="absolute right-0 top-0 h-2.5 w-2.5 cursor-nesw-resize rounded-[1px] border-2 border-blue-500 bg-white shadow" />
          </div>

          {/* Bottom-left */}
          <div className="absolute bottom-0 left-0 z-30 h-7 w-7">
            <button type="button" aria-label="Putar" onPointerDown={startRotate}
              className="absolute inset-0"
              style={{ cursor: ROTATE_CURSOR_BL }} />
            <button type="button" aria-label="Zoom" onPointerDown={scaleBL}
              className="absolute bottom-0 left-0 h-2.5 w-2.5 cursor-nesw-resize rounded-[1px] border-2 border-blue-500 bg-white shadow" />
          </div>

          {/* Bottom-right */}
          <div className="absolute bottom-0 right-0 z-30 h-7 w-7">
            <button type="button" aria-label="Putar" onPointerDown={startRotate}
              className="absolute inset-0"
              style={{ cursor: ROTATE_CURSOR_BR }} />
            <button type="button" aria-label="Zoom" onPointerDown={scaleBR}
              className="absolute bottom-0 right-0 h-2.5 w-2.5 cursor-nwse-resize rounded-[1px] border-2 border-blue-500 bg-white shadow" />
          </div>
        </>
      )}
    </div>
  )
}
