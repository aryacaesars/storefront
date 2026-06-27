import type { ThemeConfig } from "@/themes/engine/schema"

interface AboutFooterProps {
  config: ThemeConfig
}

export function AboutFooter({ config }: AboutFooterProps) {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="px-6 py-12">
          <div>
            <p
              className="text-sm font-black uppercase"
              style={{ fontFamily: "var(--theme-heading-font)", color: "var(--theme-primary)" }}
            >
              {config.storeName}
            </p>
            {config.tagline && (
              <p className="mt-3 max-w-[200px] text-xs leading-relaxed text-zinc-400">
                {config.tagline}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-5">
          <p className="text-xs text-zinc-400">
            © 2024 {config.storeName.toUpperCase()}. PRECISION ENGINEERED.
          </p>
          <div className="h-5 w-5 rounded-sm border border-gray-200 bg-gray-50" />
        </div>
      </div>
    </footer>
  )
}
