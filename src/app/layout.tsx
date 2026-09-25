import type { Metadata } from "next";
import { Oswald, Outfit } from "next/font/google";
import SmokeField from "@/components/SmokeField";
import RevealObserver from "@/components/RevealObserver";
import AgeGate from "@/components/AgeGate";
import { BRAND, SITE_URL } from "@/lib/constants";
import "./globals.css";

const sans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

const display = Oswald({
  subsets: ["latin"],
  variable: "--font-display",
});

const description =
  "Haze Puff, tienda de vapes en Cofradía, Cortés, Honduras. Desechables, pods y líquidos. Pedidos por WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND} · Cofradía, Cortés`,
    template: `%s · ${BRAND}`,
  },
  description,
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: `${BRAND} · Tienda de vapes en Cofradía`,
    description,
    url: SITE_URL,
    siteName: BRAND,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: BRAND }],
    locale: "es_HN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND,
    description,
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${sans.variable} ${display.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('reveal-ready')",
          }}
        />
      </head>
      <body>
        <SmokeField />
        <div className="grain" aria-hidden />
        <RevealObserver />
        {children}
        <AgeGate />
      </body>
    </html>
  );
}
