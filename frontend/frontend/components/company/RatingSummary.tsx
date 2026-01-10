import { Card, CardContent } from "@/components/ui/card"
import { TrustpilotRating } from "@/components/TrustpilotRating"
import { Company } from "@/types/company"


function getRatingPercentage(
    rating: number,
    breakdown: { rating: number; count: number }[],
    total: number
) {
    if (!total) return 0
    const entry = breakdown.find((b) => b.rating === rating)
    return entry ? (entry.count / total) * 100 : 0
}

export function RatingSummary({ company }: { company: Company }) {
    const breakdown = company.rating_breakdown ?? []
    const total = company.rating_count

    return (
        <aside className="lg:sticky lg:top-24 h-fit space-y-6">
            {/* ⭐ Rating Summary */}
            <Card>
                <CardContent className="space-y-6">
                    {/* Score */}
                    <div className="space-y-1">
                        <p className="text-4xl font-bold">
                            {company.rating_average.toFixed(1)}
                        </p>
                        <p className="text-sm font-medium">
                            {company.rating_average >= 4.5
                                ? "Excellent"
                                : company.rating_average >= 4
                                ? "Great"
                                : company.rating_average >= 3
                                ? "Good"
                                : "Average"}
                        </p>
                    </div>

                    {/* Stars */}
                    <TrustpilotRating
                        rating={company.rating_average}
                        reviewCount={company.rating_count}
                        starsize={22}
                    />

                    <p className="text-sm text-muted-foreground">
                        Based on {company.rating_count} reviews
                    </p>

                    {/* ⭐ Distribution */}
                    {breakdown.length > 0 && (
                        <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map((rating) => {
                                const percent = getRatingPercentage(
                                    rating,
                                    breakdown,
                                    total
                                )

                                return (
                                    <div
                                        key={rating}
                                        className="flex items-center gap-3"
                                    >
                                        <span className="text-sm w-10">
                                            {rating}-star
                                        </span>

                                        <div className="flex-1 h-2 rounded bg-muted overflow-hidden">
                                            <div
                                                className="h-full bg-green-600 transition-all"
                                                style={{
                                                    width: `${percent}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

        </aside>
    )
}
