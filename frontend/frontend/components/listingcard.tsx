"use client"

import Image from "next/image"
import { Card } from "@/components/ui/card"
import { StarRating } from "./star-rating"

type ListingCardProps = {
    title: string
    imageUrl: string
    link: string
    location: string
    rating: number
    totalReviews: number
}

export function ListingCard({
    title,
    imageUrl,
    link,
    location,
    rating,
    totalReviews,
}: ListingCardProps) {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow w-full max-w-sm">
            {/* Image */}
            <a href={link} className="block relative w-full h-64">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 650px"
                />
            </a>

            {/* Content */}
            <div className="p-4 space-y-2">
                {/* Rating */}
                <div className="flex items-center justify-between">
                    <StarRating value={rating} />
                    <span className="text-sm text-muted-foreground">
                        Based on {totalReviews} reviews
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold">
                    <a href={link}>{title}</a>
                </h3>

                {/* Location */}
                <div className="flex items-center text-sm text-muted-foreground">
                    <svg
                        width="14"
                        height="16"
                        viewBox="0 0 14 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-1"
                    >
                        <path
                            d="M10 7C10 7.796 9.684 8.559 9.122 9.122C8.559 9.684 7.796 10 7 10C6.205 10 5.442 9.684 4.879 9.122C4.317 8.559 4 7.796 4 7C4 6.205 4.317 5.442 4.879 4.879C5.442 4.317 6.205 4 7 4C7.796 4 8.559 4.317 9.122 4.879C9.684 5.442 10 6.205 10 7Z"
                            fill="currentColor"
                        />
                        <path
                            d="M11.95 11.955C13.263 10.642 14 8.861 14 7.003C14 5.146 13.263 3.365 11.95 2.051C11.3 1.401 10.529 0.885 9.68 0.533C8.83 0.181 7.92 0 7 0C6.081 0 5.171 0.181 4.321 0.533C3.472 0.885 2.7 1.401 2.05 2.051C0.738 3.365 0 5.146 0 7.003C0 8.861 0.738 10.642 2.05 11.955L3.571 13.454L5.614 15.439C6.522 16.185 7.657 16.145 8.387 15.439L10.822 13.069L11.95 11.955Z"
                            fill="currentColor"
                        />
                    </svg>
                    {location}
                </div>
            </div>
        </Card>
    )
}
