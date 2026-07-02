import Link from "next/link"
import { requireAdmin } from "@/features/auth/dal"
import { DashboardShell } from "@/features/builder/components/DashboardShell"
import {
  DashboardPanel,
  dashboardBackLink,
} from "@/features/builder/components/dashboard-ui"
import { TemplateForm } from "../TemplateForm"
import { createTemplateAction } from "./actions"

export const metadata = { title: "Admin — Tambah Template" }

export default async function NewTemplatePage() {
  await requireAdmin()
  return (
    <DashboardShell
      pageTitle="Tambah Template"
      pageSubtitle="Isi detail template marketplace lalu tentukan status terbitnya"
    >
      <div className="flex flex-col gap-4">
        <Link href="/admin/templates" className={dashboardBackLink}>
          ← Kembali ke daftar template
        </Link>
        <DashboardPanel className="p-6 lg:p-8">
          <TemplateForm action={createTemplateAction} submitLabel="Buat Template" />
        </DashboardPanel>
      </div>
    </DashboardShell>
  )
}
