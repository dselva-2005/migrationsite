import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { TrustpilotRating } from "@/components/TrustpilotRating"
import { Company } from "@/types/company"

export function RatingSummary({ company }: { company: Company }) {
    return (
        <aside className="lg:sticky lg:top-24 h-fit">
            <Card>
                <CardHeader className="font-semibold">
                    Rating Summary
                </CardHeader>

                <CardContent className="space-y-5">
                    <TrustpilotRating
                        rating={company.rating_average}
                        reviewCount={company.rating_count}
                        starsize={22}
                    />

                    {/* Breakdown can be added later when backend supports it */}
                    <p className="text-sm text-muted-foreground">
                        Based on {company.rating_count} reviews
                    </p>
                </CardContent>
            </Card>
        </aside>
    )
}
