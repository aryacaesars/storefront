"use server"

import { redirect } from "next/navigation"
import { clearCustomerSession } from "@/lib/storefront/customer-session"

export async function logoutAction(): Promise<void> {
  await clearCustomerSession()
  redirect("/")
}
