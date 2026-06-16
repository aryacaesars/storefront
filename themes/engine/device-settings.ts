/**
 * Per-device settings: base = desktop, an optional `mobile` object holds the
 * keys that differ on mobile (conceptually like Tailwind `sm:` overrides, but
 * stored as data because the values are numbers applied via inline styles).
 *
 * Only LAYOUT keys are device-specific — content (imageUrl, label, text) always
 * lives on the base so it's shared across devices.
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
  "fontScale",
])

/** Does this settings object carry a mobile override? */
export function hasMobileOverride(settings: Record<string, unknown> | undefined): boolean {
  const mobile = settings?.[MOBILE_SETTINGS_KEY]
  return typeof mobile === "object" && mobile !== null
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
  return { ...base, ...(mobile as Record<string, unknown>) }
}

/**
 * Merge an editor patch into settings, routed by the active device.
 * - desktop: patch merges into the base.
 * - mobile: LAYOUT keys go into `settings.mobile` (seeded from the base's layout
 *   on first write); content keys still merge into the base (shared).
 */
export function applyDevicePatch(
  current: Record<string, unknown>,
  patch: Record<string, unknown>,
  device: DeviceMode,
): Record<string, unknown> {
  if (device === "desktop") return { ...current, ...patch }

  const basePatch: Record<string, unknown> = {}
  const mobilePatch: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(patch)) {
    if (DEVICE_LAYOUT_KEYS.has(key)) mobilePatch[key] = value
    else basePatch[key] = value
  }

  const { [MOBILE_SETTINGS_KEY]: existing, ...baseNoMobile } = current
  const next = { ...current, ...basePatch }

  if (Object.keys(mobilePatch).length === 0) return next

  let seed: Record<string, unknown>
  if (existing && typeof existing === "object") {
    seed = existing as Record<string, unknown>
  } else {
    // Seed the mobile layer with only the base's layout keys.
    seed = {}
    for (const key of DEVICE_LAYOUT_KEYS) {
      if (key in baseNoMobile) seed[key] = baseNoMobile[key]
    }
  }

  return { ...next, [MOBILE_SETTINGS_KEY]: { ...seed, ...mobilePatch } }
}
