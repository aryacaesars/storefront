import { Pencil } from "lucide-react"

export function ActiveThemeCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Thumbnail area */}
      <div className="relative h-48 bg-[#c9b89a] flex items-center justify-center overflow-hidden">
        {/* Simulated storefront wireframe */}
        <div className="w-36 h-40 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
          {/* Store header */}
          <div className="h-6 bg-gray-100 flex items-center px-2 gap-1">
            <div className="w-8 h-1.5 bg-gray-300 rounded-full" />
            <div className="ml-auto flex gap-1">
              <div className="w-4 h-1.5 bg-gray-300 rounded-full" />
              <div className="w-4 h-1.5 bg-gray-300 rounded-full" />
              <div className="w-4 h-1.5 bg-gray-300 rounded-full" />
            </div>
          </div>
          {/* Hero row */}
          <div className="px-2 py-1.5 flex flex-col gap-1.5">
            <div className="w-full h-1.5 bg-gray-200 rounded-full" />
            <div className="w-3/4 h-1.5 bg-gray-200 rounded-full" />
            <div className="w-1/2 h-1.5 bg-gray-200 rounded-full" />
            <div className="w-12 h-3 bg-gray-800 rounded mt-1" />
          </div>
          {/* Product grid */}
          <div className="px-2 pt-1 grid grid-cols-2 gap-1.5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <div className="w-full h-8 bg-gray-100 rounded" />
                <div className="w-full h-1 bg-gray-200 rounded-full" />
                <div className="w-2/3 h-1 bg-gray-200 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* ACTIVE badge */}
        <span className="absolute bottom-3 left-3 px-2.5 py-0.5 bg-gray-900 text-white text-[9px] font-bold tracking-widest uppercase rounded">
          Active
        </span>
      </div>

      {/* Info row */}
      <div className="flex items-center justify-between px-4 py-3.5">
        <div>
          <p className="text-sm font-semibold text-gray-900 leading-tight">Minimalist</p>
          <p className="text-xs text-gray-400 mt-0.5">Design Journal V2.4</p>
        </div>
        <button
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          aria-label="Edit theme"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
