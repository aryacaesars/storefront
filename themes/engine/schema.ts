import { z } from "zod"

export const templateIdSchema = z.enum(["minimalist", "bold", "fashion", "bento"])

/**
 * Pengaturan hero berbasis preset (bukan free-form) supaya semua kombinasi
 * tetap terjaga desainnya. Semua optional + default — config lama tetap valid.
 */
export const heroConfigSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  align: z.enum(["left", "center"]).default("center"),
  textTone: z.enum(["dark", "light"]).default("dark"),
  titleSize: z.enum(["sm", "md", "lg"]).default("md"),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
})

/** Page types that support JSON-driven section layouts (Phase 3+). */
export const sectionPageTypeSchema = z.enum(["home", "about"])

export const blockInstanceSchema = z.object({
  id: z.string(),
  type: z.string(),
  settings: z.record(z.string(), z.unknown()).optional(),
})

export const sectionInstanceSchema = z.object({
  type: z.string(),
  disabled: z.boolean().optional(),
  settings: z.record(z.string(), z.unknown()).optional(),
  blocks: z.array(blockInstanceSchema).optional(),
})

export const pageTemplateSchema = z.object({
  order: z.array(z.string()),
  sections: z.record(z.string(), sectionInstanceSchema),
})

export const themeTemplatesSchema = z
  .object({
    home: pageTemplateSchema.optional(),
    about: pageTemplateSchema.optional(),
  })
  .optional()

export const themeConfigSchema = z.object({
  templateId: templateIdSchema,
  storeName: z.string().min(1),
  tagline: z.string().optional(),
  primaryColor: z.string(),
  accentColor: z.string().optional(),
  headingFont: z.string(),
  bodyFont: z.string(),
  bannerText: z.string(),
  logoUrl: z.string().optional(),
  /** Tampilan brand di header: gambar logo, teks nama toko, atau keduanya. */
  logoDisplay: z.enum(["logo", "text", "both"]).optional(),
  heroImageUrl: z.string().optional(),
  hero: heroConfigSchema.optional(),
  /** Per-page section layouts; omitted configs fall back to theme defaults. */
  templates: themeTemplatesSchema,
})

export type TemplateId = z.infer<typeof templateIdSchema>
export type ThemeConfig = z.infer<typeof themeConfigSchema>
export type HeroConfig = z.infer<typeof heroConfigSchema>
export type SectionPageType = z.infer<typeof sectionPageTypeSchema>
export type BlockInstance = z.infer<typeof blockInstanceSchema>
export type SectionInstance = z.infer<typeof sectionInstanceSchema>
export type PageTemplate = z.infer<typeof pageTemplateSchema>
export type ThemeTemplates = z.infer<typeof themeTemplatesSchema>
