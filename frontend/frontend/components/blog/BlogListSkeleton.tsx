"use client"

import { Skeleton } from "@/components/ui/skeleton"

interface Props {
    count?: number
}

export function BlogListSkeleton({ count = 5 }: Props) {
    return (
        <div className="space-y-6">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="rounded-lg border p-4 space-y-3"
                >
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            ))}
        </div>
    )
}
