import Link from "next/link"
import { redirect } from "next/navigation"
import { getCustomerSession } from "@/features/storefront/customer-dal"
import { SignUpForm } from "./SignUpForm"

export const metadata = { title: "Sign Up" }

export default async function SignUpPage() {
  const session = await getCustomerSession()
  if (session) redirect("/account")

  return (
    <section className="mx-auto flex max-w-md flex-col px-4 py-16">
      <div className="rounded-[27px] bg-white p-8 shadow-[0px_0px_19px_rgba(0,0,0,0.12)]">
        <h1
          className="text-2xl font-bold text-[var(--theme-text)]"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          Sign Up
        </h1>
        <p className="mt-1 text-sm text-[var(--theme-muted)]">Create an account to track your orders.</p>
        <SignUpForm />
        <p className="mt-6 text-center text-sm text-[var(--theme-muted)]">
          Already have an account?{" "}
          <Link href="/signin" className="font-semibold" style={{ color: "var(--theme-primary)" }}>
            Sign In
          </Link>
        </p>
      </div>
    </section>
  )
}
