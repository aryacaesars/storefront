"use client"

import { cn } from "@/lib/utils"
import { CanvasInlineText } from "@/features/builder/components/canvas/CanvasInlineText"
import {
  CanvasPositionedBox,
  type CanvasPositionedBoxProps,
} from "@/features/builder/components/canvas/CanvasPositionedBox"

interface CanvasTextBoxProps
  extends Omit<CanvasPositionedBoxProps, "children" | "isEmpty" | "hideWhenEmpty"> {
  value: string
  onTextChange: (value: string) => void
  className?: string
  style?: React.CSSProperties
  align?: "left" | "center" | "right"
}

export function CanvasTextBox({
  value,
  onTextChange,
  className,
  style,
  align = "center",
  editable,
  selected,
  emptyPlaceholder,
  ...boxProps
}: CanvasTextBoxProps) {
  const alignClass =
    align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center"

  const placeholder =
    emptyPlaceholder ?? (
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <p className="text-center text-[11px] leading-relaxed text-white/70">
          Klik untuk pilih
          <br />
          teks di panel kiri
        </p>
      </div>
    )

  return (
    <CanvasPositionedBox
      {...boxProps}
      editable={editable}
      selected={selected}
      isEmpty={!value.trim()}
      hideWhenEmpty={!editable}
      emptyPlaceholder={placeholder}
      innerClassName="flex items-center justify-center px-2"
    >
      {editable && selected ? (
        <CanvasInlineText
          value={value}
          onChange={onTextChange}
          className={cn("block w-full outline-none focus:ring-2 focus:ring-indigo-300/50", alignClass, className)}
          style={style}
        />
      ) : (
        <p className={cn("block w-full", alignClass, className)} style={style}>
          {value}
        </p>
      )}
    </CanvasPositionedBox>
  )
}
