/**
 * Per-device settings: base = desktop, an optional `mobile` object holds the
 * keys that differ on mobile (conceptually like Tailwind `sm:` overrides, but
 * stored as data because the values are numbers applied via inline styles).
 *
 * Layout (position/size) is always device-specific when a mobile layer exists.
 * Image `src` is shared by default across devices. Exception: set
 * `srcOverride: true` on a mobile image item to keep a different photo on
 * mobile only (see mergeDeviceImages).
 */

export type DeviceMode = "desktop" | "mobile"

/** Reserved persisted key holding the mobile layout override. */
export const MOBILE_SETTINGS_KEY = "mobile"
/** In-memory only flag (never persisted) marking a block that has a mobile override. */
export const MOBILE_OVERRIDE_FLAG = "__hasMobileOverride"

/** Keys routed to the mobile override; everything else stays shared on the base. */
export const DEVICE_LAYOUT_KEYS = new Set<string>([
  "xPct",
  "wPct",
  "yPx",
  "hPx",
  "labelXPct",
  "labelYPct",
  "labelWPct",
  "labelHPct",
  "title1LabelXPct",
  "title1LabelYPct",
  "title1LabelWPct",
  "title1LabelHPct",
  "title2LabelXPct",
  "title2LabelYPct",
  "title2LabelWPct",
  "title2LabelHPct",
  "imgScale",
  "imgX",
  "imgY",
  "imgRotation",
  "imgSliderScale",
  "fontScale",
  /** Multi-image hero canvas — position/size/zoom per device. */
  "images",
])

/** Does this settings object carry a mobile override? */
export function hasMobileOverride(settings: Record<string, unknown> | undefined): boolean {
  const mobile = settings?.[MOBILE_SETTINGS_KEY]
  return typeof mobile === "object" && mobile !== null
}

function asImageRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null) return null
  return value as Record<string, unknown>
}

function imageId(value: unknown): string | null {
  const img = asImageRecord(value)
  return typeof img?.id === "string" ? img.id : null
}

function imageSrc(value: unknown): string | null {
  const img = asImageRecord(value)
  return typeof img?.src === "string" && img.src.length > 0 ? img.src : null
}

function hasSrcOverride(value: unknown): boolean {
  return asImageRecord(value)?.srcOverride === true
}

/**
 * Merge desktop + mobile `images` for render.
 * - Layout prefers mobile when the same id exists
 * - `src` shared from desktop unless mobile item has `srcOverride: true`
 * - Desktop-only new images surface on mobile
 * - Mobile orphans (removed on desktop) are dropped
 */
export function mergeDeviceImages(baseImages: unknown, mobileImages: unknown): unknown {
  const base = Array.isArray(baseImages) ? baseImages : null
  const mobile = Array.isArray(mobileImages) ? mobileImages : null

  // Desktop emptied the list → stay empty (do not resurrect mobile orphans).
  if (base && base.length === 0) return []
  if (!mobile || mobile.length === 0) return base ?? mobile ?? []
  if (!base) return mobile

  const baseById = new Map<string, Record<string, unknown>>()
  for (const img of base) {
    const id = imageId(img)
    const rec = asImageRecord(img)
    if (id && rec) baseById.set(id, rec)
  }

  const seen = new Set<string>()
  const merged: Record<string, unknown>[] = []

  for (const img of mobile) {
    const id = imageId(img)
    const rec = asImageRecord(img)
    if (!id || !rec) continue
    const fromBase = baseById.get(id)
    if (!fromBase) continue
    seen.add(id)
    const override = hasSrcOverride(rec)
    const src = override
      ? imageSrc(rec) || imageSrc(fromBase) || ""
      : imageSrc(fromBase) || imageSrc(rec) || ""
    if (!src) continue
    merged.push({
      ...fromBase,
      ...rec,
      src,
      ...(override ? { srcOverride: true } : {}),
    })
  }

  for (const [id, img] of baseById) {
    if (!seen.has(id)) merged.push(img)
  }

  return merged
}

/**
 * After a desktop `images` write, mirror ids into the mobile layer:
 * keep per-id mobile layout; refresh shared `src` unless `srcOverride`.
 */
export function syncMobileImagesFromDesktop(
  mobileImages: unknown,
  desktopImages: unknown,
): unknown[] {
  const desktop = Array.isArray(desktopImages) ? desktopImages : []
  const mobileList = Array.isArray(mobileImages) ? mobileImages : []
  const mobileById = new Map<string, Record<string, unknown>>()
  for (const img of mobileList) {
    const id = imageId(img)
    const rec = asImageRecord(img)
    if (id && rec) mobileById.set(id, rec)
  }

  return desktop.map((img) => {
    const id = imageId(img)
    const desk = asImageRecord(img)
    if (!id || !desk) return img as Record<string, unknown>
    const existing = mobileById.get(id)
    if (!existing) return { ...desk }
    if (hasSrcOverride(existing)) {
      return { ...existing, id }
    }
    return {
      ...existing,
      src: imageSrc(desk) || imageSrc(existing) || "",
      id,
    }
  })
}

/**
 * Mark mobile items whose `src` diverged from desktop as `srcOverride`.
 * New ids (uploaded on mobile) stay shared (no flag).
 */
export function annotateMobileSrcOverrides(
  desktopImages: unknown,
  mobileImages: unknown,
): unknown[] {
  const mobile = Array.isArray(mobileImages) ? mobileImages : []
  const desktopList = Array.isArray(desktopImages) ? desktopImages : []
  const desktopById = new Map<string, Record<string, unknown>>()
  for (const img of desktopList) {
    const id = imageId(img)
    const rec = asImageRecord(img)
    if (id && rec) desktopById.set(id, rec)
  }

  return mobile.map((img) => {
    const id = imageId(img)
    const mob = asImageRecord(img)
    if (!id || !mob) return img as Record<string, unknown>
    if (hasSrcOverride(mob)) return mob
    const desk = desktopById.get(id)
    const mobSrc = imageSrc(mob)
    const deskSrc = desk ? imageSrc(desk) : null
    if (desk && mobSrc && deskSrc && mobSrc !== deskSrc) {
      return { ...mob, srcOverride: true }
    }
    return mob
  })
}

