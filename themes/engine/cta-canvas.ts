/**
 * Seed CTA section teks/tombol ke model canvas (`texts[]` / `buttons[]`).
 *
 * Section CTA lama menyimpan konten di `section.settings` (title/subtitle/
 * primaryLabel/…) dan dirender sebagai flow markup. Sekarang dirender lewat
 * `CanvasFreeTextLayer` + `CanvasBoundButton`; resolver di sini membaca
 * fallback dari `section.settings` SEKALI — selama block belum pernah menulis
 * key `texts`/`buttons`, seed virtual dibuat dari settings + default posisi.
 * Begitu ada tulisan pertama (drag/edit/tambah/hapus), array di block jadi
 * source of truth dan seed tidak dibuat ulang (hapus item seeded tidak
 * "bangkit" lagi).
 *
 * Dipakai oleh renderer tema, BuilderTextToolPanel, BuilderLayersPanel, dan
 * CanvasElementToolbar supaya keempatnya melihat daftar item yang sama.
 */

import type { TemplateId } from "@/themes/engine/schema"
import { parseCanvasTexts, type CanvasTextItem } from "@/themes/engine/canvas-text"
import {
  parseCanvasButtons,
  type CanvasButtonItem,
} from "@/themes/engine/canvas-button"

export type CtaTextSeed = {
  id: string
  /** Key di section.settings yang menyimpan nilai legacy. */
  settingsKey: string
  fallback: string
} & Omit<Partial<CanvasTextItem>, "id" | "value">

export type CtaButtonSeed = {
  id: string
  settingsKey: string
  fallback: string
} & Omit<Partial<CanvasButtonItem>, "id" | "label">

export type CtaCanvasSpec = {
  /** Design frame (px) — section render pakai aspect-ratio width/height. */
  frame: { width: number; height: number }
  texts: CtaTextSeed[]
  buttons: CtaButtonSeed[]
}

const BENTO_CTA_SPEC: CtaCanvasSpec = {
  frame: { width: 1200, height: 360 },
  texts: [
    {
      id: "cta-title",
      settingsKey: "title",
      fallback: "Grab It Fast And Claim 10% Discount",
      x: 52,
      y: 22,
      width: 42,
      fontSize: 44,
      color: "#ffffff",
      fontWeight: 700,
      lineHeight: 1.2,
    },
  ],
  buttons: [
    {
      id: "cta-primary",
      settingsKey: "primaryLabel",
      fallback: "Buy Now",
      xPct: 74,
      yPx: 240,
      wPct: 20,
      hPx: 56,
      bgColor: "#ffffff",
      textColor: "#b40000",
      variant: "filled",
      shape: "rounded",
    },
  ],
}

const MINIMALIST_CTA_SPEC: CtaCanvasSpec = {
  frame: { width: 1200, height: 480 },
  texts: [
    {
      id: "cta-title",
      settingsKey: "title",
      fallback: "Experience the Art of Less",
      x: 15,
      y: 28,
      width: 70,
      fontSize: 48,
      color: "#ffffff",
      fontWeight: 600,
      lineHeight: 1.2,
    },
  ],
  buttons: [
    {
      id: "cta-primary",
      settingsKey: "primaryLabel",
      fallback: "Explore Collections",
      xPct: 27,
      yPx: 310,
      wPct: 21,
      hPx: 44,
      textColor: "#ffffff",
      variant: "outline",
      shape: "square",
    },
    {
      id: "cta-secondary",
      settingsKey: "secondaryLabel",
      fallback: "Read the Journal",
      xPct: 52,
      yPx: 310,
      wPct: 21,
      hPx: 44,
      textColor: "#ffffff",
      variant: "ghost",
      shape: "square",
    },
  ],
}

const BOLD_CTA_SPEC: CtaCanvasSpec = {
  frame: { width: 1200, height: 520 },
  texts: [
    {
      id: "cta-title",
      settingsKey: "title",
      fallback: "BECOME PART OF THE MOMENTUM.",
      x: 10,
      y: 20,
      width: 80,
      fontSize: 60,
      color: "#18181b",
      fontWeight: 900,
      textTransform: "uppercase",
      lineHeight: 1.1,
    },
    {
      id: "cta-subtitle",
      settingsKey: "subtitle",
      fallback:
        "Join the elite circle of athletes and innovators redefining the boundaries of the possible.",
      x: 27,
      y: 48,
      width: 46,
      fontSize: 15,
      color: "#71717a",
      fontWeight: 400,
      lineHeight: 1.5,
    },
  ],
  buttons: [
    {
      id: "cta-primary",
      settingsKey: "primaryLabel",
      fallback: "SHOP THE SERIES",
      xPct: 38,
      yPx: 360,
      wPct: 24,
      hPx: 48,
      bgColor: "var(--theme-accent)",
      textColor: "#18181b",
      variant: "filled",
      shape: "square",
    },
  ],
}

