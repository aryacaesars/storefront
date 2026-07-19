import { dashboardCard, dashboardPage } from "@/features/builder/components/dashboard-ui"

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-dash-border/40 ${className ?? ""}`}
      aria-hidden
    />
  )
}

/** Skeleton saat pindah antar toko — kasih feedback visual di area konten. */
export default function StoreSectionLoading() {
  return (
    <div className={dashboardPage} aria-busy aria-label="Memuat toko">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <SkeletonBlock className="h-3 w-24 rounded-full" />
          <SkeletonBlock className="h-8 w-48 rounded-xl" />
          <SkeletonBlock className="h-4 w-64 rounded-lg" />
        </div>
        <SkeletonBlock className="h-10 w-36 rounded-full" />
      </div>

      <div className="grid grid-cols-12 gap-4 lg:gap-6">
        <div className={`${dashboardCard} col-span-12 p-5 lg:col-span-8`}>
          <SkeletonBlock className="mb-4 h-4 w-32 rounded-lg" />
          <div className="grid gap-3 sm:grid-cols-3">
            <SkeletonBlock className="h-24 rounded-2xl" />
            <SkeletonBlock className="h-24 rounded-2xl" />
            <SkeletonBlock className="h-24 rounded-2xl" />
          </div>
          <SkeletonBlock className="mt-4 h-40 rounded-2xl" />
        </div>
        <div className={`${dashboardCard} col-span-12 space-y-3 p-5 lg:col-span-4`}>
          <SkeletonBlock className="h-4 w-28 rounded-lg" />
          <SkeletonBlock className="h-12 rounded-xl" />
          <SkeletonBlock className="h-12 rounded-xl" />
          <SkeletonBlock className="h-12 rounded-xl" />
          <SkeletonBlock className="h-12 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
