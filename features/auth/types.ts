import type { Role } from "@prisma/client"

export interface SessionData {
  userId: string
  email: string
  name: string | null
  role: Role
}

export type LoginFormState = { error: string } | undefined
