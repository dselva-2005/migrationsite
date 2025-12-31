"use client"

import * as React from "react"

interface HeroMessage {
    title: string
    subtitle: string
}

const HERO_MESSAGES: HeroMessage[] = [
    {
        title: "Trusted company reviews",
        subtitle:
            "Honest customer experiences, transparent ratings, and real feedback.",
    },
    {
        title: "Make confident decisions",
        subtitle:
            "Compare companies based on verified customer reviews and ratings.",
    },
    {
        title: "Real voices, real impact",
        subtitle:
            "Discover what customers actually think before you choose.",
    },
]

export function ReviewHero() {
    const [index, setIndex] = React.useState(0)

    React.useEffect(() => {
        const id = setInterval(() => {
            setIndex((prev) => (prev + 1) % HERO_MESSAGES.length)
        }, 3200) // slightly longer than animation duration

        return () => clearInterval(id)
    }, [])

    const message = HERO_MESSAGES[index]

    return (
        <section className="border-0 bg-violet-50/70 dark:bg-rose-950/20">
            <div className="mx-auto max-w-7xl px-4 py-20 sm:py-24">
                <div className="relative max-w-xl min-h-[220px] mx-auto text-center">
                    {/* Remount to restart animation */}
                    <div
                        key={index}
                        className="absolute inset-0 animate-hero-text space-y-6"
                    >
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                            {message.title}
                        </h1>

                        <p className="text-base text-muted-foreground sm:text-lg">
                            {message.subtitle}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
