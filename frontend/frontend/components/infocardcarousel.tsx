"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

type InfoCardCarouselProps = {
    children: React.ReactNode
}

export function InfoCardCarousel({ children }: InfoCardCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null)

    const scroll = (dir: "left" | "right") => {
        if (!scrollRef.current) return
        scrollRef.current.scrollBy({
            left:
                dir === "left"
                    ? -scrollRef.current.clientWidth
                    : scrollRef.current.clientWidth,
            behavior: "smooth",
        })
    }

    return (
        <div className="relative mx-auto max-w-6xl px-4">
            {/* Left */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex"
            >
                <ChevronLeft />
            </Button>

            {/* Track */}
            <div
                ref={scrollRef}
                className="
                    flex
                    gap-6
                    overflow-x-auto
                    overflow-y-visible
                    scroll-smooth
                    no-scrollbar
                    py-6
                "
            >
                {Array.isArray(children) &&
                    children.map((child, i) => (
                        <div
                            key={i}
                            className="
                                shrink-0
                                w-full
                                sm:w-[calc((100%-32px)/2)]
                                lg:w-[calc((100%-80px)/3)]
                                "

                        >
                            {child}
                        </div>
                    ))}
            </div>

            {/* Right */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex"
            >
                <ChevronRight />
            </Button>
        </div>
    )
}
