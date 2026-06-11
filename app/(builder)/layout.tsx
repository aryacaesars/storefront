import type { ReactNode } from "react";
import { Search, Monitor, Bell, HelpCircle, User2 } from "lucide-react";
import { SidebarNavLinks } from "@/features/builder/components/SidebarNavLinks";
import { TopbarTabs } from "@/features/builder/components/TopbarTabs";

/**
 * Builder shell (merchant dashboard host: app.<root>).
 * NOTE: NO auth check here — Next.js 16 layouts don't re-render on navigation,
 * so auth gating lives in the DAL (requireSession) inside each protected page.
 */
export default function BuilderLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      <header className="h-14 flex items-center shrink-0 bg-white border-b border-gray-200 px-4 gap-4 z-10">
        <div className="w-52 shrink-0 flex items-center gap-2">
          <span className="text-indigo-600">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.09 6.41H21l-5.47 3.97 2.09 6.41L12 14.82l-5.62 4.07 2.09-6.41L3 8.41h6.91L12 2z" />
            </svg>
          </span>
          <span className="font-bold text-gray-900 text-[15px] tracking-tight">Etalase</span>
        </div>

        <div className="relative w-56 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search resources..."
            className="w-full h-8 pl-8 pr-3 bg-gray-100 rounded-lg text-xs text-gray-600 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:bg-white transition-colors"
          />
        </div>

        <div className="flex-1 flex justify-center">
          <TopbarTabs />
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <Monitor className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-gray-200 mx-1" />
          <button className="px-3 h-8 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            Save Draft
          </button>
          <button className="px-4 h-8 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors">
            Publish
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-52 shrink-0 flex flex-col bg-white border-r border-gray-200 overflow-y-auto">
          <div className="flex-1 pt-4">
            <SidebarNavLinks />
          </div>

          <div className="pb-4 px-2 border-t border-gray-100 pt-4">
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <HelpCircle className="w-4 h-4 shrink-0" />
              Support
            </a>

            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors text-left mt-0.5">
              <span className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                <User2 className="w-3.5 h-3.5 text-gray-500" />
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-gray-800 leading-tight truncate">
                  Account
                </span>
                <span className="text-[10px] text-gray-400 leading-tight">Pro Merchant</span>
              </div>
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
