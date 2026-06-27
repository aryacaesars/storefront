"use server";

// TODO Sprint 2: reconnect to Prisma data source — catalog connect via Scalev removed
// import { z } from "zod";
// import { revalidatePath } from "next/cache";
// import { requireSession } from "@/features/auth/dal";
// import { connectTenantCatalog, getTenantById } from "@/server/services/tenant.service";
// import { listSimplifiedStores } from "@/lib/scalev/endpoints/storefront";
// import { ScalevError } from "@/lib/scalev/client";

export type ConnectCatalogFormState =
  | { error: string }
  | { success: string }
  | undefined;

export async function connectCatalogAction(
  _prev: ConnectCatalogFormState,
  _formData: FormData,
): Promise<ConnectCatalogFormState> {
  // TODO Sprint 2: implement catalog connection via new data source
  return { error: "Fitur katalog belum tersedia di Sprint 1." };
}

export type ScalevStoreOption = {
  id: number;
  uniqueId: string;
  name: string;
  isPublic: boolean;
};

export async function loadScalevStoreOptions(): Promise<ScalevStoreOption[]> {
  // TODO Sprint 2: load store options from new data source
  return [];
}
