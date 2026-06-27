import type { ThemeConfig } from "@/themes/engine/schema"

interface ContactHeaderProps {
  config?: ThemeConfig
}

export function ContactHeader({ config }: ContactHeaderProps) {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-6 pt-12">
      <h1
        className="text-5xl font-black uppercase"
        style={{ fontFamily: "var(--theme-heading-font)", color: "var(--theme-primary)" }}
      >
        CONTACT US
      </h1>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-zinc-500">
        {config?.tagline
          ? config.tagline
          : `Hubungi tim ${config?.storeName ?? "kami"}. Kami siap membantu pertanyaan dan kebutuhan Anda.`}
      </p>
    </div>
  )
}
