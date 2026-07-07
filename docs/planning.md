# Planning: Theme Platform → Shopify-like

Dokumen ini merangkum arah arsitektur **builder + themes + storefront** untuk platform SaaS commerce.

> **Scope:** Branch `test/dragndrop` **diabaikan**.  
> **Terkait:** [`THEME_IMPLEMENTATION.md`](./THEME_IMPLEMENTATION.md), [`guide.md`](../guide.md) (MVP Scalev)

---

## 1. State sekarang (Juni 2026)

### Yang sudah jalan (infrastruktur + partial Phase 6)

| Area | Status | Catatan |
|------|--------|---------|
| Theme settings + schema-driven form | ✅ | Global branding: logo, warna, font, banner |
| Draft / publish | ✅ | DB `theme_configs` per tenant |
| Homepage live per `templateId` | ✅ | `ThemeHomeView` + `SectionRenderer` |
| Multi-page preview + page picker | ✅ | Per `getImplementedPages()` |
| Marketing + commerce **templates** | ✅ | UI per theme; data masih **mock** |
| Nav filter (no dead links) | ✅ | `nav-utils.ts` |
| Section model + editor (`home`, `about`) | ✅ | Minimalist: `templates.home` + `templates.about` |
| Block model (minimalist) | ⚠️ Partial | `category-grid`, `creative-direction`, `milestones` — editor di `SectionInspector` |
| Builder context-aware sidebar | ⚠️ Partial | Tab Theme \| Sections (home/about); banner katalog; tab Konten (placeholder) |
| Section settings field types | ⚠️ Partial | Type `image`, `url`, `color`, `segmented` ada di schema; mayoritas section belum pakai |

### Yang belum / masih cacat (produk)

| Area | Status | Dampak ke merchant |
|------|--------|-------------------|
| Block model (semua theme/section) | ⚠️ | Hanya minimalist + 3 section types; bold/fashion belum |
| Section settings di UI | ⚠️ | Banyak section masih hardcoded TSX tanpa field schema |
| Editor konten marketing | ❌ | Tab **Konten** ada tapi placeholder ("akan tersedia segera") |
| Section model `contact`, dll. | ❌ | Hanya `home` + `about`; contact/shop masih React hardcoded |
| About bold/fashion | ❌ | Masih komponen React, bukan `SectionRenderer` |
| **Customer login / account** (storefront) | ❌ | Icon account di header dead; hanya login merchant (`/login` builder) |
| Commerce data nyata | ❌ | Product/cart/checkout = mock; belum Scalev API |
| `order` page | ❌ | `/orders/[id]` masih placeholder, tidak di registry |
| Minimalist `contact` | ❌ | Belum di registry |

**Kesimpulan:** Sprint 1–7 menyelesaikan **plumbing theme** (registry, routes, section pipeline). Sprint 8–9 **sudah dimulai** (~40–50% Phase 6): minimalist about + blocks jalan; marketing editor & bold/fashion belum. **Jangan lanjut Scalev penuh** sebelum Phase 6b–6c lebih matang.

### Registry (`templatePages`)

| Theme | Pages |
|-------|-------|
| `minimalist` | `home`, `about`, `productList`, `productDetail`, `collection`, `cart`, `checkout` |
| `bold` | `home`, `about`, `productList`, `productDetail`, `collection`, `cart`, `checkout`, `techSeries`, `newArrivals`, `allProducts` |
| `fashion` | `home`, `about`, `contact`, `productList`, `productDetail`, `collection`, `cart`, `checkout`, `shop`, `collections` |

### Aturan sinkronisasi

- **Manifest** = deklarasi target (platform + marketing)
- **Registry** = implementasi nyata
- **Editor picker** = `getImplementedPages()` dari registry
- **Nav** = `isNavHrefAvailable(templateId, href)`
- **Storefront routes** = `ThemePageContent` + `resolveThemePage`

---

## 2. Perbandingan Shopify (jujur)

| Dimensi | Status | Gap |
|---------|--------|-----|
| Global theme settings | ✅ | Kecil |
| Multi-page templates (UI) | ✅ | Shell ada; konten banyak hardcoded |
| Section model | ⚠️ | `home` + `about` (minimalist); theme lain about masih hardcoded |
| Section **blocks** (cards, items) | ⚠️ | Minimalist 3 section; bold/fashion belum |
| Editor konteks per halaman | ⚠️ | About OK; katalog ada banner; marketing placeholder |
| Product dari katalog | ❌ | Harus Scalev, bukan ketik di builder |
| Customer account pages | ❌ | Belum ada template login/akun |

