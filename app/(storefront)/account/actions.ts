"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { clearCustomerSession } from "@/lib/storefront/customer-session"
import { requireCustomer } from "@/features/storefront/customer-dal"
import {
  saveCustomerAddress,
  updateCustomerProfile,
} from "@/server/services/customer.service"

export type AccountFormState =
  | { error: string }
  | { ok: true; message?: string }
  | undefined

// Tanpa redirect(): client nav (window.location) supaya subdomain tetap dan
// theme tidak flip ke default. Lihat LogoutButton.
export async function logoutAction(): Promise<void> {
  await clearCustomerSession()
}

const ProfileInput = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi."),
  phone: z
    .string()
    .trim()
    .min(8, "No. HP minimal 8 digit.")
    .max(20, "No. HP terlalu panjang.")
    .regex(/^[0-9+\-\s()]+$/, "No. HP tidak valid."),
})

export async function updateProfileAction(
  _prev: AccountFormState,
  formData: FormData,
): Promise<AccountFormState> {
  const session = await requireCustomer()
  const parsed = ProfileInput.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid." }
  }

  await updateCustomerProfile(session.customerId, {
    name: parsed.data.name,
    phone: parsed.data.phone,
  })
  revalidatePath("/account")
  revalidatePath("/checkout")
  return { ok: true, message: "Profil disimpan." }
}

const AddressInput = z.object({
  addressId: z.string().optional(),
  label: z.string().optional(),
  street: z.string().trim().min(1, "Alamat wajib diisi."),
  city: z.string().trim().min(1, "Kota wajib diisi."),
  province: z.string().trim().min(1, "Provinsi wajib diisi."),
  postalCode: z.string().trim().min(1, "Kode pos wajib diisi."),
  makeDefault: z.boolean().optional(),
})

export async function saveAddressAction(
  _prev: AccountFormState,
  formData: FormData,
): Promise<AccountFormState> {
  const session = await requireCustomer()
  const addressIdRaw = String(formData.get("addressId") ?? "").trim()
  const parsed = AddressInput.safeParse({
    addressId: addressIdRaw || undefined,
    label: String(formData.get("label") ?? ""),
    street: formData.get("street"),
    city: formData.get("city"),
    province: formData.get("province"),
    postalCode: formData.get("postalCode"),
    makeDefault: formData.get("makeDefault") === "on" || formData.get("makeDefault") === "1",
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid." }
  }

  try {
    await saveCustomerAddress({
      customerId: session.customerId,
      addressId: parsed.data.addressId,
      label: parsed.data.label,
      street: parsed.data.street,
      city: parsed.data.city,
      province: parsed.data.province,
      postalCode: parsed.data.postalCode,
      makeDefault: parsed.data.makeDefault,
    })
  } catch {
    return { error: "Gagal menyimpan alamat." }
  }

  revalidatePath("/account")
  revalidatePath("/checkout")
  return {
    ok: true,
    message: parsed.data.addressId ? "Alamat diperbarui." : "Alamat ditambahkan.",
  }
}
