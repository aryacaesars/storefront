import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, forwardRef } from "react"

type Variant = "default" | "secondary" | "outline" | "ghost"
type Size = "default" | "sm" | "lg" | "icon"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variants: Record<Variant, string> = {
  default:
    "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
  secondary:
    "bg-gray-100 text-gray-800 hover:bg-gray-200",
  outline:
    "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
  ghost:
    "bg-transparent text-gray-700 hover:bg-gray-100",
}

const sizes: Record<Size, string> = {
  default: "h-9 px-4 py-2 text-sm",
  sm: "h-8 px-3 text-xs",
  lg: "h-11 px-6 text-sm",
  icon: "h-9 w-9",
}

export function buttonClassName({
  variant = "default",
  size = "default",
  className,
}: {
  variant?: Variant
  size?: Size
  className?: string
} = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1",
    "disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  )
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", size = "default", className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={buttonClassName({ variant, size, className })}
      {...props}
    >
      {children}
    </button>
  ),
)
Button.displayName = "Button"

export { Button }
export type { ButtonProps }
