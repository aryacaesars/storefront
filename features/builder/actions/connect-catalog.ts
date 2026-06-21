"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/features/auth/dal";
import {
  connectTenantCatalog,
  getTenantById,
} from "@/server/services/tenant.service";
import { listSimplifiedStores } from "@/lib/scalev/endpoints/storefront";
import { ScalevError } from "@/lib/scalev/client";

export type ConnectCatalogFormState =
  | { error: string }
  | { success: string }
  | undefined;

const ConnectInput = z.object({
  storeNumericId: z.coerce
    .number()
    .int()
    .positive("Pilih store Scalev."),
});

export async function connectCatalogAction(
  _prev: ConnectCatalogFormState,
  formData: FormData,
): Promise<ConnectCatalogFormState> {
  const session = await requireSession();
  const parsed = ConnectInput.safeParse({
    storeNumericId: formData.get("storeNumericId"),
  });
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Input tidak valid.",
    };
  }

  const tenant = await getTenantById(session.tenantId);
  if (!tenant) {
    return { error: "Tenant tidak ditemukan. Login ulang." };
  }

  try {
    const result = await connectTenantCatalog({
      tenantId: tenant.id,
      tenantSlug: session.tenantSlug,
      scalevToken: session.scalevToken,
      storeNumericId: parsed.data.storeNumericId,
    });

    revalidatePath("/dashboard");
    revalidatePath("/connect");
    revalidatePath("/products");

    return {
      success: `Katalog terhubung: ${result.storeName} · ${result.productCount} produk visible. Lihat ${result.storefrontUrl}/products`,
    };
  } catch (e) {
    if (e instanceof ScalevError) {
      return {
        error: `Scalev menolak koneksi (HTTP ${e.status}). Periksa scope API key (store:update, product:list).`,
      };
    }
    if (e instanceof Error) return { error: e.message };
    return { error: "Gagal menghubungkan katalog." };
  }
}

export type ScalevStoreOption = {
  id: number;
  uniqueId: string;
  name: string;
  isPublic: boolean;
};

export async function loadScalevStoreOptions(): Promise<ScalevStoreOption[]> {
  const session = await requireSession();
  try {
    const stores = await listSimplifiedStores(session.scalevToken);
    return stores
      .filter((s) => s.unique_id)
      .map((s) => ({
        id: Number(s.id),
        uniqueId: s.unique_id!,
        name: s.name?.trim() || `Store #${s.id}`,
        isPublic: s.is_public !== false,
      }));
  } catch (e) {
    console.error("[connect] listSimplifiedStores:", e);
    return [];
  }
}
