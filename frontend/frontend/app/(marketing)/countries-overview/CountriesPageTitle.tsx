"use client"

import { usePageContent } from "@/providers/PageContentProvider"
import { Skeleton } from "@/components/ui/skeleton"

/* ---------------- Types ---------------- */

type CountriesPageHeader = {
    title: string
    backgroundImage: string
}

/* ---------------- Skeleton ---------------- */

function CountriesPageTitleSkeleton() {
    return (
        <section
            className="relative flex items-center justify-center"
            style={{ minHeight: "420px" }}
        >
            {/* Background placeholder */}
            <Skeleton className="absolute inset-0 rounded-none" />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20" />

            {/* Title placeholder */}
            <div className="relative z-10">
                <Skeleton className="h-10 w-72 md:w-96" />
            </div>
        </section>
    )
}

/* ---------------- Component ---------------- */

export default function CountriesPageTitle() {
    const { content, loading } = usePageContent()

    if (loading) {
        return <CountriesPageTitleSkeleton />
    }

    if (!content) return null

    const header = content["countries_page.header"] as
        | CountriesPageHeader
        | undefined

    if (!header) return null

    return (
        <section
            className="relative flex items-center justify-center page-title"
            style={{
                backgroundImage: `url('${header.backgroundImage}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "420px",
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />

            <div className="relative z-10 auto-container">
                <div className="content-box clearfix text-center">
                    <div className="title centred">
                        <h1 className="text-white text-4xl md:text-5xl font-bold">
                            {header.title}
                        </h1>
                    </div>
                </div>
            </div>
        </section>
    )
}
