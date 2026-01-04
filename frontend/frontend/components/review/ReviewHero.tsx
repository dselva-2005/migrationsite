"use client";

import * as React from "react";
import { usePageContent } from "@/providers/PageContentProvider";
import { GlobalSearch } from "@/components/GlobalSearch"

interface HeroMessage {
    title: string;
    subtitle: string;
}

export function ReviewHero() {
    const content = usePageContent();

    // Memoize messages so useEffect dependencies are stable
    const messages: HeroMessage[] = React.useMemo(() => {
        return (content["review.hero.messages"] as HeroMessage[]) || [];
    }, [content]);

    const [index, setIndex] = React.useState(0);

    React.useEffect(() => {
        if (!messages.length) return;

        const id = setInterval(() => {
            setIndex((prev) => (prev + 1) % messages.length);
        }, 3200);

        return () => clearInterval(id);
    }, [messages]); // stable dependency now

    if (!messages.length) return null; // fallback while loading

    const message = messages[index];

    return (
        <section className="border-0 bg-violet-50/70 dark:bg-rose-950/20">
            <div className="mx-auto max-w-7xl px-4 py-20 sm:py-24">
                <div className="relative max-w-xl min-h-[220px] mx-auto text-center">
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
                <GlobalSearch/>
            </div>
        </section>
    );
}
