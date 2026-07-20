import type { ReactNode } from "react"
import Link from "next/link"
import { requireAdmin } from "@/features/auth/dal"
import { DashboardLayoutShell } from "@/features/builder/components/DashboardLayoutShell"
import { LocaleShell } from "@/features/i18n/LocaleShell"
import { AdminNavLinks } from "./AdminNavLinks"

export const metadata = {
  title: {
    template: "%s — Admin Etalase",
    default: "Admin — Etalase",
  },
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireAdmin()

  return (
    <LocaleShell>
      <DashboardLayoutShell
        displayName={session.name ?? "Admin"}
        accountSubtitle="Admin"
        showProfile={false}
        sidebar={<AdminNavLinks />}
        sidebarBadge={
          <Link
            href="/admin"
            className="rounded-full bg-dash-primary-light px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-dash-primary"
          >
            Admin
          </Link>
        }
      >
        {children}
      </DashboardLayoutShell>
    </LocaleShell>
  )
}
