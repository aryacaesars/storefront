import { Phone, Mail, MapPin } from "lucide-react"

export function DirectChannels() {
  return (
    <div className="rounded-sm border border-gray-200 bg-white p-7">
      <h3 className="mb-6 text-base font-bold" style={{ color: "var(--theme-primary)" }}>
        Direct Channels
      </h3>

      <div className="space-y-6">
        {/* Phone */}
        <div className="flex items-start gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-gray-100 bg-gray-50">
            <Phone className="h-4 w-4" style={{ color: "var(--theme-primary)" }} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-400">
              PHONE SUPPORT
            </p>
            <p className="mt-0.5 text-sm font-bold text-zinc-900">+1 (800) MOMENTUM</p>
            <p className="text-xs text-zinc-400">Mon-Fri: 8am - 6pm EST</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-gray-100 bg-gray-50">
            <Mail className="h-4 w-4" style={{ color: "var(--theme-primary)" }} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-400">
              EMAIL ENQUIRIES
            </p>
            <p className="mt-0.5 text-sm font-bold text-zinc-900">support@momentum-bold.com</p>
            <p className="text-xs text-zinc-400">24/7 Response within 12h</p>
          </div>
        </div>

        {/* HQ */}
        <div className="flex items-start gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-gray-100 bg-gray-50">
            <MapPin className="h-4 w-4" style={{ color: "var(--theme-primary)" }} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-400">
              GLOBAL HQ
            </p>
            <p className="mt-0.5 text-sm font-bold text-zinc-900">
              459 Innovation Dr, Silicon Valley, CA
            </p>
            <p className="text-xs text-zinc-400">Elite Design Center</p>
          </div>
        </div>
      </div>

      {/* Location image */}
      <div className="relative mt-6 overflow-hidden rounded-sm">
        <div className="aspect-video bg-gradient-to-br from-[#0D4A3E] via-teal-900 to-zinc-950">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(16,217,160,0.06) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
        </div>
        <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-sm bg-black/50 px-3 py-1.5 backdrop-blur-sm">
          <MapPin className="h-3 w-3" style={{ color: "var(--theme-accent)" }} strokeWidth={2} />
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white">
            OUR LOCATION
          </span>
        </div>
      </div>
    </div>
  )
}
