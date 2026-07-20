"use server"

import { z } from "zod"
import { registerCustomer, CustomerAuthError } from "@/server/services/customer.service"
import { createCustomerSession } from "@/lib/storefront/customer-session"
import { getCurrentStoreId } from "@/features/storefront/customer-dal"

const SignUpInput = z.object({
  name: z.string().trim().min(1, "Name is required."),
  email: z.string().email("Invalid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
})

// Jangan redirect() dari server action storefront: buang subdomain → theme flip.
export type SignUpState = { error: string } | { success: true } | undefined

export async function signUpAction(_prev: SignUpState, formData: FormData): Promise<SignUpState> {
  const storeId = await getCurrentStoreId()
  if (!storeId) return { error: "Store not found." }

  const parsed = SignUpInput.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." }

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
      return { error: err.code === "EMAIL_TAKEN" ? "Email already registered. Try signing in." : "Registration failed." }
    }
    throw err
  }

  return { success: true }
}
