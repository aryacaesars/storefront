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
    cardBgColor: "#9ca3af",
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
      key: "cardBgColor",
      label: "Warna Kartu",
      type: "color",
      hint: "Latar belakang kartu — tampil di balik gambar PNG transparan.",
    },
    {
      key: "imageUrl",
      label: "Gambar",
      type: "image",
      placeholder: "Upload Gambar Kategori",
    },
  ],
}

/** Host block CTA tanpa gambar — menampung canvas `texts[]`/`buttons[]`. */
const CTA_CONTENT_BLOCK: BlockDefinition = {
  type: "cta-content",
  label: "Konten CTA",
  defaultSettings: {},
  fields: [],
}

const CTA_IMAGE_BLOCK: BlockDefinition = {
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

const MINIMALIST_HERO_MEDIA_BLOCK: BlockDefinition = {
  type: "hero-media",
  label: "Gambar Hero",
  defaultSettings: {
    imageUrl: "",
    imgScale: 100,
    imgX: 0,
    imgY: 0,
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

const MINIMALIST_HERO_CTA_BLOCK: BlockDefinition = {
  type: "hero-cta",
  label: "Tombol CTA",
  defaultSettings: {
    label: "Shop Collection",
    ctaBgColor: "",
    ctaTextColor: "#ffffff",
  },
  fields: [
    { key: "label", label: "Teks Tombol", type: "text", placeholder: "Shop Collection" },
    { key: "ctaBgColor", label: "Warna Latar", type: "color" },
    { key: "ctaTextColor", label: "Warna Teks", type: "color" },
  ],
}

const MINIMALIST_IMAGE_LAYER_BLOCK: BlockDefinition = {
  type: "image-layer",
  label: "Gambar",
  defaultSettings: {
    imageUrl: "",
    xPct: 5,
    yPx: 20,
    wPct: 42,
    hPx: 380,
    imgScale: 100,
    imgX: 0,
    imgY: 0,
    imgRotation: 0,
    imgSliderScale: 1,
  },
  fields: [
    {
      key: "imageUrl",
      label: "Gambar",
      type: "image",
      placeholder: "Upload Gambar",
    },
  ],
}

const MINIMALIST_BLOCK_DEFS: Record<string, Record<string, BlockDefinition>> = {
  hero: {
    "hero-media": MINIMALIST_HERO_MEDIA_BLOCK,
    "hero-cta": MINIMALIST_HERO_CTA_BLOCK,
  },
  "image-layers": {
    "image-layer": MINIMALIST_IMAGE_LAYER_BLOCK,
  },
  "category-grid": {
    "category-card": {
      type: "category-card",
      label: "Kartu Kategori",
      defaultSettings: {
        label: "Category",
        slug: "new-category",
        cardBgColor: "#d6d3d1",
        imageUrl: "",
        imgScale: 100,
        imgX: 0,
        imgY: 0,
      },
      fields: [
        { key: "label", label: "Judul", type: "text", placeholder: "Ready to Wear" },
        { key: "slug", label: "Slug", type: "text", placeholder: "ready-to-wear" },
        {
          key: "cardBgColor",
          label: "Warna Kartu",
          type: "color",
          hint: "Latar belakang kartu — tampil di balik gambar PNG transparan.",
        },
        {
          key: "imageUrl",
          label: "Gambar",
          type: "image",
          placeholder: "Upload Gambar Kategori",
        },
      ],
    },
  },
  "call-to-action": {
    "cta-image": CTA_IMAGE_BLOCK,
  },
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
    "cta-image": CTA_IMAGE_BLOCK,
  },
}

const FASHION_HERO_MEDIA_BLOCK: BlockDefinition = {
  type: "hero-media",
  label: "Gambar Hero",
  defaultSettings: { imageUrl: "", imgScale: 100, imgX: 0, imgY: 0 },
  fields: [
    {
      key: "imageUrl",
      label: "Gambar Hero",
      type: "image",
      placeholder: "Upload Gambar Hero",
    },
  ],
}

const FASHION_HERO_CTA_BLOCK: BlockDefinition = {
  type: "hero-cta",
  label: "Tombol CTA",
  defaultSettings: { label: "EXPLORE COLLECTION", ctaBgColor: "", ctaTextColor: "#ffffff" },
  fields: [
    { key: "label", label: "Teks Tombol", type: "text", placeholder: "EXPLORE COLLECTION" },
    { key: "ctaBgColor", label: "Warna Latar", type: "color" },
    { key: "ctaTextColor", label: "Warna Teks", type: "color" },
  ],
}

const FASHION_BLOCK_DEFS: Record<string, Record<string, BlockDefinition>> = {
  hero: {
    "hero-media": FASHION_HERO_MEDIA_BLOCK,
    "hero-cta": FASHION_HERO_CTA_BLOCK,
  },
  "newsletter-cta": {
    "cta-content": CTA_CONTENT_BLOCK,
  },
  "category-cards": {
    "category-card": {
      type: "category-card",
      label: "Kartu Kategori",
      defaultSettings: {
        label: "New Category",
        slug: "category",
        cta: "SHOP NOW",
        cardBgColor: "#d6d1c9",
        imageUrl: "",
        imgScale: 100,
        imgX: 0,
        imgY: 0,
      },
      fields: [
        { key: "label", label: "Judul", type: "text", placeholder: "New Collection" },
        { key: "slug", label: "Slug", type: "text", placeholder: "new-collection" },
        { key: "cta", label: "Teks CTA", type: "text", placeholder: "SHOP NOW" },
        {
          key: "cardBgColor",
          label: "Warna Kartu",
          type: "color",
          hint: "Latar belakang kartu — tampil di balik gambar PNG transparan.",
        },
        {
          key: "imageUrl",
          label: "Gambar",
          type: "image",
          placeholder: "Upload Gambar Kategori",
        },
      ],
    },
  },
}

const BOLD_HERO_CTA_BLOCK: BlockDefinition = {
  type: "hero-cta",
  label: "Tombol CTA",
  defaultSettings: {
    label: "SHOP NOW",
    xPct: 5,
    wPct: 22,
    yPx: 430,
    hPx: 48,
    ctaBgColor: "transparent",
    ctaTextColor: "#ffffff",
    ctaVariant: "outline",
  },
  fields: [
    { key: "label", label: "Teks Tombol", type: "text", placeholder: "SHOP NOW" },
    { key: "ctaBgColor", label: "Warna Latar", type: "color" },
    { key: "ctaTextColor", label: "Warna Teks", type: "color" },
  ],
}

const BOLD_BLOCK_DEFS: Record<string, Record<string, BlockDefinition>> = {
  hero: {
    "hero-media": {
      type: "hero-media",
      label: "Gambar Hero",
      defaultSettings: {
        imageUrl: "/themes/bold/hero-athlete.png",
        imgScale: 100,
        imgX: 0,
        imgY: 0,
      },
      fields: [
        {
          key: "imageUrl",
          label: "Gambar Hero",
          type: "image",
          placeholder: "Upload Gambar Hero",
        },
      ],
    },
    "hero-cta": BOLD_HERO_CTA_BLOCK,
  },
  "call-to-action": {
    "cta-content": CTA_CONTENT_BLOCK,
  },
  "category-grid": {
    "category-card": {
      type: "category-card",
      label: "Kartu Kategori",
      defaultSettings: {
        label: "Category",
        slug: "category",
        cardBgColor: "#18181b",
        imageUrl: "",
        imgScale: 100,
        imgX: 0,
        imgY: 0,
        labelLayer: "front",
        labelScale: 100,
      },
      fields: [
        { key: "label", label: "Judul", type: "text", placeholder: "Performance" },
        { key: "slug", label: "Slug", type: "text", placeholder: "performance" },
        {
          key: "cardBgColor",
          label: "Warna Kartu",
          type: "color",
          hint: "Latar belakang kartu.",
        },
        {
          key: "imageUrl",
          label: "Gambar",
          type: "image",
          placeholder: "Upload Gambar Kategori",
        },
      ],
    },
  },
}

const BLOCK_DEFS_BY_TEMPLATE: Partial<
  Record<TemplateId, Record<string, Record<string, BlockDefinition>>>
> = {
  minimalist: MINIMALIST_BLOCK_DEFS,
  bento: BENTO_BLOCK_DEFS,
  fashion: FASHION_BLOCK_DEFS,
  bold: BOLD_BLOCK_DEFS,
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
