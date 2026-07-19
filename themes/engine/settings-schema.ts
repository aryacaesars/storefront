export type SettingScope = "config" | "hero"

export type SettingFieldType =
  | "text"
  | "textarea"
  | "color"
  | "image"
  | "segmented"
  | "font-heading"
  | "font-body"
  | "slider"

export interface SegmentedOption {
  value: string
  label: string
}

export interface SettingFieldDef {
  id: string
  scope: SettingScope
  type: SettingFieldType
  label: string
  hint?: string
  placeholder?: string
  rows?: number
  options?: SegmentedOption[]
  /** For type "slider". */
  min?: number
  max?: number
  step?: number
  /** Value used when the field is unset. */
  defaultValue?: number
  /** Suffix shown next to the current value, e.g. "%". */
  unit?: string
}

export interface SettingsGroupDef {
  title: string
  description?: string
  fields: SettingFieldDef[]
}

export const THEME_SETTINGS_GROUPS: SettingsGroupDef[] = [
  {
    title: "Branding",
    description: "Logo, nama toko, dan banner pengumuman.",
    fields: [
      { id: "storeName", scope: "config", type: "text", label: "Nama Toko" },
      {
        id: "tagline",
        scope: "config",
        type: "text",
        label: "Tagline",
        hint: "Teks pendukung di footer storefront.",
      },
      {
        id: "bannerText",
        scope: "config",
        type: "textarea",
        label: "Banner Pengumuman",
        hint: "Teks bar di bagian atas storefront.",
        rows: 2,
      },
      {
        id: "logoUrl",
        scope: "config",
        type: "image",
        label: "Logo Toko",
        hint: "PNG, SVG, atau WebP. Maks. 2MB.",
        placeholder: "Upload Logo",
      },
      {
        id: "logoDisplay",
        scope: "config",
        type: "segmented",
        label: "Tampilan Brand",
        hint: "Yang ditampilkan di header. Tanpa logo, nama toko selalu dipakai.",
        options: [
          { value: "logo", label: "Logo" },
          { value: "text", label: "Teks" },
          { value: "both", label: "Keduanya" },
        ],
      },
      {
        id: "logoScale",
        scope: "config",
        type: "slider",
        label: "Skala Logo",
        hint: "Perbesar atau perkecil logo di header & footer.",
        min: 50,
        max: 200,
        step: 5,
        defaultValue: 100,
        unit: "%",
      },
    ],
  },
  {
    title: "Warna & Tipografi",
    fields: [
      { id: "primaryColor", scope: "config", type: "color", label: "Warna Utama" },
      { id: "headingFont", scope: "config", type: "font-heading", label: "Heading" },
      { id: "bodyFont", scope: "config", type: "font-body", label: "Body" },
    ],
  },
]

/** Shown in section inspector when the hero section is selected. */
export const HERO_SECTION_SETTINGS_GROUPS: SettingsGroupDef[] = [
  {
    title: "Gambar Hero",
    fields: [
      {
        id: "heroImageUrl",
        scope: "config",
        type: "image",
        label: "Gambar Latar",
        hint: "Banner besar di halaman utama. Maks. 2MB.",
        placeholder: "Upload Gambar Hero",
      },
    ],
  },
  {
    title: "Teks & Tombol",
    description: "Judul, posisi, dan gaya teks di banner utama.",
    fields: [
      {
        id: "title",
        scope: "hero",
        type: "textarea",
        label: "Judul",
        rows: 2,
        placeholder: "Quiet Luxury for the Modern Individual",
      },
      {
        id: "subtitle",
        scope: "hero",
        type: "textarea",
        label: "Subjudul",
        rows: 3,
        placeholder: "Curated essentials designed with intention…",
      },
      {
        id: "align",
        scope: "hero",
        type: "segmented",
        label: "Posisi Teks",
        options: [
          { value: "left", label: "Kiri" },
          { value: "center", label: "Tengah" },
        ],
      },
      {
        id: "textTone",
        scope: "hero",
        type: "segmented",
        label: "Warna Teks",
        hint: "Terang untuk foto gelap, gelap untuk foto terang.",
        options: [
          { value: "dark", label: "Gelap" },
          { value: "light", label: "Terang" },
        ],
      },
      {
        id: "titleSize",
        scope: "hero",
        type: "segmented",
        label: "Ukuran Judul",
        options: [
          { value: "sm", label: "S" },
          { value: "md", label: "M" },
          { value: "lg", label: "L" },
        ],
      },
      {
        id: "ctaLabel",
        scope: "hero",
        type: "text",
        label: "Teks Tombol",
        placeholder: "Shop Collection",
      },
    ],
  },
]

/** Full settings list (theme + hero) for backward compatibility. */
export const GLOBAL_SETTINGS_GROUPS: SettingsGroupDef[] = [
  {
    title: "Branding",
    description: "Perubahan langsung terlihat di preview theme.",
    fields: [
      ...THEME_SETTINGS_GROUPS[0].fields,
      HERO_SECTION_SETTINGS_GROUPS[0].fields[0],
    ],
  },
  ...HERO_SECTION_SETTINGS_GROUPS.slice(1),
  THEME_SETTINGS_GROUPS[1],
]
