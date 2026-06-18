# Handoff: Canvas-Adjustable Homepage (Bento → Theme Lain)

Dokumen ini untuk developer yang akan menerapkan pola **editable di canvas** (seperti Bento) ke homepage theme **minimalist**, **fashion**, dan **bold**.

**Referensi teknis Bento:** [`docs/CANVAS_ADJUST.md`](./CANVAS_ADJUST.md)

---

## Ringkasan

Bento sudah punya sistem customize di canvas untuk homepage:

- **Hero** — judul, gambar, CTA (posisi, ukuran, layer, warna)
- **Category Grid** — kartu free-form, label, gambar upload, warna kartu, layer judul
- **Call to Action** — gambar upload + pan/zoom

Theme lain (**minimalist**, **fashion**, **bold**) masih **static** — belum pakai `canvas`, blocks, atau handle resize di preview.

**Scope handoff fase 1:** homepage saja, per theme.

---

## Yang sudah ada (platform shared)

Infrastruktur ini sudah jalan dan dipakai Bento; theme lain tinggal wire section-nya.

| Layer | File | Fungsi |
|-------|------|--------|
| Editor state | `themes/engine/section-editor.ts` | `selectedBlockId`, `onSelectBlock`, `onBlockChange`, `onHeroChange` |
| Render | `themes/engine/SectionRenderer.tsx` | Pass `canvas`, `blocks`, `isMobile`, resolve device settings |
| Desktop / mobile | `themes/engine/device-settings.ts` | Layout key → `settings` vs `settings.mobile` |
| Page template | `themes/engine/page-template.ts` | Merge default blocks, persist `config.templates` |
| Customize | `features/builder/components/CustomizeWorkspace.tsx` | Handler block change + `applyDevicePatch` |
| Inspector | `features/builder/components/SectionInspector.tsx` | Panel sidebar (**banyak gate `templateId === "bento"`**) |

### Komponen canvas reusable

Folder: `features/builder/components/canvas/`

| File | Fungsi |
|------|--------|
| `CanvasInlineText.tsx` | Edit teks di canvas |
| `CanvasLabelResizeHandles.tsx` | Handle ungu resize box judul |
| `CanvasResizeHandles.tsx` | Handle indigo resize kartu/box |
| `CanvasImageFrame.tsx` | Pan + zoom gambar |
| `CanvasGridOverlay.tsx` | Grid overlay design width |
| `CanvasMeasurementBadge.tsx` | Badge ukuran saat kartu terpilih |
| `CanvasHeroCta.tsx` | CTA hero di canvas |

**Catatan:** Beberapa canvas component masih import dari `themes/bento/sections/category-grid-layout.ts`. Sebelum port ke 3 theme, pertimbangkan extract ke `themes/engine/canvas/` atau folder shared.

---

## Referensi implementasi Bento

### Homepage sections (adjustable)

| Section | Blocks | Fitur |
|---------|--------|-------|
| Hero | `hero-media`, `hero-cta` | Judul 2 baris, layer front/behind, gambar pan/zoom, CTA layout + warna |
| Category Grid | `category-card` (max 4) | Free-form `xPct/wPct/yPx/hPx`, label box, `labelLayer`, `cardBgColor`, upload gambar |
| Call to Action | `cta-image` | Upload + pan/zoom |
| Product Grid | — | **Belum** canvas-adjustable (hanya judul section) |

### Layout math (Bento)

- `themes/bento/sections/category-grid-layout.ts`
- `themes/bento/sections/hero-title-layout.ts`
- `themes/bento/sections/hero-cta-layout.ts`

### Defaults + registry

- `themes/bento/defaults/home.ts` — blocks + layout keys default
- `themes/engine/block-registry.ts` — field sidebar (**saat ini hanya `bento` + `minimalist` category-card basic**)

### Fix terbaru (Category Grid)

1. Background kartu selalu tampil (`backgroundColor` inline + `height` eksplisit di mode stack)
2. Setting **Warna Kartu** via `cardBgColor` (color picker); migrasi `imageClass` lama tetap jalan
3. **Layer judul** — z-index: BG=1, label behind=5, gambar=10, label front=15 (sama pola Hero)

---

## Setting keys (copy pattern)

### Layout box (kartu / CTA)

| Key | Arti |
|-----|------|
| `xPct` | Posisi kiri (% lebar parent) |
| `wPct` | Lebar (% lebar parent) |
| `yPx` | Posisi atas (px design) |
| `hPx` | Tinggi (px design) |

### Label box

| Key | Arti |
|-----|------|
| `labelXPct`, `labelYPct`, `labelWPct`, `labelHPct` | Box judul (% area kartu) |
| `labelLayer` | `"front"` \| `"behind"` (relatif ke gambar) |

### Gambar

