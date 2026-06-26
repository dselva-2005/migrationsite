import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider"
import Navbar from "@/components/header/navbar";
import { Footer } from "@/components/Footer"
import { ScrollProgressCircle } from "@/components/ScrollProgress"
import { GlobalPrefetch } from "@/components/GlobalPrefetch";
import ToasterClient from "@/components/data-table/ToasterClient";
import AuthToasts from "@/components/AuthToast";
import { PageContentProvider } from "@/providers/PageContentProvider";
import { FloatingActionButton } from "@/components/FloatingActionButton"
import Script from "next/script"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Migration Reviews | Verified Immigration Consultant Reviews",
  description:
    "Read authentic reviews from verified past clients about immigration consultants, migration agents, and visa lawyers worldwide. Find trustworthy professionals for your visa application.",
  keywords: "immigration consultant reviews, migration agent reviews, visa lawyer reviews, trusted immigration services, verified consultant ratings",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Migration Reviews | Verified Immigration Consultant Reviews",
    description:
      "Read authentic reviews from verified past clients about immigration consultants and migration agents. Make informed decisions for your visa application.",
    url: "https://migrationreviews.com",
    siteName: "Migration Reviews",
    images: [
      {
        url: "https://migrationreviews.com/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Migration Reviews - Verified Immigration Consultant Reviews",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Migration Reviews | Verified Immigration Consultant Reviews",
    description:
      "Read authentic reviews from verified past clients about immigration consultants and find trustworthy migration professionals.",
    images: [
      "https://migrationreviews.com/opengraph-image.png"
    ],
  },
  verification: {
    google: "BWWYHAeDZ6Hf0sItz7mT9OnLrkOF-okq72unPWsMgLI",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Migration Reviews",
  "url": "https://migrationreviews.com",
  "logo": "https://migrationreviews.com/favicon.png",
  "description": "Trusted platform for verified immigration consultant reviews and transparent migration service ratings worldwide.",
  "sameAs": []
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Migration Reviews",
  "url": "https://migrationreviews.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://migrationreviews.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Script
          id="schema-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <PageContentProvider page="navbar">
            <Navbar />
          </PageContentProvider>
          <GlobalPrefetch />
          {children}
          <AuthToasts />
          <ToasterClient />
          <ScrollProgressCircle />
          <FloatingActionButton />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}