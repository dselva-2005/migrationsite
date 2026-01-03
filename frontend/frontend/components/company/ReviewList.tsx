"use client"

import { Review } from "@/types/review"
import { ReviewCard } from "./ReviewCard"
import { ReviewFilterState } from "./ReviewFilters"

interface ReviewListProps {
    reviews: Review[]
    filter: ReviewFilterState
}

export function ReviewList({ reviews, filter }: ReviewListProps) {
    let filtered = [...reviews]

    if (filter.rating) {
        filtered = filtered.filter(r => r.rating === filter.rating)
    }

    switch (filter.sort) {
        case "highest":
            filtered.sort((a, b) => b.rating - a.rating)
            break
        case "lowest":
            filtered.sort((a, b) => a.rating - b.rating)
            break
        case "recent":
            filtered.sort(
                (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
            )
            break
    }

    if (filtered.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">
                No reviews found.
            </p>
        )
    }

    return (
        <div className="space-y-4">
            {filtered.map(review => (
                <ReviewCard
                    key={review.id}
                    review={review}
                />
            ))}
        </div>
    )
}
