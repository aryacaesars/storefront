import Link from "next/link"
import type { ThemeConfig } from "@/themes/engine/schema"

interface FooterProps {
  config: ThemeConfig
}

export function Footer({ config }: FooterProps) {
  const logoDisplay = config.logoDisplay ?? "logo"
  const showLogo = logoDisplay !== "text" && Boolean(config.logoUrl)
  const showText = logoDisplay === "text" || logoDisplay === "both" || !config.logoUrl

  return (
    <footer className="px-4 pb-10 pt-6 @2xl:px-6">
      <div className="mx-auto max-w-7xl rounded-[27px] bg-white p-8 shadow-[0px_0px_19px_rgba(0,0,0,0.15)] @2xl:p-12">
        <div className="grid gap-10 @2xl:grid-cols-2 @3xl:grid-cols-4">
          <div>
            <p
              className="flex items-center gap-2 text-base font-bold text-[#1a1c1b]"
              style={{ fontFamily: "var(--theme-heading-font)" }}
            >
              {showLogo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={config.logoUrl}
                  alt={showText ? "" : config.storeName}
                  className="h-6 w-auto max-w-[32px] object-contain"
                />
              )}
              {showText && config.storeName}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#515160]">
              {config.tagline ?? "Bold products. Bolder design."}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--theme-primary)]">
              Shop
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[#515160]">
              {["All Products", "New Arrivals", "Best Sellers"].map((item) => (
                <li key={item}>
                  <Link href="/products" className="transition-colors hover:text-[var(--theme-primary)]">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--theme-primary)]">
              Company
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[#515160]">
              {[
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Careers", href: "#" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="transition-colors hover:text-[var(--theme-primary)]">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--theme-primary)]">
              Support
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[#515160]">
              {["Shipping", "Returns", "FAQ"].map((item) => (
                <li key={item}>
                  <span className="cursor-default">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-6 text-xs text-[#515160] @2xl:flex-row">
          <p>© {new Date().getFullYear()} {config.storeName}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="transition-colors hover:text-[var(--theme-primary)]">Privacy</Link>
            <Link href="#" className="transition-colors hover:text-[var(--theme-primary)]">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
