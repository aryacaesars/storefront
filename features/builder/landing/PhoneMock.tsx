import EtalaseMark from "./EtalaseMark";

/** Tilted CSS phone showing the Etalase mark — decorative, contact section. */
export default function PhoneMock() {
  return (
    <div className="relative aspect-[9/19] w-40 rotate-[8deg] rounded-[2rem] bg-gradient-to-br from-slate-200 to-slate-400 p-[3px] shadow-2xl">
      <div className="relative flex h-full w-full flex-col items-center justify-center rounded-[1.8rem] bg-gradient-to-b from-white to-slate-50">
        {/* notch */}
        <span className="absolute left-1/2 top-2 h-3 w-12 -translate-x-1/2 rounded-full bg-slate-900/90" />
        <EtalaseMark className="scale-90" />
      </div>
    </div>
  );
}
