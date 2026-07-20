"use client"

import { useMessages } from "@/features/i18n/LocaleProvider"

export function AuthLoginHeading() {
  const t = useMessages()
  return (
    <h1 className="relative z-10 text-center font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl">
      {t.auth.loginLine1}
      <br />
      {t.auth.loginLine2Prefix}
      <span className="text-brand">{t.auth.loginHeadingBrand}</span>
      {t.auth.loginLine2Suffix}
    </h1>
  )
}

export function AuthLoginCardTitle() {
  const t = useMessages()
  return (
    <h2 className="text-center text-2xl font-bold text-ink">{t.auth.loginTitle}</h2>
  )
}

export function AuthRegisterHeading() {
  const t = useMessages()
  return (
    <h1 className="relative z-10 text-center font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl">
      {t.auth.registerLine1}
      <br />
      <span className="text-brand">{t.auth.registerHeadingBrand}</span>
    </h1>
  )
}

export function AuthRegisterCardTitle() {
  const t = useMessages()
  return (
    <h2 className="text-center text-2xl font-bold text-ink">{t.auth.registerTitle}</h2>
  )
}
