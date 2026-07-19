/** Prefix path storefront dengan base preview, mis. `/products` → `/preview/bento/products`. */
export function withBasePath(href: string, basePath?: string): string {
  if (!basePath) return href
  if (!href.startsWith("/")) return href
  if (href === "/") return basePath
  if (href === basePath || href.startsWith(`${basePath}/`)) return href
  // Sudah di namespace preview lain — jangan double-prefix.
  if (href === "/preview" || href.startsWith("/preview/")) return href
  return `${basePath}${href}`
}
