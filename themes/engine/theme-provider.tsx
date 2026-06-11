import type { ThemeConfig } from "./schema"

interface ThemeProviderProps {
  config: ThemeConfig
  children: React.ReactNode
}

export function ThemeProvider({ config, children }: ThemeProviderProps) {
  return (
    <div
      className="min-h-full bg-[var(--theme-bg)] text-[var(--theme-text)]"
      style={
        {
          "--theme-primary": config.primaryColor,
          "--theme-accent": config.accentColor ?? "#EDEAF5",
          "--theme-bg": "#F9F9FB",
          "--theme-text": "#1A2B3C",
          "--theme-muted": "#64748B",
          "--theme-heading-font": config.headingFont,
          "--theme-body-font": config.bodyFont,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  )
}
