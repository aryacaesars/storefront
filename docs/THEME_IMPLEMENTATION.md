# Panduan Implementasi Theme Baru

Dokumen ini untuk developer yang mengerjakan **2 theme baru** (`bold` dan `fashion`).  
Setiap theme dikerjakan di **branch terpisah**.

> **Konteks:** Ada pekerjaan paralel di branch `test/dragndrop` (builder drag-and-drop + rework schema) yang **belum final** dan belum di-merge ke `dev`. Supaya tidak konflik, pekerjaan theme **hanya boleh menyentuh folder theme masing-masing**. Integrasi ke app/builder/engine dikerjakan terpisah oleh lead setelah PR theme selesai.

---

## 1. Ringkasan cepat

| Theme | Template ID | Branch | Folder kerja |
|-------|-------------|--------|--------------|
| Bold | `bold` | `theme/bold` | `themes/bold/` |
| Fashion | `fashion` | `theme/fashion` | `themes/fashion/` |

**Referensi:** `themes/minimalist/` — baca sebagai contoh, **jangan edit**.

**Base branch:** `theme/minimalist-bold` (branch infra + minimalist lengkap).  
Kalau lead menyuruh pakai branch lain, ikuti instruksi lead — prinsipnya tetap sama: **hanya edit folder theme kamu**.

---

## 2. Workflow git

### Setup awal (lakukan sekali)

```bash
git fetch origin
git checkout theme/minimalist-bold
git pull origin theme/minimalist-bold
```

### Theme Bold

```bash
git checkout theme/minimalist-bold
git checkout -b theme/bold
```

### Theme Fashion

```bash
git checkout theme/minimalist-bold
git checkout -b theme/fashion
```

> **Penting:** Branch `theme/fashion` dibuat dari **base yang sama** (`theme/minimalist-bold`), **bukan** dari `theme/bold`. Dua theme independen.

### Saat development

```bash
# Commit kecil & fokus, hanya file di themes/<nama>/
git add themes/bold/
git commit -m "feat(theme/bold): add HeroSection"

# Sync berkala dari base (hindari drift)
git fetch origin
git merge origin/theme/minimalist-bold
```

Kalau merge menimbulkan konflik di file **luar** `themes/<nama>/`, **jangan resolve sendiri** — abort merge, lapor ke lead:

```bash
git merge --abort
```

### Pull request

- **1 theme = 1 PR**
- Target branch: `theme/minimalist-bold` (atau sesuai instruksi lead)
- Judul contoh: `feat(theme): implement Bold homepage sections`
- Isi PR: screenshot desktop + mobile, daftar section yang sudah jadi

---

## 3. Boleh vs dilarang

### ✅ BOLEH disentuh

Hanya isi folder theme kamu:

```
themes/bold/**      # kalau kerja theme Bold
themes/fashion/**   # kalau kerja theme Fashion
```

Import **read-only** dari modul lain boleh (contoh: `ThemeConfig` dari `@/themes/engine/schema`, `ThemeProvider` dari `@/themes/engine/theme-provider`). Yang dilarang adalah **mengubah** file di luar folder theme.

### ❌ DILARANG disentuh

| Area | Alasan |
|------|--------|
| `themes/engine/**` | Sedang dirework di `test/dragndrop` (`schema.ts`, `registry.ts`, `element-renderer.tsx`) |
| `themes/minimalist/**` | Template referensi — jangan diubah |
| `lib/**` | `defaults.ts`, `fonts.ts`, dll. hotspot konflik |
| `features/**` | Builder, auth, storefront shell |
| `app/**` | Routing & halaman app |
| `server/**` | Service layer |
| `prisma/**` | Database schema |
| `package.json`, `package-lock.json` | Dependency lock |
| `next.config.ts`, `docker-compose.yml`, `middleware.ts` | Infra shared |
| File theme lain (`themes/bold/` saat kamu kerja `fashion`, dan sebaliknya) | Scope terpisah per developer |

**Aturan emas:** `git diff` sebelum commit — kalau ada file di luar `themes/<templateId>/`, revert.

```bash
git diff --name-only
# Harusnya cuma themes/bold/* atau themes/fashion/*
```

---

## 4. Struktur folder wajib

