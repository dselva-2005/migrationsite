"use client"

import { Skeleton } from "@/components/ui/skeleton"

interface Props {
    count?: number
}

export function CompanyReviewGridSkeleton({ count = 8 }: Props) {
    return (
        <>
            <div className="text-3xl pb-8 text-center font-bold tracking-tight">
                Companies
            </div>

            <div className="grid p-4 max-w-7xl mx-auto gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: count }).map((_, i) => (
                    <div
                        key={i}
                        className="rounded-lg border bg-card p-4 space-y-3"
                    >
                        <Skeleton className="aspect-square w-full rounded-md" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-3 w-2/3" />
                    </div>
                ))}
            </div>
        </>
    )
}
