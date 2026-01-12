"use client"

import { Skeleton } from "@/components/ui/skeleton"

interface Props {
    count?: number
}

export function CompanyListItemSkeleton({ count = 6 }: Props) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b py-4"
                >
                    {/* LEFT */}
                    <div className="px-8 flex items-center gap-8">
                        <Skeleton className="h-30 w-30 rounded-2xl flex-shrink-0" />

                        <div className="space-y-2">
                            <Skeleton className="h-5 w-48" />
                            <Skeleton className="h-4 w-64" />
                            <Skeleton className="h-4 w-40" />
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="mt-6 sm:mt-0 px-8 text-right space-y-2">
                        <Skeleton className="h-4 w-24 ml-auto" />
                        <Skeleton className="h-4 w-16 ml-auto" />
                    </div>
                </div>
            ))}
        </>
    )
}
