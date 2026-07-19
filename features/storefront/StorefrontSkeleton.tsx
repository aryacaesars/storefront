import { cn } from "@/lib/utils"

function Bone({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-black/[0.06]",
        className,
      )}
    />
  )
}

/** Skeleton grid daftar produk. */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 @2xl:px-6">
      <div className="mb-8 flex items-end justify-between gap-4">
        <Bone className="h-9 w-48" />
        <Bone className="h-10 w-40 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-5 @3xl:grid-cols-4 @3xl:gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <Bone className="aspect-[3/4] w-full rounded-2xl" />
            <Bone className="h-4 w-[75%]" />
            <Bone className="h-3 w-1/2" />
            <Bone className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    </div>
  )
}

/** Skeleton halaman detail produk. */
export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 @2xl:px-6 @2xl:py-14">
      <Bone className="h-3 w-56" />
      <div className="mt-8 grid gap-10 @3xl:grid-cols-2 @3xl:gap-14">
        <Bone className="aspect-[3/4] w-full rounded-3xl" />
        <div className="flex flex-col gap-4">
          <Bone className="h-10 w-[80%]" />
          <Bone className="h-4 w-2/3" />
          <Bone className="mt-4 h-8 w-1/3" />
          <Bone className="h-3 w-24" />
          <Bone className="mt-6 h-24 w-full" />
          <div className="mt-6 flex gap-3">
            <Bone className="h-12 w-40 rounded-full" />
            <Bone className="h-12 w-32 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

/** Skeleton halaman generik storefront. */
export function StorefrontPageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 @2xl:px-6">
      <Bone className="mx-auto h-10 w-64" />
      <Bone className="mx-auto mt-4 h-4 w-96 max-w-full" />
      <div className="mt-12 grid grid-cols-2 gap-5 @3xl:grid-cols-4 @3xl:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Bone key={i} className="aspect-[3/4] w-full rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
