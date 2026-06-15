export function ContactFooter() {
  return (
    <footer className="border-t border-stone-200 bg-[var(--theme-bg)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-4">
        <div>
          <p
            className="mb-3 text-2xl font-medium text-[var(--theme-text)]"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            Luna Soft
          </p>
          <p className="max-w-[190px] text-xs leading-relaxed text-[var(--theme-muted)]">
            Elevating the everyday through conscious design and impeccable craftsmanship.
          </p>
        </div>

        <div>
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--theme-text)]">
            COLLECTION
          </p>
          {["New Arrivals", "Essential Knits", "Archival"].map((item) => (
            <a
              key={item}
              href="#"
              className="mb-2.5 block text-xs text-[var(--theme-muted)] transition-colors hover:text-[var(--theme-text)]"
            >
              {item}
            </a>
          ))}
        </div>

        <div>
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--theme-text)]">
            COMPANY
          </p>
          {["Journal", "Sustainability", "About"].map((item) => (
            <a
              key={item}
              href="#"
              className="mb-2.5 block text-xs text-[var(--theme-muted)] transition-colors hover:text-[var(--theme-text)]"
            >
              {item}
            </a>
          ))}
        </div>

        <div>
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--theme-text)]">
            LEGAL
          </p>
          {["Privacy Policy", "Terms of Service", "Shipping & Returns"].map((item) => (
            <a
              key={item}
              href="#"
              className="mb-2.5 block text-xs text-[var(--theme-muted)] transition-colors hover:text-[var(--theme-text)]"
            >
              {item}
            </a>
          ))}
        </div>
      </div>

      <div className="border-t border-stone-200 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <p className="text-[10px] text-[var(--theme-muted)]">
            © 2024 Luna Soft. All rights reserved.
          </p>
          <p className="text-[10px] text-[var(--theme-muted)]">Global / USD</p>
        </div>
      </div>
    </footer>
  )
}