/**
 * After a mobile `images` write, sync membership + shared src to desktop.
 * Items with `srcOverride` keep their mobile src and do not overwrite desktop.
 */
export function syncDesktopImagesFromMobile(
  desktopImages: unknown,
  mobileImages: unknown,
): unknown[] {
  const mobile = Array.isArray(mobileImages) ? mobileImages : []
  const desktopList = Array.isArray(desktopImages) ? desktopImages : []
  const desktopById = new Map<string, Record<string, unknown>>()
  for (const img of desktopList) {
    const id = imageId(img)
    const rec = asImageRecord(img)
    if (id && rec) desktopById.set(id, rec)
  }

  const result: Record<string, unknown>[] = []
  const seen = new Set<string>()

  for (const img of mobile) {
    const id = imageId(img)
    const mob = asImageRecord(img)
    if (!id || !mob) continue
    seen.add(id)
    const existing = desktopById.get(id)
    if (!existing) {
      // New on mobile → shared (strip override flag on base copy)
      const { srcOverride: _o, ...shared } = mob
      result.push(shared)
      continue
    }
    if (hasSrcOverride(mob)) {
      // Keep desktop src; membership only
      result.push(existing)
      continue
    }
    result.push({
      ...existing,
      src: imageSrc(mob) || imageSrc(existing) || "",
      id,
    })
  }

  // Keep desktop-only images (not deleted from mobile list intentionally —
  // mobile list is the source of truth for membership when editing mobile).
  // Actually when user deletes on mobile, id won't be in mobile → drop from desktop.
  // Desktop-only images that weren't in mobile before sync shouldn't appear if
  // mobile is authoritative for this write… But merge on resolve still shows
  // desktop-only. For delete-on-mobile to work, we only return `result`.
  void seen
  return result
}

/**
 * Flatten device settings for render. No mobile key → returns the SAME reference
 * (no-op, byte-identical to pre-feature behavior). Mobile → base with the mobile
 * layout merged over it; desktop → base with the mobile key stripped.
 */
export function resolveDeviceSettings(
  settings: Record<string, unknown> | undefined,
  isMobile: boolean,
): Record<string, unknown> | undefined {
  if (!settings) return settings
  const { [MOBILE_SETTINGS_KEY]: mobile, ...base } = settings
  if (mobile === undefined) return settings
  if (!isMobile || typeof mobile !== "object" || mobile === null) return base

  const mobileLayer = mobile as Record<string, unknown>
  const merged: Record<string, unknown> = { ...base, ...mobileLayer }
  if ("images" in base || "images" in mobileLayer) {
    merged.images = mergeDeviceImages(base.images, mobileLayer.images)
  }
  return merged
}

/**
 * Merge an editor patch into settings, routed by the active device.
 * - desktop: patch merges into the base; `images` also sync into mobile layer
 *   (respecting `srcOverride`).
 * - mobile: LAYOUT keys go into `settings.mobile`; `images` annotate overrides
 *   when src diverges, then sync membership back to the base.
 */
export function applyDevicePatch(
  current: Record<string, unknown>,
  patch: Record<string, unknown>,
  device: DeviceMode,
): Record<string, unknown> {
  if (device === "desktop") {
    const { [MOBILE_SETTINGS_KEY]: existingMobile, ...baseCurrent } = current
    const basePatch: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(patch)) {
      if (key === MOBILE_SETTINGS_KEY || key === MOBILE_OVERRIDE_FLAG) continue
      basePatch[key] = value
    }
    const next: Record<string, unknown> = { ...baseCurrent, ...basePatch }
    if (existingMobile !== undefined && typeof existingMobile === "object" && existingMobile) {
      const mobileLayer = { ...(existingMobile as Record<string, unknown>) }
      if ("images" in basePatch) {
        mobileLayer.images = syncMobileImagesFromDesktop(
          mobileLayer.images,
          basePatch.images,
        )
      }
      next[MOBILE_SETTINGS_KEY] = mobileLayer
    }
    return next
  }

  const basePatch: Record<string, unknown> = {}
  const mobilePatch: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(patch)) {
    if (key === MOBILE_SETTINGS_KEY || key === MOBILE_OVERRIDE_FLAG) continue
    if (DEVICE_LAYOUT_KEYS.has(key)) mobilePatch[key] = value
    else basePatch[key] = value
  }

  const { [MOBILE_SETTINGS_KEY]: existing, ...baseNoMobile } = current
  const next: Record<string, unknown> = { ...current, ...basePatch }

  if (Object.keys(mobilePatch).length === 0) return next

  let seed: Record<string, unknown>
  if (existing && typeof existing === "object") {
    seed = existing as Record<string, unknown>
  } else {
    seed = {}
    for (const key of DEVICE_LAYOUT_KEYS) {
      if (key in baseNoMobile) seed[key] = baseNoMobile[key]
    }
  }

  const mobileNext = { ...seed, ...mobilePatch }
  if ("images" in mobilePatch) {
    const annotated = annotateMobileSrcOverrides(baseNoMobile.images, mobilePatch.images)
    mobileNext.images = annotated
    next.images = syncDesktopImagesFromMobile(baseNoMobile.images, annotated)
  }

  return { ...next, [MOBILE_SETTINGS_KEY]: mobileNext }
}
