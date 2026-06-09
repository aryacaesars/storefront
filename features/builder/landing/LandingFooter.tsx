import EtalaseMark from "./EtalaseMark";

export default function LandingFooter() {
  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <EtalaseMark />
        <p className="text-sm text-slate-400">
          © 2026 Etalase Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
