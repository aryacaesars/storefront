import Link from "next/link"
import { HelpCircle, Mail, MessageCircle } from "lucide-react"
import { requireSession } from "@/features/auth/dal"
import { DashboardShell } from "@/features/builder/components/DashboardShell"
import { DashboardPanel } from "@/features/builder/components/dashboard-ui"
import { getPageMessages } from "@/features/i18n/get-page-messages"

export const metadata = { title: "Support" }

export default async function SupportPage() {
  await requireSession()
  const t = await getPageMessages()

  return (
    <DashboardShell pageTitle={t.support.title} pageSubtitle={t.support.subtitle}>
      <div className="grid w-full gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DashboardPanel className="flex items-start gap-4 p-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink">{t.support.emailTitle}</h2>
            <p className="mt-1 text-sm text-gray-500">{t.support.emailBody}</p>
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
            <h2 className="text-base font-bold text-ink">{t.support.docsTitle}</h2>
            <p className="mt-1 text-sm text-gray-500">{t.support.docsBody}</p>
            <Link
              href="/docs"
              className="mt-3 inline-block text-sm font-semibold text-brand hover:text-brand-dark"
            >
              {t.support.docsCta}
            </Link>
          </div>
        </DashboardPanel>

        <DashboardPanel className="flex items-start gap-4 p-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink">{t.support.tipsTitle}</h2>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-500">
              <li>{t.support.tipTemplates}</li>
              <li>{t.support.tipCustomize}</li>
              <li>{t.support.tipSettings}</li>
            </ul>
          </div>
        </DashboardPanel>
      </div>
    </DashboardShell>
  )
}
