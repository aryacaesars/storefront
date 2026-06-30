"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { registerCustomer, CustomerAuthError } from "@/server/services/customer.service"
import { createCustomerSession } from "@/lib/storefront/customer-session"
import { getCurrentStoreId } from "@/features/storefront/customer-dal"

const SignUpInput = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi."),
  email: z.string().email("Email tidak valid."),
  password: z.string().min(6, "Password minimal 6 karakter."),
})

export type SignUpState = { error: string } | undefined

export async function signUpAction(_prev: SignUpState, formData: FormData): Promise<SignUpState> {
  const storeId = await getCurrentStoreId()
  if (!storeId) return { error: "Toko tidak ditemukan." }

  const parsed = SignUpInput.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Input tidak valid." }

  try {
    const customer = await registerCustomer({
      storeId,
      email: parsed.data.email,
      name: parsed.data.name,
      password: parsed.data.password,
    })
    await createCustomerSession({ customerId: customer.id, storeId: customer.storeId })
  } catch (err) {
    if (err instanceof CustomerAuthError) {
      return { error: err.code === "EMAIL_TAKEN" ? "Email sudah terdaftar. Coba masuk." : "Gagal mendaftar." }
    }
    throw err
  }

  redirect("/account")
}
