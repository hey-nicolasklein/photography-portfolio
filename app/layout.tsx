import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ScrollProgress from "@/components/scroll-progress";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { generatePhotographerStructuredData } from "@/lib/og";

const inter = Inter({
    subsets: ["latin"],
    weight: ["300", "400", "500", "700"],
    display: "swap",
    variable: "--font-inter",
});

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
};

export const metadata: Metadata = {
    title: {
        default:
            "Nicolas Klein Photography - Professionelle Fotografie in Saarbrücken",
        template: "%s | Nicolas Klein Photography",
    },
    description:
        "Professioneller Fotograf in Saarbrücken. Spezialisiert auf Porträts, Events und Follow-Around Fotografie. Authentische Momente in minimalistischem Schwarzweiß-Stil.",
    keywords: [
        "Fotograf Saarbrücken",
        "Portrait Fotografie",
        "Event Fotografie",
        "Hochzeitsfotograf",
        "Professionelle Fotografie",
        "Nicolas Klein",
        "Schwarzweiß Fotografie",
        "Saarland Fotograf",
    ],
    authors: [{ name: "Nicolas Klein" }],
    creator: "Nicolas Klein",
    publisher: "Nicolas Klein Photography",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    openGraph: {
        type: "website",
        locale: "de_DE",
        url: "https://nicolasklein.photography",
        siteName: "Nicolas Klein Photography",
        title: "Nicolas Klein Photography - Professionelle Fotografie in Saarbrücken",
        description:
            "Professioneller Fotograf in Saarbrücken. Spezialisiert auf Porträts, Events und Follow-Around Fotografie.",
        images: [
            {
                url: "/api/og?title=Nicolas Klein Photography&description=Professioneller Fotograf in Saarbrücken. Spezialisiert auf Porträts, Events und Follow-Around Fotografie.&type=default",
                width: 1200,
                height: 630,
                alt: "Nicolas Klein Photography",
            },
            {
                url: "/og-default.svg",
                width: 1200,
                height: 630,
                alt: "Nicolas Klein Photography - Default",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Nicolas Klein Photography",
        description: "Professioneller Fotograf in Saarbrücken",
        images: ["/api/og?title=Nicolas Klein Photography&description=Professioneller Fotograf in Saarbrücken&type=default"],
        creator: "@hey.nicolasklein",
        site: "@hey.nicolasklein",
    },
    icons: {
        icon: [
            { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        ],
        apple: [
            {
                url: "/apple-touch-icon.png",
                sizes: "180x180",
                type: "image/png",
            },
        ],
        other: [
            {
                rel: "mask-icon",
                url: "/safari-pinned-tab.svg",
                color: "#000000",
            },
        ],
    },
    manifest: "/site.webmanifest",
    alternates: {
        canonical: "https://nicolasklein.photography",
    },
    verification: {
        google: "your-google-verification-code", // You'll need to add this when setting up Google Search Console
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="de">
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <meta name="theme-color" content="#000000" />
                <meta name="msapplication-TileColor" content="#000000" />
                <meta
                    name="msapplication-config"
                    content="/browserconfig.xml"
                />
            </head>
            <body className={`${inter.variable} font-sans antialiased`}>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(generatePhotographerStructuredData()),
                    }}
                />
                <ScrollProgress />
                {children}
                <SpeedInsights />
                <Analytics />
            </body>
        </html>
    );
}
