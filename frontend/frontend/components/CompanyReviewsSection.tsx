"use client"

import { useEffect, useMemo, useState } from "react"
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"
import { CompanyReviewCard } from "./CompanyReviewCard"
import { usePageContent } from "@/providers/PageContentProvider"
import clsx from "clsx"

/* ---------------- Types ---------------- */

interface Company {
    id: string
    name: string
    domain: string
    slug: string
    imageUrl: string
    city?: string
    country?: string
    rating: number
    reviewCount: number
}

type HeaderData = {
    eyebrow?: string
    title: string
}

interface CompanyReviewsSectionProps {
    companies: Company[]
}

/* ---------------- Component ---------------- */

export function CompanyReviewsSection({
    companies,
}: CompanyReviewsSectionProps) {
    const { content, loading } = usePageContent()

    const derived = useMemo(() => {
        return {
            header: content?.["reviews.header"] as HeaderData | undefined,
        }
    }, [content])

    const [api, setApi] = useState<CarouselApi | null>(null)
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)

    /* ---------------- Carousel wiring ---------------- */

    useEffect(() => {
        if (!api) return

        const onInit = () => {
            setCount(api.scrollSnapList().length)
            setCurrent(api.selectedScrollSnap())
        }

        const onSelect = () => {
            setCurrent(api.selectedScrollSnap())
        }

        api.on("init", onInit)
        api.on("reInit", onInit)
        api.on("select", onSelect)

        onInit()

        return () => {
            api.off("init", onInit)
            api.off("reInit", onInit)
            api.off("select", onSelect)
        }
    }, [api])

    /* ---------------- Auto loop ---------------- */

    useEffect(() => {
        if (!api) return

        let interval: NodeJS.Timeout | null = null

        const startAutoScroll = () => {
            stopAutoScroll()
            interval = setInterval(() => {
                if (!api.canScrollNext()) {
                    api.scrollTo(0)
                } else {
                    api.scrollNext()
                }
            }, 3000) // ⏱️ adjust speed here
        }

        const stopAutoScroll = () => {
            if (interval) {
                clearInterval(interval)
                interval = null
            }
        }

        // Start immediately
        startAutoScroll()

        // Pause on user interaction
        api.on("pointerDown", stopAutoScroll)
        api.on("pointerUp", startAutoScroll)

        return () => {
            stopAutoScroll()
            api.off("pointerDown", stopAutoScroll)
            api.off("pointerUp", startAutoScroll)
        }
    }, [api])

    /* ---------------- Early returns ---------------- */

    if (loading || !content) return null
    if (!derived.header || companies.length === 0) return null

    const { header } = derived

    /* ---------------- Render ---------------- */

    return (
        <div className="mx-auto max-w-7xl px-4">
            {/* Header */}
            <div className="mb-10 text-center">
                {header.eyebrow && (
                    <p className="text-sm uppercase tracking-widest text-muted-foreground">
                        {header.eyebrow}
                    </p>
                )}
                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                    {header.title}
                </h2>
            </div>

            {/* Carousel */}
            <Carousel
                setApi={setApi}
                opts={{
                    align: "start",
                    slidesToScroll: 1,
                    loop: true, // ✅ REQUIRED for auto loop
                    duration: 30, // smoother transition
                }}
            >
                <CarouselContent className="-ml-6">
                    {companies.map((company) => (
                        <CarouselItem
                            key={company.id}
                            className="
                                pl-6
                                basis-full
                                sm:basis-1/2
                                xl:basis-1/4
                            "
                        >
                            <CompanyReviewCard {...company} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

            {/* Dots */}
            {count > 1 && (
                <div className="mt-10 flex justify-center gap-2">
                    {Array.from({ length: count }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => api?.scrollTo(i)}
                            className={clsx(
                                "h-2.5 w-2.5 rounded-full transition",
                                i === current
                                    ? "bg-gray-900"
                                    : "bg-gray-300 hover:bg-gray-400"
                            )}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
