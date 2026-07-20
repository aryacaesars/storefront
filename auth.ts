import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db/prisma"
import { verifyPassword } from "@/lib/auth/password"
import type { Role } from "@prisma/client"

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean)

export function resolveMerchantRole(email: string): Role {
  return ADMIN_EMAILS.includes(email) ? "ADMIN" : "OWNER"
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string"
            ? credentials.email.trim().toLowerCase()
            : ""
        const password =
          typeof credentials?.password === "string" ? credentials.password : ""
        if (!email || !password) return null

        const dbUser = await prisma.user.findUnique({ where: { email } })
        if (!dbUser?.passwordHash) return null

        const ok = await verifyPassword(password, dbUser.passwordHash)
        if (!ok) return null

        return {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          image: dbUser.image,
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  cookies: {
    sessionToken: {
      name: "sf_session",
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async signIn({ user }) {
      return Boolean(user.email)
    },
    async jwt({ token, user }) {
      // Kunci Prisma user id + role ke JWT, reconcile lewat email.
      // `user.email` ada saat sign-in; `token.email` di request berikutnya.
      // Email DIKUNCI ke token supaya reconcile tak pernah ke-skip — akar bug
      // 404 dashboard: token tanpa email → id jatuh ke OAuth `sub` → owner
      // check (store.ownerId === session.userId) gagal → notFound().
      const email = (user?.email ?? token.email) as string | undefined
      if (email) {
        const dbUser = await prisma.user.findUnique({ where: { email } })
        if (dbUser) {
          const role = resolveMerchantRole(dbUser.email)
          if (dbUser.role !== role) {
            await prisma.user.update({ where: { id: dbUser.id }, data: { role } })
          }
          token.id = dbUser.id
          token.role = role
          token.email = dbUser.email
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token.id) session.user.id = token.id as string
      if (token.role) session.user.role = token.role as Role
      return session
    },
  },
})
