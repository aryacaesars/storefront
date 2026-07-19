/** Visual (post-transform) size — required when the artboard is CSS-scaled. */
export function visualFrameSize(
  el: HTMLElement | null | undefined,
): { w: number; h: number } {
  if (!el) return { w: 1, h: 1 }
  const rect = el.getBoundingClientRect()
  return {
    w: Math.max(rect.width, 1),
    h: Math.max(rect.height, 1),
  }
}

type LockListener = () => void
let scrollLockCount = 0
const scrollLockListeners = new Set<LockListener>()

function emitScrollLock() {
  for (const listener of scrollLockListeners) listener()
}

/** True while a canvas object is being dragged/resized. */
export function isPreviewScrollLocked() {
  return scrollLockCount > 0
}

export function subscribePreviewScrollLock(listener: LockListener) {
  scrollLockListeners.add(listener)
  return () => {
    scrollLockListeners.delete(listener)
  }
}

/** Freeze preview viewport pan/scroll for the duration of a drag. */
export function lockPreviewScroll() {
  scrollLockCount += 1
  if (scrollLockCount === 1) {
    document.documentElement.dataset.canvasDragging = "true"
    emitScrollLock()
  }
  let released = false
  return () => {
    if (released) return
    released = true
    scrollLockCount = Math.max(0, scrollLockCount - 1)
    if (scrollLockCount === 0) {
      delete document.documentElement.dataset.canvasDragging
      emitScrollLock()
    }
  }
}

/** Coalesce rapid pointer updates to one React commit per frame. */
export function createDragRaf<T>(commit: (value: T) => void) {
  let raf = 0
  let pending: T | null = null

  const push = (value: T) => {
    pending = value
    if (raf) return
    raf = requestAnimationFrame(() => {
      raf = 0
      if (pending !== null) commit(pending)
      pending = null
    })
  }

  const cancel = () => {
    if (raf) cancelAnimationFrame(raf)
    raf = 0
    pending = null
  }

  const flush = () => {
    if (raf) {
      cancelAnimationFrame(raf)
      raf = 0
    }
    if (pending !== null) {
      commit(pending)
      pending = null
    }
  }

  return { push, cancel, flush }
}

/**
 * Canvas pointer session.
 *
 * Scroll/zoom stay free on click & select. Viewport only freezes after the
 * first real commit (`push`) — i.e. actual move/resize, not a tap.
 */
export function createDragSession<T>(
  event: React.PointerEvent,
  commit: (value: T) => void,
) {
  event.stopPropagation()
  const target = event.currentTarget as HTMLElement
  try {
    target.setPointerCapture(event.pointerId)
  } catch {
    // ignore
  }

  const viewport = document.querySelector<HTMLElement>("[data-preview-viewport]")
  let frozenLeft = 0
  let frozenTop = 0
  let unlockScroll: (() => void) | null = null
  let armed = false

  const freezeScroll = () => {
    if (!viewport || !armed) return
    if (viewport.scrollLeft !== frozenLeft) viewport.scrollLeft = frozenLeft
    if (viewport.scrollTop !== frozenTop) viewport.scrollTop = frozenTop
  }

  const arm = () => {
    if (armed) return
    armed = true
    frozenLeft = viewport?.scrollLeft ?? 0
    frozenTop = viewport?.scrollTop ?? 0
    unlockScroll = lockPreviewScroll()
    viewport?.addEventListener("scroll", freezeScroll, { passive: true })
  }

  const raf = createDragRaf(commit)
  let ended = false

  const end = () => {
    if (ended) return
    ended = true
    raf.flush()
    viewport?.removeEventListener("scroll", freezeScroll)
    unlockScroll?.()
    unlockScroll = null
    try {
      if (target.hasPointerCapture(event.pointerId)) {
        target.releasePointerCapture(event.pointerId)
      }
    } catch {
      // ignore
    }
  }

  const push = (value: T) => {
    arm()
    raf.push(value)
  }

  const listen = (onMove: (e: PointerEvent) => void) => {
    const handleMove = (e: PointerEvent) => {
      // Only steal the gesture once we're actually dragging/resizing.
      if (armed) {
        e.preventDefault()
        freezeScroll()
      }
      onMove(e)
    }
    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove)
      window.removeEventListener("pointerup", handleUp)
      window.removeEventListener("pointercancel", handleUp)
      end()
    }
    window.addEventListener("pointermove", handleMove, { passive: false })
    window.addEventListener("pointerup", handleUp)
    window.addEventListener("pointercancel", handleUp)
  }

  return { push, end, listen, /** Force-lock immediately (resize handles). */ arm }
}
