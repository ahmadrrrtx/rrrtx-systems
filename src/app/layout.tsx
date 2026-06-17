import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { StructuredData } from "@/components/StructuredData";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { SITE_URL } from "@/lib/site-config";
import { ChatbotWidget } from "@/components/ChatbotWidget";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RRRTX SYSTEMS | Custom Ecommerce & AI Systems Built to Convert",
    template: "%s | RRRTX SYSTEMS",
  },
  description:
    "Premium custom ecommerce websites and AI automation systems built from scratch. Engineering-first product studio for brands that outgrew templates. Next.js, Python agents, and conversion infrastructure.",
  keywords: [
    "custom ecommerce development",
    "AI automation agency",
    "custom agents",
    "lead generation systems",
    "website rebuild",
    "conversion optimization",
    "Next.js ecommerce",
    "AI chatbots",
    "SEO AEO",
    "product studio",
    "Vercel deployment",
    "Turso database",
    "custom website development",
    "ecommerce website design",
    "AI business automation",
    "digital product studio",
  ],
  authors: [{ name: "RRRTX SYSTEMS", url: https://rrrtx-systems.com/ }],
  creator: "RRRTX SYSTEMS",
  publisher: "RRRTX SYSTEMS",
  metadataBase: new URL(https://rrrtx-systems.com/),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "RRRTX SYSTEMS | Custom Ecommerce & AI Systems Built to Convert",
    description:
      "Premium custom ecommerce websites and AI automation systems built from scratch. Engineering-first product studio for brands that outgrew templates.",
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "RRRTX SYSTEMS",
    images: [
      {
        url: "/assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "RRRTX SYSTEMS - Custom Ecommerce & AI Automation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RRRTX SYSTEMS | Custom Ecommerce & AI Systems Built to Convert",
    description:
      "Premium custom ecommerce websites and AI automation systems built from scratch. Engineering-first product studio.",
    images: ["/assets/og-image.png"],
    creator: "@rrrtx_systems",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "P-JJqDq0XPsyg9Fs-hho1F9oKLloYaJsDZ5jNlSFlVs",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/assets/rrrtx-logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/assets/rrrtx-logo.png" />
        <meta name="theme-color" content="#020617" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body className={`${inter.variable} font-sans bg-[#020617] text-white antialiased`}>
        <GoogleAnalytics />
        <StructuredData />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <ChatbotWidget />
      </body>
    </html>
  );
}
