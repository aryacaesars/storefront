"use server"

import { AuthError } from "next-auth"
import { z } from "zod"
import { signIn, signOut, resolveMerchantRole } from "@/auth"
import { prisma } from "@/lib/db/prisma"
import { hashPassword } from "@/lib/auth/password"
import { strongPasswordSchema } from "@/features/auth/password-rules"
import type { LoginFormState } from "@/features/auth/types"

const CredentialsInput = z.object({
  email: z.string().email("Invalid email."),
  password: z.string().min(1, "Password is required."),
})

const RegisterInput = z
  .object({
    name: z.string().trim().max(80).optional(),
    email: z.string().email("Invalid email."),
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export async function loginWithGoogle(): Promise<void> {
  await signIn("google", { redirectTo: "/dashboard" })
}

export async function loginWithCredentials(
  _prev: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const parsed = CredentialsInput.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
  }

  try {
    await signIn("credentials", {
      email: normalizeEmail(parsed.data.email),
      password: parsed.data.password,
      redirectTo: "/dashboard",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." }
    }
    throw error
  }
}

export async function registerWithCredentials(
  _prev: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const parsed = RegisterInput.safeParse({
    name: formData.get("name") || undefined,
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
  }

  const email = normalizeEmail(parsed.data.email)
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return { error: "Email already registered. Please sign in." }
  }

  const passwordHash = await hashPassword(parsed.data.password)
  const name = parsed.data.name?.trim() || null
  const role = resolveMerchantRole(email)

  await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      role,
    },
  })

  try {
    await signIn("credentials", {
      email,
      password: parsed.data.password,
      redirectTo: "/dashboard",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Account created, but sign-in failed. Try signing in manually." }
    }
    throw error
  }
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/login" })
}
