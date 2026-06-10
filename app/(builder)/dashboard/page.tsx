import { LiveEnvironmentCard } from "@/features/builder/components/LiveEnvironmentCard"
import { ActiveThemeCard } from "@/features/builder/components/ActiveThemeCard"
import { OrderFulfillmentCard } from "@/features/builder/components/OrderFulfillmentCard"

export default function DashboardPage() {
  return (
    <div className="p-6 h-full">
      <div className="grid grid-cols-[1fr_320px] gap-5 h-full max-h-[600px]">
        {/* Left — Live Environment */}
        <div className="flex flex-col justify-start">
          <LiveEnvironmentCard />
        </div>

        {/* Right — stacked widgets */}
        <div className="flex flex-col gap-5">
          <ActiveThemeCard />
          <OrderFulfillmentCard />
        </div>
      </div>
    </div>
  )
}
