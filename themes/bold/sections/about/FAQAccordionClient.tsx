"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const FAQ_ITEMS = [
  {
    q: "What is the return policy for Elite Gear?",
    a: "All Elite Gear products come with a 30-day performance guarantee. If you're not satisfied with your purchase, return it in original condition for a full refund or exchange. Tech Series items are eligible for extended 60-day returns.",
  },
  {
    q: "How do I track my international shipment?",
    a: "Once your order ships, you'll receive a tracking number via email. International orders typically take 7-14 business days. Use our tracking portal or carrier's website for real-time updates.",
  },
  {
    q: "Do you offer corporate or team partnerships?",
    a: "Yes — Momentum Bold partners with elite sports teams, fitness facilities, and corporate wellness programs. Contact our partnerships team at partners@momentum-bold.com for custom pricing and branding options.",
  },
]

export function FAQAccordionClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div>
      {/* Header */}
      <div className="mb-10 text-center">
        <p
          className="text-[10px] font-bold uppercase tracking-[0.25em]"
          style={{ color: "var(--theme-primary)" }}
        >
          EXPERTISE
        </p>
        <h2
          className="mt-3 text-3xl font-semibold text-zinc-900"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          Frequently Asked Questions
        </h2>
      </div>

      {/* Accordion */}
      <div className="border-t border-gray-200">
        {FAQ_ITEMS.map((item, i) => (
          <div key={i} className="border-b border-gray-200">
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="group flex w-full items-center justify-between py-5 text-left transition-colors"
            >
              <span
                className="text-sm font-medium text-zinc-800 transition-colors group-hover:text-zinc-900"
                style={openIndex === i ? { color: "var(--theme-primary)" } : undefined}
              >
                {item.q}
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform ${openIndex === i ? "rotate-180" : ""}`}
                strokeWidth={1.5}
              />
            </button>
            {openIndex === i && (
              <div className="pb-4 pr-8">
                <p className="text-sm leading-relaxed text-zinc-500">{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
