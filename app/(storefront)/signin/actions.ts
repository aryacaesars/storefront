"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { authenticateCustomer, CustomerAuthError } from "@/server/services/customer.service"
import { createCustomerSession } from "@/lib/storefront/customer-session"
import { getCurrentStoreId } from "@/features/storefront/customer-dal"

const SignInInput = z.object({
  email: z.string().email("Email tidak valid."),
  password: z.string().min(1, "Password wajib diisi."),
})

export type SignInState = { error: string } | undefined

export async function signInAction(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const storeId = await getCurrentStoreId()
  if (!storeId) return { error: "Toko tidak ditemukan." }

  const parsed = SignInInput.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Input tidak valid." }

  try {
    const customer = await authenticateCustomer({
      storeId,
      email: parsed.data.email,
      password: parsed.data.password,
    })
    await createCustomerSession({ customerId: customer.id, storeId: customer.storeId })
  } catch (err) {
    if (err instanceof CustomerAuthError) return { error: "Email atau password salah." }
    throw err
  }

  redirect("/account")
}
