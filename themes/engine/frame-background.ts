import type { CSSProperties } from "react"

/**
 * Background custom frame/card hero — settings di block `hero-media`:
 * - `frameBgColor`  : warna solid / warna awal gradient
 * - `frameBgMode`   : "solid" (default) | "gradient"
 * - `frameBgColor2` : warna akhir gradient
 * - `frameBgAngle`  : arah gradient dalam derajat (default 180 = atas → bawah)
 *
 * Return null bila belum di-set → tema pakai background default-nya.
 * Inline style ini menang atas class gradient bawaan tema.
 */
export function parseFrameBackground(
  settings: Record<string, unknown> | undefined,
): CSSProperties | null {
  const color =
    typeof settings?.frameBgColor === "string" && settings.frameBgColor
      ? settings.frameBgColor
      : null
  if (!color) return null

  if (settings?.frameBgMode === "gradient") {
    const color2 =
      typeof settings?.frameBgColor2 === "string" && settings.frameBgColor2
        ? settings.frameBgColor2
        : color
    const angle = Number(settings?.frameBgAngle)
    const deg = Number.isFinite(angle) ? angle : 180
    return { backgroundImage: `linear-gradient(${deg}deg, ${color}, ${color2})` }
  }

  return { backgroundColor: color, backgroundImage: "none" }
}
