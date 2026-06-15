export function ContactHeader() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-6 pt-12">
      <h1
        className="text-5xl font-black uppercase"
        style={{ fontFamily: "var(--theme-heading-font)", color: "var(--theme-primary)" }}
      >
        CONTACT US
      </h1>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-zinc-500">
        Connect with the Momentum precision team. Whether it&apos;s technical support or
        partnership inquiries, we are here to maintain your performance peak.
      </p>
    </div>
  )
}
