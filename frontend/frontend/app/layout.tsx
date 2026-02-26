import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider"
import Navbar from "@/components/header/navbar";
import { Footer } from "@/components/Footer"
import { ScrollProgressCircle } from "@/components/ScrollProgress"
// import Breadcrumbs from "@/components/header/Breadcrumbs";
import { GlobalPrefetch } from "@/components/GlobalPrefetch";
import ToasterClient from "@/components/data-table/ToasterClient";
import AuthToasts from "@/components/AuthToast";
import { PageContentProvider } from "@/providers/PageContentProvider";
import { FloatingActionButton } from "@/components/FloatingActionButton"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Migration Reviews | Trusted Reviews of Migration Companies",
  description:
    "Discover trusted migration reviews and compare migration companies to find the best service providers. Make informed decisions with verified migration company.",

  icons: {
    icon: "/favicon.png",
  },

  openGraph: {
    title: "Migration Reviews | Trusted Reviews of Migration Companies",
    description:
      "Discover trusted migration reviews and compare migration companies to find the best service providers. Make informed decisions with verified migration company.",
    url: "https://migrationreviews.com",
    siteName: "Migration Reviews",
    images: [
      {
        url: "https://migrationreviews.com/opengraph-image.png", 
        width: 1200,
        height: 630,
        alt: "Migration Reviews - Trusted Migration Company Reviews",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Migration Reviews | Trusted Reviews of Migration Companies",
    description:
      "Discover trusted migration reviews and compare migration companies to find the best service providers.",
    images: [
      "https://migrationreviews.com/opengraph-image.png"
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <PageContentProvider page="navbar">
            <Navbar />
          </PageContentProvider>

          {/* <Breadcrumbs/> */}

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
