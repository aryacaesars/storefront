"use client"

import { useEffect, useId, useRef, useState } from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { dashboardLabel } from "@/features/builder/components/dashboard-ui"

export type DashboardSelectOption = {
  value: string
  label: string
}

interface DashboardSelectProps {
  name: string
  options: DashboardSelectOption[]
  defaultValue?: string
  placeholder?: string
  label?: string
  className?: string
}

export function DashboardSelect({
  name,
  options,
  defaultValue = "",
  placeholder = "Pilih opsi",
  label,
  className,
}: DashboardSelectProps) {
  const listId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(defaultValue)

  const selected = options.find((opt) => opt.value === value)
  const displayLabel = selected?.label ?? placeholder

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("keydown", handleKey)
    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("keydown", handleKey)
    }
  }, [open])

  function selectOption(next: string) {
    setValue(next)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {label ? <label className={dashboardLabel}>{label}</label> : null}
      <input type="hidden" name={name} value={value} />

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-lg border bg-white px-3 py-2.5 text-left text-sm transition-colors",
          open
            ? "border-brand ring-2 ring-brand/20"
            : "border-gray-200 hover:border-gray-300",
        )}
      >
        <span className={cn("truncate", selected ? "text-ink" : "text-gray-400")}>
          {displayLabel}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200",
            open && "rotate-180 text-brand",
          )}
        />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-1.5 max-h-56 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg ring-1 ring-black/5"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value
            return (
              <li key={opt.value || "__empty"} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => selectOption(opt.value)}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm transition-colors",
                    isSelected
                      ? "bg-brand/8 font-medium text-brand"
                      : "text-gray-700 hover:bg-gray-50",
                  )}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected ? <Check className="h-4 w-4 shrink-0" /> : null}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
