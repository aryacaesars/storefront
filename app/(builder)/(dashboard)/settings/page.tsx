import { Copy, Upload, ExternalLink, Crown, Check } from "lucide-react"
import { requireSession } from "@/features/auth/dal"
import {
  SettingsSection,
  SettingsField,
  SettingsInput,
  SettingsTextarea,
  ToggleRow,
} from "@/features/builder/components/SettingsSection"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getStorefrontHost, getStorefrontUrl } from "@/lib/tenant/storefront-url"

export default async function SettingsPage() {
  const session = await requireSession()
  // @ts-expect-error TODO Sprint 2: use storeId from URL params, session.tenantSlug/tenantId removed
  const storefrontHost = getStorefrontHost(session.tenantSlug)
  // @ts-expect-error TODO Sprint 2: use storeId from URL params, session.tenantSlug/tenantId removed
  const storefrontUrl = getStorefrontUrl(session.tenantSlug)
  return (
    <div className="p-8 max-w-4xl">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-indigo-600 tracking-tight">
          Settings
        </h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-100 px-8">

        {/* ── 1. Informasi Toko ─────────────────────────────── */}
        <SettingsSection
          title="Informasi Toko"
          description="Identitas dasar toko Anda yang tampil di storefront dan hasil pencarian."
        >
          <SettingsField label="Nama Toko">
            <SettingsInput placeholder="Masukkan nama toko..." defaultValue="Nama Toko Saya" />
          </SettingsField>

          <SettingsField
            label="Deskripsi Singkat"
            hint="Maks. 160 karakter. Digunakan sebagai meta description halaman utama."
          >
            <SettingsTextarea
              rows={3}
              placeholder="Ceritakan sedikit tentang toko Anda..."
              defaultValue="Toko online pilihan untuk produk berkualitas premium dengan pengiriman cepat."
            />
          </SettingsField>

          <SettingsField label="Kategori Bisnis">
            <select className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition">
              <option>Fashion & Apparel</option>
              <option>Elektronik</option>
              <option>Makanan & Minuman</option>
              <option>Kecantikan & Perawatan</option>
              <option>Olahraga & Outdoor</option>
              <option>Rumah & Dekorasi</option>
              <option>Lainnya</option>
            </select>
          </SettingsField>

          <div className="flex justify-end pt-1">
            <Button variant="default" size="sm">Simpan Perubahan</Button>
          </div>
        </SettingsSection>

        {/* ── 2. Domain & URL ───────────────────────────────── */}
        <SettingsSection
          title="Domain & URL"
          description="Subdomain otomatis dari username bisnis Scalev saat login. Belum bisa diubah manual di MVP ini."
        >
          <SettingsField
            label="Subdomain Etalase"
            // @ts-expect-error TODO Sprint 2: use storeId from URL params, session.tenantSlug/tenantId removed
            hint={`Diambil dari akun Scalev: ${session.tenantSlug || "—"}. Custom slug butuh integrasi tenant DB (coming soon).`}
          >
            <div className="flex items-center h-9 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
              <span className="px-3 text-sm text-gray-400 border-r border-gray-200 bg-gray-100 h-full flex items-center shrink-0">
                https://
              </span>
              <span className="px-3 text-sm text-indigo-600 font-medium flex-1">
                {storefrontHost}
              </span>
              <button className="px-3 h-full border-l border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </SettingsField>

          <SettingsField label="Custom Domain">
            <div className="flex gap-2">
              <SettingsInput
                placeholder="toko.domainanda.com"
                className="flex-1"
                disabled
              />
              <Button variant="secondary" size="default" className="shrink-0 opacity-60 cursor-not-allowed">
                Verifikasi
              </Button>
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-medium">
                <Crown className="w-2.5 h-2.5" />
                Fitur Pro — Upgrade untuk mengaktifkan custom domain
              </span>
            </div>
          </SettingsField>

          <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
            <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-green-800">SSL Aktif</p>
              <p className="text-[11px] text-green-600">Sertifikat HTTPS valid · Diperbarui otomatis</p>
            </div>
            <a
              href={storefrontUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-green-700 font-medium hover:underline shrink-0"
            >
              Buka <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </SettingsSection>

        {/* ── 3. Branding ───────────────────────────────────── */}
        <SettingsSection
          title="Branding"
          description="Logo, favicon, dan palet warna yang menjadi identitas visual storefront Anda."
        >
          {/* Logo upload */}
          <SettingsField label="Logo Toko" hint="Format: PNG, SVG, atau WebP. Ukuran max 2MB. Rekomendasi 200×60px.">
            <div className="flex items-center gap-4">
              <div className="w-24 h-14 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-gray-300 shrink-0">
                <svg viewBox="0 0 48 20" className="w-10 h-5 opacity-40" fill="currentColor">
                  <rect width="48" height="20" rx="4" />
                </svg>
              </div>
              <div className="flex flex-col gap-2">
                <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-gray-400" />
                  Upload Logo
                </button>
                <span className="text-[11px] text-gray-400">Belum ada logo diunggah</span>
              </div>
            </div>
          </SettingsField>

          {/* Color palette */}
          <SettingsField label="Warna Utama" hint="Digunakan untuk tombol, link aktif, dan aksen di seluruh storefront.">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-gray-200 cursor-pointer shrink-0">
                <input type="color" defaultValue="#4f46e5" className="absolute inset-0 w-14 h-14 -translate-x-2 -translate-y-2 cursor-pointer opacity-0" />
                <div className="w-full h-full bg-indigo-600" />
              </div>
              <SettingsInput defaultValue="#4F46E5" className="w-32 font-mono uppercase" />
              <span className="text-xs text-gray-400">Indigo — warna aktif saat ini</span>
            </div>
          </SettingsField>

          {/* Font */}
          <SettingsField label="Tipografi">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[11px] text-gray-500 mb-1.5">Heading</p>
                <select className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/30 transition">
                  <option>Inter</option>
                  <option>Geist</option>
                  <option>Playfair Display</option>
                  <option>Lora</option>
                  <option>DM Serif Display</option>
                </select>
              </div>
              <div>
                <p className="text-[11px] text-gray-500 mb-1.5">Body</p>
                <select className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/30 transition">
                  <option>Inter</option>
                  <option>Geist</option>
                  <option>Plus Jakarta Sans</option>
                  <option>DM Sans</option>
                </select>
              </div>
            </div>
          </SettingsField>

          <div className="flex justify-end pt-1">
            <Button variant="default" size="sm">Simpan Branding</Button>
          </div>
        </SettingsSection>

        {/* ── 4. Notifikasi ─────────────────────────────────── */}
        <SettingsSection
          title="Notifikasi"
          description="Atur kapan Anda ingin dihubungi terkait aktivitas toko dan platform."
        >
          <div className="rounded-xl border border-gray-200 px-4 divide-y divide-gray-100">
            <ToggleRow
              label="Order baru masuk"
              description="Notifikasi email setiap ada order baru dari storefront."
              defaultChecked
            />
            <ToggleRow
              label="Pembayaran berhasil"
              description="Konfirmasi saat pembayaran dari pelanggan terkonfirmasi."
              defaultChecked
            />
            <ToggleRow
              label="Stok hampir habis"
              description="Peringatan saat stok produk di bawah 5 unit."
            />
            <ToggleRow
              label="Update platform"
              description="Info fitur baru dan pembaruan sistem Etalase."
              defaultChecked
            />
            <ToggleRow
              label="Tips & best practice"
              description="Panduan meningkatkan performa toko dari tim Etalase."
            />
          </div>
        </SettingsSection>

        {/* ── 5. Akun & Langganan ───────────────────────────── */}
        <SettingsSection
          title="Akun & Langganan"
          description="Informasi akun merchant dan status paket berlangganan Anda."
        >
          {/* Plan card */}
          <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-indigo-900">Pro Merchant</p>
                  <Badge variant="default" className="text-[10px] px-1.5 py-0">Aktif</Badge>
                </div>
                <p className="text-[11px] text-indigo-600 mt-0.5">
                  Semua fitur tersedia · Diperbarui otomatis setiap bulan
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="border-indigo-200 text-indigo-700 hover:bg-indigo-100">
              Kelola Paket
            </Button>
          </div>

          {/* Account fields */}
          <div className="grid grid-cols-2 gap-4">
            <SettingsField label="Nama Merchant">
              <SettingsInput defaultValue="John Merchant" />
            </SettingsField>
            <SettingsField label="Email">
              <SettingsInput type="email" defaultValue="merchant@email.com" />
            </SettingsField>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors">
              Hapus Akun & Data Toko
            </button>
            <Button variant="default" size="sm">Simpan Akun</Button>
          </div>
        </SettingsSection>

      </div>
    </div>
  )
}
