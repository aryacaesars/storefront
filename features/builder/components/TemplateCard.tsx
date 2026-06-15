import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { activateTemplate } from "@/features/builder/actions/theme-actions"
import { TemplateThumbnail } from "@/features/builder/components/TemplateThumbnail"
import type { TemplateId } from "@/themes/engine/schema"

export interface TemplateCardProps {
  id: TemplateId
  name: string
  description: string
  active?: boolean
  previewReady?: boolean
  purchasedAt?: string
}

export function TemplateCard({
  id,
  name,
  description,
  active = false,
  previewReady = false,
  purchasedAt,
}: TemplateCardProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-200",
        active
          ? "border-indigo-600 ring-2 ring-indigo-600 shadow-lg shadow-indigo-100"
          : "border-gray-200 hover:border-gray-300 hover:shadow-md",
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <TemplateThumbnail id={id} className="aspect-auto h-full" />

        {active ? (
          <Badge className="absolute top-3 right-3 bg-white text-indigo-700 border-indigo-200 shadow-sm gap-1 px-3 py-1">
            <CheckCircle2 className="w-3 h-3 fill-indigo-600 text-white" />
            TERPASANG
          </Badge>
        ) : (
          <Badge className="absolute top-3 right-3 bg-white text-gray-600 border-gray-200 shadow-sm px-3 py-1">
            {previewReady ? "SIAP PREVIEW" : "SEGERA"}
          </Badge>
        )}
      </div>

      <CardContent className="pt-5 pb-3">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
        {purchasedAt && (
          <p className="text-xs text-gray-400 mt-2">Dibeli pada {purchasedAt}</p>
        )}
      </CardContent>

      <CardFooter className="gap-3">
        {active ? (
          <>
            <Link
              href="/customize"
              className="flex-1 inline-flex items-center justify-center h-9 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              Kelola
            </Link>
            <Link
              href="/customize?mode=preview"
              className="flex-1 inline-flex items-center justify-center h-9 rounded-xl border border-gray-300 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Preview
            </Link>
          </>
        ) : (
          <>
            <form action={activateTemplate} className="flex-1">
              <input type="hidden" name="templateId" value={id} />
              <Button type="submit" variant="default" className="w-full">
                Aktifkan
              </Button>
            </form>
            {previewReady ? (
              <Link
                href={`/customize?template=${id}&mode=preview`}
                className="flex-1 inline-flex items-center justify-center h-9 rounded-xl border border-gray-300 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Preview
              </Link>
            ) : (
              <Button variant="outline" className="flex-1" disabled>
                Preview
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  )
}
