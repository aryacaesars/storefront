import { requireSession } from "@/features/auth/dal"
import { CustomizeWorkspace } from "@/features/builder/components/CustomizeWorkspace"

export const metadata = { title: "Customize — Storefront Builder" }

// TODO: ambil template aktif dari API theme/tenant
const ACTIVE_TEMPLATE = "Minimalist"

export default async function CustomizePage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>
}) {
  await requireSession()

  const { mode } = await searchParams
  const initialMode = mode === "preview" ? "preview" : "edit"

  return (
    <CustomizeWorkspace
      templateName={ACTIVE_TEMPLATE}
      initialMode={initialMode}
    />
  )
}
