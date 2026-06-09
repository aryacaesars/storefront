import type { ReactNode } from "react";

/**
 * Builder shell (merchant dashboard host: app.<root>).
 * NOTE: NO auth check here — Next.js 16 layouts don't re-render on navigation,
 * so auth gating lives in the DAL (requireSession) inside each protected page.
 */
export default function BuilderLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-full bg-background text-foreground">{children}</div>;
}
