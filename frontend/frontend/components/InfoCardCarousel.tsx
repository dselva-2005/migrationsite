"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

type InfoCardCarouselProps = {
    children: React.ReactNode
    delay?: number
}

export function InfoCardCarousel({
    children,
    delay = 3500,
}: InfoCardCarouselProps) {
    const items = React.Children.toArray(children)

    /**
     * IMPORTANT:
     * Keep autoplay instance stable
     * so Embla does not reset on re-render
     */
    const autoplay = React.useRef(
        Autoplay({
            delay,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
        })
    )

    return (
        <div className="relative w-full overflow-hidden">
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                    dragFree: true, // smoother infinite feel
                }}
                plugins={[autoplay.current]}
                className="mx-auto max-w-7xl px-4"
            >
                <CarouselContent className="-ml-4 py-6">
                    {items.map((child, i) => (
                        <CarouselItem
                            key={i}
                            className="pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                        >
                            {child}
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Desktop arrows only — no overflow */}
                <CarouselPrevious className="hidden md:flex left-2" />
                <CarouselNext className="hidden md:flex right-2" />
            </Carousel>
        </div>
    )
}
