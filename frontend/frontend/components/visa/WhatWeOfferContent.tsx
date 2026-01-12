"use client"

import Image from "next/image"
import { usePageContent } from "@/providers/PageContentProvider"
import { Skeleton } from "@/components/ui/skeleton"

/* -----------------------------
   Content shape from backend
-------------------------------- */
export type WhatWeOfferContent = {
    eyebrow: string
    title: string
    description: string
    image: string
    stats: {
        year_label: string
        year: number
        percentage: {
            value: number
            suffix: string
        }
        heading: string
        description: string
    }
}

/* =========================
   SKELETON
========================= */
function WhatWeOfferSkeleton() {
    return (
        <section>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Image skeleton */}
                    <Skeleton className="w-full h-[420px] rounded-2xl" />

                    {/* Content skeleton */}
                    <div>
                        <Skeleton className="h-4 w-32 mb-3" />
                        <Skeleton className="h-10 w-3/4 mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-5/6 mb-8" />

                        {/* Stats skeleton */}
                        <div className="flex items-start gap-6">
                            {/* Circular stat placeholder */}
                            <Skeleton className="w-[110px] h-[110px] rounded-full" />

                            {/* Text block */}
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-24" />
                                <Skeleton className="h-5 w-40" />
                                <Skeleton className="h-4 w-64" />
                            </div>
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
export default function WhatWeOfferSection() {
    const { content, loading } = usePageContent()

    if (loading) return <WhatWeOfferSkeleton />
    if (!content) return null

    const data = content["visa.what_we_offer"] as WhatWeOfferContent | undefined
    if (!data) return null

    const percentage = Math.min(Math.max(data.stats.percentage.value, 0), 100)

    // SVG math
    const size = 110
    const stroke = 10
    const radius = (size - stroke) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (percentage / 100) * circumference

    return (
        <section>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Image */}
                    <div className="relative w-full h-[420px] rounded-2xl overflow-hidden">
                        <Image
                            src={data.image}
                            alt={data.title}
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <h6 className="text-sm font-semibold uppercase tracking-wide text-primary">
                            {data.eyebrow}
                        </h6>

                        <h2 className="mt-2 text-3xl md:text-4xl font-bold">
                            {data.title}
                        </h2>

                        <p className="mt-4 text-muted-foreground">
                            {data.description}
                        </p>

                        {/* Stats */}
                        <div className="mt-8 flex items-start gap-6">
                            {/* Circular Progress */}
                            <div className="relative w-[110px] h-[110px]">
                                <svg
                                    width={size}
                                    height={size}
                                    viewBox={`0 0 ${size} ${size}`}
                                    className="rotate-[-90deg]"
                                >
                                    <circle
                                        cx={size / 2}
                                        cy={size / 2}
                                        r={radius}
                                        stroke="#e5e7eb"
                                        strokeWidth={stroke}
                                        fill="none"
                                    />
                                    <circle
                                        cx={size / 2}
                                        cy={size / 2}
                                        r={radius}
                                        stroke="#2563eb"
                                        strokeWidth={stroke}
                                        fill="none"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={offset}
                                        strokeLinecap="round"
                                    />
                                </svg>

                                <div className="absolute inset-0 flex items-center justify-center text-center">
                                    <div className="text-xs font-semibold leading-tight">
                                        {data.stats.year_label}
                                        <br />
                                        {data.stats.year}
                                    </div>
                                </div>
                            </div>

                            {/* Percentage + Text */}
                            <div>
                                <h2 className="text-3xl font-bold text-primary">
                                    {data.stats.percentage.value}
                                    {data.stats.percentage.suffix}
                                </h2>

                                <h3 className="mt-1 text-lg font-semibold">
                                    {data.stats.heading}
                                </h3>

                                <p className="mt-2 text-sm text-muted-foreground">
                                    {data.stats.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
