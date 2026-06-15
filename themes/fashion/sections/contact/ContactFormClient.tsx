"use client"

import { useState } from "react"

const INPUT_CLASS =
  "w-full bg-transparent border-b border-stone-300 py-2 text-sm text-[var(--theme-text)] placeholder:text-stone-400 outline-none focus:border-[var(--theme-text)] transition-colors"

const LABEL_CLASS =
  "block mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--theme-muted)]"

export function ContactFormClient() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <section className="bg-[var(--theme-bg)] pb-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-16 md:grid-cols-[1fr_320px]">
          {/* Form */}
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-8 grid grid-cols-2 gap-8">
              <div>
                <label className={LABEL_CLASS}>NAME</label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={update("name")}
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>EMAIL</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={update("email")}
                  className={INPUT_CLASS}
                />
              </div>
            </div>

            <div className="mb-8">
              <label className={LABEL_CLASS}>SUBJECT</label>
              <input
                type="text"
                placeholder="How can we assist you?"
                value={form.subject}
                onChange={update("subject")}
                className={INPUT_CLASS}
              />
            </div>

            <div className="mb-8">
              <label className={LABEL_CLASS}>MESSAGE</label>
              <textarea
                placeholder="Your message..."
                value={form.message}
                onChange={update("message")}
                rows={5}
                className={`${INPUT_CLASS} min-h-[120px] resize-none`}
              />
            </div>

            <hr className="mb-8 border-stone-200" />

            <button
              type="submit"
              className="h-11 bg-[var(--theme-text)] px-8 text-[10px] font-semibold uppercase tracking-[0.25em] text-white transition-colors hover:bg-zinc-700"
            >
              SEND INQUIRY
            </button>
          </form>

          {/* Atelier info */}
          <div className="pt-2">
            <h3
              className="mb-4 text-2xl font-medium text-[var(--theme-text)]"
              style={{ fontFamily: "var(--theme-heading-font)" }}
            >
              Our Atelier
            </h3>
            <p className="mb-8 text-sm leading-relaxed text-[var(--theme-muted)]">
              118 Crosby Street, 4th Floor
              <br />
              SoHo, New York, NY 10012
              <br />
              United States
            </p>

            <div className="mb-6">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--theme-muted)]">
                INQUIRIES
              </p>
              <p className="text-sm text-[var(--theme-text)]">concierge@lunasoft.com</p>
            </div>

            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--theme-muted)]">
                FOLLOW
              </p>
              <div className="flex items-center gap-5">
                {["Instagram", "Pinterest", "LinkedIn"].map((link) => (
                  <span
                    key={link}
                    className="cursor-pointer text-sm text-[var(--theme-muted)] transition-colors hover:text-[var(--theme-text)]"
                  >
                    {link}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
