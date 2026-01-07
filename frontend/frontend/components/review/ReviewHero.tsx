"use client"

import { useEffect, useState } from "react"
import { usePageContent } from "@/providers/PageContentProvider"

/* ---------------- Types ---------------- */

interface HeroMessage {
    title: string
    subtitle: string
}

/* ---------------- Component ---------------- */

export function ReviewHero() {
    const { content } = usePageContent()

    const messages =
        (content?.["review.hero.messages"] as HeroMessage[]) ?? []

    const [index, setIndex] = useState(0)

    useEffect(() => {
        if (messages.length === 0) return

        const id = setInterval(() => {
            setIndex((prev) => (prev + 1) % messages.length)
        }, 3200)

        return () => clearInterval(id)
    }, [messages.length])

    /* Graceful CMS loading / failure */
    if (messages.length === 0) return null

    const message = messages[index]

    return (
        <section className="border-0 bg-violet-50/70 dark:bg-rose-950/20">
            <div className="mx-auto max-w-7xl px-4 py-20 sm:py-24">
                <div className="relative mx-auto min-h-[220px] max-w-xl text-center">
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