const FASHION_NEWSLETTER_SPEC: CtaCanvasSpec = {
  frame: { width: 1200, height: 420 },
  texts: [
    {
      id: "cta-title",
      settingsKey: "title",
      fallback: "Join Our World",
      x: 30,
      y: 22,
      width: 40,
      fontSize: 30,
      color: "#ffffff",
      fontWeight: 500,
      lineHeight: 1.25,
    },
    {
      id: "cta-subtitle",
      settingsKey: "subtitle",
      fallback:
        "Sign up for early access to new collections and curated brand stories.",
      x: 30,
      y: 40,
      width: 40,
      fontSize: 14,
      color: "#ffffff",
      opacity: 50,
      fontWeight: 400,
      lineHeight: 1.5,
    },
  ],
  // Tombol subscribe tetap menempel di form email (flow), tidak jadi canvas item.
  buttons: [],
}

const CTA_SPECS: Partial<Record<TemplateId, Record<string, CtaCanvasSpec>>> = {
  bento: { "call-to-action": BENTO_CTA_SPEC },
  minimalist: { "call-to-action": MINIMALIST_CTA_SPEC },
  bold: { "call-to-action": BOLD_CTA_SPEC },
  fashion: { "newsletter-cta": FASHION_NEWSLETTER_SPEC },
}

export function getCtaCanvasSpec(
  templateId: TemplateId,
  sectionType: string | undefined,
): CtaCanvasSpec | undefined {
  if (!sectionType) return undefined
  return CTA_SPECS[templateId]?.[sectionType]
}

function settingString(
  settings: Record<string, unknown> | undefined,
  key: string,
  fallback: string,
): string {
  const value = settings?.[key]
  return typeof value === "string" && value.trim() ? value : fallback
}

/**
 * Teks canvas section — `texts[]` dari block; untuk section CTA yang belum
 * pernah menulis `texts`, seed virtual dari section.settings ditambahkan.
 */
export function resolveSectionCanvasTexts(
  templateId: TemplateId,
  sectionType: string | undefined,
  sectionSettings: Record<string, unknown> | undefined,
  blockSettings: Record<string, unknown> | undefined,
): CanvasTextItem[] {
  const parsed = parseCanvasTexts(blockSettings)
  const spec = getCtaCanvasSpec(templateId, sectionType)
  if (!spec || Array.isArray(blockSettings?.texts)) return parsed

  const seeded = spec.texts
    .filter((seed) => !parsed.some((item) => item.id === seed.id))
    .map(({ id, settingsKey, fallback, ...item }) => ({
      id,
      value: settingString(sectionSettings, settingsKey, fallback),
      x: item.x ?? 10,
      y: item.y ?? 10,
      width: item.width ?? 40,
      fontSize: item.fontSize ?? 48,
      ...item,
    }))
  return [...parsed, ...seeded]
}

/** Analog `resolveSectionCanvasTexts` untuk `buttons[]`. */
export function resolveSectionCanvasButtons(
  templateId: TemplateId,
  sectionType: string | undefined,
  sectionSettings: Record<string, unknown> | undefined,
  blockSettings: Record<string, unknown> | undefined,
): CanvasButtonItem[] {
  const parsed = parseCanvasButtons(blockSettings)
  const spec = getCtaCanvasSpec(templateId, sectionType)
  if (!spec || Array.isArray(blockSettings?.buttons)) return parsed

  const seeded = spec.buttons
    .filter((seed) => !parsed.some((item) => item.id === seed.id))
    .map(({ id, settingsKey, fallback, ...item }) => ({
      id,
      label: settingString(sectionSettings, settingsKey, fallback),
      xPct: item.xPct ?? 40,
      yPx: item.yPx ?? 40,
      wPct: item.wPct ?? 20,
      hPx: item.hPx ?? 48,
      ...item,
    }))
  return [...parsed, ...seeded]
}
