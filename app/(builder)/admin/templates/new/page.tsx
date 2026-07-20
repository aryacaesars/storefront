import Link from "next/link"
import { requireAdmin } from "@/features/auth/dal"
import { DashboardShell } from "@/features/builder/components/DashboardShell"
import {
  DashboardPanel,
  dashboardBackLink,
} from "@/features/builder/components/dashboard-ui"
import { TemplateForm } from "../TemplateForm"
import { createTemplateAction } from "./actions"

export const metadata = { title: "Add Template" }

export default async function NewTemplatePage() {
  await requireAdmin()
  return (
    <DashboardShell
      pageTitle="Add Template"
      pageSubtitle="Fill in marketplace template details and set its publish status"
    >
      <div className="flex flex-col gap-4">
        <Link href="/admin/templates" className={dashboardBackLink}>
          ← Back to template list
        </Link>
        <DashboardPanel className="p-6 lg:p-8">
          <TemplateForm action={createTemplateAction} submitLabel="Create Template" />
        </DashboardPanel>
      </div>
    </DashboardShell>
  )
}
