import Image from "next/image";
import laptopMock from "@/public/builder-landing/laptop-mock.png";
import gradient from "@/public/builder-landing/gradient.png";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-white px-6 pt-16 pb-24"
    >
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl md:text-7xl">
          Work <span className="text-brand">Smarter</span>
          <br />
          Not Harder
        </h1>

        <a
          href="/login"
          className="mt-8 inline-block rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition-colors hover:bg-brand-dark"
        >
          Get Yours Now!
        </a>
      </div>

      {/* laptop + glow */}
      <div className="relative mx-auto mt-14 max-w-4xl">
        {/* glow */}
        <Image
          src={gradient}
          alt=""
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[42%] z-0 h-[72%] w-[175%] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-80 blur-2xl"
        />

        {/* laptop */}
        <Image
          src={laptopMock}
          alt="Storefront preview on a laptop"
          priority
          className="relative z-10 mx-auto h-auto w-full"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 58%, rgba(0,0,0,0.35) 76%, transparent 92%)",
            maskImage:
              "linear-gradient(to bottom, black 0%, black 58%, rgba(0,0,0,0.35) 76%, transparent 92%)",
          }}
        />
      </div>
    </section>
  );
}
