"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const HERO_IMAGES = [
    "https://picsum.photos/id/1011/600/800",
    "https://picsum.photos/id/1015/600/800",
    "https://picsum.photos/id/1024/600/800",
]

const HERO_CONTENT = [
    {
        title: "Study In Recognized Universities!",
        description:
            "We help students secure admissions in top global universities with end-to-end visa support.",
    },
    {
        title: "Build Your Global Career",
        description:
            "Expert immigration consultants guiding you through every step of your journey abroad.",
    },
    {
        title: "Trusted Visa & Migration Experts",
        description:
            "Professional assistance for student, work, and permanent residency visas.",
    },
]

export default function Hero() {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % HERO_CONTENT.length)
        }, 4500)

        return () => clearInterval(interval)
    }, [])

    const content = HERO_CONTENT[index]

    return (
        <section className="relative w-full overflow-hidden bg-muted">
            <div className="mx-auto max-w-7xl px-6 py-20">
                <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

                    {/* LEFT — LOOPING CONTENT */}
                    <div className="relative max-w-xl min-h-[220px]">
                        <div
                            key={index}
                            className="
                absolute inset-0
                animate-hero-text
                space-y-6
              "
                        >
                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                                {content.title}
                            </h1>

                            <p className="text-muted-foreground text-base sm:text-lg">
                                {content.description}
                            </p>

                            <Button size="lg" className="gap-2">
                                More Details
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* RIGHT — IMAGE REEL */}
                    <div className="relative h-[320px] overflow-hidden rounded-3xl">
                        <div className="flex w-max gap-6 animate-hero-marquee">
                            {[...HERO_IMAGES, ...HERO_IMAGES].map((src, i) => (
                                <div
                                    key={i}
                                    className="relative h-[320px] w-[260px] flex-shrink-0 overflow-hidden rounded-2xl"
                                >
                                    <Image
                                        src={src}
                                        alt="Study abroad"
                                        fill
                                        unoptimized
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
