export function LoadMoreSection() {
  return (
    <div className="mt-12 flex flex-col items-center gap-6">
      <div className="text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
          DISPLAYING 6 OF 42 ITEMS
        </p>
        <div
          className="mx-auto mt-2 h-0.5 w-8"
          style={{ backgroundColor: "var(--theme-accent)" }}
        />
      </div>

      <button
        type="button"
        className="h-12 w-full max-w-xs border border-zinc-900 px-16 text-xs font-black uppercase tracking-[0.2em] text-zinc-900 transition-colors hover:bg-zinc-900 hover:text-white"
      >
        LOAD MORE PRODUCTS
      </button>
    </div>
  )
}
