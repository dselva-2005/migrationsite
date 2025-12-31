import { Progress } from "@/components/ui/progress"

export function RatingBreakdown({
    distribution,
    total,
}: {
    distribution: Record<number, number>
    total: number
}) {
    return (
        <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
                const count = distribution[star] || 0
                const percent = total ? (count / total) * 100 : 0

                return (
                    <div key={star} className="flex items-center gap-3">
                        <span className="w-6 text-sm font-medium">
                            {star}
                        </span>

                        <Progress value={percent} className="h-2" />

                        <span className="w-10 text-right text-sm text-muted-foreground">
                            {count}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}
