"use client"

import { useState } from "react"
import { SlidersHorizontal } from "lucide-react"

const TABS = ["ALL GEAR", "OUTERWEAR", "TECH-KNITS", "BASE LAYERS", "ACCESSORIES"] as const

export function CategoryTabsClient() {
  const [activeTab, setActiveTab] = useState<string>("ALL GEAR")

  return (
    <div className="sticky top-14 z-40 border-b border-gray-100 bg-white shadow-sm">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-6">
        {/* Tabs */}
        <div className="flex h-full">
          {TABS.map((tab) => {
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className="relative flex h-full items-center px-4 text-[10px] font-bold uppercase tracking-[0.15em] transition-colors"
                style={{ color: isActive ? "var(--theme-primary)" : undefined }}
              >
                <span className={isActive ? "" : "text-zinc-400 hover:text-zinc-700"}>{tab}</span>
                {isActive && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: "var(--theme-primary)" }}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 transition-colors hover:text-zinc-900"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.5} />
            FILTERS
          </button>

          <div className="h-4 w-px bg-gray-200" />

          <select className="cursor-pointer border-none bg-transparent text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 outline-none">
            <option>SORT: FEATURED</option>
            <option>NEWEST FIRST</option>
            <option>PRICE: LOW TO HIGH</option>
            <option>PRICE: HIGH TO LOW</option>
          </select>
        </div>
      </div>
    </div>
  )
}
