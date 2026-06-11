import { z } from "zod"

export const templateIdSchema = z.enum(["minimalist", "bold", "fashion"])

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
})

export type TemplateId = z.infer<typeof templateIdSchema>
export type ThemeConfig = z.infer<typeof themeConfigSchema>
