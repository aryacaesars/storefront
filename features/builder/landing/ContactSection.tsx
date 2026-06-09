import PhoneMock from "./PhoneMock";

const CONTACT_POINTS = ["Template advice", "Fast setup", "Custom request"];

export default function ContactSection() {
  return (
    <section id="contact" className="relative overflow-hidden bg-white px-6 pb-28 pt-8">
      <div className="pointer-events-none absolute inset-x-0 top-12 mx-auto h-56 max-w-5xl rounded-full bg-brand/10 blur-3xl" />

      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-4xl border border-white/70 bg-[linear-gradient(135deg,#f8fafc_0%,#f0eefc_48%,#e4e8f6_100%)] shadow-2xl shadow-slate-900/10">
        <div className="absolute right-0 top-0 h-56 w-56 translate-x-20 -translate-y-20 rounded-full bg-brand/20 blur-2xl" />
        <div className="absolute bottom-0 left-1/2 h-40 w-40 -translate-x-1/2 translate-y-20 rounded-full bg-white/70 blur-2xl" />

        <div className="relative grid items-stretch gap-0 md:grid-cols-[1.25fr_0.75fr]">
          <div className="p-8 sm:p-10 md:p-14">
            <span className="inline-flex rounded-full border border-brand/15 bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-brand shadow-sm">
              Start your storefront
            </span>

            <h2 className="mt-5 max-w-xl font-display text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl">
              Tell us what you want to sell next.
            </h2>

            <p className="mt-4 max-w-lg text-base leading-7 text-slate-600">
              Share your email and we will help you pick a template, refine the
              store flow, and launch a storefront that feels ready from day one.
            </p>

            <div className="mt-7 flex flex-wrap gap-2.5">
              {CONTACT_POINTS.map((point) => (
                <span
                  key={point}
                  className="rounded-full border border-white/80 bg-white/60 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-900/5"
                >
                  {point}
                </span>
              ))}
            </div>

            <form className="mt-9 max-w-xl rounded-[1.75rem] border border-white/80 bg-white/75 p-3 shadow-xl shadow-slate-900/10 backdrop-blur">
              <label
                htmlFor="email"
                className="flex items-center gap-2 px-4 pt-2 text-sm font-bold text-ink"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
                Email
              </label>

              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="min-w-0 flex-1 rounded-full bg-slate-50 px-5 py-3 text-sm font-medium text-ink ring-1 ring-slate-200 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/40 placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-brand/35"
                >
                  Send Request
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          <div className="relative flex min-h-96 items-center justify-center overflow-hidden bg-ink px-8 py-12 md:min-h-full">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(91,78,230,0.55),transparent_32%),radial-gradient(circle_at_80%_75%,rgba(255,255,255,0.2),transparent_28%)]" />

            <div className="relative">
              <div className="absolute -left-16 top-12 z-10 rounded-2xl border border-white/10 bg-white/90 px-4 py-3 shadow-2xl shadow-black/20">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Reply time
                </p>
                <p className="mt-1 font-display text-2xl font-extrabold text-ink">
                  24h
                </p>
              </div>

              <div className="absolute -right-14 bottom-8 z-10 rounded-2xl border border-white/10 bg-brand px-4 py-3 text-white shadow-2xl shadow-black/20">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/60">
                  Launch
                </p>
                <p className="mt-1 text-sm font-bold">Ready to sell</p>
              </div>

              <PhoneMock />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
