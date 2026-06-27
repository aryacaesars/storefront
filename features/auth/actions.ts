"use server"
import { signIn, signOut } from "@/auth"

export async function loginWithGoogle(): Promise<void> {
  await signIn("google", { redirectTo: "/dashboard" })
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/login" })
}
