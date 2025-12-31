"use client"

import { useState } from "react"
import { TrustpilotStar } from "../TrustpilotStar"
import { trustpilotColor } from "../TrustpilotRating"

export function StarRatingInput({
    onSelect,
    maxStars = 5,
}: {
    onSelect: (rating: number) => void
    maxStars?: number
}) {
    const [hovered, setHovered] = useState<number | null>(null)
    const [selected, setSelected] = useState<number | null>(null)

    // ⭐ one value drives EVERYTHING
    const activeRating = hovered ?? selected ?? 0
    const color = trustpilotColor(activeRating || 1)

    if (selected !== null) return null

    return (
        <div className="flex items-center gap-3">
            {/* Stars */}
            <div className="flex gap-[2px]">
                {Array.from({ length: maxStars }).map((_, i) => {
                    const starValue = i + 1

                    return (
                        <button
                            key={i}
                            type="button"
                            className="focus:outline-none"
                            onMouseEnter={() => setHovered(starValue)}
                            onMouseLeave={() => setHovered(null)}
                            onClick={() => {
                                setSelected(starValue)
                                onSelect(starValue)
                            }}
                        >
                            <TrustpilotStar
                                fillPercent={
                                    hovered !== null
                                        ? starValue <= hovered
                                            ? 1
                                            : 0
                                        : 0
                                }
                                color={color}
                                size={48}
                            />
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
