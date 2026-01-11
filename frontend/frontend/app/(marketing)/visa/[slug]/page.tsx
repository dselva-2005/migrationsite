"use client"

import { PageContentProvider } from "@/providers/PageContentProvider"
import { usePathname, notFound } from "next/navigation"

import Hero from "./hero"
import LeftSidebar from "./leftSidebar"
import RightContent from "./rightContent"
import { VISA_ROUTE_MAP } from "@/lib/visaRoutes"

export default function VisaPage() {
    const pathname = usePathname()
    const slug = pathname.replace(/\/$/, "").split("/").pop() || ""

    // Redirect to 404 if slug is invalid
    if (!slug || !VISA_ROUTE_MAP[slug]) {
        notFound()
    }

    return (
        <PageContentProvider page="visa">
            {/* HERO */}
            <Hero slug={slug} />

            {/* PAGE BODY */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 py-20 px-8">
                {/* LEFT SIDEBAR */}
                <aside className="lg:col-span-4">
                    <LeftSidebar />
                </aside>

                {/* RIGHT CONTENT */}
                <main className="lg:col-span-8">
                    <RightContent/>
                </main>
            </div>
        </PageContentProvider>
    )
}
