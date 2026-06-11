import { requireSession } from "@/features/auth/dal";

export const metadata = { title: "Profile — Storefront Builder" };

export default async function ProfilePage() {
  const session = await requireSession();

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-4xl font-extrabold text-indigo-600 tracking-tight mb-8">
        Profile
      </h1>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <dl className="space-y-5">
          <div>
            <dt className="text-xs font-medium text-gray-500">Nama Merchant</dt>
            <dd className="text-sm text-gray-900 mt-1">{session.displayName}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500">Toko</dt>
            <dd className="text-sm text-gray-900 mt-1">{session.tenantSlug}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500">Paket</dt>
            <dd className="text-sm text-gray-900 mt-1">Pro Merchant</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
