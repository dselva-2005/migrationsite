"use client"

import Image from "next/image"
import { usePageContent } from "@/providers/PageContentProvider"

/* ---------------- Types ---------------- */

type PageHeroContent = {
    title: string
    backgroundImage?: {
        url: string
        alt?: string
    }
}

/* ---------------- Skeleton ---------------- */

function PageHeroSkeleton() {
    return (
        <section className="relative h-[220px] sm:h-[260px lg:h-[300px] bg-muted animate-pulse">
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 flex h-full items-center justify-center">
                <div className="h-8 w-48 rounded bg-muted-foreground/30 sm:h-10 sm:w-64" />
            </div>
        </section>
    )
}

/* ---------------- Component ---------------- */

export default function PageHero() {
    const { content, loading } = usePageContent()

    if (loading) return <PageHeroSkeleton />

    const hero = content?.["page.hero"] as PageHeroContent | undefined

    if (!hero || !hero.title) return null

    return (
        <section className="relative h-[220px] sm:h-[260px] lg:h-[300px] overflow-hidden">
            {/* Background Image */}
            {hero.backgroundImage?.url && (
                <Image
                    src={hero.backgroundImage.url}
                    alt={hero.backgroundImage.alt ?? hero.title}
                    fill
                    priority
                    className="object-cover"
                />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/45" />

            {/* Content */}
            <div className="relative z-10 flex h-full items-center justify-center px-4 text-center">
                <h1 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                    {hero.title}
                </h1>
            </div>
        </section>
    )
}
