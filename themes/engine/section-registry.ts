import type { ComponentType } from "react"
import type { BlockInstance, SectionPageType, ThemeConfig } from "@/themes/engine/schema"
import type { SectionEditorState } from "@/themes/engine/section-editor"
import { ArchitectsSection } from "@/themes/bold/sections/ArchitectsSection"
import { CallToActionSection as BoldCallToActionSection } from "@/themes/bold/sections/CallToActionSection"
import { HeroSection as BoldHeroSection } from "@/themes/bold/sections/HeroSection"
import { ImpactSection } from "@/themes/bold/sections/ImpactSection"
import { ManifestoSection } from "@/themes/bold/sections/ManifestoSection"
import { OriginSection } from "@/themes/bold/sections/OriginSection"
import { PillarsSection } from "@/themes/bold/sections/PillarsSection"
import { BrandStory } from "@/themes/fashion/sections/BrandStory"
import { CategoryCards } from "@/themes/fashion/sections/CategoryCards"
import { CommunityGallery } from "@/themes/fashion/sections/CommunityGallery"
import { Footer as FashionFooter } from "@/themes/fashion/sections/Footer"
import { HeroSection as FashionHeroSection } from "@/themes/fashion/sections/HeroSection"
import { NewsletterCTA } from "@/themes/fashion/sections/NewsletterCTA"
import { SignatureSeries } from "@/themes/fashion/sections/SignatureSeries"
import type { TemplateId } from "@/themes/engine/schema"
import { CallToActionSection as MinimalistCallToActionSection } from "@/themes/minimalist/sections/CallToActionSection"
import { CategoryGrid } from "@/themes/minimalist/sections/CategoryGrid"
import { HeroSection as MinimalistHeroSection } from "@/themes/minimalist/sections/HeroSection"
import { ImageLayers } from "@/themes/minimalist/sections/ImageLayers"
import { ProductGrid } from "@/themes/minimalist/sections/ProductGrid"
import { CallToActionSection as BentoCallToActionSection } from "@/themes/bento/sections/CallToActionSection"
import { CategoryGrid as BentoCategoryGrid } from "@/themes/bento/sections/CategoryGrid"
import { HeroSection as BentoHeroSection } from "@/themes/bento/sections/HeroSection"
import { ProductGrid as BentoProductGrid } from "@/themes/bento/sections/ProductGrid"

export type SectionCanvasContext = {
  sectionId: string
  pageType: SectionPageType
  editor: SectionEditorState
}

export type SectionProps = {
  config?: ThemeConfig
  settings?: Record<string, unknown>
  blocks?: BlockInstance[]
  canvas?: SectionCanvasContext
  /** True when rendering the mobile layer (viewport <640px or forced in preview). */
  isMobile?: boolean
}

export type SectionDefinition = {
  type: string
  label: string
  component: ComponentType<SectionProps>
}

// Sections declare varying prop shapes; registry normalizes to SectionProps at render time.
function section(component: ComponentType<SectionProps>): ComponentType<SectionProps> {
  return component
}

const MINIMALIST_SECTIONS: Record<string, SectionDefinition> = {
  hero: { type: "hero", label: "Hero", component: MinimalistHeroSection },
  "image-layers": {
    type: "image-layers",
    label: "Galeri Gambar",
    component: ImageLayers,
  },
  "category-grid": {
    type: "category-grid",
    label: "Category Grid",
    component: CategoryGrid,
  },
  "product-grid": {
    type: "product-grid",
    label: "Product Grid",
    component: section(ProductGrid as ComponentType<SectionProps>),
  },
  "call-to-action": {
    type: "call-to-action",
    label: "Call to Action",
    component: MinimalistCallToActionSection,
  },
}

const BOLD_SECTIONS: Record<string, SectionDefinition> = {
  hero: { type: "hero", label: "Hero", component: BoldHeroSection },
  origin: { type: "origin", label: "Origin", component: OriginSection },
  manifesto: {
    type: "manifesto",
    label: "Manifesto",
    component: ManifestoSection,
  },
  pillars: { type: "pillars", label: "Pillars", component: PillarsSection },
  impact: { type: "impact", label: "Impact", component: ImpactSection },
  architects: {
    type: "architects",
    label: "Architects",
    component: ArchitectsSection,
  },
  "call-to-action": {
    type: "call-to-action",
    label: "Call to Action",
    component: BoldCallToActionSection,
  },
}

const FASHION_SECTIONS: Record<string, SectionDefinition> = {
  hero: { type: "hero", label: "Hero", component: FashionHeroSection },
  "category-cards": {
    type: "category-cards",
    label: "Category Cards",
    component: CategoryCards,
  },
  "signature-series": {
    type: "signature-series",
    label: "Signature Series",
    component: SignatureSeries,
  },
  "brand-story": {
    type: "brand-story",
    label: "Brand Story",
    component: BrandStory,
  },
  "community-gallery": {
    type: "community-gallery",
    label: "Community Gallery",
    component: CommunityGallery,
  },
  "newsletter-cta": {
    type: "newsletter-cta",
    label: "Newsletter CTA",
    component: NewsletterCTA,
  },
  footer: { type: "footer", label: "Footer", component: section(FashionFooter as ComponentType<SectionProps>) },
}

const BENTO_SECTIONS: Record<string, SectionDefinition> = {
  hero: { type: "hero", label: "Hero", component: BentoHeroSection },
  "category-grid": {
    type: "category-grid",
    label: "Category Grid",
    component: BentoCategoryGrid,
  },
  "product-grid": {
    type: "product-grid",
    label: "Product Grid",
    component: section(BentoProductGrid as ComponentType<SectionProps>),
  },
  "call-to-action": {
    type: "call-to-action",
    label: "Call to Action",
    component: BentoCallToActionSection,
  },
}

const REGISTRIES: Record<TemplateId, Record<string, SectionDefinition>> = {
  minimalist: MINIMALIST_SECTIONS,
  bold: BOLD_SECTIONS,
  fashion: FASHION_SECTIONS,
  bento: BENTO_SECTIONS,
}

export function getSectionRegistry(
  templateId: TemplateId,
): Record<string, SectionDefinition> {
  return REGISTRIES[templateId] ?? {}
}

export function getSectionDefinition(
  templateId: TemplateId,
  type: string,
): SectionDefinition | undefined {
  return REGISTRIES[templateId]?.[type]
}
