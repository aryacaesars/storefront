"use client";

import { useActionState } from "react";
import {
  connectCatalogAction,
  type ConnectCatalogFormState,
  type ScalevStoreOption,
} from "@/features/builder/actions/connect-catalog";

type ConnectCatalogFormProps = {
  stores: ScalevStoreOption[];
  defaultStoreId?: number | null;
};

export function ConnectCatalogForm({
  stores,
  defaultStoreId,
}: ConnectCatalogFormProps) {
  const [state, action, pending] = useActionState<
    ConnectCatalogFormState,
    FormData
  >(connectCatalogAction, undefined);

  if (stores.length === 0) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Tidak ada store di akun Scalev ini. Buat store di dashboard Scalev
        dulu, lalu refresh halaman ini.
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="storeNumericId"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500"
        >
          Pilih Store Scalev
        </label>
        <select
          id="storeNumericId"
          name="storeNumericId"
          required
          defaultValue={defaultStoreId ?? stores[0]?.id}
          className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
        >
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
              {!store.isPublic ? " (private)" : ""}
            </option>
          ))}
        </select>
        <p className="mt-1.5 text-xs text-gray-500">
          Platform akan membuat Storefront API key dan mendaftarkan origin
          subdomain etalase Anda secara otomatis.
        </p>
      </div>

      {state && "error" in state && state.error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {state.error}
        </p>
      )}

      {state && "success" in state && state.success && (
        <p
          role="status"
          className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800"
        >
          {state.success}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Menghubungkan katalog…" : "Connect Catalog"}
      </button>
    </form>
  );
}
