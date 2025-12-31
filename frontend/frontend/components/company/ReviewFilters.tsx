"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export type ReviewSort =
    | "recent"
    | "highest"
    | "lowest"

export interface ReviewFilterState {
    rating?: number
    sort: ReviewSort
}

interface ReviewFiltersProps {
    value: ReviewFilterState
    onChange: (value: ReviewFilterState) => void
}

export function ReviewFilters({
    value,
    onChange,
}: ReviewFiltersProps) {
    return (
        <div className="flex flex-wrap items-center gap-3">
            {/* Rating filter */}
            <Select
                value={value.rating?.toString() ?? "all"}
                onValueChange={(v) =>
                    onChange({
                        ...value,
                        rating: v === "all" ? undefined : Number(v),
                    })
                }
            >
                <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="All ratings" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All ratings</SelectItem>
                    <SelectItem value="5">5 stars</SelectItem>
                    <SelectItem value="4">4 stars</SelectItem>
                    <SelectItem value="3">3 stars</SelectItem>
                    <SelectItem value="2">2 stars</SelectItem>
                    <SelectItem value="1">1 star</SelectItem>
                </SelectContent>
            </Select>

            {/* Sort */}
            <Select
                value={value.sort}
                onValueChange={(v) =>
                    onChange({
                        ...value,
                        sort: v as ReviewSort,
                    })
                }
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="recent">Most recent</SelectItem>
                    <SelectItem value="highest">Highest rated</SelectItem>
                    <SelectItem value="lowest">Lowest rated</SelectItem>
                </SelectContent>
            </Select>

            {/* Clear */}
            {(value.rating || value.sort !== "recent") && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        onChange({ sort: "recent" })
                    }
                >
                    Clear
                </Button>
            )}
        </div>
    )
}
