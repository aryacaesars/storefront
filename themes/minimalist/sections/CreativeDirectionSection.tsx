import { TEAM_MEMBERS } from "@/themes/minimalist/data/mock"

export function CreativeDirectionSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      {/* Section header — 2 column */}
      <div className="mb-14 grid gap-6 md:grid-cols-2 md:items-end">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-[var(--theme-muted)] uppercase">
            The Hands Behind the Brand
          </p>
          <h2
            className="mt-4 text-3xl font-semibold text-[var(--theme-text)] sm:text-4xl"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            Creative Direction
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-[var(--theme-muted)] md:max-w-sm">
          A collective of designers, artisans, and thinkers united by a singular
          aesthetic vision — to create objects that endure.
        </p>
      </div>

      {/* Team grid */}
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {TEAM_MEMBERS.map((member) => (
          <div key={member.name}>
            <div
              className={`aspect-[3/4] w-full overflow-hidden rounded-sm object-cover ${member.imageClass}`}
            />
            <div className="mt-4">
              <p className="text-[10px] font-semibold tracking-[0.15em] text-[var(--theme-muted)] uppercase">
                {member.role}
              </p>
              <h3
                className="mt-1 text-lg font-semibold text-[var(--theme-text)]"
                style={{ fontFamily: "var(--theme-heading-font)" }}
              >
                {member.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--theme-muted)]">
                {member.bio}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
