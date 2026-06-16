import { cn } from "@/lib/utils"

interface SettingsSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function SettingsSection({
  title,
  description,
  children,
  className,
}: SettingsSectionProps) {
  return (
    <section className={cn("grid grid-cols-[240px_1fr] gap-8 py-8 border-b border-gray-100 last:border-0", className)}>
      {/* Left label col */}
      <div className="pt-0.5">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        {description && (
          <p className="mt-1 text-xs text-gray-400 leading-relaxed">{description}</p>
        )}
      </div>

      {/* Right content col */}
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  )
}

/* ── Primitives reused inside settings forms ──────────────────── */

interface FieldProps {
  label: string
  hint?: string
  children: React.ReactNode
}

export function SettingsField({ label, hint, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-700">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-gray-400">{hint}</p>}
    </div>
  )
}

export function SettingsInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900",
        "placeholder:text-gray-400 outline-none",
        "focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition",
        className,
      )}
      {...props}
    />
  )
}

export function SettingsTextarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 resize-none",
        "placeholder:text-gray-400 outline-none",
        "focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition",
        className,
      )}
      {...props}
    />
  )
}

interface ToggleRowProps {
  label: string
  description?: string
  defaultChecked?: boolean
}

interface SegmentedControlProps {
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}

export function SegmentedControl({ value, options, onChange }: SegmentedControlProps) {
  return (
    <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "h-8 flex-1 rounded-md text-xs font-medium transition-colors",
            value === opt.value
              ? "border border-gray-200 bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export function ToggleRow({ label, description, defaultChecked = false }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      {/* Static toggle — "use client" not needed, visual only */}
      <div
        className={cn(
          "relative w-10 h-6 rounded-full transition-colors shrink-0",
          defaultChecked ? "bg-indigo-600" : "bg-gray-200",
        )}
      >
        <span
          className={cn(
            "absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform",
            defaultChecked ? "translate-x-5" : "translate-x-1",
          )}
        />
      </div>
    </div>
  )
}
