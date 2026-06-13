"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import { FAQ_ITEMS } from "@/themes/fashion/data/mock"

export function FAQAccordionClient() {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <h2
        className="mb-10 text-center text-4xl font-medium text-[var(--theme-text)]"
        style={{ fontFamily: "var(--theme-heading-font)" }}
      >
        Frequently Asked
      </h2>

      <div className="divide-y divide-stone-200">
        {FAQ_ITEMS.map((item) => (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => setOpenId(openId === item.id ? null : item.id)}
              className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-[var(--theme-text)]"
            >
              <span className="text-base text-[var(--theme-text)]">{item.question}</span>
              <span className="ml-4 flex-shrink-0 text-[var(--theme-muted)]">
                {openId === item.id ? (
                  <Minus className="h-4 w-4" strokeWidth={1.5} />
                ) : (
                  <Plus className="h-4 w-4" strokeWidth={1.5} />
                )}
              </span>
            </button>

            {openId === item.id && (
              <div className="pb-5">
                <p className="text-sm leading-relaxed text-[var(--theme-muted)]">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