### Model konten yang benar (target)

```
ThemeConfig (global)     → logo, warna, font, banner
templates.{page}         → order + sections (home, about, …)
  section.settings       → judul, CTA, copy section
  section.blocks[]       → card, team member, milestone (repeatable)
Product grid / PDP       → data dari Scalev API (bukan blocks theme)
```

**Prinsip:** Marketing blocks di theme; merchandise dari katalog. Product cards sengaja **bukan** theme blocks — nanti dari Scalev.

---

## 3. Page model

**Platform pages:** `productList`, `productDetail`, `collection`, `cart`, `checkout`, `order`

| Page | Route | Registry | Data | Section JSON |
|------|-------|----------|------|--------------|
| productList | `/products` | ✅ | mock → Scalev | ❌ katalog |
| productDetail | `/products/[slug]` | ✅ | mock → Scalev | ❌ katalog |
| collection | `/categories/[slug]` | ✅ | mock → Scalev | ❌ katalog |
| cart | `/cart` | ✅ | mock → Scalev cart API | ❌ katalog |
| checkout | `/checkout` | ✅ | mock → Scalev checkout | ❌ katalog |
| order | `/orders/[id]` | ❌ | placeholder | — |

**Marketing pages:** `about`, `contact`, `shop`, `collections`, `techSeries`, …

| Page | Section JSON | Catatan |
|------|--------------|---------|
| `about` (minimalist) | ✅ | `SectionRenderer pageType="about"` |
| `about` (bold/fashion) | ❌ | React hardcoded |
| `contact`, `shop`, … | ❌ | UI registry; konten TSX |

**Account (belum):** `account`, `login` — target Phase 6c, storefront customer-facing.

---

## 4. Roadmap progress

| Phase | Status | Isi |
|-------|--------|-----|
| 0 — Fondasi | ✅ | Chrome, palette, preview |
| 1 — Settings schema | ✅ | Global branding form |
| 2 — Multi-page | ✅ | Registry, routes, page picker |
| 3 — Section model | ✅ | `templates.home` + `SectionRenderer` |
| 4 — Editor UX (home) | ✅ | Tabs, click-to-select, inspector, DnD |
| 5 — Commerce templates | ✅ | UI shell per theme (mock data) |
| **6 — Builder & content** | ⏳ **~45%** | 6a partial, 6b minimalist partial, 6c belum |
| **7 — Scalev integration** | ⏳ | Produk, cart, checkout, order nyata |

### Phase 6 breakdown

| Sub-phase | Status | Done | Sisa |
|-----------|--------|------|------|
| **6a** Builder context | ⚠️ ~70% | Tab Theme/Sections/Konten; banner katalog; about tidak paksa branding | Panel Konten masih placeholder |
| **6b** Blocks + marketing | ⚠️ ~35% | Schema blocks; `block-registry`; inspector; minimalist about + 3 sections | bold/fashion about; `contact`; image picker UI |
| **6c** Storefront account | ❌ | — | login/account template + header link |

---

## 5. Referensi code

| Komponen | Path |
|----------|------|
| Settings schema | `themes/engine/settings-schema.ts` |
| Section settings | `themes/engine/section-settings-schema.ts` |
| Block registry | `themes/engine/block-registry.ts` |
| Theme config schema (blocks) | `themes/engine/schema.ts` |
| Settings panel | `features/builder/components/ThemeSettingsPanel.tsx` |
| Sections panel | `features/builder/components/ThemeSectionsPanel.tsx` |
| Section inspector (+ blocks) | `features/builder/components/SectionInspector.tsx` |
| Customize workspace | `features/builder/components/CustomizeWorkspace.tsx` |
| Page registry | `themes/engine/registry.ts` |
| Section registry | `themes/engine/section-registry.ts` |
| Section renderer | `themes/engine/SectionRenderer.tsx` |
| Page template resolver | `themes/engine/page-template.ts` |
| About defaults (minimalist) | `themes/minimalist/defaults/about.ts` |
| Page props | `themes/engine/page-props.ts` |
| Storefront page helper | `features/storefront/ThemePageContent.tsx` |
| Storefront theme config | `features/storefront/theme-config.ts` |
| Scalev client (awal) | `lib/scalev/` — identity saja |

