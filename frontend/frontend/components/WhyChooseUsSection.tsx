"use client"

import Image from "next/image"
import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"
import { usePageContent } from "@/providers/PageContentProvider"

/* ---------------- Types ---------------- */

type WhyChooseHeader = {
    eyebrow: string
    title: string
    highlight: string
}

type Feature = {
    title: string
    description: string
    icon: string
    href: string
}

/* ---------------- Component ---------------- */

export default function WhyChooseUsSection() {
    const { content, loading } = usePageContent()

    // ✅ hook-safe early exit
    if (loading || !content) return null

    const header =
        content["why_choose.header"] as WhyChooseHeader | undefined

    const items =
        content["why_choose.items"] as Feature[] | undefined

    /* Graceful CMS failure */
    if (!header || !items || items.length === 0) return null

    return (
        <section className="py-2">
            <div className="mx-auto max-w-7xl px-4">

                {/* Header */}
                <div className="mb-14 text-center">
                    <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary/80">
                        {header.eyebrow}
                    </p>

                    <h2 className="mx-auto max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                        {header.title}{" "}
                        <span className="text-primary">
                            {header.highlight}
                        </span>
                    </h2>
                </div>

                {/* Cards */}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {items.map((item) => (
                        <Card
                            key={item.title}
                            className="group h-full rounded-2xl border-0 transition hover:shadow-lg"
                        >
                            <CardContent className="flex h-full flex-col p-6 text-center">

                                {/* Icon */}
                                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
                                    <Image
                                        src={item.icon}
                                        alt={item.title}
                                        width={32}
                                        height={32}
                                    />
                                </div>

                                <h4 className="text-lg font-semibold">
                                    {item.title}
                                </h4>

                                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                                    {item.description}
                                </p>

                                <div className="mt-auto pt-4">
                                    <Link
                                        href={item.href}
                                        className="text-sm font-medium text-primary hover:underline"
                                    >
                                        Read More →
                                    </Link>
                                </div>

                            </CardContent>
                        </Card>
                    ))}
                </div>

            </div>
        </section>
    )
}
