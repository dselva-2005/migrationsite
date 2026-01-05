"use client"

import Link from "next/link"
import Image from "next/image"

import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { TrustpilotRating } from "@/components/TrustpilotRating"

interface CompanyReviewCardProps {
    name: string
    domain: string
    slug: string
    imageUrl: string
    rating: number
    reviewCount: number
    tagline?: string | null
    city?: string | null
}

export function CompanyReviewCard({
    name,
    domain,
    slug,
    imageUrl,
    rating,
    reviewCount,
    tagline,
    city,
}: CompanyReviewCardProps) {
    return (
        <Card className="p-0 hover:shadow-lg">
            <Link href={`/review/${slug}`} className="block">
                {/* Image */}
                <div className="w-full">
                    <AspectRatio ratio={1.2 / 1}>
                        <Image
                            src={imageUrl}
                            alt={name}
                            fill
                            className="rounded-[6px]"
                            unoptimized
                        />
                    </AspectRatio>
                </div>

                {/* Card Content */}
                <CardContent className="p-4 space-y-2 rounded-md">
                    {/* Company Name */}
                    <h3 className="text-sm font-semibold leading-tight">
                        {name}
                    </h3>

                    {/* Tagline */}
                    {tagline && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                            {tagline}
                        </p>
                    )}

                    {/* Domain and City */}
                    <p className="text-xs text-muted-foreground">
                        {domain} {city ? `• ${city}` : ""}
                    </p>

                    {/* Rating */}
                    <TrustpilotRating
                        rating={rating}
                        reviewCount={reviewCount}
                        starsize={20}
                    />
                </CardContent>
            </Link>
        </Card>
    )
}
