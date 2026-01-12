"use client"

import Image from "next/image"
import { usePageContent } from "@/providers/PageContentProvider"
import { Separator } from "@/components/ui/separator"

/* ───────────────────────── TYPES ───────────────────────── */

type WhyChooseHeader = {
    eyebrow: string
    title: string
    description?: string
}

type WhyChooseItem = {
    icon: string
    title: string
    description: string
}

type WhyChooseImage = {
    src: string
    alt: string
}

/* ───────────────────────── SKELETON ───────────────────────── */

function WhyChooseSkeleton() {
    return (
        <section
            className="mx-auto max-w-7xl px-4 py-16 lg:py-24 animate-pulse"
        >
            <div className="grid items-stretch gap-12 lg:grid-cols-12">

                {/* LEFT — IMAGE SKELETON */}
                <div className="hidden lg:block lg:col-span-4">
                    <div className="h-full rounded-3xl bg-muted" />
                </div>

                {/* RIGHT — CONTENT */}
                <div className="lg:col-span-8 flex flex-col space-y-10">

                    {/* Header Skeleton */}
                    <div className="max-w-2xl space-y-3">
                        <div className="h-3 w-24 rounded bg-muted" />
                        <div className="h-10 w-3/4 rounded bg-muted" />
                        <div className="h-4 w-full rounded bg-muted" />
                        <div className="h-4 w-5/6 rounded bg-muted" />
                    </div>

                    <Separator className="max-w-sm" />

                    {/* Items Skeleton */}
                    <div className="grid gap-6 sm:grid-cols-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex gap-4 rounded-2xl border bg-background p-6"
                            >
                                <div className="h-12 w-12 rounded bg-muted shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-2/3 rounded bg-muted" />
                                    <div className="h-3 w-full rounded bg-muted" />
                                    <div className="h-3 w-5/6 rounded bg-muted" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

/* ───────────────────────── COMPONENT ───────────────────────── */

export default function WhyChooseSection() {
    const { content, loading } = usePageContent()

    /* ⛔ Loading → Skeleton */
    if (loading) return <WhyChooseSkeleton />

    if (!content) return null

    const header = content["whyChoose.header"] as WhyChooseHeader | undefined
    const items = content["whyChoose.items"] as WhyChooseItem[] | undefined
    const sideImage = content["whyChoose.image"] as WhyChooseImage | undefined

    /* ⛔ CMS failure */
    if (!header || !items || items.length === 0) return null

    return (
        <section
            id="why-choose-us"
            className="mx-auto max-w-7xl px-4 py-16 lg:py-24"
        >
            <div className="grid items-stretch gap-12 lg:grid-cols-12">

                {/* LEFT — SIDE IMAGE */}
                {sideImage && (
                    <div className="hidden lg:block lg:col-span-4">
                        <div className="relative h-full overflow-hidden rounded-3xl">
                            <Image
                                src={sideImage.src}
                                alt={sideImage.alt}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                )}

                {/* RIGHT — CONTENT */}
                <div className="lg:col-span-8 flex flex-col space-y-10">

                    {/* Header */}
                    <div className="max-w-2xl space-y-3">
                        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                            {header.eyebrow}
                        </p>

                        <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                            {header.title}
                        </h2>

                        {header.description && (
                            <p className="text-base leading-relaxed text-muted-foreground">
                                {header.description}
                            </p>
                        )}
                    </div>

                    <Separator className="max-w-sm" />

                    {/* Items */}
                    <div className="grid gap-6 sm:grid-cols-2">
                        {items.map((item, index) => (
                            <div
                                key={index}
                                className="flex gap-4 rounded-2xl border bg-background p-6 transition hover:shadow-sm"
                            >
                                <div className="relative h-12 w-12 shrink-0">
                                    <Image
                                        src={item.icon}
                                        alt=""
                                        fill
                                        className="object-contain"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <h4 className="text-lg font-semibold">
                                        {item.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    )
}
