import LandingNav from "@/features/builder/landing/LandingNav";
import Hero from "@/features/builder/landing/Hero";
import LogoStrip from "@/features/builder/landing/LogoStrip";
import TemplateShowcase from "@/features/builder/landing/TemplateShowcase";
import ContactSection from "@/features/builder/landing/ContactSection";
import LandingFooter from "@/features/builder/landing/LandingFooter";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-white font-sans text-ink">
      <LandingNav />
      <main>
        <Hero />
        <LogoStrip />
        <TemplateShowcase />
        <ContactSection />
      </main>
      <LandingFooter />
    </div>
  );
}
