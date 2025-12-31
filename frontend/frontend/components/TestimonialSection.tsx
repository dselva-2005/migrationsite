"use client"

import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"
import { SafeCarousel } from "@/components/SafeCarousel"
import { TrustpilotRating } from "./TrustpilotRating"

const testimonials = [
    {
        id: 1,
        title: "Thank You Immigo!",
        text:
            "Immigo visa consultancy is the best we came across while doing market research & migrating to Canada.",
        author: "Nora Penelope",
        country: "Switzerland",
        date: "February 3, 2022",
        rating: 4,
        image:
            "https://migrationreviews.com/1123/wp-content/uploads/2022/02/testimonial-2.jpg",
    },
    {
        id: 2,
        title: "Smooth & Efficient Service!",
        text:
            "Quisque Consultancy is definitely a highly recommended canadian migration agency.",
        author: "Silverster Scott",
        country: "Netherland",
        date: "February 3, 2022",
        rating: 3,
        image:
            "https://migrationreviews.com/1123/wp-content/uploads/2022/02/testimonial-1.jpg",
    },
    {
        id: 3,
        title: "Highly Recommended!",
        text: "Awesome customer service, they know what they are doing.",
        author: "Arlo Sebastian",
        country: "Australia",
        date: "February 3, 2022",
        rating: 5,
        image:
            "https://migrationreviews.com/1123/wp-content/uploads/2022/02/testimonial-3.jpg",
    },
    {
        id: 4,
        title: "Thank You Immigo!",
        text:
            "Immigo visa consultancy is the best we came across while doing market research & migrating to Canada.",
        author: "Nora Penelope",
        country: "Switzerland",
        date: "February 3, 2022",
        rating: 4,
        image:
            "https://migrationreviews.com/1123/wp-content/uploads/2022/02/testimonial-2.jpg",
    },
    {
        id: 5,
        title: "Smooth & Efficient Service!",
        text:
            "Quisque Consultancy is definitely a highly recommended canadian migration agency.",
        author: "Silverster Scott",
        country: "Netherland",
        date: "February 3, 2022",
        rating: 3,
        image:
            "https://migrationreviews.com/1123/wp-content/uploads/2022/02/testimonial-1.jpg",
    },
    {
        id: 6,
        title: "Highly Recommended!",
        text: "Awesome customer service, they know what they are doing.",
        author: "Arlo Sebastian",
        country: "Australia",
        date: "February 3, 2022",
        rating: 5,
        image:
            "https://migrationreviews.com/1123/wp-content/uploads/2022/02/testimonial-3.jpg",
    },
]

export default function TestimonialSection() {
    return (
        <section className="w-full py-6 sm:py-8 lg:py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-10 text-center">
                    <p className="text-sm uppercase tracking-wide text-muted-foreground">
                        Client Reviews
                    </p>
                    <h2 className="mt-2 text-2xl font-bold sm:text-3xl lg:text-4xl">
                        Feedback From Our Clients
                    </h2>
                </div>

                <SafeCarousel autoplay autoplayDelay={3500}>
                    {testimonials.map((item) => (
                        <Card key={item.id} className="h-full">
                            <CardContent className="flex h-full flex-col justify-between p-6 sm:p-8">

                                {/* Content */}
                                <div className="space-y-3">
                                    <h4 className="text-lg font-semibold">
                                        {item.title}
                                    </h4>
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

                                    {/* Rating */}
                                    {/* Rating */}
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
