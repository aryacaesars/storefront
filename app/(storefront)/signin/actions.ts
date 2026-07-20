"use server"

import { z } from "zod"
import { authenticateCustomer, CustomerAuthError } from "@/server/services/customer.service"
import { createCustomerSession } from "@/lib/storefront/customer-session"
import { getCurrentStoreId } from "@/features/storefront/customer-dal"

const SignInInput = z.object({
  email: z.string().email("Invalid email."),
  password: z.string().min(1, "Password is required."),
})

// Sengaja TIDAK redirect() dari server action: redirect di storefront buang
// subdomain → theme resolve ke default = flip. Client nav via window.location.
export type SignInState = { error: string } | { success: true } | undefined

export async function signInAction(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const storeId = await getCurrentStoreId()
  if (!storeId) return { error: "Store not found." }

  const parsed = SignInInput.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." }

  try {
    const customer = await authenticateCustomer({
      storeId,
      email: parsed.data.email,
      password: parsed.data.password,
    })
    await createCustomerSession({ customerId: customer.id, storeId: customer.storeId })
  } catch (err) {
    if (err instanceof CustomerAuthError) return { error: "Invalid email or password." }
    throw err
  }

  return { success: true }
}
