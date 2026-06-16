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
  /** When true: drag-to-pan + corner handle to resize/zoom. */
  interactive: boolean
  onChange: (patch: Record<string, unknown>) => void
}

function clampScale(value: number): number {
  return Math.min(MAX_IMG_SCALE, Math.max(MIN_IMG_SCALE, value))
}

/**
 * Centered object-contain image. Pan by dragging; zoom via corner resize handle.
 */
export function CanvasImageFrame({ image, interactive, onChange }: CanvasImageFrameProps) {
  const stateRef = useRef({ image, onChange })
  stateRef.current = { image, onChange }

  function startPan(event: React.PointerEvent<HTMLImageElement>) {
    event.preventDefault()
    event.stopPropagation()
    const startX = event.clientX
    const startY = event.clientY
    const { x: originX, y: originY } = stateRef.current.image
    const frame = event.currentTarget.parentElement?.parentElement
    const width = frame?.clientWidth || 1
    const height = frame?.clientHeight || 1

    function onMove(moveEvent: PointerEvent) {
      stateRef.current.onChange({
        imgX: Math.round(originX + ((moveEvent.clientX - startX) / width) * 100),
        imgY: Math.round(originY + ((moveEvent.clientY - startY) / height) * 100),
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
    const startScale = stateRef.current.image.scale
    const startX = event.clientX
    const startY = event.clientY

    function onMove(moveEvent: PointerEvent) {
      const delta = (moveEvent.clientX - startX) + (moveEvent.clientY - startY)
      stateRef.current.onChange({
        imgScale: clampScale(Math.round(startScale + delta * 0.35)),
      })
    }
    function onUp() {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
  }

  if (!image.url) return null

  return (
    <div
      className={cn(
        "absolute inset-0 z-[1] overflow-hidden",
        interactive && "pointer-events-auto",
      )}
    >
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
            transform: `scale(${image.scale / 100})`,
            transformOrigin: "center center",
          }}
        />
      </div>

      {interactive && (
        <>
          <button
            type="button"
            aria-label="Tarik untuk zoom gambar"
            onPointerDown={startScaleDrag}
            className="absolute bottom-3 right-3 z-30 flex h-4 w-4 cursor-nwse-resize items-center justify-center rounded-sm border-2 border-white bg-violet-500 shadow-md transition-transform hover:scale-110"
          />
          <div className="pointer-events-none absolute left-2 top-2 z-20 rounded-full bg-black/55 px-2 py-0.5 text-[9px] font-semibold text-white/90">
            {image.scale}% · tarik ⊙ zoom · drag geser
          </div>
        </>
      )}
    </div>
  )
}
