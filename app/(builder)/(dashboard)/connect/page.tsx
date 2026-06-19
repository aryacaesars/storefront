import Link from "next/link";
import { CheckCircle2, Package, PlugZap } from "lucide-react";
import { requireSession } from "@/features/auth/dal";
import {
  getTenantById,
  isCatalogConnected,
} from "@/server/services/tenant.service";
import { loadScalevStoreOptions } from "@/features/builder/actions/connect-catalog";
import { ConnectCatalogForm } from "@/features/builder/components/ConnectCatalogForm";
import { getStorefrontUrl } from "@/lib/tenant/storefront-url";

export const metadata = { title: "Connect Catalog — Storefront Builder" };

export default async function ConnectCatalogPage() {
  const session = await requireSession();
  const tenant = await getTenantById(session.tenantId);
  const stores = await loadScalevStoreOptions();
  const connected = tenant ? isCatalogConnected(tenant) : false;
  const storefrontUrl = getStorefrontUrl(session.tenantSlug);

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
          Scalev Commerce
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight">
          Connect Product Catalog
        </h1>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed">
          Hubungkan store Scalev ke etalase{" "}
          <span className="font-medium text-gray-700">{session.tenantSlug}</span>.
          Produk akan tampil di storefront publik tanpa setting env manual.
        </p>
      </div>

      {connected && tenant && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-green-900">
              Katalog terhubung
            </p>
            <p className="mt-1 text-sm text-green-800">
              Store: <strong>{tenant.scalevStoreName}</strong>
              {tenant.catalogProductCount != null && (
                <> · {tenant.catalogProductCount} produk visible</>
              )}
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
            <p className="text-xs text-gray-500">
              Menggunakan token Scalev dari sesi login Anda (sk_/rk_).
            </p>
          </div>
        </div>

        <ConnectCatalogForm
          stores={stores}
          defaultStoreId={tenant?.scalevStoreNumericId}
        />
      </div>
    </div>
  );
}
