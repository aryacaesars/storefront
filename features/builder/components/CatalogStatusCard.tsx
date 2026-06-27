import Link from "next/link";
import { Package, PlugZap } from "lucide-react";
// TODO Sprint 2: reconnect to Prisma data source — Tenant type and isCatalogConnected removed
// import type { Tenant } from "@/server/services/tenant.service";
// import { isCatalogConnected } from "@/server/services/tenant.service";
import { getStorefrontUrl } from "@/lib/tenant/storefront-url";

type CatalogStatusCardProps = {
  // TODO Sprint 2: replace with Store type from new tenant.service
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tenant: any | null;
  tenantSlug: string;
};

export function CatalogStatusCard({ tenant, tenantSlug }: CatalogStatusCardProps) {
  // TODO Sprint 2: reconnect to Prisma data source — isCatalogConnected stub
  const connected = false;
  const storefrontUrl = getStorefrontUrl(tenantSlug);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              connected ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
            }`}
          >
            {connected ? (
              <Package className="h-5 w-5" />
            ) : (
              <PlugZap className="h-5 w-5" />
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Katalog</p>
            <p className="text-xs text-gray-500">
              {connected
                ? `${tenant?.catalogProductCount ?? 0} produk · ${tenant?.scalevStoreName}`
                : "Belum terhubung — produk masih mock/kosong"}
            </p>
          </div>
        </div>
        <Link
          href="/connect"
          className="shrink-0 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          {connected ? "Kelola" : "Connect"}
        </Link>
      </div>

      {connected && (
        <a
          href={`${storefrontUrl}/products`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block text-xs font-medium text-indigo-600 hover:underline"
        >
          Lihat produk live →
        </a>
      )}
    </div>
  );
}
