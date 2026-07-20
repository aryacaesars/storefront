import type { ThemeConfig } from "./schema"
import { getThemePalette } from "./theme-palette"
import { DeviceProvider } from "./device-context"
import type { DeviceMode } from "./device-settings"

interface ThemeProviderProps {
  config: ThemeConfig
  children: React.ReactNode
  /** Editor preview forces desktop/mobile; live storefront omits this and uses the viewport. */
  forcedDevice?: DeviceMode
  /** false = tanpa min-h-full / bg surface (thumbnail kartu). */
  surface?: boolean
  /**
   * Kunci lebar `@container` (px). Dipakai thumbnail kartu supaya `@2xl:` dll.
   * selalu resolve ke desktop, tidak ikut sempitnya card di mobile viewport.
   */
  containerWidth?: number
}

export function ThemeProvider({
  config,
  children,
  forcedDevice,
  surface = true,
  containerWidth,
}: ThemeProviderProps) {
  const palette = getThemePalette(config.templateId)

  return (
    <div
      // `@container`: section theme pakai container query (@2xl:/@3xl:/@5xl:),
      // bukan media query, supaya preview builder (frame 375px) ikut responsif.
      className={
        surface
          ? "@container flex min-h-full flex-1 flex-col bg-[var(--theme-bg)] text-[var(--theme-text)]"
          : "@container block text-[var(--theme-text)]"
      }
      style={
        {
          "--theme-primary": config.primaryColor,
          "--theme-accent": config.accentColor ?? "#EDEAF5",
          "--theme-bg": palette.bg,
          "--theme-text": palette.text,
          "--theme-muted": palette.muted,
          "--theme-heading-font": config.headingFont,
          "--theme-body-font": config.bodyFont,
          ...(containerWidth
            ? {
                width: containerWidth,
                minWidth: containerWidth,
                maxWidth: containerWidth,
              }
            : {}),
        } as React.CSSProperties
      }
    >
      <DeviceProvider forcedDevice={forcedDevice}>{children}</DeviceProvider>
    </div>
  )
}
