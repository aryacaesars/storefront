"use client"

import { useRef } from "react"
import { cn } from "@/lib/utils"
import type { CanvasImageItem } from "@/themes/engine/canvas-image"

/** Curved two-headed arrow cursors — one per corner, curve faces inward toward that corner. */
const ROTATE_CURSOR_TL = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M5 19 Q5 5 19 5' fill='none' stroke='white' stroke-width='3.5' stroke-linecap='round'/%3E%3Cpath d='M5 19 Q5 5 19 5' fill='none' stroke='black' stroke-width='2' stroke-linecap='round'/%3E%3Cpolygon points='22,5 18,2 18,8' fill='black'/%3E%3Cpolygon points='5,22 2,18 8,18' fill='black'/%3E%3C/svg%3E") 12 12, crosshair`
const ROTATE_CURSOR_TR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M19 19 Q19 5 5 5' fill='none' stroke='white' stroke-width='3.5' stroke-linecap='round'/%3E%3Cpath d='M19 19 Q19 5 5 5' fill='none' stroke='black' stroke-width='2' stroke-linecap='round'/%3E%3Cpolygon points='2,5 6,2 6,8' fill='black'/%3E%3Cpolygon points='19,22 16,18 22,18' fill='black'/%3E%3C/svg%3E") 12 12, crosshair`
const ROTATE_CURSOR_BL = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M5 5 Q5 19 19 19' fill='none' stroke='white' stroke-width='3.5' stroke-linecap='round'/%3E%3Cpath d='M5 5 Q5 19 19 19' fill='none' stroke='black' stroke-width='2' stroke-linecap='round'/%3E%3Cpolygon points='22,19 18,16 18,22' fill='black'/%3E%3Cpolygon points='5,2 2,6 8,6' fill='black'/%3E%3C/svg%3E") 12 12, crosshair`
const ROTATE_CURSOR_BR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M19 5 Q19 19 5 19' fill='none' stroke='white' stroke-width='3.5' stroke-linecap='round'/%3E%3Cpath d='M19 5 Q19 19 5 19' fill='none' stroke='black' stroke-width='2' stroke-linecap='round'/%3E%3Cpolygon points='2,19 6,16 6,22' fill='black'/%3E%3Cpolygon points='19,2 16,6 22,6' fill='black'/%3E%3C/svg%3E") 12 12, crosshair`

interface CanvasMultiImageItemProps {
  item: CanvasImageItem
  selected: boolean
  editable: boolean
  onSelect: () => void
  onChange: (patch: Partial<CanvasImageItem>) => void
}

/**
 * Pointer-area map (when selected):
 *
 *   ░░░░░░░░░░░░░░░░░░░░░░  ← rotation zone (-inset-3, z-10, custom cursor)
 *   ░  [◼]───[↕]───[◼]  ░
 *   ░  [↔]  image  [↔]  ░  ← edge handles: ↔ = width, ↕ = height
 *   ░  [◼]───[↕]───[◼]  ░
 *   ░░░░░░░░░░░░░░░░░░░░░░
 *
 * [◼] = corner handle → resize bounding box from that corner (opposite corner fixed)
 * [↔]/[↕] = edge handle → resize single axis
 * Inside (z-20) → move
 * Outside (rotation zone, z-10) → rotate
 */
