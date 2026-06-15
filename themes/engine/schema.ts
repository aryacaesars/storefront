import { z } from "zod"

export const templateIdSchema = z.enum(["minimalist", "bold", "fashion"])

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
})

export type TemplateId = z.infer<typeof templateIdSchema>
export type ThemeConfig = z.infer<typeof themeConfigSchema>
export type HeroConfig = z.infer<typeof heroConfigSchema>
