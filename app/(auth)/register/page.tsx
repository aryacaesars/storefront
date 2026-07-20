import Image from "next/image"
import { redirect } from "next/navigation"
import { getSession } from "@/features/auth/dal"
import { RegisterForm } from "@/features/auth/components/RegisterForm"
import {
  AuthRegisterCardTitle,
  AuthRegisterHeading,
} from "@/features/auth/components/AuthHeadings"
import LandingNav from "@/features/builder/landing/LandingNav"
import LandingFooter from "@/features/builder/landing/LandingFooter"
import { LocaleShell } from "@/features/i18n/LocaleShell"
import gradient from "@/public/builder-landing/gradient.png"

export const metadata = { title: "Sign up" }

export default async function RegisterPage() {
  const session = await getSession()
  if (session) redirect(session.role === "ADMIN" ? "/admin" : "/dashboard")

  return (
    <LocaleShell>
      <div className="flex min-h-dvh flex-col bg-white">
        <LandingNav showLinks={false} />

        <main className="relative flex flex-1 flex-col items-center overflow-hidden px-6 pt-16 pb-16">
          <Image
            src={gradient}
            alt=""
            aria-hidden
            priority
            className="pointer-events-none absolute top-1/2 left-1/2 z-0 h-[80%] w-[150%] max-w-none -translate-x-1/2 -translate-y-1/3 opacity-80 blur-2xl"
          />

          <AuthRegisterHeading />

          <div className="relative z-10 mt-10 w-full max-w-md rounded-3xl bg-white p-8 shadow-xl shadow-slate-900/5 ring-1 ring-black/5">
            <AuthRegisterCardTitle />
            <div className="mt-6">
              <RegisterForm />
            </div>
          </div>
        </main>

        <LandingFooter />
      </div>
    </LocaleShell>
  )
}
