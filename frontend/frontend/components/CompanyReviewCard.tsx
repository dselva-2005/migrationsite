"use client"

import Link from "next/link"
import Image from "next/image"
import { MapPin } from "lucide-react"

import {
    Card,
    CardContent,
} from "@/components/ui/card"
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
    country?: string | null
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
    country,
}: CompanyReviewCardProps) {
    return (
        <Card className="p-0 hover:shadow-lg">
            <Link href={`/listing/${slug}`} className="block">
                {/* Image */}
                <div className="w-full">
                    <Image
                        src={imageUrl}
                        alt={name}
                        width={360}
                        height={270}
                        className="w-full object-cover rounded-[6px]"
                        unoptimized
                    />
                </div>

                {/* Card Content */}
                <CardContent className="p-4 space-y-2 rounded-md">
                    {/* Company Name with ellipsis */}
                    <h3 className="text-sm font-semibold leading-tight line-clamp-1">
                        {name}
                    </h3>

                    {/* Tagline */}
                    {tagline && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                            {tagline}
                        </p>
                    )}

                    {/* Domain and City */}
                    <div className="text-xs text-muted-foreground">
                        <p className="line-clamp-1">{domain}</p>
                        {(country || city) && (
                            <div className="flex items-center gap-1 mt-1 text-gray-400">
                                <MapPin className="h-3 w-3 shrink-0" />
                                <span className="line-clamp-1">
                                    {city && country
                                        ? `${city}, ${country}`
                                        : city || country}
                                </span>
                            </div>
                        )}
                    </div>

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