"use client"

import { cn } from "@/lib/utils"

/**
 * Chrome bounding box teks (visual yang di-acc): ring violet tebal, dot bulat
 * violet di 4 sudut, pill putih di tengah 4 sisi. Reusable — murni visual +
 * penerus pointer event; matematika resize milik pemanggil.
 */

export type BoxEdge = "top" | "right" | "bottom" | "left"
export type BoxCorner = "nw" | "ne" | "sw" | "se"

interface CanvasTextBoundingBoxProps {
  onEdgeDrag: (edge: BoxEdge) => (event: React.PointerEvent<HTMLElement>) => void
  onCornerDrag: (corner: BoxCorner) => (event: React.PointerEvent<HTMLElement>) => void
  /** Untuk aria-label, mis. "judul" / "teks". */
  labelPrefix?: string
}

function HandleDot({
  className,
  cursor,
  label,
  onPointerDown,
}: {
  className?: string
  cursor: string
  label: string
  onPointerDown: (event: React.PointerEvent<HTMLElement>) => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={onPointerDown}
      className={cn(
        "pointer-events-auto absolute z-[40] flex h-5 w-5 items-center justify-center rounded-full touch-none",
        "border-2 border-white bg-violet-500 shadow-md",
        "transition-transform hover:scale-125 active:scale-110",
        className,
      )}
      style={{ cursor }}
    />
  )
}

function HandleBar({
  className,
  cursor,
  label,
  onPointerDown,
}: {
  className?: string
  cursor: string
  label: string
  onPointerDown: (event: React.PointerEvent<HTMLElement>) => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={onPointerDown}
      className={cn(
        "pointer-events-auto absolute z-[40] rounded-full bg-white/95 shadow ring-1 ring-violet-400/70 touch-none",
        "transition-transform hover:scale-105 active:bg-violet-50",
        className,
      )}
      style={{ cursor }}
    />
  )
}

export function CanvasTextBoundingBox({
  onEdgeDrag,
  onCornerDrag,
  labelPrefix = "teks",
}: CanvasTextBoundingBoxProps) {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 rounded-sm ring-2 ring-violet-500 ring-offset-1 ring-offset-transparent"
      />

      <HandleBar
        label={`Tarik atas ${labelPrefix}`}
        cursor="ns-resize"
        onPointerDown={onEdgeDrag("top")}
        className="left-1/2 top-0 h-2 w-10 -translate-x-1/2 -translate-y-1/2"
      />
      <HandleBar
        label={`Tarik bawah ${labelPrefix}`}
        cursor="ns-resize"
        onPointerDown={onEdgeDrag("bottom")}
        className="bottom-0 left-1/2 h-2 w-10 -translate-x-1/2 translate-y-1/2"
      />
      <HandleBar
        label={`Tarik kiri ${labelPrefix}`}
        cursor="ew-resize"
        onPointerDown={onEdgeDrag("left")}
        className="left-0 top-1/2 h-10 w-2 -translate-x-1/2 -translate-y-1/2"
      />
      <HandleBar
        label={`Tarik kanan ${labelPrefix}`}
        cursor="ew-resize"
        onPointerDown={onEdgeDrag("right")}
        className="right-0 top-1/2 h-10 w-2 translate-x-1/2 -translate-y-1/2"
      />

      <HandleDot
        label={`Tarik sudut kiri atas ${labelPrefix}`}
        cursor="nwse-resize"
        onPointerDown={onCornerDrag("nw")}
        className="-left-2 -top-2"
      />
      <HandleDot
        label={`Tarik sudut kanan atas ${labelPrefix}`}
        cursor="nesw-resize"
        onPointerDown={onCornerDrag("ne")}
        className="-right-2 -top-2"
      />
      <HandleDot
        label={`Tarik sudut kiri bawah ${labelPrefix}`}
        cursor="nesw-resize"
        onPointerDown={onCornerDrag("sw")}
        className="-bottom-2 -left-2"
      />
      <HandleDot
        label={`Tarik sudut kanan bawah ${labelPrefix}`}
        cursor="nwse-resize"
        onPointerDown={onCornerDrag("se")}
        className="-bottom-2 -right-2"
      />
    </>
  )
}