export function CanvasMultiImageItem({
  item,
  selected,
  editable,
  onSelect,
  onChange,
}: CanvasMultiImageItemProps) {
  const stateRef = useRef({ item, onChange })
  stateRef.current = { item, onChange }
  const containerRef = useRef<HTMLDivElement>(null)

  function getFrame() {
    return containerRef.current?.parentElement
  }

  // ── Move ────────────────────────────────────────────────────────────────────

  function startMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!editable) return
    event.preventDefault()
    event.stopPropagation()
    onSelect()
    const startX = event.clientX
    const startY = event.clientY
    const { x: ox, y: oy } = stateRef.current.item
    const frame = getFrame()
    const fw = frame?.clientWidth || 1
    const fh = frame?.clientHeight || 1

    function onMove(e: PointerEvent) {
      stateRef.current.onChange({
        x: Math.round(Math.max(-20, Math.min(95, ox + ((e.clientX - startX) / fw) * 100)) * 10) / 10,
        y: Math.round(Math.max(-20, Math.min(95, oy + ((e.clientY - startY) / fh) * 100)) * 10) / 10,
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

  function startRotate(event: React.PointerEvent<HTMLDivElement>) {
    event.preventDefault()
    event.stopPropagation()
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const startAngle = Math.atan2(event.clientY - cy, event.clientX - cx)
    const startRotation = stateRef.current.item.rotation

    function onMove(e: PointerEvent) {
      const angle = Math.atan2(e.clientY - cy, e.clientX - cx)
      stateRef.current.onChange({ rotation: Math.round(startRotation + (angle - startAngle) * (180 / Math.PI)) })
    }
    function onUp() {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
  }

  // ── Corner resize — opposite corner stays fixed ──────────────────────────────

  function startTLResize(event: React.PointerEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
    const sx = event.clientX, sy = event.clientY
    const { x: ox, y: oy, width: ow, height: oh } = stateRef.current.item
    const frame = getFrame()
    const fw = frame?.clientWidth || 1, fh = frame?.clientHeight || 1

    function onMove(e: PointerEvent) {
      const dx = ((e.clientX - sx) / fw) * 100
      const dy = ((e.clientY - sy) / fh) * 100
      const nw = ow - dx, nh = oh - dy
      if (nw < 5 || nh < 5) return
      stateRef.current.onChange({
        x: Math.round((ox + dx) * 10) / 10,
        y: Math.round((oy + dy) * 10) / 10,
        width: Math.round(nw * 10) / 10,
        height: Math.round(nh * 10) / 10,
      })
    }
    function onUp() { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp) }
    window.addEventListener("pointermove", onMove); window.addEventListener("pointerup", onUp)
  }

  function startTRResize(event: React.PointerEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
    const sx = event.clientX, sy = event.clientY
    const { y: oy, width: ow, height: oh } = stateRef.current.item
    const frame = getFrame()
    const fw = frame?.clientWidth || 1, fh = frame?.clientHeight || 1

    function onMove(e: PointerEvent) {
      const dx = ((e.clientX - sx) / fw) * 100
      const dy = ((e.clientY - sy) / fh) * 100
      const nw = ow + dx, nh = oh - dy
      if (nw < 5 || nh < 5) return
      stateRef.current.onChange({
        y: Math.round((oy + dy) * 10) / 10,
        width: Math.round(nw * 10) / 10,
        height: Math.round(nh * 10) / 10,
      })
    }
    function onUp() { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp) }
    window.addEventListener("pointermove", onMove); window.addEventListener("pointerup", onUp)
  }

  function startBLResize(event: React.PointerEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
    const sx = event.clientX, sy = event.clientY
    const { x: ox, width: ow, height: oh } = stateRef.current.item
    const frame = getFrame()
    const fw = frame?.clientWidth || 1, fh = frame?.clientHeight || 1

    function onMove(e: PointerEvent) {
      const dx = ((e.clientX - sx) / fw) * 100
      const dy = ((e.clientY - sy) / fh) * 100
      const nw = ow - dx, nh = oh + dy
      if (nw < 5 || nh < 5) return
      stateRef.current.onChange({
        x: Math.round((ox + dx) * 10) / 10,
        width: Math.round(nw * 10) / 10,
        height: Math.round(nh * 10) / 10,
      })
    }
    function onUp() { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp) }
    window.addEventListener("pointermove", onMove); window.addEventListener("pointerup", onUp)
  }

  function startBRResize(event: React.PointerEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
    const sx = event.clientX, sy = event.clientY
    const { width: ow, height: oh } = stateRef.current.item
    const frame = getFrame()
    const fw = frame?.clientWidth || 1, fh = frame?.clientHeight || 1

    function onMove(e: PointerEvent) {
      const nw = Math.max(5, ow + ((e.clientX - sx) / fw) * 100)
      const nh = Math.max(5, oh + ((e.clientY - sy) / fh) * 100)
      stateRef.current.onChange({
        width: Math.round(nw * 10) / 10,
        height: Math.round(nh * 10) / 10,
      })
    }
    function onUp() { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp) }
    window.addEventListener("pointermove", onMove); window.addEventListener("pointerup", onUp)
  }

  // ── Edge resize ──────────────────────────────────────────────────────────────

  function startRightResize(event: React.PointerEvent<HTMLButtonElement>) {
    event.preventDefault(); event.stopPropagation()
    const sx = event.clientX, ow = stateRef.current.item.width
    const fw = getFrame()?.clientWidth || 1
    function onMove(e: PointerEvent) {
      stateRef.current.onChange({ width: Math.round(Math.max(5, ow + ((e.clientX - sx) / fw) * 100) * 10) / 10 })
    }
    function onUp() { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp) }
    window.addEventListener("pointermove", onMove); window.addEventListener("pointerup", onUp)
  }

  function startLeftResize(event: React.PointerEvent<HTMLButtonElement>) {
    event.preventDefault(); event.stopPropagation()
    const sx = event.clientX
    const { x: ox, width: ow } = stateRef.current.item
    const fw = getFrame()?.clientWidth || 1
    function onMove(e: PointerEvent) {
      const dx = ((e.clientX - sx) / fw) * 100
      const nw = ow - dx
      if (nw < 5) return
      stateRef.current.onChange({
        x: Math.round((ox + dx) * 10) / 10,
        width: Math.round(nw * 10) / 10,
      })
    }
    function onUp() { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp) }
    window.addEventListener("pointermove", onMove); window.addEventListener("pointerup", onUp)
  }

  function startBottomResize(event: React.PointerEvent<HTMLButtonElement>) {
    event.preventDefault(); event.stopPropagation()
    const sy = event.clientY, oh = stateRef.current.item.height
    const fh = getFrame()?.clientHeight || 1
    function onMove(e: PointerEvent) {
      stateRef.current.onChange({ height: Math.round(Math.max(5, oh + ((e.clientY - sy) / fh) * 100) * 10) / 10 })
    }
    function onUp() { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp) }
    window.addEventListener("pointermove", onMove); window.addEventListener("pointerup", onUp)
  }

  function startTopResize(event: React.PointerEvent<HTMLButtonElement>) {
    event.preventDefault(); event.stopPropagation()
    const sy = event.clientY
    const { y: oy, height: oh } = stateRef.current.item
    const fh = getFrame()?.clientHeight || 1
    function onMove(e: PointerEvent) {
      const dy = ((e.clientY - sy) / fh) * 100
      const nh = oh - dy
      if (nh < 5) return
      stateRef.current.onChange({
        y: Math.round((oy + dy) * 10) / 10,
        height: Math.round(nh * 10) / 10,
      })
    }
    function onUp() { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp) }
    window.addEventListener("pointermove", onMove); window.addEventListener("pointerup", onUp)
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  const containerStyle: React.CSSProperties = {
    position: "absolute",
    left: `${item.x}%`,
    top: `${item.y}%`,
    width: `${item.width}%`,
    height: `${item.height}%`,
    zIndex: selected ? 20 : 10,
  }

  return (
    <div ref={containerRef} style={containerStyle} className="relative">

      {/* Rotation zones — one per corner, z-10, extends 20px outside box */}
      {selected && editable && (
        <>
          <div className="absolute z-10" style={{ top: -20, left: -20, width: 28, height: 28, cursor: ROTATE_CURSOR_TL }} onPointerDown={startRotate} />
          <div className="absolute z-10" style={{ top: -20, right: -20, width: 28, height: 28, cursor: ROTATE_CURSOR_TR }} onPointerDown={startRotate} />
          <div className="absolute z-10" style={{ bottom: -20, left: -20, width: 28, height: 28, cursor: ROTATE_CURSOR_BL }} onPointerDown={startRotate} />
          <div className="absolute z-10" style={{ bottom: -20, right: -20, width: 28, height: 28, cursor: ROTATE_CURSOR_BR }} onPointerDown={startRotate} />
        </>
      )}

      {/* Image clip — z-20 overrides rotation zone for interior */}
      <div
        className={cn(
          "absolute inset-0 z-20 overflow-hidden rounded-sm",
          editable && "cursor-move",
          selected && "ring-2 ring-blue-400 ring-offset-1 ring-offset-transparent",
        )}
        onPointerDown={editable ? startMove : undefined}
        onClick={
          editable
            ? (e) => { e.stopPropagation(); onSelect() }
            : undefined
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.src}
          alt=""
          draggable={false}
          className="h-full w-full select-none object-cover pointer-events-none"
          style={{
            transform: `scale(${item.scale}) rotate(${item.rotation}deg)`,
            transformOrigin: "center center",
          }}
        />
      </div>

      {/* Handles — z-30 */}
      {selected && editable && (
        <>
          {/* Status badge below box */}
          <div
            className="pointer-events-none absolute left-1/2 z-30 mt-1 -translate-x-1/2 whitespace-nowrap rounded-sm bg-blue-500 px-2 py-0.5 text-[10px] font-semibold text-white"
            style={{ top: "100%" }}
          >
            {Math.round(item.width)}% × {Math.round(item.height)}% · {item.rotation > 0 ? `+${item.rotation}` : item.rotation}°
          </div>

          {/* Corner handles — centered on corner point */}
          <button type="button" aria-label="Resize TL" onPointerDown={startTLResize}
            style={{ top: -5, left: -5 }}
            className="absolute z-30 h-2.5 w-2.5 cursor-nwse-resize rounded-[1px] border-2 border-blue-500 bg-white shadow" />
          <button type="button" aria-label="Resize TR" onPointerDown={startTRResize}
            style={{ top: -5, right: -5 }}
            className="absolute z-30 h-2.5 w-2.5 cursor-nesw-resize rounded-[1px] border-2 border-blue-500 bg-white shadow" />
          <button type="button" aria-label="Resize BL" onPointerDown={startBLResize}
            style={{ bottom: -5, left: -5 }}
            className="absolute z-30 h-2.5 w-2.5 cursor-nesw-resize rounded-[1px] border-2 border-blue-500 bg-white shadow" />
          <button type="button" aria-label="Resize BR" onPointerDown={startBRResize}
            style={{ bottom: -5, right: -5 }}
            className="absolute z-30 h-2.5 w-2.5 cursor-nwse-resize rounded-[1px] border-2 border-blue-500 bg-white shadow" />

          {/* Edge handles — midpoint of each edge */}
          <button type="button" aria-label="Tinggi atas" onPointerDown={startTopResize}
            className="absolute left-1/2 top-0 z-30 h-2.5 w-8 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize rounded-full border-2 border-blue-400 bg-white shadow" />
          <button type="button" aria-label="Tinggi bawah" onPointerDown={startBottomResize}
            className="absolute bottom-0 left-1/2 z-30 h-2.5 w-8 -translate-x-1/2 translate-y-1/2 cursor-ns-resize rounded-full border-2 border-blue-400 bg-white shadow" />
          <button type="button" aria-label="Lebar kiri" onPointerDown={startLeftResize}
            className="absolute left-0 top-1/2 z-30 h-8 w-2.5 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize rounded-full border-2 border-blue-400 bg-white shadow" />
          <button type="button" aria-label="Lebar kanan" onPointerDown={startRightResize}
            className="absolute right-0 top-1/2 z-30 h-8 w-2.5 translate-x-1/2 -translate-y-1/2 cursor-ew-resize rounded-full border-2 border-blue-400 bg-white shadow" />
        </>
      )}
    </div>
  )
}
