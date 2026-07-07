import Link from "next/link"
import { Pencil } from "lucide-react"
import { getActiveTemplateId, getThemeConfig } from "@/features/builder/theme-state"
import { TEMPLATE_META } from "@/themes/engine/registry"
import { TemplateThumbnail } from "@/features/builder/components/TemplateThumbnail"

export async function ActiveThemeCard() {
  const templateId = await getActiveTemplateId()
  const config = await getThemeConfig()
  const meta = TEMPLATE_META[templateId]

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <TemplateThumbnail id={templateId} />

        <span className="absolute bottom-3 left-3 px-2.5 py-0.5 bg-gray-900 text-white text-[9px] font-bold tracking-widest uppercase rounded">
          Active
        </span>
      </div>

      <div className="flex items-center justify-between px-4 py-3.5">
        <div>
          <p className="text-sm font-semibold text-gray-900 leading-tight">{meta.name}</p>
          <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[180px]">
            {config.storeName}
          </p>
        </div>
        <Link
          href="/customize"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          aria-label="Edit theme"
        >
          <Pencil className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
