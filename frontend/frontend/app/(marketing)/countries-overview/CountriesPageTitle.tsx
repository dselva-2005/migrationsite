"use client"

import { usePageContent } from "@/providers/PageContentProvider"

/* ---------------- Types ---------------- */

type CountriesPageHeader = {
    title: string
    backgroundImage: string
}

/* ---------------- Component ---------------- */

export default function CountriesPageTitle() {
    const { content, loading } = usePageContent()

    if (loading || !content) return null

    const header = content["countries_page.header"] as CountriesPageHeader | undefined
    if (!header) return null

    return (
        <section
            className="relative flex items-center justify-center page-title"
            style={{
                backgroundImage: `url('${header.backgroundImage}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "420px", // ✅ key fix
            }}
        >
            {/* Optional overlay for contrast */}
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
