import { getSession } from "@/features/auth/dal"
import { LandingNavClient } from "@/features/builder/landing/LandingNavClient"

interface LandingNavProps {
  /** false = sembunyikan link tengah (dipakai di login). */
  showLinks?: boolean
}

export default async function LandingNav({ showLinks = true }: LandingNavProps) {
  const session = await getSession()
  const ctaHref = session
    ? session.role === "ADMIN"
      ? "/admin"
      : "/dashboard"
    : "/login"
  const ctaKind = session
    ? session.role === "ADMIN"
      ? "admin"
      : "dashboard"
    : "login"

  return (
    <LandingNavClient showLinks={showLinks} ctaHref={ctaHref} ctaKind={ctaKind} />
  )
}
