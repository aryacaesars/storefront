import { TemplateCard, type TemplateCardProps } from "@/features/builder/components/TemplateCard"

const templates: TemplateCardProps[] = [
  {
    id: "minimalist",
    name: "Minimalist",
    description:
      "Fokus pada tipografi bersih dan ruang putih yang luas untuk brand premium.",
    active: true,
  },
  {
    id: "bold",
    name: "Bold",
    description:
      "Kombinasi kontras tinggi dan elemen visual besar untuk pernyataan yang kuat.",
    active: false,
  },
  {
    id: "fashion",
    name: "Fashion",
    description:
      "Layout asimetris dan galeri dinamis yang sempurna untuk brand gaya hidup.",
    active: false,
  },
]

export default function TemplatesPage() {
  return (
    <div className="p-8 max-w-6xl">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-indigo-600 tracking-tight mb-3">
          Pilih Template
        </h1>
        <p className="text-base text-gray-500 max-w-xl leading-relaxed">
          Mulai koleksi baru Anda dengan desain yang dikurasi secara profesional.
          Setiap template dioptimalkan untuk performa dan konversi.
        </p>
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {templates.map((template) => (
          <TemplateCard key={template.id} {...template} />
        ))}
      </div>
    </div>
  )
}
