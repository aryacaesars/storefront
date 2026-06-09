import { requireSession } from "@/features/auth/dal";
import { logoutAction } from "@/features/auth/actions";

export const metadata = { title: "Dashboard — Storefront Builder" };

export default async function DashboardPage() {
  const session = await requireSession(); // redirects to /login if unauthenticated

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Halo, {session.displayName || "Merchant"} 👋
          </h1>
          <p className="mt-1 text-sm text-foreground/60">
            Tenant aktif: <span className="font-mono">{session.tenantSlug}</span>
          </p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-lg border border-black/10 px-4 py-2 text-sm font-medium transition hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/5"
          >
            Logout
          </button>
        </form>
      </div>

      <div className="mt-8 rounded-xl border border-black/10 p-6 text-sm text-foreground/70 dark:border-white/10">
        <p>Session aktif. Selanjutnya: pilih template &amp; kustomisasi branding.</p>
        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-xs text-foreground/60">
          <dt>merchantId</dt>
          <dd>{session.merchantId}</dd>
          <dt>tenantId</dt>
          <dd>{session.tenantId}</dd>
        </dl>
      </div>
    </main>
  );
}
