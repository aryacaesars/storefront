import type { ThemeConfig } from "./schema"
import { getThemePalette } from "./theme-palette"
import { DeviceProvider } from "./device-context"
import type { DeviceMode } from "./device-settings"

interface ThemeProviderProps {
  config: ThemeConfig
  children: React.ReactNode
  /** Editor preview forces desktop/mobile; live storefront omits this and uses the viewport. */
  forcedDevice?: DeviceMode
}

export function ThemeProvider({ config, children, forcedDevice }: ThemeProviderProps) {
  const palette = getThemePalette(config.templateId)

  return (
    <div
      // `@container`: section theme pakai container query (@2xl:/@3xl:/@5xl:),
      // bukan media query, supaya preview builder (frame 375px) ikut responsif.
      className="@container min-h-full bg-[var(--theme-bg)] text-[var(--theme-text)]"
      style={
        {
          "--theme-primary": config.primaryColor,
          "--theme-accent": config.accentColor ?? "#EDEAF5",
          "--theme-bg": palette.bg,
          "--theme-text": palette.text,
          "--theme-muted": palette.muted,
          "--theme-heading-font": config.headingFont,
          "--theme-body-font": config.bodyFont,
        } as React.CSSProperties
      }
    >
      <DeviceProvider forcedDevice={forcedDevice}>{children}</DeviceProvider>
    </div>
  )
}
