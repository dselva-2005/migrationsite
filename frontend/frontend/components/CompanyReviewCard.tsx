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
}

export function CompanyReviewCard({
    name,
    domain,
    slug,
    imageUrl,
    rating,
    reviewCount,
}: CompanyReviewCardProps) {
    return (
        <Card className="p-0 hover:shadow-lg">
            <Link href={`/review/${slug}`} className="block">
                    <div className="w-full">
                        <AspectRatio ratio={1.2/ 1}>
                            <Image
                                src={imageUrl}
                                alt={name}
                                fill
                                className="rounded-[6px]"
                            />
                        </AspectRatio>
                    </div>
                <CardContent className="p-4 space-y-3 rounded-md">
                    {/* Image */}

                    {/* Company name */}
                    <h3 className="text-sm font-semibold leading-tight">
                        {name}
                    </h3>

                    {/* Domain */}
                    <p className="text-sm text-muted-foreground">
                        {domain}
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
