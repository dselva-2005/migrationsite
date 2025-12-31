"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import Autoplay from "embla-carousel-autoplay"
import type { CarouselApi } from "@/components/ui/carousel"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"

type Country = {
    id: string
    name: string
    description: string
    image: string
    flag: string
    link: string
}

function CarouselDots({
    api,
    count,
}: {
    api: CarouselApi | null
    count: number
}) {
    const [selectedIndex, setSelectedIndex] = React.useState(0)

    React.useEffect(() => {
        if (!api) return

        const onSelect = () => {
            setSelectedIndex(api.selectedScrollSnap())
        }

        api.on("select", onSelect)
        onSelect()

        return () => {
            // IMPORTANT: do not return api.off(...)
            api.off("select", onSelect)
        }
    }, [api])

    if (!api) return null

    return (
        <div className="mt-4 flex justify-center gap-2">
            {Array.from({ length: count }).map((_, i) => (
                <button
                    key={i}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => api.scrollTo(i)}
                    className={`h-2.5 w-2.5 rounded-full transition ${
                        selectedIndex === i
                            ? "bg-primary"
                            : "bg-muted hover:bg-muted-foreground"
                    }`}
                />
            ))}
        </div>
    )
}


export function CountriesCarousel({ items }: { items: Country[] }) {
    const [api, setApi] = React.useState<CarouselApi | null>(null)

    const autoplay = React.useRef(
        Autoplay({
            delay: 3500,
            stopOnInteraction: false,
        })
    )

    return (
        <div className="relative overflow-hidden">
            <Carousel
                setApi={setApi}
                opts={{ align: "start", loop: true }}
                plugins={[autoplay.current]}
                onMouseEnter={() => autoplay.current.stop()}
                onMouseLeave={() => autoplay.current.reset()}
            >
                <CarouselContent className="-ml-6 py-6">
                    {items.map((item) => (
                        <CarouselItem
                            key={item.id}
                            className="pl-6 basis-full sm:basis-1/2 lg:basis-1/3"
                        >
                            {/* 👇 group added */}
                            <Card className="group border-0 flex h-full flex-col overflow-hidden rounded-2xl p-0 transition-shadow hover:shadow-lg">
                                {/* Image */}
                                <div className="relative aspect-[16/10] overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                                        className="
                                            object-cover
                                            transition-transform
                                            duration-500
                                            ease-out
                                            group-hover:scale-105
                                        "
                                    />

                                    {/* Flag */}
                                    <div className="
                                        absolute left-4 top-4
                                        rounded-full bg-white p-1 shadow
                                        transition-transform duration-300
                                        group-hover:scale-105
                                    ">
                                        <Image
                                            src={item.flag}
                                            alt=""
                                            width={28}
                                            height={28}
                                        />
                                    </div>
                                </div>

                                {/* Content */}
                                <CardContent className="flex flex-1 flex-col gap-3 p-5">
                                    <h4 className="text-lg font-semibold">
                                        {item.name}
                                    </h4>

                                    <p className="line-clamp-3 text-sm text-muted-foreground">
                                        {item.description}
                                    </p>

                                    <div className="mt-auto">
                                        <Link
                                            href={item.link}
                                            className="text-sm font-medium text-primary hover:underline"
                                        >
                                            Read More →
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Desktop arrows only */}
                <CarouselPrevious className="hidden lg:flex" />
                <CarouselNext className="hidden lg:flex" />

                {/* Scroll dots */}
                <CarouselDots api={api} count={items.length} />
            </Carousel>
        </div>
    )
}
