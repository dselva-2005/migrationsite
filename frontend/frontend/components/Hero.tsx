"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { getPageContent } from "@/services/content"

type Slide = {
    title: string
    description: string
}

type ImageItem = {
    url: string
    alt: string
}

export default function Hero() {
    const [slides, setSlides] = useState<Slide[]>([])
    const [images, setImages] = useState<ImageItem[]>([])
    const [cta, setCta] = useState<{ label: string; href: string }>({
        label: "",
        href: "#",
    })
    const [index, setIndex] = useState(0)

    useEffect(() => {
        getPageContent("home")
            .then(data => {
                setSlides(data["hero.slides"] ?? [])
                setImages(data["hero.images"] ?? [])
                setCta(data["hero.cta"] ?? {})
            })
            .catch(() => {
                // fail silently for CMS content
            })
    }, [])

    useEffect(() => {
        if (!slides.length) return

        const interval = setInterval(() => {
            setIndex(prev => (prev + 1) % slides.length)
        }, 4500)

        return () => clearInterval(interval)
    }, [slides])

    if (!slides.length) return null

    const content = slides[index]

    return (
        <section className="relative w-full overflow-hidden bg-muted">
            <div className="mx-auto max-w-7xl px-6 py-20">
                <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

                    {/* LEFT */}
                    <div className="relative max-w-xl min-h-[220px]">
                        <div key={index} className="absolute inset-0 animate-hero-text space-y-6">
                            <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">
                                {content.title}
                            </h1>

                            <p className="text-muted-foreground text-base sm:text-lg">
                                {content.description}
                            </p>

                            <Button size="lg" className="gap-2" asChild>
                                <a href={cta.href}>
                                    {cta.label}
                                    <ArrowRight className="h-4 w-4" />
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="relative h-[320px] overflow-hidden rounded-3xl">
                        <div className="flex w-max gap-6 animate-hero-marquee">
                            {[...images, ...images].map((img, i) => (
                                <div
                                    key={i}
                                    className="relative h-[320px] w-[260px] flex-shrink-0 overflow-hidden rounded-2xl"
                                >
                                    <Image
                                        src={img.url}
                                        alt={img.alt}
                                        fill
                                        priority
                                        className="object-cover"
                                        sizes="260px"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
