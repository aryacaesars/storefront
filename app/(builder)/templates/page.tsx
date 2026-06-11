import Link from "next/link"
import { Store } from "lucide-react"
import { requireSession } from "@/features/auth/dal"
import { TemplateCard, type TemplateCardProps } from "@/features/builder/components/TemplateCard"

export const metadata = { title: "Storefront — Template Saya" }

// TODO: ganti dengan data dari API setelah endpoint template library tersedia
const purchasedTemplates: TemplateCardProps[] = [
  {
    id: "minimalist",
    name: "Minimalist",
    description:
      "Fokus pada tipografi bersih dan ruang putih yang luas untuk brand premium.",
    active: true,
    purchasedAt: "5 Mar 2026",
  },
]

export default async function TemplatesPage() {
  await requireSession()

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-indigo-600 tracking-tight mb-3">
          Template Saya
        </h1>
        <p className="text-base text-gray-500 max-w-xl leading-relaxed">
          Koleksi template yang sudah Anda beli. Aktifkan atau kelola desain untuk
          storefront Anda.
        </p>
      </div>

      {purchasedTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {purchasedTemplates.map((template) => (
            <TemplateCard key={template.id} {...template} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-8 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Store className="h-7 w-7" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Belum ada template yang dibeli
          </h2>
          <p className="text-sm text-gray-500 max-w-sm mb-6 leading-relaxed">
            Jelajahi katalog template di halaman utama Etalase untuk menemukan
            desain yang cocok dengan toko Anda.
          </p>
          <Link
            href="/#templates"
            className="inline-flex h-9 items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Jelajahi Template
          </Link>
        </div>
      )}
    </div>
  )
}
