import { NEW_ARRIVALS } from "@/themes/bold/data/mock"
import { NewArrivalCard } from "@/themes/bold/sections/new-arrivals/NewArrivalCard"

export function NewArrivalsGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {NEW_ARRIVALS.map((product) => (
        <NewArrivalCard key={product.id} product={product} />
      ))}
    </div>
  )
}
