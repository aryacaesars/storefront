import type { TemplateId } from "@/themes/engine/schema"
import type { SectionSettingField } from "@/themes/engine/section-settings-schema"
import {
  defaultHeroTitle1Layout,
  defaultHeroTitle2Layout,
  heroTitleLayoutsToPatch,
} from "@/themes/bento/sections/hero-title-layout"

const DEFAULT_HERO_TITLE_LAYOUTS = heroTitleLayoutsToPatch(
  defaultHeroTitle1Layout(false),
  defaultHeroTitle2Layout(false),
)

export type BlockDefinition = {
  type: string
  label: string
  defaultSettings: Record<string, unknown>
  fields: SectionSettingField[]
}

const BENTO_CATEGORY_BLOCK: BlockDefinition = {
  type: "category-card",
  label: "Kartu Kategori",
  defaultSettings: {
    label: "Category",
    slug: "category",
    imageClass: "bg-gray-400",
    imageUrl: "",
    imgScale: 100,
    imgX: 0,
    imgY: 0,
    labelLayer: "front",
    labelScale: 100,
  },
  fields: [
    { key: "label", label: "Judul", type: "text", placeholder: "Fill It With NEO" },
    { key: "slug", label: "Slug", type: "text", placeholder: "tablets" },
    {
      key: "imageUrl",
      label: "Gambar",
      type: "image",
      placeholder: "Upload Gambar Kategori",
    },
  ],
}

const MINIMALIST_BLOCK_DEFS: Record<string, Record<string, BlockDefinition>> = {
  "category-grid": {
    "category-card": {
      type: "category-card",
      label: "Category Card",
      defaultSettings: {
        label: "Category",
        slug: "new-category",
        imageClass: "bg-gradient-to-br from-stone-400 to-stone-600",
        large: false,
      },
      fields: [
        { key: "label", label: "Label", type: "text", placeholder: "Ready to Wear" },
        { key: "slug", label: "Slug", type: "text", placeholder: "ready-to-wear" },
      ],
    },
  },
}

const BENTO_CTA_IMAGE_BLOCK: BlockDefinition = {
  type: "cta-image",
  label: "Gambar CTA",
  defaultSettings: {
    imageUrl: "",
    imgScale: 100,
    imgX: 0,
    imgY: 0,
  },
  fields: [
    {
      key: "imageUrl",
      label: "Gambar",
      type: "image",
      placeholder: "Upload Gambar CTA",
    },
  ],
}

const BENTO_HERO_CTA_BLOCK: BlockDefinition = {
  type: "hero-cta",
  label: "Tombol CTA",
  defaultSettings: {
    label: "Get Yours Now!",
    xPct: 70,
    wPct: 24,
    yPx: 459,
    hPx: 56,
    ctaBgColor: "#ffffff",
    ctaTextColor: "",
  },
  fields: [
    { key: "label", label: "Teks Tombol", type: "text", placeholder: "Get Yours Now!" },
    { key: "ctaBgColor", label: "Warna Latar", type: "color" },
    { key: "ctaTextColor", label: "Warna Teks", type: "color" },
  ],
}

const BENTO_HERO_BLOCK: BlockDefinition = {
  type: "hero-media",
  label: "Gambar Hero",
  defaultSettings: {
    imageUrl: "",
    imgScale: 45,
    imgX: 0,
    imgY: 0,
    title1Layer: "front",
    title2Layer: "front",
    ...DEFAULT_HERO_TITLE_LAYOUTS,
  },
  fields: [
    {
      key: "imageUrl",
      label: "Gambar Hero",
      type: "image",
      placeholder: "Upload Gambar Hero",
    },
  ],
}

const BENTO_BLOCK_DEFS: Record<string, Record<string, BlockDefinition>> = {
  hero: {
    "hero-media": BENTO_HERO_BLOCK,
    "hero-cta": BENTO_HERO_CTA_BLOCK,
  },
  "category-grid": {
    "category-card": BENTO_CATEGORY_BLOCK,
  },
  "call-to-action": {
    "cta-image": BENTO_CTA_IMAGE_BLOCK,
  },
}

const BLOCK_DEFS_BY_TEMPLATE: Partial<
  Record<TemplateId, Record<string, Record<string, BlockDefinition>>>
> = {
  minimalist: MINIMALIST_BLOCK_DEFS,
  bento: BENTO_BLOCK_DEFS,
}

export function getBlockDefinitions(
  templateId: TemplateId,
  sectionType: string,
): Record<string, BlockDefinition> {
  return BLOCK_DEFS_BY_TEMPLATE[templateId]?.[sectionType] ?? {}
}

export function getBlockDefinition(
  templateId: TemplateId,
  sectionType: string,
  blockType: string,
): BlockDefinition | undefined {
  return getBlockDefinitions(templateId, sectionType)[blockType]
}

export function sectionHasBlocks(
  templateId: TemplateId,
  sectionType: string,
): boolean {
  return Object.keys(getBlockDefinitions(templateId, sectionType)).length > 0
}