Ikuti pola `themes/minimalist/`. Target minimum untuk MVP homepage:

```
themes/<templateId>/
├── index.tsx                 # export publik theme
├── theme.config.ts           # default config (warna, font, copy)
├── pages/
│   └── HomePage.tsx          # susunan section homepage
├── sections/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── MobileNav.tsx
│   ├── HeroSection.tsx
│   ├── CategoryGrid.tsx
│   ├── ProductGrid.tsx
│   ├── ProductCard.tsx
│   ├── PhilosophySection.tsx   # atau section brand story setara
│   └── NewsletterSection.tsx
├── data/
│   └── mock.ts               # data dummy produk/kategori (opsional tapi disarankan)
└── preview/
    └── DevPreview.tsx        # preview lokal — lihat §7
```

Nama file section boleh beda **asal** `HomePage.tsx` jelas dan lengkap. Desain visual bebas — yang penting **kontrak props** konsisten (§5).

---

## 5. Kontrak teknis (wajib ikut)

### 5.1 `theme.config.ts`

Export constant `DEFAULT_<TEMPLATE>_CONFIG` dengan `templateId` yang benar:

```ts
import type { ThemeConfig } from "@/themes/engine/schema"

export const DEFAULT_BOLD_CONFIG: ThemeConfig = {
  templateId: "bold",           // harus "bold" atau "fashion"
  storeName: "...",
  tagline: "...",
  primaryColor: "#...",
  accentColor: "#...",
  headingFont: "var(--font-geist-sans)",  // atau var(--font-playfair)
  bodyFont: "var(--font-geist-sans)",
  bannerText: "...",
}
```

Field opsional yang section boleh pakai: `logoUrl`, `logoDisplay`, `heroImageUrl`, `hero` (lihat `heroConfigSchema` di `themes/engine/schema.ts`).

### 5.2 `index.tsx`

Export minimal:

```ts
export { DEFAULT_BOLD_CONFIG } from "./theme.config"
export { HomePage } from "./pages/HomePage"
export { Header } from "./sections/Header"
export { Footer } from "./sections/Footer"
```

### 5.3 Props section

| Komponen | Props |
|----------|-------|
| `Header` | `{ config: ThemeConfig; cartCount?: number }` |
| `Footer` | `{ config: ThemeConfig }` |
| `HeroSection` | `{ config?: ThemeConfig }` |
| Section lain | Bebas, tapi prefer tanpa hardcode brand name — ambil dari `config` kalau relevan |

### 5.4 Styling — CSS variables theme

Jangan hardcode warna brand di section. Pakai token dari `ThemeProvider`:

| Variable | Pemakaian |
|----------|-----------|
| `var(--theme-primary)` | CTA, aksen, banner |
| `var(--theme-accent)` | Background aksen |
| `var(--theme-text)` | Teks utama |
| `var(--theme-muted)` | Teks sekunder |
| `var(--theme-heading-font)` | Heading (`font-family`) |
| `var(--theme-body-font)` | Body (`font-family`) |

Contoh: `className="text-[var(--theme-text)]"` dan `style={{ fontFamily: "var(--theme-heading-font)" }}`.

### 5.5 Responsive — container query, bukan media query

`ThemeProvider` sudah set `@container`. Section **wajib** pakai prefix `@` Tailwind:

```tsx
// ✅ Benar — responsif di preview builder (frame sempit)
className="text-2xl @2xl:text-4xl @5xl:text-5xl"

// ❌ Salah — tidak ikut ukuran preview frame
className="text-2xl md:text-4xl lg:text-5xl"
```

Breakpoint umum: `@2xl`, `@3xl`, `@5xl`.

### 5.6 Link & navigasi

Pakai `next/link` untuk href internal (`/products`, `/about`, dll.).  
Jangan pakai `<a href>` untuk route internal.

### 5.7 Gambar

- Hero / banner: `next/image` dengan `fill` atau `width`/`height`
- Placeholder: gradient Tailwind (lihat `themes/minimalist/data/mock.ts`)
- Jangan commit asset binary besar — pakai gradient atau URL placeholder

---

## 6. Perbedaan desain yang diharapkan

