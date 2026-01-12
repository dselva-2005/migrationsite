"use client"

import { cn } from "@/lib/utils"
import { usePageContent } from "@/providers/PageContentProvider"
import { Skeleton } from "@/components/ui/skeleton"

type HeaderContent = {
    title: string
    background_image: string
}

/* =========================
   SKELETON
========================= */
function PageHeaderSkeleton() {
    return (
        <section
            className={cn(
                "relative w-full bg-muted",
                "py-24 md:py-32"
            )}
        >
            <div className="relative container mx-auto px-4">
                <div className="flex justify-center">
                    <Skeleton className="h-10 md:h-14 w-64 md:w-96" />
                </div>
            </div>
        </section>
    )
}

/* =========================
   COMPONENT
========================= */
export default function PageHeader() {
    const { content, loading } = usePageContent()

    if (loading) {
        return <PageHeaderSkeleton />
    }

    if (!content) return null

    const hero = content["visa.hero"] as HeaderContent | undefined

    if (!hero) return null

    return (
        <section
            className={cn(
                "relative w-full bg-cover bg-center bg-no-repeat",
                "py-24 md:py-32"
            )}
            style={{ backgroundImage: `url(${hero.background_image})` }}
        >
            <div className="absolute inset-0 bg-black/50" />

            <div className="relative container mx-auto px-4">
                <h1 className="text-center text-3xl md:text-5xl font-bold text-white">
                    {hero.title}
                </h1>
            </div>
        </section>
    )
}
