// components/blog/CategoryBadge.tsx
import { Badge } from "@/components/ui/badge"

export function CategoryBadge({ label }: { label: string }) {
    return (
        <Badge
            variant="secondary"
            className="bg-red-100 text-red-600 font-medium"
        >
            {label}
        </Badge>
    )
}