| Template | Arah desain |
|----------|-------------|
| **Bold** | Kontras tinggi, tipografi tegas, layout berani, statement visual kuat |
| **Fashion** | Editorial / lifestyle, grid rapi, nuansa fashion magazine |

Keduanya harus **terasa berbeda** dari `minimalist`, bukan sekadar ganti warna.

---

## 7. Cara test tanpa menyentuh `app/`

Karena integrasi routing dilarang, buat preview lokal di dalam folder theme:

`themes/<templateId>/preview/DevPreview.tsx`:

```tsx
"use client"

import { ThemeProvider } from "@/themes/engine/theme-provider"
import { DEFAULT_BOLD_CONFIG } from "../theme.config"
import { Header } from "../sections/Header"
import { Footer } from "../sections/Footer"
import { HomePage } from "../pages/HomePage"

export function BoldDevPreview() {
  const config = DEFAULT_BOLD_CONFIG
  return (
    <ThemeProvider config={config}>
      <Header config={config} />
      <HomePage config={config} />
      <Footer config={config} />
    </ThemeProvider>
  )
}
```

Lead akan sementara men-wire preview ini ke route dev. Kamu cukup pastikan `DevPreview` render tanpa error.

Cek TypeScript lokal:

```bash
npx tsc --noEmit
```

---

## 8. Checklist sebelum PR

- [ ] `git diff --name-only` hanya berisi `themes/<templateId>/`
- [ ] `templateId` di `theme.config.ts` sesuai (`bold` / `fashion`)
- [ ] `index.tsx` export `HomePage`, `Header`, `Footer`, default config
- [ ] `HomePage` render semua section utama tanpa error
- [ ] Header baca `config.storeName`, `config.logoUrl`, `config.logoDisplay`, `config.bannerText`
- [ ] Hero baca `config.hero` dan `config.heroImageUrl` (dengan fallback copy default)
- [ ] Styling pakai CSS variables theme, bukan hardcode warna brand
- [ ] Responsif pakai `@2xl` / `@5xl`, bukan `md:` / `lg:`
- [ ] `npx tsc --noEmit` lolos
- [ ] Screenshot desktop + mobile disertakan di PR
- [ ] Tidak ada `console.log` atau kode debug

---

## 9. Apa yang lead integrasikan setelah PR kamu

Kamu **tidak perlu** mengerjakan ini — cukup tahu supaya tidak duplikasi:

1. `themes/engine/registry.ts` — daftarkan `HomePage` ke `templatePages`
2. `lib/themes/defaults.ts` — wire `DEFAULT_*_CONFIG` (kalau belum)
3. `features/storefront/StorefrontShell.tsx` — routing Header/Footer per template
4. `app/page.tsx` — pilih `HomePage` sesuai `config.templateId`
5. `features/builder/components/ThemeLivePreview.tsx` — idem
6. Setelah `test/dragndrop` merge — migrasi ke pola `SectionRenderer` (lead yang handle)

---

## 10. FAQ

**Boleh tambah template ID baru (mis. `luxury`)?**  
Tidak di scope ini. ID baru butuh edit `themes/engine/schema.ts` yang sedang konflik. Pakai `bold` atau `fashion` saja.

**Boleh copy-paste dari `minimalist` lalu modif?**  
Boleh, asal file hasil copy ada di `themes/bold/` atau `themes/fashion/`, bukan edit langsung di `minimalist`.

**Preview di dashboard kok belum muncul?**  
Normal. Preview aktif setelah lead register theme di `registry.ts`. Tugas kamu: `DevPreview` + PR lengkap.

**Harus ikut pola `SectionRenderer` dari `test/dragndrop`?**  
Belum. Kerjakan `HomePage` hardcode section dulu (seperti minimalist sekarang). Lead migrasikan setelah drag-and-drop final.

**Konflik pas merge base branch?**  
Hanya resolve file di `themes/<templateId>/`. Konflik di file lain → abort, lapor lead.

---

## 11. Kontak & eskalasi

- Ragukan file di luar scope → **jangan commit**, tanya lead dulu
- Butuh field baru di `ThemeConfig` → buat issue / chat lead (butuh perubahan `schema.ts`)
- Butuh data produk real → di luar scope theme; pakai `data/mock.ts` dulu
