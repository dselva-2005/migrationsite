"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef } from "react"

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

/* ───────────────────────── SHADOW DOM RENDERER ───────────────────────── */

function ShadowDOMRenderer({ html }: { html: string }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const shadowRef = useRef<ShadowRoot | null>(null)

    useEffect(() => {
        const host = containerRef.current
        if (!host) return

        if (!shadowRef.current) {
            shadowRef.current = host.attachShadow({ mode: "open" })

            const style = document.createElement("style")
            style.textContent = `
                div {
                    font-family: inherit;
                    color: inherit;
                    line-height: 1.7;
                    font-size: 16px;
                }
                h1, h2, h3, h4, h5, h6 {
                    font-weight: 600;
                    margin: 1rem 0 0.5rem;
                }
                p {
                    margin: 0.75rem 0;
                }
                ul {
                    margin: 0.75rem 0;
                    padding-left: 1.25rem;
                }
                li {
                    margin: 0.4rem 0;
                }
                img {
                    max-width: 100%;
                    height: auto;
                    display: block;
                    margin: 1rem 0;
                }
            `
            shadowRef.current.appendChild(style)
        }

        const wrapper = document.createElement("div")
        wrapper.innerHTML = html

        const existingNodes = shadowRef.current.querySelectorAll("div")
        existingNodes.forEach(node => node.remove())

        shadowRef.current.appendChild(wrapper)

    }, [html])

    return <div ref={containerRef} className="w-full" />
}

/* ───────────────────────── SKELETON ───────────────────────── */

function AboutSectionSkeleton() {
    return (
        <section
            id="about"
            className="mx-auto max-w-7xl px-4 py-6 sm:py-2 lg:py-4"
        >
            <div className="grid lg:grid-cols-2 gap-14 lg:gap-20">
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    <Skeleton className="aspect-[4/5] rounded-2xl" />
                    <Skeleton className="aspect-[4/5] rounded-2xl" />
                    <Skeleton className="aspect-[4/5] rounded-2xl" />
                    <Skeleton className="aspect-[4/5] rounded-2xl" />
                </div>

                <div className="flex flex-col gap-8 lg:gap-10">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                </div>
            </div>
        </section>
    )
}

/* ───────────────────────── COMPONENT ───────────────────────── */

export default function AboutSection() {
    const { content, loading } = usePageContent()

    if (loading || !content) {
        return <AboutSectionSkeleton />
    }

    const images = content["about.images"] as AboutImage[] | undefined
    const experience = content["about.experience"] as AboutExperience | undefined
    const header = content["about.header"] as AboutHeader | undefined
    const highlight = content["about.highlight"] as AboutHighlight | undefined
    const description = content["about.description"] as string | undefined
    const cta = content["about.cta"] as AboutCTA | undefined

    if (!images || images.length < 3 || !experience || !header || !highlight) {
        return null
    }

    return (
        <section
            id="about"
            className="mx-auto max-w-7xl px-4 py-6 sm:py-2 lg:py-4"
        >
            <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 lg:items-start">

                {/* LEFT — IMAGE MOSAIC (Sticky) */}
                <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:sticky lg:top-24 h-fit">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                        <Image
                            src={images[0].src}
                            alt={images[0].alt}
                            fill
                            priority
                            className="object-cover transition-all duration-1000 ease-in-out hover:grayscale-[40%] hover:brightness-90"
                        />
                    </div>

                    <div className="flex aspect-[4/5] flex-col items-center justify-center rounded-2xl bg-muted text-center">
                        <span className="text-5xl font-semibold tabular-nums sm:text-6xl">
                            {experience.years}
                        </span>
                        <span className="mt-3 text-sm font-medium leading-tight text-muted-foreground">
                            {experience.label}
                        </span>
                    </div>

                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                        <Image
                            src={images[1].src}
                            alt={images[1].alt}
                            fill
                            className="object-cover transition-all duration-1000 ease-in-out hover:grayscale-[40%] hover:brightness-90"
                        />
                    </div>

                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                        <Image
                            src={images[2].src}
                            alt={images[2].alt}
                            fill
                            className="object-cover transition-all duration-1000 ease-in-out hover:grayscale-[40%] hover:brightness-90"
                        />
                    </div>
                </div>

                {/* RIGHT — CONTENT (Sticky) */}
                <div className="flex flex-col gap-8 lg:gap-10 lg:sticky lg:top-24 h-fit">

                    <div className="space-y-3">
                        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                            {header.eyebrow}
                        </p>

                        <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
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

                    {description && (
                        <ShadowDOMRenderer html={description} />
                    )}

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
