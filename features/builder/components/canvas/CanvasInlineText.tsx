"use client"

import { cn } from "@/lib/utils"

interface CanvasInlineTextProps {
  value: string
  onChange: (value: string) => void
  className?: string
  style?: React.CSSProperties
}

export function CanvasInlineText({ value, onChange, className, style }: CanvasInlineTextProps) {
  return (
    <span
      role="textbox"
      contentEditable
      suppressContentEditableWarning
      onBlur={(event) => {
        const next = event.currentTarget.textContent?.trim() ?? ""
        if (next !== value) {
          onChange(next)
        }
      }}
      onKeyDown={(event) => {
        // Parent canvas wrappers often use role="button" + Space/Enter → select.
        // Stop bubbling so Space inserts a character instead of "activating" the parent.
        event.stopPropagation()
        if (event.key === "Enter") {
          event.preventDefault()
          event.currentTarget.blur()
        }
      }}
      className={cn(
        "outline-none empty:before:content-['Category'] empty:before:text-white/50",
        "rounded-sm focus:ring-2 focus:ring-white/40",
        className,
      )}
      style={style}
    >
      {value}
    </span>
  )
}
