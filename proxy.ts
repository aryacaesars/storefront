import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * MULTI-TENANT ROUTING (Next.js 16 Proxy — dulu "middleware").
 *
 * Resolusi tenant dari host header, lalu inject ke request header supaya
 * Server Components / layout bisa baca via `headers()` (lihat
 * features/tenant/resolve-tenant.ts).
 *
 *   app.<ROOT_DOMAIN>     -> builder dashboard (konteks merchant)
 *   <subdomain>.<ROOT>    -> storefront publik (subdomain = slug tenant)
 *
 * Route group (builder) & (storefront) TIDAK menambah segment URL dan path-nya
 * tidak overlap, jadi proxy cukup menentukan konteks + tenant — bukan rewrite ke group.
 */

// Domain root platform, mis. "platform.com". Override via env di prod.
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'localhost:3000'

// Header internal yang dibaca server. Selalu di-strip dari request masuk
// agar client tak bisa spoof tenant.
const CTX_HEADER = 'x-app-context' // 'builder' | 'storefront'
const TENANT_HEADER = 'x-tenant-subdomain'

/** Ambil hostname tanpa port. Tangani juga preview Vercel & localhost. */
function getHostname(request: NextRequest): string {
  const host = request.headers.get('host') ?? ''
  return host.split(':')[0].toLowerCase()
}

/** Base domain tanpa port, untuk dipotong dari hostname. */
function baseDomain(): string {
  return ROOT_DOMAIN.split(':')[0].toLowerCase()
}

/**
 * Resolve konteks dari hostname.
 * - "app.<base>"         -> builder
 * - "<sub>.<base>"       -> storefront, tenant = <sub>
 * - "<base>" / localhost -> builder (default; root domain = landing/dashboard)
 */
function resolve(hostname: string): { context: 'builder' | 'storefront'; tenant: string | null } {
  const base = baseDomain()

  // Akses langsung ke root domain atau localhost telanjang -> builder.
  if (hostname === base || hostname === 'localhost' || hostname === '127.0.0.1') {
    return { context: 'builder', tenant: null }
  }

  // Ada subdomain? Potong ".<base>" dari belakang.
  const suffix = `.${base}`
  if (hostname.endsWith(suffix)) {
    const sub = hostname.slice(0, -suffix.length)
    if (sub === 'app' || sub === 'www') {
      return { context: 'builder', tenant: null }
    }
    // Subdomain pertama = slug tenant (abaikan nested sub seperti a.b.base).
    const tenant = sub.split('.')[0]
    return { context: 'storefront', tenant }
  }

  // Host tak dikenal (mis. custom domain belum dipetakan) -> builder default.
  return { context: 'builder', tenant: null }
}

export function proxy(request: NextRequest) {
  const hostname = getHostname(request)
  const { context, tenant } = resolve(hostname)

  // Salin header masuk, strip header internal (anti-spoof), set ulang.
  const headers = new Headers(request.headers)
  headers.delete(CTX_HEADER)
  headers.delete(TENANT_HEADER)
  headers.set(CTX_HEADER, context)
  if (tenant) headers.set(TENANT_HEADER, tenant)

  return NextResponse.next({ request: { headers } })
}

export const config = {
  // Jalankan di semua path KECUALI internal Next, static asset, & file dengan ekstensi.
  matcher: ['/((?!api/|_next/|_static/|_vercel|favicon.ico|.*\\..*).*)'],
}
