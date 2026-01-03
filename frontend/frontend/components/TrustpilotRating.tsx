"use client"

import { TrustpilotStar } from "./TrustpilotStar"

interface TrustpilotRatingProps {
    starsize:number
    rating: number
    reviewCount?: number
    maxStars?: number
}

export const trustpilotColor = (rating: number) => {
    // if (rating >= 4.5) return "#00B67A"
    // if (rating >= 3.5) return "#73CF11"
    // if (rating >= 2.5) return "#FFCE00"
    // if (rating >= 1.5) return "#FF8622"
    return "#FF8622"
    // return "#E74C3C"
}


export function TrustpilotRating({
    starsize = 18,
    rating,
    reviewCount,
    maxStars = 5,
}: TrustpilotRatingProps) {
    rating = rating || 0
    const color = trustpilotColor(rating)

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
            <span className="text-sm font-medium text-foreground">
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
