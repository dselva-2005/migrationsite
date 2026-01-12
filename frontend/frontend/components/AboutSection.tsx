"use client"

import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { usePageContent } from "@/providers/PageContentProvider"

/* ───────────────────────── TYPES ───────────────────────── */

type AboutImage = {
    src: string
    alt: string
}

type AboutExperience = {
    years: number
    label: string
}

type AboutHeader = {
    eyebrow: string
    title: string
    subtitle?: string
}

type AboutHighlight = {
    icon: string
    eyebrow: string
    title: string
}

type AboutCTA = {
    label: string
    href: string
}

/* ───────────────────────── SKELETON ───────────────────────── */

function AboutSectionSkeleton() {
    return (
        <section
            id="about"
            className="mx-auto max-w-7xl px-4 py-6 sm:py-2 lg:py-4"
        >
            <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
                {/* LEFT — IMAGE MOSAIC */}
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    <Skeleton className="aspect-[4/5] rounded-2xl" />
                    <Skeleton className="aspect-[4/5] rounded-2xl" />
                    <Skeleton className="aspect-[4/5] rounded-2xl" />
                    <Skeleton className="aspect-[4/5] rounded-2xl" />
                </div>

                {/* RIGHT — CONTENT */}
                <div className="flex flex-col justify-center gap-8 lg:gap-10">
                    {/* Heading */}
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-8 w-2/3" />
                    </div>

                    <Separator className="max-w-xs" />

                    {/* Highlight */}
                    <div className="flex items-start gap-4">
                        <Skeleton className="h-12 w-12 rounded-md" />
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-5 w-40" />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>

                    {/* CTA */}
                    <Skeleton className="h-12 w-40 rounded-full" />
                </div>
            </div>
        </section>
    )
}

/* ───────────────────────── COMPONENT ───────────────────────── */

export default function AboutSection() {
    const { content, loading } = usePageContent()

    /* ───────────── Loading state ───────────── */
    if (loading || !content) {
        return <AboutSectionSkeleton />
    }

    const images = content["about.images"] as AboutImage[] | undefined
    const experience = content["about.experience"] as AboutExperience | undefined
    const header = content["about.header"] as AboutHeader | undefined
    const highlight = content["about.highlight"] as AboutHighlight | undefined
    const description = content["about.description"] as string | undefined
    const cta = content["about.cta"] as AboutCTA | undefined

    /* ───────────── Graceful CMS failure ───────────── */
    if (
        !images ||
        images.length < 3 ||
        !experience ||
        !header ||
        !highlight
    ) {
        return null
    }

    return (
        <section
            id="about"
            className="mx-auto max-w-7xl px-4 py-6 sm:py-2 lg:py-4"
        >
            <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">

                {/* LEFT — IMAGE MOSAIC */}
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    {/* Image 1 */}
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                        <Image
                            src={images[0].src}
                            alt={images[0].alt}
                            fill
                            priority
                            className="object-cover transition-all duration-1000 ease-in-out hover:grayscale-[40%] hover:brightness-90"
                        />
                    </div>

                    {/* Experience */}
                    <div className="flex aspect-[4/5] flex-col items-center justify-center rounded-2xl bg-muted text-center">
                        <span className="text-5xl font-semibold tabular-nums sm:text-6xl">
                            {experience.years}
                        </span>
                        <span className="mt-3 text-sm font-medium leading-tight text-muted-foreground">
                            {experience.label}
                        </span>
                    </div>

                    {/* Image 2 */}
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                        <Image
                            src={images[1].src}
                            alt={images[1].alt}
                            fill
                            className="object-cover transition-all duration-1000 ease-in-out hover:grayscale-[40%] hover:brightness-90"
                        />
                    </div>

                    {/* Image 3 */}
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                        <Image
                            src={images[2].src}
                            alt={images[2].alt}
                            fill
                            className="object-cover transition-all duration-1000 ease-in-out hover:grayscale-[40%] hover:brightness-90"
                        />
                    </div>
                </div>

                {/* RIGHT — CONTENT */}
                <div className="flex flex-col justify-center gap-8 lg:gap-10">
                    {/* Heading */}
                    <div className="space-y-3">
                        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                            {header.eyebrow}
                        </p>

                        <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                            {header.title}
                            {header.subtitle && (
                                <>
                                    <br className="hidden sm:block" />
                                    {header.subtitle}
                                </>
                            )}
                        </h2>
                    </div>

                    <Separator className="max-w-xs" />

                    {/* Highlight */}
                    <div className="flex items-start gap-4">
                        <Image
                            src={highlight.icon}
                            alt=""
                            width={48}
                            height={48}
                            className="shrink-0"
                        />
                        <div className="space-y-1">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                {highlight.eyebrow}
                            </p>
                            <h3 className="text-lg font-semibold">
                                {highlight.title}
                            </h3>
                        </div>
                    </div>

                    {/* Description */}
                    {description && (
                        <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
                            {description}
                        </p>
                    )}

                    {/* CTA */}
                    {cta && (
                        <div>
                            <Button
                                asChild
                                size="lg"
                                className="rounded-full px-8"
                            >
                                <Link href={cta.href}>{cta.label}</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
