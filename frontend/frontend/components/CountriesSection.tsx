"use client"

import { useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CountriesCarousel } from "./CountriesCarousel"
import { usePageContent } from "@/providers/PageContentProvider"

/* ---------------- Types ---------------- */

type Country = {
    id: string
    name: string
    description: string
    image: string
    flag: string
    link: string
    cta?: string
    category: string
}

type CountriesHeader = {
    title: string
    eyebrow: string
    description?: string
}

type CountriesFilters = Record<string, string>

/* ---------------- Component ---------------- */

export default function CountriesSection() {
    const { content, loading } = usePageContent()

    /**
     * ✅ Hooks MUST be called unconditionally
     */
    const derived = useMemo(() => {
        if (!content) {
            return {
                header: undefined,
                items: [],
                filters: undefined,
                grouped: {},
                filterKeys: [],
            }
        }

        const header = content["countries.header"] as CountriesHeader | undefined
        const items = (content["countries.items"] as Country[]) ?? []
        const filters = content["countries.filters"] as CountriesFilters | undefined

        if (!filters) {
            return {
                header,
                items,
                filters,
                grouped: {},
                filterKeys: [],
            }
        }

        const grouped: Record<string, Country[]> = {}
        const filterKeys = Object.keys(filters)

        filterKeys.forEach(key => {
            grouped[key] = []
        })

        items.forEach(item => {
            if (grouped[item.category]) {
                grouped[item.category].push(item)
            }
        })

        return {
            header,
            items,
            filters,
            grouped,
            filterKeys,
        }
    }, [content])

    /**
     * ✅ Early returns AFTER hooks
     */
    if (loading) return null
    if (!derived.header || !derived.filters) return null
    if (derived.filterKeys.length === 0) return null

    const { header, filters, grouped, filterKeys } = derived

    return (
        <section>
            <div className="mx-auto max-w-7xl px-4">

                {/* Header */}
                <div className="mb-12 text-center">
                    <p className="text-sm uppercase tracking-widest text-muted-foreground">
                        {header.eyebrow}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
                        {header.title}
                    </h2>

                    {header.description && (
                        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                            {header.description}
                        </p>
                    )}
                </div>

                {/* Tabs */}
                <Tabs defaultValue={filterKeys[0]}>
                    {/* <TabsList className="mx-auto mb-10 flex w-fit gap-6">
                        {filterKeys.map(key => (
                            <TabsTrigger key={key} value={key}>
                                {filters[key]}
                            </TabsTrigger>
                        ))}
                    </TabsList> */}

                    {filterKeys.map(key => (
                        <TabsContent key={key} value={key}>
                            <CountriesCarousel items={grouped[key]} />
                        </TabsContent>
                    ))}
                </Tabs>

            </div>
        </section>
    )
}
