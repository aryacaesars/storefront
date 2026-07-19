"use client"

import { useRef } from "react"
import { cn } from "@/lib/utils"
import {
  createDragSession,
  visualFrameSize,
} from "@/features/builder/components/canvas/visual-frame"
import {
  virtualBoxFromCrop,
  type CanvasImageCrop,
  type CanvasImageItem,
} from "@/themes/engine/canvas-image"

/** Curved two-headed arrow cursors — one per corner, curve faces inward toward that corner. */
const ROTATE_CURSOR_TL = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M5 19 Q5 5 19 5' fill='none' stroke='white' stroke-width='3.5' stroke-linecap='round'/%3E%3Cpath d='M5 19 Q5 5 19 5' fill='none' stroke='black' stroke-width='2' stroke-linecap='round'/%3E%3Cpolygon points='22,5 18,2 18,8' fill='black'/%3E%3Cpolygon points='5,22 2,18 8,18' fill='black'/%3E%3C/svg%3E") 12 12, crosshair`
const ROTATE_CURSOR_TR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M19 19 Q19 5 5 5' fill='none' stroke='white' stroke-width='3.5' stroke-linecap='round'/%3E%3Cpath d='M19 19 Q19 5 5 5' fill='none' stroke='black' stroke-width='2' stroke-linecap='round'/%3E%3Cpolygon points='2,5 6,2 6,8' fill='black'/%3E%3Cpolygon points='19,22 16,18 22,18' fill='black'/%3E%3C/svg%3E") 12 12, crosshair`
const ROTATE_CURSOR_BL = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M5 5 Q5 19 19 19' fill='none' stroke='white' stroke-width='3.5' stroke-linecap='round'/%3E%3Cpath d='M5 5 Q5 19 19 19' fill='none' stroke='black' stroke-width='2' stroke-linecap='round'/%3E%3Cpolygon points='22,19 18,16 18,22' fill='black'/%3E%3Cpolygon points='5,2 2,6 8,6' fill='black'/%3E%3C/svg%3E") 12 12, crosshair`
const ROTATE_CURSOR_BR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M19 5 Q19 19 5 19' fill='none' stroke='white' stroke-width='3.5' stroke-linecap='round'/%3E%3Cpath d='M19 5 Q19 19 5 19' fill='none' stroke='black' stroke-width='2' stroke-linecap='round'/%3E%3Cpolygon points='2,19 6,16 6,22' fill='black'/%3E%3Cpolygon points='19,2 16,6 22,6' fill='black'/%3E%3C/svg%3E") 12 12, crosshair`

interface CanvasMultiImageItemProps {
  item: CanvasImageItem
  selected: boolean
  editable: boolean
  /** Crop mode: move/resize/rotate handles hidden, crop window handles shown. */
  cropping?: boolean
  /** Stamped as data-canvas-element so the floating toolbar can anchor here. */
  domKey?: string
  onSelect: () => void
  onChange: (patch: Partial<CanvasImageItem>) => void
}

const MIN_CROP_PCT = 3

