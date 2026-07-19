import { TEAM_MEMBERS } from "@/themes/bold/data/mock"

export function ArchitectsSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">
              THE ARCHITECTS
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Led by visionaries, driven by engineers.
            </p>
          </div>
        </div>

        {/* Team grid */}
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          {TEAM_MEMBERS.map((member) => (
            <div key={member.name}>
              <div
                className={`aspect-[3/4] rounded-sm ${member.imageClass}`}
                style={{ filter: "grayscale(100%)" }}
              />
              <p className="mt-4 text-sm font-black uppercase tracking-wider text-zinc-900">
                {member.name}
              </p>
              <p
                className="mt-0.5 text-[10px] uppercase tracking-[0.15em]"
                style={{ color: "var(--theme-primary)" }}
              >
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