| Key | Arti |
|-----|------|
| `imageUrl` | URL upload (shared desktop/mobile) |
| `imgScale`, `imgX`, `imgY` | Zoom + pan |

### Lainnya

| Key | Arti |
|-----|------|
| `cardBgColor` | Warna dasar kartu (hex) |
| `title1Label*Pct`, `title2Label*Pct` | Box judul hero |
| `title1Layer`, `title2Layer` | Layer judul hero |
| `ctaBgColor`, `ctaTextColor` | Warna tombol CTA |

**Device:** key layout di atas masuk `settings.mobile` saat edit di mode Mobile (lihat `DEVICE_LAYOUT_KEYS` di `device-settings.ts`). Konten (`label`, `imageUrl`, `cardBgColor`) tetap di base.

---

## Kondisi theme lain (homepage)

### Minimalist — prioritas tertinggi

**Order:** `hero` → `category-grid` → `product-grid` → `call-to-action`

| Section | Status sekarang |
|---------|-----------------|
| Hero | Static, `config.hero` + `heroImageUrl`, tanpa canvas |
| Category Grid | Block `category-card` ada (label, slug), tanpa canvas/upload |
| CTA | Static |
| `defaults/home.ts` | Tidak ada blocks |

**Effort:** paling kecil — struktur section mirip Bento.

### Bold

**Order:** `hero` → `origin` → `manifesto` → `pillars` → `impact` → `architects` → `call-to-action`

- Semua static, tidak ada blocks di defaults
- Tidak ada `category-grid`
- **Fase 1 disarankan:** Hero + CTA saja; section lain butuh desain block model sendiri

### Fashion

**Order:** `hero` → `category-cards` → `signature-series` → `brand-story` → `community-gallery` → `newsletter-cta` → `footer`

- Hero **hardcoded** (belum pakai `config.hero`)
- Section `category-cards` (bukan `category-grid`)
- **Fase 1 disarankan:** Hero (refactor ke config) + `category-cards` sebagai blocks

---

## Pola implementasi (checklist per section)

```
CustomizeWorkspace
  → SectionRenderer (editor + blocks)
    → SectionComponent (canvas?.editor)
      → editable: select block, drag handle, inline text
      → onBlockChange → applyDevicePatch → config.templates.home
```

**Per section yang mau adjustable:**

- [ ] Definisikan blocks di `themes/<theme>/defaults/home.ts`
- [ ] Tambah block definitions di `themes/engine/block-registry.ts`
- [ ] Refactor section jadi `"use client"`, pakai `SectionProps` (`blocks`, `canvas`, `isMobile`)
- [ ] Integrasi canvas components + layout math (adapt dari Bento, jangan copy visual 1:1)
- [ ] Extend `SectionInspector` (generalize atau tambah branch per `templateId`)
- [ ] Test desktop + mobile + Save Draft

---

## Rekomendasi scope per theme

### Minimalist (sprint 1)

1. Hero — blocks `hero-media` + `hero-cta` (adapt layout minimalist)
2. Category Grid — blocks + upload + warna (bisa pertahankan grid featured/rest secara visual)
3. Call to Action — block `cta-image`
4. Isi `defaults/home.ts`
5. Inspector untuk `templateId === "minimalist"`

### Bold (sprint 1)

1. Hero + CTA canvas
2. `defaults/home.ts` blocks untuk hero saja
3. Section `origin` dst. — fase 2 (butuh spec block)

### Fashion (sprint 1)

1. Refactor Hero pakai `config.hero` + blocks
2. `category-cards` → block model mirip `category-card`
3. Section lain — fase 2

---

## Acceptance criteria (homepage)

- [ ] Customize → Home: section terpilih, block bisa diklik di canvas
- [ ] Hero: teks/gambar/CTA bisa diedit (canvas dan/atau sidebar)
- [ ] Section kategori setara: blocks, label, minimal upload gambar
- [ ] Perubahan persist di `config.templates.home`
- [ ] Desktop/mobile layout tidak saling timpa
- [ ] Mode storefront (non-edit) render bersih tanpa handle editor

---

## File wajib dibaca

```
docs/CANVAS_ADJUST.md
themes/bento/defaults/home.ts
themes/bento/sections/HeroSection.tsx
themes/bento/sections/CategoryGrid.tsx
themes/bento/sections/CallToActionSection.tsx
themes/bento/sections/category-grid-layout.ts
features/builder/components/CustomizeWorkspace.tsx
features/builder/components/SectionInspector.tsx
themes/engine/SectionRenderer.tsx
themes/engine/device-settings.ts
```

---

## Catatan untuk lead

- Port **logic**, bukan pixel layout Bento — tiap theme punya visual sendiri.
- Extract shared layout math sebelum duplikasi ke 3 theme.
- Product grid belum adjustable di Bento; jangan jadikan blocker fase 1.
- `SectionInspector` perlu refactor agar tidak hardcode `bento` saja.
