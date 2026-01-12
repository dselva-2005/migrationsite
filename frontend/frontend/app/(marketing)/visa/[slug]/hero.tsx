"use client"

import Image from "next/image"
import { usePageContent } from "@/providers/PageContentProvider"
import { VISA_ROUTE_MAP } from "@/lib/visaRoutes"

type HeroProps = { slug: string }

/* ---------------------------------- */
/* Skeleton */
/* ---------------------------------- */

function HeroSkeleton() {
    return (
        <div className="relative overflow-hidden">
            {/* Background skeleton */}
            <div className="absolute inset-0 bg-muted animate-pulse" />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Title skeleton */}
            <div className="relative z-10 flex min-h-[260px] items-center justify-center">
                <div className="h-10 w-64 rounded-md bg-white/30 animate-pulse" />
            </div>
        </div>
    )
}

/* ---------------------------------- */
/* Hero */
/* ---------------------------------- */

export default function Hero({ slug }: HeroProps) {
    const { content, loading } = usePageContent()

    const title = VISA_ROUTE_MAP[slug] ?? null
    const header = content?.["visa.page_header"] as
        | { background_image: string }
        | undefined

    if (loading) return <HeroSkeleton />

    if (!content || !header || !title) return null

    return (
        <div className="relative overflow-hidden">
            <div className="absolute inset-0">
                <Image
                    src={header.background_image}
                    alt={title}
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
            </div>

            <div className="relative z-10 flex min-h-[260px] items-center justify-center text-center">
                <h1 className="text-4xl font-bold text-white">
                    {title}
                </h1>
            </div>
        </div>
    )
}