function clampNum(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function round1(value: number): number {
  return Math.round(value * 10) / 10
}

/** Box (canvas %) → crop fractions relative to a virtual box (canvas %). */
function cropFromBox(
  box: { x: number; y: number; width: number; height: number },
  virtual: { x: number; y: number; width: number; height: number },
): CanvasImageCrop | undefined {
  const w = box.width / virtual.width
  const h = box.height / virtual.height
  const x = (box.x - virtual.x) / virtual.width
  const y = (box.y - virtual.y) / virtual.height
  if (x < 0.005 && y < 0.005 && w > 0.995 && h > 0.995) return undefined
  return {
    x: Math.max(0, x),
    y: Math.max(0, y),
    w: Math.min(1, w),
    h: Math.min(1, h),
  }
}

/** Inner <img> geometry so the crop region fills the item box. */
function croppedImageStyle(item: CanvasImageItem): React.CSSProperties {
  const crop = item.crop
  const flipX = item.flipH ? -1 : 1
  const flipY = item.flipV ? -1 : 1
  const transform = `rotate(${item.rotation}deg) scale(${item.scale * flipX}, ${item.scale * flipY})`
  if (!crop) {
    return {
      transform,
      transformOrigin: "center center",
      opacity: item.opacity / 100,
    }
  }
  return {
    position: "absolute",
    width: `${100 / crop.w}%`,
    height: `${100 / crop.h}%`,
    left: `${(-crop.x / crop.w) * 100}%`,
    top: `${(-crop.y / crop.h) * 100}%`,
    maxWidth: "none",
    transform,
    transformOrigin: "center center",
    opacity: item.opacity / 100,
  }
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
  cropping = false,
  domKey,
  onSelect,
  onChange,
}: CanvasMultiImageItemProps) {
  const stateRef = useRef({ item, onChange })
  stateRef.current = { item, onChange }
  const containerRef = useRef<HTMLDivElement>(null)

  function getFrame() {
    return containerRef.current?.parentElement
  }

  function frameVisual() {
    return visualFrameSize(getFrame())
  }

  // ── Crop mode ────────────────────────────────────────────────────────────────
  // Crop window = the item box; the full image (virtual box) shows as a ghost.
  // Dragging inside slides the image under the window (crop.x/y); corner
  // handles resize the window, clamped to the virtual box.

  function startCropSlide(event: React.PointerEvent<HTMLDivElement>) {
    event.preventDefault()
    event.stopPropagation()
    const startX = event.clientX
    const startY = event.clientY
    const startItem = stateRef.current.item
    const virtual = virtualBoxFromCrop(startItem)
    const startCrop = startItem.crop ?? { x: 0, y: 0, w: 1, h: 1 }
    const { w: fw, h: fh } = frameVisual()
    const session = createDragSession(event, stateRef.current.onChange)
    session.arm()

    session.listen((e) => {
      const dxFrac = (((e.clientX - startX) / fw) * 100) / virtual.width
      const dyFrac = (((e.clientY - startY) / fh) * 100) / virtual.height
      const x = clampNum(startCrop.x - dxFrac, 0, 1 - startCrop.w)
      const y = clampNum(startCrop.y - dyFrac, 0, 1 - startCrop.h)
      session.push({ crop: { ...startCrop, x, y } })
    })
  }

  function startCropCorner(corner: "tl" | "tr" | "bl" | "br") {
    return function (event: React.PointerEvent<HTMLButtonElement>) {
      event.preventDefault()
      event.stopPropagation()
      const startX = event.clientX
      const startY = event.clientY
      const startItem = stateRef.current.item
      const virtual = virtualBoxFromCrop(startItem)
      const start = {
        x: startItem.x,
        y: startItem.y,
        width: startItem.width,
        height: startItem.height,
      }
      const { w: fw, h: fh } = frameVisual()
      const right = start.x + start.width
      const bottom = start.y + start.height
      const vRight = virtual.x + virtual.width
      const vBottom = virtual.y + virtual.height
      const session = createDragSession(event, stateRef.current.onChange)
      session.arm()

      session.listen((e) => {
        const dx = ((e.clientX - startX) / fw) * 100
        const dy = ((e.clientY - startY) / fh) * 100
        const box = { ...start }

        if (corner === "tl" || corner === "bl") {
          const x = clampNum(start.x + dx, virtual.x, right - MIN_CROP_PCT)
          box.x = x
          box.width = right - x
        } else {
          const r = clampNum(right + dx, start.x + MIN_CROP_PCT, vRight)
          box.width = r - start.x
        }

        if (corner === "tl" || corner === "tr") {
          const y = clampNum(start.y + dy, virtual.y, bottom - MIN_CROP_PCT)
          box.y = y
          box.height = bottom - y
        } else {
          const b = clampNum(bottom + dy, start.y + MIN_CROP_PCT, vBottom)
          box.height = b - start.y
        }

        session.push({
          x: round1(box.x),
          y: round1(box.y),
          width: round1(box.width),
          height: round1(box.height),
          crop: cropFromBox(box, virtual),
        })
      })
    }
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
    const { w: fw, h: fh } = frameVisual()
    const session = createDragSession(event, stateRef.current.onChange)

    session.listen((e) => {
      session.push({
        x: Math.round(Math.max(-20, Math.min(95, ox + ((e.clientX - startX) / fw) * 100)) * 10) / 10,
        y: Math.round(Math.max(-20, Math.min(95, oy + ((e.clientY - startY) / fh) * 100)) * 10) / 10,
      })
    })
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
    const session = createDragSession(event, stateRef.current.onChange)
    session.arm()

    session.listen((e) => {
      const angle = Math.atan2(e.clientY - cy, e.clientX - cx)
      session.push({
        rotation: Math.round(startRotation + (angle - startAngle) * (180 / Math.PI)),
      })
    })
  }

  // ── Corner resize — opposite corner stays fixed ──────────────────────────────

  function startTLResize(event: React.PointerEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
    const sx = event.clientX, sy = event.clientY
    const { x: ox, y: oy, width: ow, height: oh } = stateRef.current.item
    const { w: fw, h: fh } = frameVisual()
    const session = createDragSession(event, stateRef.current.onChange)
    session.arm()

    session.listen((e) => {
      const dx = ((e.clientX - sx) / fw) * 100
      const dy = ((e.clientY - sy) / fh) * 100
      const nw = ow - dx, nh = oh - dy
      if (nw < 5 || nh < 5) return
      session.push({
        x: Math.round((ox + dx) * 10) / 10,
        y: Math.round((oy + dy) * 10) / 10,
        width: Math.round(nw * 10) / 10,
        height: Math.round(nh * 10) / 10,
      })
    })
  }

  function startTRResize(event: React.PointerEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
    const sx = event.clientX, sy = event.clientY
    const { y: oy, width: ow, height: oh } = stateRef.current.item
    const { w: fw, h: fh } = frameVisual()
    const session = createDragSession(event, stateRef.current.onChange)
    session.arm()

    session.listen((e) => {
      const dx = ((e.clientX - sx) / fw) * 100
      const dy = ((e.clientY - sy) / fh) * 100
      const nw = ow + dx, nh = oh - dy
      if (nw < 5 || nh < 5) return
      session.push({
        y: Math.round((oy + dy) * 10) / 10,
        width: Math.round(nw * 10) / 10,
        height: Math.round(nh * 10) / 10,
      })
    })
  }

  function startBLResize(event: React.PointerEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
    const sx = event.clientX, sy = event.clientY
    const { x: ox, width: ow, height: oh } = stateRef.current.item
    const { w: fw, h: fh } = frameVisual()
    const session = createDragSession(event, stateRef.current.onChange)
    session.arm()

    session.listen((e) => {
      const dx = ((e.clientX - sx) / fw) * 100
      const dy = ((e.clientY - sy) / fh) * 100
      const nw = ow - dx, nh = oh + dy
      if (nw < 5 || nh < 5) return
      session.push({
        x: Math.round((ox + dx) * 10) / 10,
        width: Math.round(nw * 10) / 10,
        height: Math.round(nh * 10) / 10,
      })
    })
  }

  function startBRResize(event: React.PointerEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
    const sx = event.clientX, sy = event.clientY
    const { width: ow, height: oh } = stateRef.current.item
    const { w: fw, h: fh } = frameVisual()
    const session = createDragSession(event, stateRef.current.onChange)
    session.arm()

    session.listen((e) => {
      const nw = Math.max(5, ow + ((e.clientX - sx) / fw) * 100)
      const nh = Math.max(5, oh + ((e.clientY - sy) / fh) * 100)
      session.push({
        width: Math.round(nw * 10) / 10,
        height: Math.round(nh * 10) / 10,
      })
    })
  }

  // ── Edge resize ──────────────────────────────────────────────────────────────

  function startRightResize(event: React.PointerEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
    const sx = event.clientX
    const ow = stateRef.current.item.width
    const { w: fw } = frameVisual()
    const session = createDragSession(event, stateRef.current.onChange)
    session.arm()
    session.listen((e) => {
      session.push({
        width: Math.round(Math.max(5, ow + ((e.clientX - sx) / fw) * 100) * 10) / 10,
      })
    })
  }

  function startLeftResize(event: React.PointerEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
    const sx = event.clientX
    const { x: ox, width: ow } = stateRef.current.item
    const { w: fw } = frameVisual()
    const session = createDragSession(event, stateRef.current.onChange)
    session.arm()
    session.listen((e) => {
      const dx = ((e.clientX - sx) / fw) * 100
      const nw = ow - dx
      if (nw < 5) return
      session.push({
        x: Math.round((ox + dx) * 10) / 10,
        width: Math.round(nw * 10) / 10,
      })
    })
  }

  function startBottomResize(event: React.PointerEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
    const sy = event.clientY
    const oh = stateRef.current.item.height
    const { h: fh } = frameVisual()
    const session = createDragSession(event, stateRef.current.onChange)
    session.arm()
    session.listen((e) => {
      session.push({
        height: Math.round(Math.max(5, oh + ((e.clientY - sy) / fh) * 100) * 10) / 10,
      })
    })
  }

  function startTopResize(event: React.PointerEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
    const sy = event.clientY
    const { y: oy, height: oh } = stateRef.current.item
    const { h: fh } = frameVisual()
    const session = createDragSession(event, stateRef.current.onChange)
    session.arm()
    session.listen((e) => {
      const dy = ((e.clientY - sy) / fh) * 100
      const nh = oh - dy
      if (nh < 5) return
      session.push({
        y: Math.round((oy + dy) * 10) / 10,
        height: Math.round(nh * 10) / 10,
      })
    })
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  const containerStyle: React.CSSProperties = {
    position: "absolute",
    left: `${item.x}%`,
    top: `${item.y}%`,
    width: `${item.width}%`,
    height: `${item.height}%`,
    zIndex: cropping ? 30 : selected ? 20 : 10,
  }

  const virtual = virtualBoxFromCrop(item)
  const ghostStyle: React.CSSProperties = {
    position: "absolute",
    left: `${((virtual.x - item.x) / item.width) * 100}%`,
    top: `${((virtual.y - item.y) / item.height) * 100}%`,
    width: `${(virtual.width / item.width) * 100}%`,
    height: `${(virtual.height / item.height) * 100}%`,
  }

  const inCropMode = cropping && editable

  return (
    <div
      ref={containerRef}
      style={containerStyle}
      className="relative"
      data-canvas-element={domKey}
    >

      {/* Rotation zones — one per corner, z-10, extends 20px outside box */}
      {selected && editable && !inCropMode && (
        <>
          <div className="absolute z-10" style={{ top: -20, left: -20, width: 28, height: 28, cursor: ROTATE_CURSOR_TL }} onPointerDown={startRotate} />
          <div className="absolute z-10" style={{ top: -20, right: -20, width: 28, height: 28, cursor: ROTATE_CURSOR_TR }} onPointerDown={startRotate} />
          <div className="absolute z-10" style={{ bottom: -20, left: -20, width: 28, height: 28, cursor: ROTATE_CURSOR_BL }} onPointerDown={startRotate} />
          <div className="absolute z-10" style={{ bottom: -20, right: -20, width: 28, height: 28, cursor: ROTATE_CURSOR_BR }} onPointerDown={startRotate} />
        </>
      )}

      {/* Ghost of the full (un-cropped) image while cropping */}
      {inCropMode && (
        <div className="pointer-events-none absolute z-10" style={ghostStyle}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.src}
            alt=""
            draggable={false}
            className="h-full w-full select-none object-cover opacity-40"
            style={{
              transform: `rotate(${item.rotation}deg) scale(${item.scale * (item.flipH ? -1 : 1)}, ${item.scale * (item.flipV ? -1 : 1)})`,
              transformOrigin: "center center",
            }}
          />
          <div className="absolute inset-0 border border-dashed border-white/70" />
        </div>
      )}

      {/* Image clip — z-20 overrides rotation zone for interior */}
      <div
        className={cn(
          "absolute inset-0 z-20 overflow-hidden rounded-sm",
          editable && !inCropMode && "cursor-move",
          inCropMode && "cursor-grab",
          selected && !inCropMode &&
            "ring-2 ring-indigo-500 ring-offset-1 ring-offset-transparent",
          inCropMode && "ring-2 ring-white",
        )}
        onPointerDown={
          editable ? (inCropMode ? startCropSlide : startMove) : undefined
        }
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
          style={croppedImageStyle(item)}
        />
      </div>

      {/* Crop window handles — z-40 */}
      {inCropMode && (
        <>
          <button type="button" aria-label="Crop TL" onPointerDown={startCropCorner("tl")}
            style={{ top: -6, left: -6 }}
            className="absolute z-40 h-4 w-4 cursor-nwse-resize rounded-[2px] border-2 border-white bg-indigo-500 shadow" />
          <button type="button" aria-label="Crop TR" onPointerDown={startCropCorner("tr")}
            style={{ top: -6, right: -6 }}
            className="absolute z-40 h-4 w-4 cursor-nesw-resize rounded-[2px] border-2 border-white bg-indigo-500 shadow" />
          <button type="button" aria-label="Crop BL" onPointerDown={startCropCorner("bl")}
            style={{ bottom: -6, left: -6 }}
            className="absolute z-40 h-4 w-4 cursor-nesw-resize rounded-[2px] border-2 border-white bg-indigo-500 shadow" />
          <button type="button" aria-label="Crop BR" onPointerDown={startCropCorner("br")}
            style={{ bottom: -6, right: -6 }}
            className="absolute z-40 h-4 w-4 cursor-nwse-resize rounded-[2px] border-2 border-white bg-indigo-500 shadow" />
          <div className="pointer-events-none absolute left-1/2 z-40 mt-1 -translate-x-1/2 whitespace-nowrap rounded-sm bg-indigo-600 px-2 py-0.5 text-[10px] font-semibold text-white"
            style={{ top: "100%" }}>
            Crop — geser gambar / tarik sudut
          </div>
        </>
      )}

      {/* Handles — z-30 */}
      {selected && editable && !inCropMode && (
        <>
          {/* Status badge below box */}
          <div
            className="pointer-events-none absolute left-1/2 z-30 mt-1 -translate-x-1/2 whitespace-nowrap rounded-sm bg-indigo-500 px-2 py-0.5 text-[10px] font-semibold text-white"
            style={{ top: "100%" }}
          >
            {Math.round(item.width)}% × {Math.round(item.height)}% · {item.rotation > 0 ? `+${item.rotation}` : item.rotation}°
          </div>

          {/* Corner handles — larger hit area when zoomed */}
          <button type="button" aria-label="Resize TL" onPointerDown={startTLResize}
            style={{ top: -18, left: -18 }}
            className="absolute z-30 flex h-11 w-11 touch-none cursor-nwse-resize items-center justify-center before:block before:h-2.5 before:w-2.5 before:rounded-[1px] before:border-2 before:border-indigo-500 before:bg-white before:shadow" />
          <button type="button" aria-label="Resize TR" onPointerDown={startTRResize}
            style={{ top: -18, right: -18 }}
            className="absolute z-30 flex h-11 w-11 touch-none cursor-nesw-resize items-center justify-center before:block before:h-2.5 before:w-2.5 before:rounded-[1px] before:border-2 before:border-indigo-500 before:bg-white before:shadow" />
          <button type="button" aria-label="Resize BL" onPointerDown={startBLResize}
            style={{ bottom: -18, left: -18 }}
            className="absolute z-30 flex h-11 w-11 touch-none cursor-nesw-resize items-center justify-center before:block before:h-2.5 before:w-2.5 before:rounded-[1px] before:border-2 before:border-indigo-500 before:bg-white before:shadow" />
          <button type="button" aria-label="Resize BR" onPointerDown={startBRResize}
            style={{ bottom: -18, right: -18 }}
            className="absolute z-30 flex h-11 w-11 touch-none cursor-nwse-resize items-center justify-center before:block before:h-2.5 before:w-2.5 before:rounded-[1px] before:border-2 before:border-indigo-500 before:bg-white before:shadow" />

          {/* Edge handles — midpoint of each edge */}
          <button type="button" aria-label="Tinggi atas" onPointerDown={startTopResize}
            className="absolute left-1/2 top-0 z-30 h-3 w-12 -translate-x-1/2 -translate-y-1/2 touch-none cursor-ns-resize rounded-full border-2 border-indigo-400 bg-white shadow" />
          <button type="button" aria-label="Tinggi bawah" onPointerDown={startBottomResize}
            className="absolute bottom-0 left-1/2 z-30 h-3 w-12 -translate-x-1/2 translate-y-1/2 touch-none cursor-ns-resize rounded-full border-2 border-indigo-400 bg-white shadow" />
          <button type="button" aria-label="Lebar kiri" onPointerDown={startLeftResize}
            className="absolute left-0 top-1/2 z-30 h-12 w-3 -translate-x-1/2 -translate-y-1/2 touch-none cursor-ew-resize rounded-full border-2 border-indigo-400 bg-white shadow" />
          <button type="button" aria-label="Lebar kanan" onPointerDown={startRightResize}
            className="absolute right-0 top-1/2 z-30 h-12 w-3 translate-x-1/2 -translate-y-1/2 touch-none cursor-ew-resize rounded-full border-2 border-indigo-400 bg-white shadow" />
        </>
      )}
    </div>
  )
}
