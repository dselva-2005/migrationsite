"use client"

import { useState } from "react"
import { Review } from "@/types/review"
import { ReviewFilters, ReviewFilterState } from "./ReviewFilters"
import { ReviewList } from "./ReviewList"
import { Button } from "@/components/ui/button"

type ReviewSectionProps = {
    reviews: Review[]
    loadMore?: () => Promise<void>
    onReviewSubmitted?: () => void
}

export function ReviewSection({
    reviews,
    loadMore,
    onReviewSubmitted,
}: ReviewSectionProps) {
    const [filter, setFilter] = useState<ReviewFilterState>({
        sort: "recent",
    })

    return (
        <div className="space-y-4">
            <ReviewFilters
                value={filter}
                onChange={setFilter}
            />

            <ReviewList
                reviews={reviews}
                filter={filter}
            />

            {loadMore && (
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={loadMore}
                >
                    Load more
                </Button>
            )}

            {/* Call this after successful POST review */}
            {/* onReviewSubmitted?.() */}
        </div>
    )
}
