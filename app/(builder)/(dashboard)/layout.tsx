import type { ReactNode } from "react";
import { HelpCircle } from "lucide-react";
import { getSession } from "@/features/auth/dal";
import { getStoresByOwnerId } from "@/server/services/tenant.service";
import { SidebarNavLinks } from "@/features/builder/components/SidebarNavLinks";
import { SidebarAccountMenu } from "@/features/builder/components/SidebarAccountMenu";
import EtalaseMark from "@/features/builder/landing/EtalaseMark";

/**
 * Dashboard shell dengan sidebar (merchant dashboard host: app.<root>).
 * Hanya untuk halaman dashboard/templates/settings/profile — /customize berada
 * di luar group ini karena editornya full-screen tanpa sidebar.
 * NOTE: NO auth check here — Next.js 16 layouts don't re-render on navigation,
 * so auth gating lives in the DAL (requireSession) inside each protected page.
 */
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  const stores = session ? await getStoresByOwnerId(session.userId) : [];

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <aside className="w-52 shrink-0 flex flex-col bg-white border-r border-gray-200 overflow-y-auto">
        <div className="px-4 py-5 border-b border-gray-100">
          <EtalaseMark />
        </div>

        <div className="flex-1 pt-4">
          <SidebarNavLinks stores={stores} isAdmin={session?.role === "ADMIN"} />
        </div>

        <div className="pb-4 px-2 border-t border-gray-100 pt-4">
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            Support
          </a>

          <SidebarAccountMenu displayName={session?.name ?? "Account"} />
        </div>
      </aside>

      <main className="flex-1 min-h-0 overflow-auto">{children}</main>
    </div>
  );
}
