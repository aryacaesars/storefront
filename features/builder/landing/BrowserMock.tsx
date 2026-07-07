/**
 * Pure-CSS storefront preview used inside the laptop frame (hero) and the
 * template thumbnails. No image assets — everything is drawn with divs so the
 * landing has zero external dependencies.
 */
import Image from "next/image";
import gradient from "@/public/builder-landing/gradient.png";

export default function BrowserMock({ chrome = false }: { chrome?: boolean }) {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden text-[6px] leading-none text-slate-700">
      <Image
        src={gradient}
        alt=""
        aria-hidden
        fill
        className="pointer-events-none -z-10 object-full"
      />
      {chrome && (
        <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </div>
      )}

      {/* announcement bar */}
      <div className="flex items-center justify-between bg-slate-900 px-3 py-1 text-[5px] text-white/80">
        <span>Free shipping on orders over $50</span>
        <span className="flex gap-2">
          <span>Help &amp; Support</span>
          <span>Track Order</span>
        </span>
      </div>

      {/* header */}
      <div className="flex items-center gap-2 px-3 py-1.5">
        <span className="font-display text-[9px] font-bold text-slate-900">Shoply</span>
        <span className="flex-1 rounded-full bg-slate-100 px-2 py-1 text-slate-400">
          Search for products, brands…
        </span>
        <span className="rounded bg-brand px-1.5 py-1 text-white">Cart</span>
      </div>
      <div className="flex gap-2.5 border-y border-slate-100 px-3 py-1 text-slate-500">
        {["Home", "Shop", "Deals", "New", "Brands", "Blog"].map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>

      {/* hero banner */}
      <div className="m-2 flex items-center gap-2 rounded bg-gradient-to-r from-indigo-50 to-slate-50 p-2">
        <div className="flex-1">
          <p className="font-semibold text-slate-900">
            Upgrade Your Tech<br />Save up to{" "}
            <span className="text-brand">40%</span>
          </p>
          <span className="mt-1 inline-block rounded bg-brand px-1.5 py-0.5 text-white">
            Shop Now
          </span>
        </div>
        <div className="relative h-8 w-12">
          <div className="absolute right-0 top-0 h-8 w-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-400" />
          <div className="absolute bottom-0 left-1 h-5 w-3 rounded-sm bg-slate-700" />
          <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-brand text-[5px] text-white">
            40%
          </span>
        </div>
      </div>

      {/* feature strip */}
      <div className="flex justify-between px-3 text-[5px] text-slate-400">
        {["Free Shipping", "Easy Returns", "Secure Pay", "24/7 Support"].map((t) => (
          <span key={t} className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-brand/40" />
            {t}
          </span>
        ))}
      </div>

      {/* product grid */}
      <div className="px-3 pt-2 font-semibold text-slate-900">Featured Products</div>
      <div className="grid grid-cols-4 gap-1.5 px-3 pb-2 pt-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded border border-slate-100 p-1">
            <div className="mb-1 h-6 rounded bg-slate-100" />
            <div className="h-1 w-full rounded bg-slate-200" />
            <div className="mt-1 flex items-center justify-between">
              <span className="font-semibold text-slate-900">$59</span>
              <span className="rounded bg-brand/10 px-1 text-brand">Add</span>
            </div>
          </div>
        ))}
      </div>

      {/* footer */}
      <div className="mt-auto flex justify-between bg-slate-900 px-3 py-1.5 text-[5px] text-white/60">
        <span className="font-display text-white">Shoply</span>
        <span>Shop · Help · About · Contact</span>
      </div>
    </div>
  );
}
