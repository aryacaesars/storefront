import { redirect } from "next/navigation"

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

/** Legacy — katalog Bold sekarang di /products. */
export default async function AllProductsRedirect({ searchParams }: PageProps) {
  const params = await searchParams
  const qs = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") qs.set(key, value)
    else if (Array.isArray(value)) value.forEach((v) => qs.append(key, v))
  }
  const suffix = qs.toString()
  redirect(suffix ? `/products?${suffix}` : "/products")
}
