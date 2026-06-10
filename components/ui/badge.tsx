import { cn } from "@/lib/utils"
import { HTMLAttributes } from "react"

type Variant = "default" | "secondary" | "outline" | "success"

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant
}

const variants: Record<Variant, string> = {
  default:
    "bg-indigo-50 text-indigo-700 border border-indigo-200",
  secondary:
    "bg-gray-100 text-gray-700 border border-gray-200",
  outline:
    "bg-transparent text-gray-700 border border-gray-300",
  success:
    "bg-green-50 text-green-700 border border-green-200",
}

function Badge({ variant = "default", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export { Badge }
export type { BadgeProps }
