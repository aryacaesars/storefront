import Image from "next/image"
import { redirect } from "next/navigation"
import { getSession } from "@/features/auth/dal"
import { LoginForm } from "@/features/auth/components/LoginForm"
import LandingNav from "@/features/builder/landing/LandingNav"
import LandingFooter from "@/features/builder/landing/LandingFooter"
import gradient from "@/public/builder-landing/gradient.png"

export const metadata = { title: "Masuk" }

export default async function LoginPage() {
  // Already signed in? Skip the form. Admin → admin panel, owner → dashboard.
  const session = await getSession()
  if (session) redirect(session.role === "ADMIN" ? "/admin" : "/dashboard")

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <LandingNav />

      <main className="relative flex flex-1 flex-col items-center overflow-hidden px-6 pt-16">
        <Image
          src={gradient}
          alt=""
          aria-hidden
          priority
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[80%] w-[150%] max-w-none -translate-x-1/2 -translate-y-1/3 opacity-80 blur-2xl"
        />

        <h1 className="relative z-10 text-center font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl">
          Hi, Welcome
          <br />
          To <span className="text-brand">Etalase</span>!
        </h1>

        <div className="relative z-10 mt-12 w-full max-w-md rounded-3xl bg-white p-8 shadow-xl shadow-slate-900/5 ring-1 ring-black/5">
          <h2 className="text-center text-2xl font-bold text-ink">
            Masuk ke Etalase
          </h2>

          <div className="my-6 flex justify-center">
            <LoginForm />
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
