# Canvas Adjust — Font, Card, Image

Dokumen ini merangkum fitur **adjust layout di Customize mode** untuk theme **Bento**, section **Hero** dan **Category Grid**.

Fitur ini memungkinkan merchant mengatur posisi, ukuran, dan zoom elemen langsung di canvas preview — dengan dukungan **Desktop / Mobile** terpisah.

---

## Prasyarat umum

| Item | Detail |
|------|--------|
| **Mode** | Customize → **Edit** (bukan Preview saja) |
| **Device toggle** | Desktop / Mobile di topbar — layout disimpan terpisah |
| **Seleksi** | Klik section → klik block di canvas → handle & sidebar aktif |
| **Penyimpanan layout** | Key layout masuk `settings` (desktop) atau `settings.mobile` (mobile) |
| **Konten shared** | Teks judul, `imageUrl`, label kartu — sama di semua device |

---

## 1. Font (Label Box)

Model yang **sama** dipakai di **Category Grid** (judul kartu) dan **Hero** (baris judul 1 & 2).

### Konsep

- Font **bukan** slider persentase abstrak — ukuran dihitung dari **bounding box teks** (% area parent).
- Formula: `fontSize = tinggi box (px) × 0.72` (minimum 14px).
- Setiap box teks punya 4 key layout: `*XPct`, `*YPct`, `*WPct`, `*HPct`.

### Key settings

| Section | Block | Keys |
|---------|-------|------|
| Category Grid | `category-card` | `labelXPct`, `labelYPct`, `labelWPct`, `labelHPct` |
| Hero | `hero-media` | `title1LabelXPct`, `title1LabelYPct`, `title1LabelWPct`, `title1LabelHPct` |
| Hero | `hero-media` | `title2LabelXPct`, `title2LabelYPct`, `title2LabelWPct`, `title2LabelHPct` |

Layer teks (front / behind gambar):

| Section | Key |
|---------|-----|
| Category Grid | `labelLayer` |
| Hero | `title1Layer`, `title2Layer` |

### Canvas UX

| Aksi | Cara |
|------|------|
| **Ubah ukuran font** | Tarik **handle ungu** (tepi/sudut box judul) |
| **Pindah posisi** | Drag **area teks** (box judul) |
| **Edit teks** | Klik langsung di canvas (layer front maupun behind) atau panel kiri |
| **Layer** | Front / Behind — panel kiri (`SegmentedControl`) |

### Sidebar

- Slider **Ukuran font** = `labelHPct` (Category Grid) atau `title1LabelHPct` / `title2LabelHPct` (Hero), dalam **% tinggi parent**.
- Range slider: 4–50%.
- Hint standar: *"Atur lewat slider atau tarik handle ungu di canvas"*.

### Komponen terkait

- `features/builder/components/canvas/CanvasLabelResizeHandles.tsx` — handle ungu (8 titik)
- `features/builder/components/canvas/CanvasInlineText.tsx` — inline edit teks

### Migrasi legacy

| Legacy | Perilaku |
|--------|----------|
| Category Grid `labelScale` | Otomatis dikonversi ke label box saat render |
| Hero `fontScale` | Otomatis dikonversi ke `title1/2Label*Pct` saat render |

---

## 2. Card (Layout Box)

Free-form canvas untuk **posisi & ukuran kartu** (Category Grid) dan **tombol CTA** (Hero).

### Category Grid — kartu kategori

| Key | Fungsi |
|-----|--------|
| `xPct`, `wPct` | Posisi horizontal & lebar (% grid) |
| `yPx`, `hPx` | Posisi vertikal & tinggi (px design) |

| Aksi | Cara |
|------|------|
| **Resize kartu** | Pilih kartu → tarik **handle indigo** (tepi/sudut kartu) |
| **Grid ukuran** | Overlay grid + badge ukuran saat kartu terpilih |

| Constraint | Detail |
|------------|--------|
| Max kartu | **4** |
| Design width | Desktop **1200px** · Mobile **390px** |
| Mobile stack | Auto-stack sampai ada override / mode edit aktif |

### Hero — tombol CTA (`hero-cta`)

| Key | Fungsi |
|-----|--------|
| `xPct`, `wPct`, `yPx`, `hPx` | Box tombol CTA |

| Aksi | Cara |
|------|------|
| **Resize / pindah CTA** | Pilih block CTA → tarik handle di canvas |

### Komponen terkait

