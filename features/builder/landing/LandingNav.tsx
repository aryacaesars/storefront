import Link from "next/link"
import { getSession } from "@/features/auth/dal"
import EtalaseMark from "./EtalaseMark"

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Template", href: "/templates" },
  { label: "Contact", href: "/#contact" },
]

export default async function LandingNav() {
  const session = await getSession()
  const ctaHref = session
    ? session.role === "ADMIN"
      ? "/admin"
      : "/dashboard"
    : "/login"
  const ctaLabel = session
    ? session.role === "ADMIN"
      ? "Admin"
      : "Dashboard"
    : "Login"

  return (
    <header className="sticky top-4 z-50 w-full px-4">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between rounded-full border border-black/5 bg-white/80 pl-6 pr-2.5 shadow-lg shadow-slate-900/5 backdrop-blur">
        <Link href="/" aria-label="Etalase home">
          <EtalaseMark />
        </Link>

        <ul className="hidden items-center gap-9 text-sm font-medium text-slate-600 md:flex">
          {LINKS.map((l) => (
            <li key={l.label}>
              <Link href={l.href} className="transition-colors hover:text-ink">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href={ctaHref}
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
        >
          {ctaLabel}
        </Link>
      </nav>
    </header>
  )
}
