import type { Metadata } from "next";
import { Orbitron, Exo_2, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/providers/ClientProviders";
import Navigation from "@/components/layout/Navigation";
import BackgroundWrapper from "@/components/layout/BackgroundWrapper";
import KeyboardShortcuts from "@/components/ui/KeyboardShortcuts";
import InteractionController from "@/components/ui/InteractionController";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import PWAInstallPrompt, { ServiceWorkerRegistration } from "@/components/pwa/PWAInstallPrompt";
import { getPersonJsonLd, getWebsiteJsonLd } from "@/lib/seo";
import AnalyticsTracker from "@/components/ui/AnalyticsTracker";

const orbitron = Orbitron({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const exo2 = Exo_2({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://nexusforge.dev'),
  title: {
    default: "Witt | Creative Engineer Portfolio",
    template: "%s | Witt",
  },
  description: "Full-stack developer portfolio showcasing work in AI, Digital Twin, GIS, Data Visualization, and 3D Technology. A visionary creative engineer crafting digital realities.",
  keywords: ["Full-Stack Developer", "Creative Engineer", "Digital Twin", "GIS", "Data Visualization", "Three.js", "WebGL", "AI", "Portfolio"],
  authors: [{ name: "Alex Chen" }],
  creator: "王腾腾",
  publisher: "Witt",
  openGraph: {
    title: "Witt | Creative Engineer Portfolio",
    description: "Crafting Digital Realities at the Intersection of Art & Technology",
    type: "website",
    locale: "en_US",
    alternateLocale: "zh_CN",
    siteName: "Witt",
  },
  twitter: {
    card: "summary_large_image",
    title: "Witt | Creative Engineer Portfolio",
    description: "Crafting Digital Realities at the Intersection of Art & Technology",
    creator: "@alexchen",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: "/",
    languages: {
      'en-US': '/en',
      'zh-CN': '/zh',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#00f5ff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getPersonJsonLd()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getWebsiteJsonLd()),
          }}
        />
      </head>
      <body
        className={`${orbitron.variable} ${exo2.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <ClientProviders>
            <BackgroundWrapper />
            <Navigation />
            <main className="relative z-10 min-h-screen">
              {children}
              <AnalyticsTracker />
            </main>
            <KeyboardShortcuts />
            <InteractionController enableVoice={true} enableGestures={true} />
            <PWAInstallPrompt />
            <ServiceWorkerRegistration />
          </ClientProviders>
        </ErrorBoundary>
      </body>
    </html>
  );
}



