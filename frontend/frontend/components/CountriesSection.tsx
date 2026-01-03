"use client"

import { useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CountriesCarousel } from "./CountriesCarousel"
import { usePageContent } from "@/providers/PageContentProvider"

/* ---------------- Types (local only) ---------------- */

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

/* ---------------- Static Countries Data ---------------- */

export const COUNTRIES: Country[] = [
    {
        id: "canada-education",
        name: "Canada",
        category: "education",
        description:
            "Globally ranked universities with strong post-study work options.",
        image:
            "https://images.unsplash.com/photo-1508973375-1d5be6c98b00?q=80&w=1200&auto=format&fit=crop",
        flag: "/flags/canada.svg",
        link: "/study-in-canada",
    },
    {
        id: "germany-education",
        name: "Germany",
        category: "education",
        description:
            "Low tuition fees and world-class technical education.",
        image:
            "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1200&auto=format&fit=crop",
        flag: "/flags/germany.svg",
        link: "/study-in-germany",
    },
    {
        id: "uk-education",
        name: "United Kingdom",
        category: "education",
        description:
            "Shorter degrees and top global institutions.",
        image:
            "https://images.unsplash.com/photo-1486299267070-83823f5448dd?q=80&w=1200&auto=format&fit=crop",
        flag: "/flags/uk.svg",
        link: "/study-in-uk",
    },
    {
        id: "australia-immigration",
        name: "Australia",
        category: "immigration",
        description:
            "Points-based immigration with strong demand occupations.",
        image:
            "https://images.unsplash.com/photo-1506973035872-a4f23e576c59?q=80&w=1200&auto=format&fit=crop",
        flag: "/flags/australia.svg",
        link: "/australia-pr",
    },
    {
        id: "canada-immigration",
        name: "Canada",
        category: "immigration",
        description:
            "Fast-track permanent residency programs via Express Entry.",
        image:
            "https://images.unsplash.com/photo-1517935706615-2717063c2225?q=80&w=1200&auto=format&fit=crop",
        flag: "/flags/canada.svg",
        link: "/canada-pr",
    },
    {
        id: "germany-immigration",
        name: "Germany",
        category: "immigration",
        description:
            "EU residency through the Germany Blue Card program.",
        image:
            "https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?q=80&w=1200&auto=format&fit=crop",
        flag: "/flags/germany.svg",
        link: "/germany-blue-card",
    },
    {
        id: "usa-business",
        name: "United States",
        category: "business",
        description:
            "LLC setup, investor visas, and large-scale business expansion.",
        image:
            "https://images.unsplash.com/photo-1508433957232-3107f5fd5995?q=80&w=1200&auto=format&fit=crop",
        flag: "/flags/usa.svg",
        link: "/business-in-usa",
    },
    {
        id: "uae-business",
        name: "UAE",
        category: "business",
        description:
            "Zero-tax free zones with fast company formation.",
        image:
            "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1200&auto=format&fit=crop",
        flag: "/flags/uae.svg",
        link: "/business-in-uae",
    },
    {
        id: "singapore-business",
        name: "Singapore",
        category: "business",
        description:
            "Asia’s most business-friendly ecosystem.",
        image:
            "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1200&auto=format&fit=crop",
        flag: "/flags/singapore.svg",
        link: "/business-in-singapore",
    },
]

/* ---------------- Component ---------------- */

export default function CountriesSection() {
    const content = usePageContent()

    const header = content["countries.header"] as HeaderData | undefined
    const filters = content["countries.filters"] as FiltersData | undefined

    const grouped = useMemo(() => {
        return {
            education: COUNTRIES.filter(c => c.category === "education"),
            immigration: COUNTRIES.filter(c => c.category === "immigration"),
            business: COUNTRIES.filter(c => c.category === "business"),
        }
    }, [])

    /* -------- Graceful failure -------- */

    if (!header || !filters) return null

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
