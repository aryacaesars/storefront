import BrowserMock from "./BrowserMock";

function TemplateCard({ name, price }: { name: string; price: string }) {
  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-black/5 bg-white shadow-xl shadow-slate-900/10">
        <div className="aspect-[16/11]">
          <BrowserMock chrome />
        </div>
      </div>
      <h3 className="mt-4 font-display text-lg font-bold text-ink">{name}</h3>
      <p className="text-sm text-slate-500">{price}</p>
    </div>
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
          <TemplateCard name="Template 1" price="Rp. 300.000" />
          <TemplateCard name="Template 1" price="Rp. 300.000" />
          <TemplateCard name="Template 1" price="Rp. 300.000" />
          <ExploreCard />
        </div>
      </div>
    </section>
  );
}
