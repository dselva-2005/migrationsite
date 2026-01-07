"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { SafeCarousel } from "@/components/SafeCarousel"
import { TrustpilotRating } from "./TrustpilotRating"
import { usePageContent } from "@/providers/PageContentProvider"

/* ---------------- Types ---------------- */

type TestimonialsHeader = {
    eyebrow: string
    title: string
}

type Testimonial = {
    id: number
    title: string
    text: string
    author: string
    country: string
    date: string
    rating: number
    image: string
}

/* ---------------- Component ---------------- */

export default function TestimonialSection() {
    const { content, loading } = usePageContent()

    // ✅ early exit AFTER hook
    if (loading || !content) return null

    const header =
        content["testimonials.header"] as TestimonialsHeader | undefined

    const testimonials =
        content["testimonials.items"] as Testimonial[] | undefined

    // graceful CMS failure
    if (!header || !testimonials || testimonials.length === 0) return null

    return (
        <section className="w-full py-6 sm:py-8 lg:py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-10 text-center">
                    <p className="text-sm uppercase tracking-wide text-muted-foreground">
                        {header.eyebrow}
                    </p>
                    <h2 className="mt-2 text-2xl font-bold sm:text-3xl lg:text-4xl">
                        {header.title}
                    </h2>
                </div>

                {/* Reviews */}
                <SafeCarousel autoplay autoplayDelay={3500}>
                    {testimonials.map((item) => (
                        <Card key={item.id} className="h-full">
                            <CardContent className="flex h-full flex-col justify-between p-6 sm:p-8">

                                {/* Content */}
                                <div className="space-y-3">
                                    <h4 className="text-lg font-semibold">{item.title}</h4>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        {item.text}
                                    </p>
                                </div>

                                {/* Footer */}
                                <div className="mt-6 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={item.image}
                                            alt={item.author}
                                            width={44}
                                            height={44}
                                            className="rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="text-sm font-semibold">
                                                {item.author}
                                                <span className="text-muted-foreground">
                                                    {" "}• {item.country}
                                                </span>
                                            </p>
                                            <span className="text-xs text-muted-foreground">
                                                {item.date}
                                            </span>
                                        </div>
                                    </div>

                                    <TrustpilotRating
                                        rating={item.rating}
                                        maxStars={5}
                                        starsize={20}
                                    />
                                </div>

                            </CardContent>
                        </Card>
                    ))}
                </SafeCarousel>

            </div>
        </section>
    )
}
