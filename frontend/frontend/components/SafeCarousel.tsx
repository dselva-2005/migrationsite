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

type SafeCarouselProps = {
    children: React.ReactNode
    itemClassName?: string
    loop?: boolean
    autoplay?: boolean
    autoplayDelay?: number
}

export function SafeCarousel({
    children,
    itemClassName = "basis-full md:basis-1/2 lg:basis-1/3",
    loop = true,
    autoplay = false,
    autoplayDelay = 3500,
}: SafeCarouselProps) {
    const items = Array.isArray(children) ? children : [children]

    const plugins = React.useMemo(
        () =>
            autoplay
                ? [
                    Autoplay({
                        delay: autoplayDelay,
                        stopOnInteraction: true,
                        stopOnMouseEnter: true,
                    }),
                ]
                : [],
        [autoplay, autoplayDelay]
    )

    return (
        <div className="relative w-full overflow-hidden">
            <Carousel
                opts={{
                    align: "start",
                    loop,
                }}
                plugins={plugins}
                className="w-full"
            >
                <CarouselContent>
                    {items.map((child, index) => (
                        <CarouselItem
                            key={index}
                            className={itemClassName}
                        >
                            {child}
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Desktop arrows only (prevent mobile overflow) */}
                <CarouselPrevious
                    className="hidden md:flex left-2 top-1/2 -translate-y-1/2"
                />
                <CarouselNext
                    className="hidden md:flex right-2 top-1/2 -translate-y-1/2"
                />
            </Carousel>
        </div>
    )
}
