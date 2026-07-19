import Link from "next/link"

export function BrandStory() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div className="aspect-[3/4] overflow-hidden rounded-sm bg-gradient-to-br from-stone-200 via-amber-50 to-stone-300">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=900&q=80&auto=format"
            alt="Luna Soft atelier"
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <p className="mb-4 text-[10px] tracking-[0.2em] uppercase text-[var(--theme-primary)]">
            OUR STORY
          </p>
          <h2
            className="text-3xl font-medium leading-snug text-[var(--theme-text)]"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            Elevated Living Through Intentional Design
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[var(--theme-muted)]">
            At Luna Soft, we believe that beauty is found in simplicity. Our philosophy is rooted
            in the pursuit of &ldquo;Quiet Luxury&rdquo; — creating pieces that don&rsquo;t need
            to shout to be noticed. Every garment and object is selected for its quality, its
            timelessness, and the way it complements a life lived with intention.
          </p>
          <blockquote className="mt-5 border-l-2 border-[var(--theme-accent)] pl-4">
            <p className="text-sm italic leading-relaxed text-[var(--theme-muted)]">
              &ldquo;We design for the woman who values the tactile experience of a silk weave as
              much as the silhouette it creates.&rdquo;
            </p>
          </blockquote>
          <Link
            href="#"
            className="mt-6 inline-flex h-9 items-center border border-[var(--theme-text)] px-6 text-[10px] tracking-[0.2em] uppercase text-[var(--theme-text)] transition-colors hover:bg-[var(--theme-text)] hover:text-white"
          >
            OUR HERITAGE
          </Link>
        </div>
      </div>
    </div>
  )
}
