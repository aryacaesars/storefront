"use client"

import { useRef } from "react"
import { cn } from "@/lib/utils"
import type { CanvasImageItem } from "@/themes/engine/canvas-image"

const MIN_SCALE = 0.1
const MAX_SCALE = 5

interface CanvasMultiImageItemProps {
  item: CanvasImageItem
  /** Is this image currently selected/active on canvas? */
  selected: boolean
  /** Is the hero-media block currently interactive (block selected in editor)? */
  editable: boolean
  onSelect: () => void
  onChange: (patch: Partial<CanvasImageItem>) => void
}

/**
 * Renders one image from the multi-image array on the hero canvas.
 * - Drag body → move (x, y)
 * - Bottom-right violet handle → scale zoom
 * - Bottom-right indigo handle → resize bounding box (width, height)
 * Container uses overflow-hidden so scale > 1 clips like a crop mask.
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

  function startMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!editable) return
    event.preventDefault()
    event.stopPropagation()
    onSelect()

    const startX = event.clientX
    const startY = event.clientY
    const { x: originX, y: originY } = stateRef.current.item
    const frame = (event.currentTarget as HTMLElement).parentElement
    const frameW = frame?.clientWidth || 1
    const frameH = frame?.clientHeight || 1

    function onMove(e: PointerEvent) {
      const nextX = Math.max(-20, Math.min(95, originX + ((e.clientX - startX) / frameW) * 100))
      const nextY = Math.max(-20, Math.min(95, originY + ((e.clientY - startY) / frameH) * 100))
      stateRef.current.onChange({
        x: Math.round(nextX * 10) / 10,
        y: Math.round(nextY * 10) / 10,
      })
    }
    function onUp() {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
  }

  function startScaleDrag(event: React.PointerEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
    const startScale = stateRef.current.item.scale
    const startX = event.clientX
    const startY = event.clientY

    function onMove(e: PointerEvent) {
      const delta = (e.clientX - startX) + (e.clientY - startY)
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, startScale + delta * 0.005))
      stateRef.current.onChange({ scale: Math.round(next * 100) / 100 })
    }
    function onUp() {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
  }

  function startResizeDrag(event: React.PointerEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
    const startX = event.clientX
    const startY = event.clientY
    const { width: originW, height: originH } = stateRef.current.item
    const frame = (event.currentTarget as HTMLElement).parentElement?.parentElement
    const frameW = frame?.clientWidth || 1
    const frameH = frame?.clientHeight || 1

    function onMove(e: PointerEvent) {
      const nextW = Math.max(5, Math.min(100, originW + ((e.clientX - startX) / frameW) * 100))
      const nextH = Math.max(5, Math.min(100, originH + ((e.clientY - startY) / frameH) * 100))
      stateRef.current.onChange({
        width: Math.round(nextW * 10) / 10,
        height: Math.round(nextH * 10) / 10,
      })
    }
    function onUp() {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
  }

  const containerStyle: React.CSSProperties = {
    position: "absolute",
    left: `${item.x}%`,
    top: `${item.y}%`,
    width: `${item.width}%`,
    height: `${item.height}%`,
    zIndex: selected ? 20 : 10,
  }

  return (
    <div
      style={containerStyle}
      className={cn(
        "overflow-hidden rounded-sm",
        editable && "cursor-move",
        selected && "ring-2 ring-violet-500 ring-offset-1 ring-offset-transparent",
      )}
      onPointerDown={editable ? startMove : undefined}
      onClick={
        editable
          ? (e) => {
              e.stopPropagation()
              onSelect()
            }
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

      {selected && (
        <>
          {/* Scale handle — violet, bottom-right inner */}
          <button
            type="button"
            aria-label="Tarik untuk zoom gambar"
            onPointerDown={startScaleDrag}
            className="absolute bottom-2 right-6 z-30 flex h-4 w-4 cursor-nwse-resize items-center justify-center rounded-sm border-2 border-white bg-violet-500 shadow-md transition-transform hover:scale-110"
          />

          {/* Resize handle — indigo, bottom-right corner */}
          <button
            type="button"
            aria-label="Tarik untuk resize bingkai"
            onPointerDown={startResizeDrag}
            className="absolute bottom-2 right-2 z-30 flex h-4 w-4 cursor-se-resize items-center justify-center rounded-sm border-2 border-white bg-indigo-500 shadow-md transition-transform hover:scale-110"
          />

          <div className="pointer-events-none absolute left-1.5 top-1.5 z-20 rounded-full bg-black/55 px-2 py-0.5 text-[9px] font-semibold text-white/90">
            {Math.round(item.scale * 100)}% · {item.rotation > 0 ? `+${item.rotation}` : item.rotation}° · drag geser · ⊙zoom · □resize
          </div>
        </>
      )}
    </div>
  )
}
