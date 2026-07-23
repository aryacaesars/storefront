"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { clearCustomerSession } from "@/lib/storefront/customer-session"
import { requireCustomer } from "@/features/storefront/customer-dal"
import {
  changeCustomerPassword,
  CustomerAuthError,
  deleteCustomerAddress,
  saveCustomerAddress,
  setDefaultCustomerAddress,
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
  name: z.string().trim().min(1, "Name is required."),
  phone: z
    .string()
    .trim()
    .min(8, "Phone number must be at least 8 digits.")
    .max(20, "Phone number is too long.")
    .regex(/^[0-9+\-\s()]+$/, "Invalid phone number."),
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
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
  }

  await updateCustomerProfile(session.customerId, {
    name: parsed.data.name,
    phone: parsed.data.phone,
  })
  revalidatePath("/account")
  revalidatePath("/checkout")
  return { ok: true, message: "Profile saved." }
}

const AddressInput = z.object({
  addressId: z.string().optional(),
  label: z.string().optional(),
  street: z.string().trim().min(1, "Address is required."),
  city: z.string().trim().min(1, "City is required."),
  province: z.string().trim().min(1, "Province is required."),
  postalCode: z.string().trim().min(1, "Postal code is required."),
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
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
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
    return { error: "Failed to save address." }
  }

  revalidatePath("/account")
  revalidatePath("/checkout")
  return {
    ok: true,
    message: parsed.data.addressId ? "Address updated." : "Address added.",
  }
}

export async function setDefaultAddressAction(
  _prev: AccountFormState,
  formData: FormData,
): Promise<AccountFormState> {
  const session = await requireCustomer()
  const addressId = String(formData.get("addressId") ?? "").trim()
  if (!addressId) return { error: "Invalid address." }

  try {
    await setDefaultCustomerAddress(session.customerId, addressId)
  } catch {
    return { error: "Failed to activate address." }
  }

  revalidatePath("/account")
  revalidatePath("/checkout")
  return { ok: true, message: "Active address updated." }
}

export async function deleteAddressAction(
  _prev: AccountFormState,
  formData: FormData,
): Promise<AccountFormState> {
  const session = await requireCustomer()
  const addressId = String(formData.get("addressId") ?? "").trim()
  if (!addressId) return { error: "Invalid address." }

  try {
    await deleteCustomerAddress(session.customerId, addressId)
  } catch (err) {
    if (err instanceof Error && err.message === "ADDRESS_IS_DEFAULT") {
      return { error: "Active address cannot be deleted." }
    }
    return { error: "Failed to delete address." }
  }

  revalidatePath("/account")
  revalidatePath("/checkout")
  return { ok: true, message: "Address deleted." }
}

const PasswordInput = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z.string().min(6, "New password must be at least 6 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password confirmation does not match.",
    path: ["confirmPassword"],
  })

export async function changePasswordAction(
  _prev: AccountFormState,
  formData: FormData,
): Promise<AccountFormState> {
  const session = await requireCustomer()
  const parsed = PasswordInput.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
  }

  try {
    await changeCustomerPassword({
      customerId: session.customerId,
      currentPassword: parsed.data.currentPassword,
      newPassword: parsed.data.newPassword,
    })
  } catch (err) {
    if (err instanceof CustomerAuthError) {
      return { error: "Current password is incorrect." }
    }
    return { error: "Failed to change password." }
  }

  return { ok: true, message: "Password changed." }
}
