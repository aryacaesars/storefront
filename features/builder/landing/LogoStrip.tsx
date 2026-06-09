const ICONS = ["✳", "⚡", "✦", "△", "≋"];

export default function LogoStrip() {
  const logoItems = [...ICONS, ...ICONS];

  return (
    <section className="bg-white py-10">
      <div className="mx-auto max-w-6xl px-6">
        <style>{`
          @keyframes logo-strip-marquee {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }

          .logo-strip-track {
            animation: logo-strip-marquee 18s linear infinite;
          }

          .logo-strip-track:hover {
            animation-play-state: paused;
          }

          @media (prefers-reduced-motion: reduce) {
            .logo-strip-track {
              animation: none;
            }
          }
        `}</style>
        <div
          className="overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          }}
        >
          <div className="logo-strip-track flex w-max items-center gap-14">
            {logoItems.map((icon, i) => (
              <span
                key={`${icon}-${i}`}
                className="flex shrink-0 items-center gap-2 text-lg font-semibold text-brand/80"
              >
                <span aria-hidden>{icon}</span>
                Logoipsum
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
