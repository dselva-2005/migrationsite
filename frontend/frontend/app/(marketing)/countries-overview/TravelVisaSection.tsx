"use client"

import { usePageContent } from "@/providers/PageContentProvider"
import Image from "next/image"

/* =========================
   TYPES
========================= */
type StatItem = {
    icon: string
    count: string
    title: string
    text: string
}

type TravelVisaSectionData = {
    image: string
    sectionTitle: {
        small: string
        main: string
    }
    description: string[]
    stats: StatItem[]
}

/* =========================
   COMPONENT
========================= */
export default function TravelVisaSection() {
    const { content, loading } = usePageContent()

    const data = content?.["travelVisaSection"] as TravelVisaSectionData | undefined

    if (loading) return null
    if (!data) return null

    return (
        <section className="py-20">
            <div className="auto-container max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* IMAGE COLUMN */}
                    <div>
                        <figure className="rounded-lg overflow-hidden">
                            <Image
                                src={data.image}
                                alt={data.sectionTitle.main}
                                width={600}
                                height={500}
                                className="w-full object-cover"
                            />
                        </figure>
                    </div>

                    {/* CONTENT COLUMN */}
                    <div>
                        {/* Section title */}
                        <div className="mb-6">
                            <h6 className="text-primary font-medium mb-1">
                                {data.sectionTitle.small}
                            </h6>
                            <h2 className="text-3xl font-bold">
                                {data.sectionTitle.main}
                            </h2>
                        </div>

                        {/* Text */}
                        <div className="space-y-4 mb-8 text-muted-foreground">
                            {data.description.map((p, i) => (
                                <p key={i}>{p}</p>
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {data.stats.map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="shrink-0">
                                        <Image
                                            src={item.icon}
                                            alt={item.title}
                                            width={50}
                                            height={50}
                                        />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold">{item.count}</h2>
                                        <h4 className="font-semibold">{item.title}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {item.text}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}
