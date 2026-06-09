import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js 16 renamed `middleware` -> `proxy` (file must export a `proxy` fn).
 *
 * AUTH-BRANCH SCOPE: cheap presence-gate only. Multi-tenant host routing
 * (guide §7: app.* -> builder, *.* -> storefront) lands later.
 *
 * Only checks the session COOKIE EXISTS — does NOT decrypt/verify it. Real
 * auth check happens in each protected page via getSession() (dal.ts). Proxy
 * gate is a fast redirect, not a security boundary (see proxy docs: verify
 * inside server functions, don't rely on proxy alone).
 */

const SESSION_COOKIE = "sf_session";
const PROTECTED = ["/dashboard", "/templates", "/customize"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsAuth = PROTECTED.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (needsAuth && !request.cookies.has(SESSION_COOKIE)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Skip static assets, image optim, and API routes.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
