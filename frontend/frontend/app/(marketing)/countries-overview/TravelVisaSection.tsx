"use client"

import { usePageContent } from "@/providers/PageContentProvider"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"

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
   SKELETON
========================= */
function TravelVisaSectionSkeleton() {
    return (
        <section className="py-20">
            <div className="auto-container max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Image */}
                    <Skeleton className="h-[500px] w-full rounded-lg" />

                    {/* Content */}
                    <div>
                        {/* Title */}
                        <div className="mb-6 space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-8 w-72" />
                        </div>

                        {/* Paragraphs */}
                        <div className="space-y-3 mb-8">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-11/12" />
                            <Skeleton className="h-4 w-10/12" />
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex gap-4">
                                    <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-6 w-24" />
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-40" />
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

/* =========================
   COMPONENT
========================= */
export default function TravelVisaSection() {
    const { content, loading } = usePageContent()

    if (loading) {
        return <TravelVisaSectionSkeleton />
    }

    const data = content?.["travelVisaSection"] as
        | TravelVisaSectionData
        | undefined

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
                                        <h2 className="text-3xl font-bold">
                                            {item.count}
                                        </h2>
                                        <h4 className="font-semibold">
                                            {item.title}
                                        </h4>
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
