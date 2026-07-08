import Link from "next/link"
import { HelpCircle, Mail, MessageCircle } from "lucide-react"
import { requireSession } from "@/features/auth/dal"
import { DashboardShell } from "@/features/builder/components/DashboardShell"
import { DashboardPanel } from "@/features/builder/components/dashboard-ui"

export const metadata = { title: "Support — Etalase" }

export default async function SupportPage() {
  await requireSession()

  return (
    <DashboardShell
      pageTitle="Support"
      pageSubtitle="Butuh bantuan? Hubungi tim Etalase lewat channel di bawah."
    >
      <div className="grid w-full gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DashboardPanel className="flex items-start gap-4 p-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink">Email</h2>
            <p className="mt-1 text-sm text-gray-500">
              Kirim pertanyaan atau laporan bug ke tim kami.
            </p>
            <a
              href="mailto:support@etalase.com"
              className="mt-3 inline-block text-sm font-semibold text-brand hover:text-brand-dark"
            >
              support@etalase.com
            </a>
          </div>
        </DashboardPanel>

        <DashboardPanel className="flex items-start gap-4 p-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink">Dokumentasi</h2>
            <p className="mt-1 text-sm text-gray-500">
              Pelajari cara setup store, template, dan kustomisasi.
            </p>
            <Link
              href="/dashboard"
              className="mt-3 inline-block text-sm font-semibold text-brand hover:text-brand-dark"
            >
              Kembali ke Dashboard
            </Link>
          </div>
        </DashboardPanel>

        <DashboardPanel className="flex items-start gap-4 p-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink">Tips Cepat</h2>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-500">
              <li>
                <strong className="font-medium text-ink">Template</strong> — pilih & aktifkan
                desain storefront
              </li>
              <li>
                <strong className="font-medium text-ink">Kustomisasi</strong> — edit konten setelah
                template aktif
              </li>
              <li>
                <strong className="font-medium text-ink">Pengaturan</strong> — ubah nama & slug
                store
              </li>
            </ul>
          </div>
        </DashboardPanel>
      </div>
    </DashboardShell>
  )
}
