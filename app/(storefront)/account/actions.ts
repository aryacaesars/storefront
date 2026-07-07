"use server"

import { clearCustomerSession } from "@/lib/storefront/customer-session"

// Tanpa redirect(): client nav (window.location) supaya subdomain tetap dan
// theme tidak flip ke default. Lihat LogoutButton.
export async function logoutAction(): Promise<void> {
  await clearCustomerSession()
}