- `features/builder/components/canvas/CanvasResizeHandles.tsx` — handle indigo (kartu & CTA)
- `features/builder/components/canvas/CanvasGridOverlay.tsx` — grid + measurement
- `features/builder/components/canvas/CanvasMeasurementBadge.tsx` — info ukuran kartu
- `features/builder/components/canvas/CanvasHeroCta.tsx` — CTA hero di canvas

---

## 3. Image (Pan & Zoom)

Sama di **Category Grid** (gambar kartu) dan **Hero** (gambar hero).

### Key settings

| Key | Fungsi |
|-----|--------|
| `imgScale` | Zoom % (clamp min–max) |
| `imgX`, `imgY` | Offset pan (% relatif frame) |
| `imageUrl` | **Shared** — sama desktop & mobile |

### Canvas UX

| Aksi | Cara |
|------|------|
| **Pan (geser)** | Drag **gambar** langsung |
| **Zoom** | Tarik **handle ungu kecil** di sudut kanan bawah gambar |
| **Upload** | Panel kiri → field Gambar |

> Gambar interaktif hanya saat **block terpilih** (`interactive={selected}`).

### Komponen terkait

- `features/builder/components/canvas/CanvasImageFrame.tsx` — pan + zoom handle
- Badge overlay saat edit: `{scale}% · tarik ⊙ zoom · drag geser`

---

## Desktop / Mobile

Layout key di-route per device lewat `applyDevicePatch()`:

- **Desktop** → merge langsung ke `settings` (base).
- **Mobile** → layout key masuk `settings.mobile` (seed dari base saat edit pertama).

Key layout yang di-route per device didefinisikan di `DEVICE_LAYOUT_KEYS` (`themes/engine/device-settings.ts`).

Preview mobile memakai frame **375px** dengan `ThemeProvider forcedDevice="mobile"`.

---

## Arsitektur

```
CustomizeWorkspace
  ├── device: desktop | mobile
  ├── applyDevicePatch() → route layout keys per device
  └── ThemeLivePreview (forcedDevice)
        └── SectionRenderer → resolveDeviceSettings()
              ├── CategoryGrid.tsx
              └── HeroSection.tsx
```

| Layer | File |
|-------|------|
| Device routing | `themes/engine/device-settings.ts` |
| Layout math (kartu + label) | `themes/bento/sections/category-grid-layout.ts` |
| Layout math (hero judul) | `themes/bento/sections/hero-title-layout.ts` |
| Layout math (hero CTA) | `themes/bento/sections/hero-cta-layout.ts` |
| Sidebar inspector | `features/builder/components/SectionInspector.tsx` |
| Canvas handles | `CanvasLabelResizeHandles`, `CanvasResizeHandles`, `CanvasImageFrame` |
| Section UI | `themes/bento/sections/CategoryGrid.tsx`, `HeroSection.tsx` |
| Defaults | `themes/bento/defaults/home.ts`, `themes/engine/block-registry.ts` |

---

## Quick reference per section

### Category Grid (klik kartu)

| Adjust | Canvas | Sidebar |
|--------|--------|---------|
| **Font** | Handle ungu + drag box judul | Slider `labelHPct`, Layer |
| **Card** | Handle indigo di kartu | — (canvas only) |
| **Image** | Drag gambar + handle zoom ungu | Upload `imageUrl` |

### Hero

| Block | Font | Card | Image |
|-------|------|------|-------|
| **hero-media** | Handle ungu ×2 baris + drag box | — | Drag + zoom ungu |
| **hero-cta** | — | Handle resize CTA | — |

---

## Tips mobile customize

1. Toggle **Mobile** di topbar sebelum edit layout mobile.
2. Edit di mobile → perubahan masuk `settings.mobile`, tidak menimpa desktop.
3. Edit pertama di mobile **seed** dari layout desktop yang ada.
4. Handle font ungu punya hit area lebih besar; wrapper handle memakai `pointer-events-none` agar drag box teks tetap berfungsi.
5. Z-index handle font: `z-[30]` (di atas layer teks `z-[10]`).

---

## Alur edit tipikal

1. Buka **Customize** → halaman **Home**.
2. Klik section **Hero** atau **Category Grid** di preview.
3. Klik block yang ingin diedit (kartu, gambar hero, atau CTA).
4. Atur di canvas (handle / drag) atau panel kiri (slider, layer, teks, upload gambar).
5. Switch **Mobile** → ulangi untuk layout mobile jika perlu.
6. **Save Draft** / **Publish**.
