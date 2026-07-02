import type { ReactNode } from "react"
import Link from "next/link"
import { requireAdmin } from "@/features/auth/dal"
import EtalaseMark from "@/features/builder/landing/EtalaseMark"
import { SidebarAccountMenu } from "@/features/builder/components/SidebarAccountMenu"
import { AdminNavLinks } from "./AdminNavLinks"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireAdmin()

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <aside className="w-52 shrink-0 flex flex-col bg-white border-r border-gray-200 overflow-y-auto">
        <div className="px-4 py-5 border-b border-gray-100">
          <Link href="/admin" aria-label="Admin home">
            <EtalaseMark />
          </Link>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-indigo-600">Admin Panel</p>
        </div>
        <div className="flex-1 pt-4">
          <AdminNavLinks />
        </div>
        <div className="pb-4 px-2 border-t border-gray-100 pt-4">
          <SidebarAccountMenu displayName={session.name ?? "Admin"} subtitle="Admin" showProfile={false} />
        </div>
      </aside>
      <main className="flex-1 min-h-0 overflow-auto bg-[#eceaf3]">{children}</main>
    </div>
  )
}
