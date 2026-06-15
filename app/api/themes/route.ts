import { NextResponse } from "next/server"
import { getSession } from "@/features/auth/dal"
import { getActiveTemplateId, getThemeConfig } from "@/features/builder/theme-state"
import { saveThemeDraft } from "@/features/builder/actions/theme-actions"
import { themeConfigSchema } from "@/themes/engine/schema"

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const templateId = await getActiveTemplateId()
  const config = await getThemeConfig()

  return NextResponse.json({ templateId, config })
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const config = themeConfigSchema.parse(body)
  await saveThemeDraft(config)

  return NextResponse.json({ ok: true, config })
}
