import { Star } from "lucide-react"

type StarRatingProps = {
    value: number // 1–5
}

export function StarRating({ value }: StarRatingProps) {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    className={`h-4 w-4 ${i < value
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                />
            ))}
        </div>
    )
}
