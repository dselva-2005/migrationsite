"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ListingCard } from "./listingcard"

type Listing = {
    title: string
    imageUrl: string
    link: string
    location: string
    rating: number
    totalReviews: number
}

type ListingCarouselProps = {
    items: Listing[]
}

export function ListingCarousel({ items }: ListingCarouselProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    const scroll = (direction: "left" | "right") => {
        if (!containerRef.current) return

        const scrollAmount = containerRef.current.clientWidth
        containerRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        })
    }

    return (
        <div className="relative w-full">
            {/* Left button */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-background/80 backdrop-blur"
            >
                <ChevronLeft />
            </Button>

            {/* Carousel */}
            <div
                ref={containerRef}
                className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-10 scrollbar-hide"
            >
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="
              snap-start
              flex-shrink-0
              w-full
              sm:w-1/2
              lg:w-1/3
            "
                    >
                        <ListingCard {...item} />
                    </div>
                ))}
            </div>

            {/* Right button */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-background/80 backdrop-blur"
            >
                <ChevronRight />
            </Button>
        </div>
    )
}
