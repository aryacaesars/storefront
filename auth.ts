import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db/prisma"
import type { Role } from "@prisma/client"

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean)

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
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
          const role: Role = ADMIN_EMAILS.includes(dbUser.email) ? "ADMIN" : "OWNER"
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
