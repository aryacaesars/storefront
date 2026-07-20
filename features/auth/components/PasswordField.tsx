"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMessages } from "@/features/i18n/LocaleProvider"

const inputClass =
  "h-11 w-full rounded-xl border border-black/10 bg-white py-0 pl-4 pr-11 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand/40 focus:ring-2 focus:ring-brand/20"

interface PasswordFieldProps {
  name: string
  placeholder: string
  autoComplete?: string
  required?: boolean
  minLength?: number
  className?: string
  value?: string
  onChange?: (value: string) => void
}

export function PasswordField({
  name,
  placeholder,
  autoComplete = "current-password",
  required,
  minLength,
  className,
  value,
  onChange,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)
  const t = useMessages()

  return (
    <div className={cn("relative", className)}>
      <input
        name={name}
        type={visible ? "text" : "password"}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={inputClass}
        value={value}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:text-ink"
        aria-label={visible ? t.auth.hidePassword : t.auth.showPassword}
        aria-pressed={visible}
      >
        {visible ? (
          <EyeOff className="h-4 w-4" strokeWidth={1.75} />
        ) : (
          <Eye className="h-4 w-4" strokeWidth={1.75} />
        )}
      </button>
    </div>
  )
}
