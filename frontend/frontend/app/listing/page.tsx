"use client"

import { useEffect, useState, useMemo } from "react"
import { Company } from "@/types/company"
import { Section } from "@/components/Section"
import { PageContentProvider } from "@/providers/PageContentProvider"
import Image from "next/image"
import { getCompanies } from "@/services/company"

interface CompanyListItemProps {
    name: string
    slug: string
    city?: string
    rating: number
    reviewCount: number
    tagline?: string
    logo?: string | null
}

function CompanyListItem({
    name,
    slug,
    city,
    rating,
    reviewCount,
    tagline,
    logo,
}: CompanyListItemProps) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b py-4 hover:bg-gray-50 transition">
            <div className="flex items-center gap-4">
                {logo ? (
                    <div className="w-16 h-16 relative flex-shrink-0">
                        <Image
                            src={logo}
                            alt={name}
                            fill
                            className="object-cover rounded-md"
                            unoptimized
                        />
                    </div>
                ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0" />
                )}

                <div className="flex flex-col">
                    <a
                        href={`/review/${slug}`}
                        className="text-lg font-semibold hover:underline"
                    >
                        {name}
                    </a>
                    {tagline && <p className="text-sm text-gray-500 mt-1">{tagline}</p>}
                    {city && <p className="text-sm text-gray-400 mt-0.5">City: {city}</p>}
                </div>
            </div>

            <div className="mt-2 sm:mt-0 text-sm text-gray-600">
                {rating.toFixed(1)} ⭐ ({reviewCount} reviews)
            </div>
        </div>
    )
}

export default function Review() {
    const [companies, setCompanies] = useState<Company[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)

    // Filters state
    const [cityFilter, setCityFilter] = useState<string>("All")
    const [minRating, setMinRating] = useState<number>(0)

    const pageSize = 8

    // Load companies (with "load more")
    const loadCompanies = async (pageToLoad: number) => {
        setLoading(true)
        try {
            const data = await getCompanies(pageToLoad, pageSize)
            if (pageToLoad === 1) {
                setCompanies(data.results)
            } else {
                setCompanies((prev) => [...prev, ...data.results])
            }
            setHasMore(data.results.length === pageSize)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadCompanies(1)
    }, [])

    // Filter companies
    const filteredCompanies = useMemo(() => {
        return companies.filter((c) => {
            const cityMatch =
                cityFilter === "All" || (c.city?.toLowerCase() === cityFilter.toLowerCase())
            const ratingMatch = Number(c.rating_average) >= minRating
            return cityMatch && ratingMatch
        })
    }, [companies, cityFilter, minRating])

    const cities = Array.from(
        new Set(companies.map((c) => c.city ?? "").filter(Boolean))
    )

    const handleLoadMore = () => {
        if (!hasMore) return
        const nextPage = page + 1
        setPage(nextPage)
        loadCompanies(nextPage)
    }

    if (loading && companies.length === 0)
        return (
            <div className="py-20 text-center text-muted-foreground">
                Loading companies…
            </div>
        )

    return (
        <PageContentProvider page="review">
            <Section>
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
                    {/* Sidebar filters */}
                    <aside className="lg:w-64 flex-shrink-0 order-first lg:order-last">
                        <div className="sticky top-24 space-y-6">
                            {/* City Filter */}
                            <div className="border border-gray-200 rounded-md p-4 space-y-2">
                                <h4 className="font-semibold text-lg">City</h4>
                                <div className="flex flex-col gap-1 mt-2">
                                    <button
                                        onClick={() => setCityFilter("All")}
                                        className={`text-left px-2 py-1 border-b border-transparent transition ${cityFilter === "All"
                                                ? "border-b-2 border-gray-900 font-semibold"
                                                : "hover:border-gray-400"
                                            }`}
                                    >
                                        All
                                    </button>
                                    {cities.map((city) => (
                                        <button
                                            key={city}
                                            onClick={() => setCityFilter(city ?? "All")}
                                            className={`text-left px-2 py-1 border-b border-transparent transition ${cityFilter === city
                                                    ? "border-b-2 border-gray-900 font-semibold"
                                                    : "hover:border-gray-400"
                                                }`}
                                        >
                                            {city}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Rating Filter */}
                            <div className="border border-gray-200 rounded-md p-4 space-y-2">
                                <h4 className="font-semibold text-lg">Rating</h4>
                                <div className="flex flex-col gap-1 mt-2">
                                    {[1, 2, 3, 4, 5].map((r) => (
                                        <button
                                            key={r}
                                            onClick={() => setMinRating(r)}
                                            className={`text-left px-2 py-1 border-b border-transparent transition ${minRating === r
                                                    ? "border-b-2 border-gray-900 font-semibold"
                                                    : "hover:border-gray-400"
                                                }`}
                                        >
                                            {r}+
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* List view */}
                    <main className="flex-1 space-y-4 order-last lg:order-first">
                        {filteredCompanies.length === 0 ? (
                            <div className="py-20 text-center text-muted-foreground">
                                No companies match the filters.
                            </div>
                        ) : (
                            filteredCompanies.map((company) => (
                                <CompanyListItem
                                    key={company.id}
                                    name={company.name}
                                    slug={company.slug}
                                    city={company.city ?? ""}
                                    rating={Number(company.rating_average)}
                                    reviewCount={company.rating_count}
                                    tagline={company.tagline ?? ""}
                                    logo={company.logo ?? null}
                                />
                            ))
                        )}

                        {hasMore && (
                            <div className="text-center mt-6">
                                <button
                                    onClick={handleLoadMore}
                                    className="px-6 py-2 rounded border border-gray-900 text-gray-900 hover:bg-gray-100 transition"
                                >
                                    Load More
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </Section>

        </PageContentProvider>
    )
}
