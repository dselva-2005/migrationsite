import { Suspense } from "react"
import SearchResultsPage from "./SearchResultsClient"

export default function SearchPage() {
    return (
        <Suspense fallback={<SearchPageFallback />}>
            <SearchResultsPage />
        </Suspense>
    )
}

/* -------- Instant skeleton while CSR bails out -------- */
function SearchPageFallback() {
    return (
        <div className="mx-auto max-w-7xl px-4 py-20 space-y-12">
            <div className="h-8 w-48 bg-gray-200 animate-pulse rounded" />

            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-24 w-full bg-gray-200 animate-pulse rounded"
                    />
                ))}
            </div>

            <div className="space-y-6">
                {Array.from({ length: 2 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-60 w-full bg-gray-200 animate-pulse rounded"
                    />
                ))}
            </div>
        </div>
    )
}
