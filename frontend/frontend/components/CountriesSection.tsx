"use client"

import { useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CountriesCarousel } from "./CountriesCarousel"
import { usePageContent } from "@/providers/PageContentProvider"

/* ---------------- Types ---------------- */

type Country = {
    id: string
    name: string
    category: "education" | "immigration" | "business"
    description: string
    image: string
    flag: string
    link: string
}

type HeaderData = {
    eyebrow: string
    title: string
}

type FiltersData = {
    education: string
    immigration: string
    business: string
}

/* ---------------- Component ---------------- */

export default function CountriesSection() {
    const { content, loading } = usePageContent()

    // ✅ ALL derived data lives inside useMemo
    const derived = useMemo(() => {
        const countries =
            (content?.["countries.items"] as Country[]) ?? []

        return {
            grouped: {
                education: countries.filter(c => c.category === "education"),
                immigration: countries.filter(c => c.category === "immigration"),
                business: countries.filter(c => c.category === "business"),
            },
            header: content?.["countries.header"] as HeaderData | undefined,
            filters: content?.["countries.filters"] as FiltersData | undefined,
        }
    }, [content])

    // ✅ early returns AFTER hooks
    if (loading || !content) return null
    if (!derived.header || !derived.filters) return null

    const { header, filters, grouped } = derived

    return (
        <section className="py-2">
            <div className="mx-auto max-w-7xl px-4">

                {/* Header */}
                <div className="mb-12 text-center">
                    <p className="text-sm uppercase tracking-widest text-muted-foreground">
                        {header.eyebrow}
                    </p>
                    <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
                        {header.title}
                    </h2>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="education">
                    <TabsList className="mx-auto mb-10 flex w-fit gap-6">
                        <TabsTrigger value="education">
                            {filters.education}
                        </TabsTrigger>
                        <TabsTrigger value="immigration">
                            {filters.immigration}
                        </TabsTrigger>
                        <TabsTrigger value="business">
                            {filters.business}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="education">
                        <CountriesCarousel items={grouped.education} />
                    </TabsContent>

                    <TabsContent value="immigration">
                        <CountriesCarousel items={grouped.immigration} />
                    </TabsContent>

                    <TabsContent value="business">
                        <CountriesCarousel items={grouped.business} />
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    )
}