### Storefront routes

**Commerce:** `/products`, `/products/[slug]`, `/categories/[slug]`, `/cart`, `/checkout`, `/orders/[id]` (placeholder)

**Marketing:** `/`, `/about`, `/contact`, `/shop`, `/collections`, `/new-arrivals`, `/tech-series`, `/all-products`

**Auth:** `app/(auth)/login` = merchant builder saja; **bukan** customer storefront.

---

## 6. Sprint checklist

### Sprint 1–7 ✅ (Phase 0–5)

- [x] Theme engine, multi-page, settings schema
- [x] Section pipeline home + editor UX dasar
- [x] Commerce page components + registry (mock)

### Sprint 8 — Phase 6a: Builder context-aware ⚠️ partial

- [x] Sidebar ikut halaman preview — about punya tab Sections (bukan paksa branding)
- [x] Tab: **Theme** | **Sections** (home + about) | **Konten** (marketing, stub)
- [x] Empty state katalog: banner amber "Halaman dikontrol katalog"
- [ ] Panel **Konten** functional untuk contact, shop, collections, …
- [ ] Auto-select tab yang tepat saat klik section di preview (marketing)

### Sprint 9 — Phase 6b: Blocks + halaman marketing ⚠️ partial

- [x] Schema `section.blocks[]` di `ThemeConfig` (`blockInstanceSchema`)
- [x] Block types minimalist: `category-card`, `team-member`, `milestone`
- [x] Editor blocks di `SectionInspector` (add/remove/reorder) — tanpa `BlockRenderer` terpisah
- [x] Wire `CategoryGrid`, `CreativeDirectionSection`, `MilestonesSection` ke blocks
- [x] `templates.about` + migrasi `AboutPage` **minimalist**
- [x] Field types `image`, `url`, `color`, `segmented` di `section-settings-schema`
- [ ] Image/url picker di UI inspector (type ada, widget belum)
- [ ] `templates.contact` + section model halaman marketing lain
- [ ] Migrasi about **bold** + **fashion** ke `SectionRenderer`
- [ ] Block defs untuk bold/fashion sections

### Sprint 10 — Phase 6c: Storefront account ⏳

- [ ] `login` / `account` page type + registry per theme
- [ ] Route storefront customer login/account
- [ ] Header icon User → link account/login
- [ ] Keputusan produk: guest-only vs Scalev customer auth

### Sprint 11 — Phase 7: Scalev integration ⏳

- [ ] `lib/scalev` storefront: items, categories, cart, checkout, orders
- [ ] Product list/detail/collection baca API (ganti mock)
- [ ] Cart + checkout functional → order di Scalev
- [ ] `order` page di registry + konfirmasi status
- [ ] Builder: commerce pages tampilkan "data dari katalog Scalev" (read-only di editor)

---

## 7. Known issues (builder UX)

1. **Marketing tab Konten kosong** — `CustomizeWorkspace` menampilkan tab "Konten" untuk contact/shop/… tapi isinya placeholder. Merchant tidak bisa edit teks halaman tersebut.

2. **About bold/fashion** — masih React hardcoded; ganti page di preview tidak membuka editor sections (hanya Theme + banner jika commerce).

3. **Klik section tanpa schema** — inspector kosong / "belum punya field"; mayoritas section home belum punya `section-settings-schema` entry.

4. **Product cards** — sengaja tidak di theme blocks; nanti dari Scalev. Category/marketing cards harus blocks (minimalist category-grid sudah).

5. **Config tenant vs kode theme** — revisi TSX mengubah semua tenant; JSON `templates` tidak auto-migrate saat rename section type.

6. **`getDefaultPageTemplate("about")`** — hanya minimalist punya default; bold/fashion about belum di section model (akan throw jika dipaksa).

---

## 8. Urutan rekomendasi

```
Phase 6a selesai (panel Konten marketing)  →  fix frustrasi contact/shop
Phase 6b selesai (bold/fashion + contact)  →  parity 3 theme
Phase 6c (account template)                →  storefront lengkap navigasi
Phase 7 (Scalev)                           →  toko yang benar-benar jualan
```

---

*Terakhir diperbarui: Juni 2026 — Phase 0–5 selesai; Phase 6 ~45% (minimalist blocks + about + builder tabs); Phase 7 direncanakan.*
