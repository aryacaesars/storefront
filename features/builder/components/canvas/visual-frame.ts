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

  return { push, cancel }
}
