"use client"

import { TrustpilotStar } from "./TrustpilotStar"

interface TrustpilotRatingProps {
    starsize: number
    rating: number
    reviewCount?: number
    maxStars?: number
    ratingFontWeight?: string // ✅ new prop
}

export function TrustpilotRating({
    starsize = 18,
    rating,
    reviewCount,
    maxStars = 5,
    ratingFontWeight = "text-sm", // ✅ default
}: TrustpilotRatingProps) {
    rating = rating || 0
    const color = "#FF8622"

    return (
        <div className="flex items-center gap-2">
            {/* Stars */}
            <div className="flex gap-[2px]">
                {Array.from({ length: maxStars }).map((_, i) => {
                    const fillPercent = rating - i
                    return (
                        <TrustpilotStar
                            key={i}
                            fillPercent={fillPercent}
                            color={color}
                            size={starsize}
                        />
                    )
                })}
            </div>

            {/* Numeric rating */}
            <span className={`${ratingFontWeight} text-foreground`}>
                {rating.toFixed(1).replace(".0", "")}
            </span>

            {/* Review count */}
            {reviewCount !== undefined && (
                <span className="text-sm text-muted-foreground">
                    ({reviewCount})
                </span>
            )}
        </div>
    )
}
