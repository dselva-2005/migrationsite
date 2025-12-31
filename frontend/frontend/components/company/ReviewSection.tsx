"use client"

import { useState } from "react"
import { Review } from "@/types/review"
import { ReviewFilters, ReviewFilterState } from "./ReviewFilters"
import { ReviewList } from "./ReviewList"

export function ReviewSection({
    reviews,
}: {
    reviews: Review[]
}) {
    const [filter, setFilter] =
        useState<ReviewFilterState>({
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
        </div>
    )
}
