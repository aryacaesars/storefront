import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Poppins } from "next/font/google";
import { getAppContext, getTenantSubdomain } from "@/features/tenant/resolve-tenant";
import { getStorefrontThemeConfig } from "@/features/storefront/theme-config";
import { storefrontIconMetadata } from "@/features/storefront/store-favicon";
import { PwaRegister } from "@/features/pwa/PwaRegister";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export async function generateMetadata(): Promise<Metadata> {
  const context = await getAppContext();

  // Live store: set icons di root supaya file-based app/icon.svg + favicon.ico
  // (brand Etalase) tidak ikut ke-inject ke <head>.
  if (context === "storefront") {
    const tenantSlug = await getTenantSubdomain();
    const config = await getStorefrontThemeConfig(tenantSlug);
    return {
      title: {
        default: config.storeName,
        template: `%s — ${config.storeName}`,
      },
      description: config.tagline,
      applicationName: config.storeName,
      icons: storefrontIconMetadata(config),
    };
  }

  return {
    title: {
      default: "Etalase — Storefront Builder",
      template: "%s — Etalase",
    },
    description:
      "Etalase adalah platform storefront builder untuk membuat toko online dengan subdomain sendiri, kelola produk, pesanan, dan tema tanpa koding.",
    applicationName: "Etalase",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "Etalase",
    },
    icons: {
      apple: "/icons/apple-touch-icon.png",
    },
  };
}

export const viewport = {
  themeColor: "#5b4ee6",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${poppins.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
