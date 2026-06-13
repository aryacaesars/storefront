import { COMMUNITY_IMAGES } from "@/themes/fashion/data/mock"

export function CommunityGallery() {
  return (
    <section className="bg-[var(--theme-bg)] py-12">
      <div className="mb-8 text-center">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--theme-muted)]">
          COMMUNITY
        </p>
        <h2
          className="mt-2 text-3xl font-normal italic text-[var(--theme-text)]"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          #LunaInMotion
        </h2>
      </div>

      <div className="flex overflow-hidden">
        {COMMUNITY_IMAGES.map((img, i) => (
          <div key={i} className="min-w-0 flex-1">
            <div className={`relative aspect-square ${img.imageClass}`}>
              {i === 5 && (
                <div className="absolute inset-0 bg-[var(--theme-text)]/40" />
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
