import Link from "next/link";
import { CheckCircle2, Package, PlugZap } from "lucide-react";
import { requireSession } from "@/features/auth/dal";
// TODO Sprint 2: reconnect to Prisma data source — getTenantById/isCatalogConnected removed
// import { getTenantById, isCatalogConnected } from "@/server/services/tenant.service";
import { loadScalevStoreOptions } from "@/features/builder/actions/connect-catalog";
import { ConnectCatalogForm } from "@/features/builder/components/ConnectCatalogForm";
import { getStorefrontUrl } from "@/lib/tenant/storefront-url";

export const metadata = { title: "Connect Catalog — Storefront Builder" };

export default async function ConnectCatalogPage() {
  const session = await requireSession();
  // TODO Sprint 2: reconnect to Prisma data source
  // const tenant = await getTenantById(session.tenantId);
  const tenant = null;
  const stores = await loadScalevStoreOptions();
  // TODO Sprint 2: reconnect — isCatalogConnected needs new Store model
  const connected = false;
  // @ts-expect-error TODO Sprint 2: session.tenantSlug not in new SessionData shape
  const storefrontUrl = getStorefrontUrl(session.tenantSlug ?? "");

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight">
          Connect Product Catalog
        </h1>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed">
          Hubungkan store ke etalase. Produk akan tampil di storefront publik.
        </p>
      </div>

      {connected && tenant && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-green-900">
              Katalog terhubung
            </p>
            <Link
              href={`${storefrontUrl}/products`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex text-xs font-semibold text-green-700 underline-offset-2 hover:underline"
            >
              Buka /products di storefront →
            </Link>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            {connected ? (
              <Package className="h-5 w-5" />
            ) : (
              <PlugZap className="h-5 w-5" />
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {connected ? "Reconnect atau ganti store" : "Hubungkan produk"}
            </h2>
          </div>
        </div>

        <ConnectCatalogForm
          stores={stores}
          defaultStoreId={undefined}
        />
      </div>
    </div>
  );
}
