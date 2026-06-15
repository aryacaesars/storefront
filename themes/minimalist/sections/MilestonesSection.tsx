import { MILESTONES } from "@/themes/minimalist/data/mock"

export function MilestonesSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-14 text-center">
        <p className="text-[10px] font-bold tracking-[0.2em] text-[var(--theme-muted)] uppercase">
          Milestones
        </p>
        <h2
          className="mt-4 text-3xl font-semibold text-[var(--theme-text)] sm:text-4xl"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          A Journey of Intent
        </h2>
      </div>

      <div className="space-y-16">
        {MILESTONES.map((milestone, index) => {
          const isOdd = index % 2 === 0

          return (
            <div key={milestone.year} className="grid items-center gap-6 md:grid-cols-[1fr_40px_1fr]">
              {/* Text side (odd) or Image side (even) */}
              <div className={isOdd ? "order-1" : "order-1 md:order-3"}>
                {isOdd ? (
                  <MilestoneText milestone={milestone} align="right" />
                ) : (
                  <MilestoneImage milestone={milestone} />
                )}
              </div>

              {/* Center dot */}
              <div className="order-2 hidden items-center justify-center md:flex">
                <div
                  className="h-3 w-3 rounded-full border-2"
                  style={{
                    backgroundColor: "var(--theme-primary)",
                    borderColor: "var(--theme-primary)",
                  }}
                />
              </div>

              {/* Image side (odd) or Text side (even) */}
              <div className={isOdd ? "order-3" : "order-3 md:order-1"}>
                {isOdd ? (
                  <MilestoneImage milestone={milestone} />
                ) : (
                  <MilestoneText milestone={milestone} align="left" />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function MilestoneText({
  milestone,
  align,
}: {
  milestone: (typeof MILESTONES)[number]
  align: "left" | "right"
}) {
  return (
    <div className={align === "right" ? "md:text-right" : "md:text-left"}>
      <p
        className="text-[80px] font-bold leading-none select-none text-gray-100 sm:text-[96px]"
        style={{ fontFamily: "var(--theme-heading-font)" }}
        aria-hidden
      >
        {milestone.year}
      </p>
      <h3
        className="-mt-4 text-xl font-semibold text-[var(--theme-text)]"
        style={{ fontFamily: "var(--theme-heading-font)" }}
      >
        {milestone.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-[var(--theme-muted)]">
        {milestone.description}
      </p>
    </div>
  )
}

function MilestoneImage({ milestone }: { milestone: (typeof MILESTONES)[number] }) {
  return (
    <div
      className={`aspect-[4/3] w-full rounded-lg ${milestone.imageClass}`}
      role="img"
      aria-label={milestone.title}
    />
  )
}
