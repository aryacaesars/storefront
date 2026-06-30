import Link from "next/link"
import { redirect } from "next/navigation"
import { getCustomerSession } from "@/features/storefront/customer-dal"
import { SignInForm } from "./SignInForm"

export const metadata = { title: "Masuk" }

export default async function SignInPage() {
  const session = await getCustomerSession()
  if (session) redirect("/account")

  return (
    <section className="mx-auto flex max-w-md flex-col px-4 py-16">
      <div className="rounded-[27px] bg-white p-8 shadow-[0px_0px_19px_rgba(0,0,0,0.12)]">
        <h1
          className="text-2xl font-bold text-[var(--theme-text)]"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          Masuk
        </h1>
        <p className="mt-1 text-sm text-[var(--theme-muted)]">
          Masuk untuk melihat pesanan dan checkout lebih cepat.
        </p>
        <SignInForm />
        <p className="mt-6 text-center text-sm text-[var(--theme-muted)]">
          Belum punya akun?{" "}
          <Link href="/signup" className="font-semibold" style={{ color: "var(--theme-primary)" }}>
            Daftar
          </Link>
        </p>
      </div>
    </section>
  )
}
