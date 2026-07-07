export function AboutFooter() {
  return (
    <footer className="border-t border-white/10 bg-[var(--theme-text)]">
      <div className="mx-auto max-w-7xl px-6 pb-6 pt-12">
        <div>
          <p
            className="mb-3 text-2xl font-medium text-white"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            Luna Soft
          </p>
          <p className="max-w-[190px] text-xs leading-relaxed text-white/40">
            Curating a life of quiet luxury and intentional design since 2024.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 mt-10 py-5">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-[10px] text-white/30">© 2024 Luna Soft. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
