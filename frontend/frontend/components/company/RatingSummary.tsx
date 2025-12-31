import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { TrustpilotRating } from "@/components/TrustpilotRating"
import { RatingBreakdown } from "./RatingBreakdown"
import { Company } from "@/types/review"

export function RatingSummary({ company }: { company: Company }) {
    return (
        <aside className="lg:sticky lg:top-24 h-fit">
            <Card className="h-75">
                <CardHeader className="font-semibold">
                    Rating Summary
                </CardHeader>

                <CardContent className="space-y-5">
                    <TrustpilotRating
                        rating={company.rating}
                        reviewCount={company.totalReviews}
                        starsize={22}
                    />

                    <RatingBreakdown
                        distribution={company.ratingDistribution}
                        total={company.totalReviews}
                    />
                </CardContent>
            </Card>
        </aside>
    )
}
