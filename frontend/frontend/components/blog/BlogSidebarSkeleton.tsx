"use client"

import { Skeleton } from "@/components/ui/skeleton"

interface Props {
    count?: number
}

export function BlogSidebarSkeleton({ count = 6 }: Props) {
    return (
        <div className="rounded-lg border p-4 space-y-4">
            <Skeleton className="h-6 w-32" />

            <div className="space-y-2">
                {Array.from({ length: count }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                ))}
            </div>
        </div>
    )
}
