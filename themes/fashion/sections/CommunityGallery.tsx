import { COMMUNITY_IMAGES } from "@/themes/fashion/data/mock"
import type { SectionProps } from "@/themes/engine/section-registry"
import {
  CanvasSectionText,
  findSectionTextBlock,
} from "@/features/builder/components/canvas/CanvasSectionText"

export function CommunityGallery({ blocks, canvas }: SectionProps) {
  return (
    <section className="bg-[var(--theme-bg)] py-12">
      <div className="mb-8 text-center">
        <CanvasSectionText
          canvas={canvas}
          block={findSectionTextBlock(blocks, "fashion-community-eyebrow")}
          fallback="COMMUNITY"
          basePx={10}
          className="tracking-[0.2em] uppercase text-[var(--theme-muted)]"
        />
        <CanvasSectionText
          canvas={canvas}
          block={findSectionTextBlock(blocks, "fashion-community-title")}
          fallback="#LunaInMotion"
          basePx={30}
          as="h2"
          className="mt-2 font-normal italic text-[var(--theme-text)]"
          baseStyle={{ fontFamily: "var(--theme-heading-font)" }}
        />
      </div>

      <div className="flex overflow-hidden">
        {COMMUNITY_IMAGES.map((img, i) => (
          <div key={i} className="min-w-0 flex-1">
            <div className={`relative aspect-square ${img.imageClass}`}>
              {img.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={img.imageUrl}
                  alt={img.alt}
                  className="h-full w-full object-cover"
                />
              )}
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
