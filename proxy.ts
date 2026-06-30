import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * MULTI-TENANT ROUTING + AUTH GATE (Next.js 16 Proxy — dulu "middleware").
 *
 * Dua tugas, satu fungsi:
 *  1. Resolusi tenant dari host header → inject ke request header supaya
 *     Server Components / layout baca via `headers()` (features/tenant/resolve-tenant.ts).
 *  2. Gate cepat path builder terproteksi: tak ada cookie sesi → redirect /login.
 *
 *   app.<ROOT_DOMAIN>     -> builder dashboard (konteks merchant)
 *   <subdomain>.<ROOT>    -> storefront publik (subdomain = slug tenant)
 *
 * Gate cuma cek cookie ADA — TIDAK decrypt. Verifikasi asli di tiap page via
 * getSession() (dal.ts). Proxy = redirect cepat, bukan security boundary.
 */

// Domain root platform, mis. "platform.com". Override via env di prod.
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";

// Header internal yang dibaca server. Selalu di-strip dari request masuk
// agar client tak bisa spoof tenant.
const CTX_HEADER = "x-app-context"; // 'builder' | 'storefront'
const TENANT_HEADER = "x-tenant-subdomain";

// Cookie sesi owner/admin (NextAuth JWT, lihat auth.ts).
const SESSION_COOKIE = "sf_session";
// Cookie sesi end user storefront (set saat Sprint 5 — gate sudah dipasang).
const SF_CUSTOMER_COOKIE = "sf_customer_session";
// Path builder yang wajib login.
const PROTECTED = ["/dashboard", "/templates", "/customize", "/stores", "/admin"];
// Path storefront yang wajib login end user.
const PROTECTED_STOREFRONT = ["/account"];

/** Ambil hostname tanpa port. Tangani juga preview Vercel & localhost. */
function getHostname(request: NextRequest): string {
  const host = request.headers.get("host") ?? "";
  return host.split(":")[0].toLowerCase();
}

/** Base domain tanpa port, untuk dipotong dari hostname. */
function baseDomain(): string {
  return ROOT_DOMAIN.split(":")[0].toLowerCase();
}

/**
 * Resolve konteks dari hostname.
 * - "app.<base>"         -> builder
 * - "<sub>.<base>"       -> storefront, tenant = <sub>
 * - "<base>" / localhost -> builder (default; root domain = landing/dashboard)
 */
function resolveLocalhostSubdomain(hostname: string): {
  context: "builder" | "storefront";
  tenant: string | null;
} | null {
  // Dev: namatoko.localhost — works regardless of NEXT_PUBLIC_ROOT_DOMAIN.
  if (!hostname.endsWith(".localhost")) return null;

  const sub = hostname.slice(0, -".localhost".length);
  if (!sub || sub === "app" || sub === "www") {
    return { context: "builder", tenant: null };
  }

  return { context: "storefront", tenant: sub.split(".")[0] };
}

function resolve(hostname: string): {
  context: "builder" | "storefront";
  tenant: string | null;
} {
  const localhost = resolveLocalhostSubdomain(hostname);
  if (localhost) return localhost;

  const base = baseDomain();

  // Akses langsung ke root domain atau localhost telanjang -> builder.
  if (hostname === base || hostname === "localhost" || hostname === "127.0.0.1") {
    return { context: "builder", tenant: null };
  }

  // Ada subdomain? Potong ".<base>" dari belakang.
  const suffix = `.${base}`;
  if (hostname.endsWith(suffix)) {
    const sub = hostname.slice(0, -suffix.length);
    if (sub === "app" || sub === "www") {
      return { context: "builder", tenant: null };
    }
    // Subdomain pertama = slug tenant (abaikan nested sub seperti a.b.base).
    const tenant = sub.split(".")[0];
    return { context: "storefront", tenant };
  }

  // Host tak dikenal (mis. custom domain belum dipetakan) -> builder default.
  return { context: "builder", tenant: null };
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = getHostname(request);
  const { context, tenant } = resolve(hostname);

  // Auth gate: hanya konteks builder + path terproteksi. Tak ada cookie -> login.
  if (context === "builder") {
    const needsAuth = PROTECTED.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`),
    );
    if (needsAuth && !request.cookies.has(SESSION_COOKIE)) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // Auth gate storefront: /account wajib login end user.
  if (context === "storefront") {
    const needsAuth = PROTECTED_STOREFRONT.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`),
    );
    if (needsAuth && !request.cookies.has(SF_CUSTOMER_COOKIE)) {
      const url = request.nextUrl.clone();
      url.pathname = "/signin";
      return NextResponse.redirect(url);
    }
  }

  // Salin header masuk, strip header internal (anti-spoof), set ulang.
  const headers = new Headers(request.headers);
  headers.delete(CTX_HEADER);
  headers.delete(TENANT_HEADER);
  headers.set(CTX_HEADER, context);
  if (tenant) headers.set(TENANT_HEADER, tenant);

  return NextResponse.next({ request: { headers } });
}

export const config = {
  // Jalankan di semua path KECUALI internal Next, static asset, & file dengan ekstensi.
  // api/storefront/ tetap masuk supaya x-tenant-subdomain ter-inject ke route handlers storefront.
  matcher: ["/((?!api/(?!storefront/)|_next/|_static/|_vercel|favicon.ico|.*\\..*).*)"],
};
