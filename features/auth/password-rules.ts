import { z } from "zod"

/** Aturan password register merchant. */
export const PASSWORD_RULES_HINT =
  "Min. 8 characters, uppercase & lowercase letters, plus a number or symbol."

const HAS_LOWER = /[a-z]/
const HAS_UPPER = /[A-Z]/
const HAS_DIGIT = /\d/
const HAS_SYMBOL = /[^A-Za-z0-9]/
const HAS_NUMBER_OR_SYMBOL = /[\d\W_]/

export type PasswordStrengthLevel = "empty" | "weak" | "fair" | "strong"

export type PasswordStrength = {
  level: PasswordStrengthLevel
  score: number
  label: string
  /** 0–100 untuk lebar bar. */
  percent: number
}

export function isStrongPassword(password: string): boolean {
  return (
    password.length >= 8 &&
    HAS_LOWER.test(password) &&
    HAS_UPPER.test(password) &&
    HAS_NUMBER_OR_SYMBOL.test(password)
  )
}

/** Skor visual untuk strength bar (bukan pengganti validasi server). */
export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { level: "empty", score: 0, label: "", percent: 0 }
  }

  let score = 0
  if (password.length >= 8) score += 1
  if (HAS_LOWER.test(password)) score += 1
  if (HAS_UPPER.test(password)) score += 1
  if (HAS_DIGIT.test(password) || HAS_SYMBOL.test(password)) score += 1
  if (password.length >= 12) score += 1
  if (HAS_DIGIT.test(password) && HAS_SYMBOL.test(password)) score += 1

  if (score <= 2) {
    return { level: "weak", score, label: "weak", percent: 33 }
  }
  if (score <= 4) {
    return { level: "fair", score, label: "fair", percent: 66 }
  }
  return { level: "strong", score, label: "strong", percent: 100 }
}

export const strongPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .refine((value) => HAS_LOWER.test(value), {
    message: "Password must include a lowercase letter.",
  })
  .refine((value) => HAS_UPPER.test(value), {
    message: "Password must include an uppercase letter.",
  })
  .refine((value) => HAS_NUMBER_OR_SYMBOL.test(value), {
    message: "Password must include a number or symbol.",
  })
