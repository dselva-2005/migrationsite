"use client"

import { useEffect, useState, useMemo } from "react"
import Image from "next/image"
import { MapPin } from "lucide-react"

import { Company } from "@/types/company"
import { Section } from "@/components/Section"
import { PageContentProvider } from "@/providers/PageContentProvider"
import { getCompanies } from "@/services/company"
import { TrustpilotRating } from "@/components/TrustpilotRating"
import { CompanyListItemSkeleton } from "@/components/company/CompanyListItemSkeleton"

/* ---------------- Item ---------------- */

interface CompanyListItemProps {
    name: string
    slug: string
    city?: string
    country?: string
    rating: number
    reviewCount: number
    tagline?: string
    logo?: string | null
}

function CompanyListItem({
    name,
    slug,
    city,
    country,
    rating,
    reviewCount,
    tagline,
    logo,
}: CompanyListItemProps) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b py-4 hover:bg-gray-50 transition">
            {/* LEFT */}
            <div className="px-8 flex items-center gap-8">
                {logo ? (
                    <div className="relative h-30 w-30 flex-shrink-0">
                        <Image
                            src={logo}
                            alt={name}
                            fill
                            className="rounded-2xl object-cover"
                            unoptimized
                        />
                    </div>
                ) : (
                    <div className="h-30 w-30 rounded-2xl bg-gray-200 flex-shrink-0" />
                )}

                <div className="space-y-2">
                    <a
                        href={`/review/${slug}`}
                        className="text-lg font-semibold hover:underline"
                    >
                        {name}
                    </a>

                    {tagline && (
                        <p className="text-md text-gray-500 leading-relaxed">
                            {tagline}
                        </p>
                    )}

                    {(city || country) && (
                        <div className="flex items-center gap-2 text-md text-gray-400">
                            <MapPin className="h-5 w-5 shrink-0" />
                            <span>
                                {city && country
                                    ? `${city}, ${country}`
                                    : city || country}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT */}
            <div className="mt-6 sm:mt-0 px-8 text-right">
                <TrustpilotRating rating={rating} starsize={17} />
                <div className="mt-2 text-base text-gray-600">
                    ({reviewCount} reviews)
                </div>
            </div>
        </div>
    )
}

/* ---------------- Page ---------------- */

export default function Review() {
    const [companies, setCompanies] = useState<Company[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)

    // filters
    const [cityFilter, setCityFilter] = useState("All")
    const [minRating, setMinRating] = useState(0)

    const pageSize = 8

    const loadCompanies = async (pageToLoad: number) => {
        setLoading(true)
        try {
            const data = await getCompanies(pageToLoad, pageSize)

            setCompanies((prev) =>
                pageToLoad === 1
                    ? data.results
                    : [...prev, ...data.results]
            )

            setHasMore(data.results.length === pageSize)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadCompanies(1)
    }, [])

    const filteredCompanies = useMemo(() => {
        return companies.filter((c) => {
            const cityMatch =
                cityFilter === "All" ||
                c.city?.toLowerCase() === cityFilter.toLowerCase()

            const ratingMatch =
                Number(c.rating_average) >= minRating

            return cityMatch && ratingMatch
        })
    }, [companies, cityFilter, minRating])

    // ✅ FIXED: case-insensitive unique cities
    const cities = useMemo(() => {
        const map = new Map<string, string>()

        companies.forEach((c) => {
            if (!c.city) return
            const trimmed = c.city.trim()
            if (!trimmed) return

            const key = trimmed.toLowerCase()
            if (!map.has(key)) {
                map.set(key, trimmed)
            }
        })

        return Array.from(map.values())
    }, [companies])

    const handleLoadMore = () => {
        if (!hasMore) return
        const next = page + 1
        setPage(next)
        loadCompanies(next)
    }

    return (
        <PageContentProvider page="review">
            <Section>
                <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row">
                    {/* Sidebar */}
                    <aside className="order-first lg:order-last lg:w-64">
                        <div className="sticky top-24 space-y-6">
                            {/* City filter */}
                            <div className="rounded-md border p-4">
                                <h4 className="text-lg font-semibold">
                                    City
                                </h4>
                                <div className="mt-2 space-y-1">
                                    {["All", ...cities].map((city) => (
                                        <button
                                            key={city}
                                            onClick={() =>
                                                setCityFilter(city)
                                            }
                                            className={`block w-full text-left px-2 py-1 ${
                                                cityFilter === city
                                                    ? "font-semibold underline"
                                                    : "hover:underline"
                                            }`}
                                        >
                                            {city}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Rating filter */}
                            <div className="rounded-md border p-4">
                                <h4 className="text-lg font-semibold">
                                    Rating
                                </h4>
                                <div className="mt-2 space-y-1">
                                    {[0, 1, 2, 3, 4, 5].map((r) => (
                                        <button
                                            key={r}
                                            onClick={() =>
                                                setMinRating(r)
                                            }
                                            className={`block w-full text-left px-2 py-1 ${
                                                minRating === r
                                                    ? "font-semibold underline"
                                                    : "hover:underline"
                                            }`}
                                        >
                                            {r}+
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* List */}
                    <main className="order-last flex-1 lg:order-first">
                        {/* Initial load skeleton */}
                        {loading && companies.length === 0 && (
                            <CompanyListItemSkeleton count={pageSize} />
                        )}

                        {!loading &&
                            filteredCompanies.length === 0 && (
                                <div className="py-20 text-center text-muted-foreground">
                                    No companies match the filters.
                                </div>
                            )}

                        {filteredCompanies.map((company) => (
                            <CompanyListItem
                                key={company.id}
                                name={company.name}
                                slug={company.slug}
                                city={company.city ?? ""}
                                country={company.country ?? ""}
                                rating={Number(company.rating_average)}
                                reviewCount={company.rating_count}
                                tagline={company.tagline ?? ""}
                                logo={company.logo ?? null}
                            />
                        ))}

                        {/* Load-more skeleton */}
                        {loading && companies.length > 0 && (
                            <CompanyListItemSkeleton count={3} />
                        )}

                        {hasMore && !loading && (
                            <div className="mt-8 text-center">
                                <button
                                    onClick={handleLoadMore}
                                    className="rounded border border-gray-900 px-6 py-2 hover:bg-gray-100"
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
