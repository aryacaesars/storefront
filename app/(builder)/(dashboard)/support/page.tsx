import Link from "next/link"
import { HelpCircle, Mail, MessageCircle } from "lucide-react"
import { requireSession } from "@/features/auth/dal"
import { DashboardShell } from "@/features/builder/components/DashboardShell"
import { DashboardPanel } from "@/features/builder/components/dashboard-ui"

export const metadata = { title: "Support" }

export default async function SupportPage() {
  await requireSession()

  return (
    <DashboardShell
      pageTitle="Support"
      pageSubtitle="Need help? Contact the Etalase team through the channels below."
    >
      <div className="grid w-full gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DashboardPanel className="flex items-start gap-4 p-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink">Email</h2>
            <p className="mt-1 text-sm text-gray-500">
              Send questions or bug reports to our team.
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
            <h2 className="text-base font-bold text-ink">Documentation</h2>
            <p className="mt-1 text-sm text-gray-500">
              Learn how to set up your store, templates, and customization.
            </p>
            <Link
              href="/docs"
              className="mt-3 inline-block text-sm font-semibold text-brand hover:text-brand-dark"
            >
              Open documentation
            </Link>
          </div>
        </DashboardPanel>

        <DashboardPanel className="flex items-start gap-4 p-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink">Quick Tips</h2>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-500">
              <li>
                <strong className="font-medium text-ink">Templates</strong> — choose and activate
                your storefront design
              </li>
              <li>
                <strong className="font-medium text-ink">Customization</strong> — edit content after
                activating a template
              </li>
              <li>
                <strong className="font-medium text-ink">Settings</strong> — change store name &
                slug
              </li>
            </ul>
          </div>
        </DashboardPanel>
      </div>
    </DashboardShell>
  )
}
