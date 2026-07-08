import Link from "next/link";
import { TemplateThumbnail } from "@/features/builder/components/TemplateThumbnail";
import { getTemplatePreviewHref } from "@/themes/engine/registry";

const TEMPLATES = [
  {
    id: "minimalist" as const,
    name: "Aurora Minimal",
    label: "Minimalist",
    price: "Rp. 300.000",
  },
  {
    id: "bold" as const,
    name: "Momentum",
    label: "Bold",
    price: "Rp. 300.000",
  },
  {
    id: "fashion" as const,
    name: "Luna Soft",
    label: "Fashion",
    price: "Rp. 300.000",
  },
];

function TemplateCard({
  id,
  name,
  label,
  price,
}: (typeof TEMPLATES)[number]) {
  return (
    <Link href={getTemplatePreviewHref(id)} target="_blank" className="group block">
      <div className="overflow-hidden rounded-xl border border-black/5 bg-white shadow-xl shadow-slate-900/10 transition-shadow group-hover:shadow-2xl group-hover:shadow-slate-900/15">
        {/* Browser chrome dots */}
        <div className="flex items-center gap-1.5 border-b border-black/5 bg-slate-100 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-red-400" />
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <div className="mx-auto flex h-4 w-32 items-center rounded bg-white/80 px-2">
            <span className="truncate text-[9px] text-slate-400">
              etalase.id/preview
            </span>
          </div>
        </div>

        <TemplateThumbnail id={id} className="aspect-[16/10]" />
      </div>

      <p className="mt-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <h3 className="mt-0.5 font-display text-lg font-bold text-ink">{name}</h3>
      <p className="text-sm font-medium text-brand">{price}</p>
    </Link>
  );
}

function ExploreCard() {
  return (
    <a
      href="#templates"
      className="group flex aspect-[16/11] flex-col items-center justify-center gap-3 rounded-xl bg-white shadow-xl shadow-slate-900/10 transition-shadow hover:shadow-2xl"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-16 w-16 text-slate-300 transition-colors group-hover:text-brand"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <span className="text-lg font-semibold text-slate-400 transition-colors group-hover:text-brand">
        Explore More!
      </span>
    </a>
  );
}

export default function TemplateShowcase() {
  return (
    <section id="templates" className="relative overflow-hidden bg-white px-6 py-24">
      <div className="relative mx-auto max-w-5xl">
        <h2 className="mx-auto max-w-3xl text-center font-display text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl">
          Template That Might Suit
          <br />
          To Your <span className="text-brand">Store</span>
        </h2>

        <div className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2">
          {TEMPLATES.map((t) => (
            <TemplateCard key={t.id} {...t} />
          ))}
          <ExploreCard />
        </div>
      </div>
    </section>
  );
}
