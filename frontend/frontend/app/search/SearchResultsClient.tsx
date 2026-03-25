"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { MapPin } from "lucide-react"

import { Section } from "@/components/Section"
import { PageContentProvider } from "@/providers/PageContentProvider"
import { TrustpilotRating } from "@/components/TrustpilotRating"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

import {
    fullSearch,
    type Blog,
    type Company,
    type FullSearchResponse,
} from "@/services/search"

/* ───────────────────────── PAGE ───────────────────────── */

export default function SearchResultsPage() {
    const searchParams = useSearchParams()
    const query = searchParams.get("q")?.trim() ?? ""

    const [initialLoading, setInitialLoading] = useState(true)
    const [loadMoreLoading, setLoadMoreLoading] = useState(false)
    const [data, setData] = useState<FullSearchResponse | null>(null)
    const [page, setPage] = useState(1)

    useEffect(() => {
        let cancelled = false

        async function fetchSearch() {
            try {
                setInitialLoading(true)

                const res = await fullSearch({
                    query,
                    page: 1,
                })

                if (cancelled) return

                setData(res)
                setPage(1)
            } catch (error) {
                console.error("Search failed:", error)
            } finally {
                if (!cancelled) setInitialLoading(false)
            }
        }

        if (query) {
            fetchSearch()
        } else {
            setInitialLoading(false)
            setData(null)
            setPage(1)
        }

        return () => {
            cancelled = true
        }
    }, [query])

    const loadMore = async () => {
        if (loadMoreLoading) return

        try {
            setLoadMoreLoading(true)

            const nextPage = page + 1
            const res = await fullSearch({
                query,
                page: nextPage,
            })

            setData(prev => {
                if (!prev) return res
                return {
                    ...res,
                    companies: [...prev.companies, ...res.companies],
                    blogs: [...prev.blogs, ...res.blogs],
                }
            })
            setPage(nextPage)
        } catch (error) {
            console.error("Load more failed:", error)
        } finally {
            setLoadMoreLoading(false)
        }
    }

    const hasMore = data && (
        data.companies.length < data.meta.total_companies ||
        data.blogs.length < data.meta.total_blogs
    )

    return (
        <PageContentProvider page="search">
            <Section>
                <div className="mx-auto max-w-7xl grid grid-cols-1 gap-10 lg:grid-cols-4">

                    {/* ───────── MAIN CONTENT ───────── */}
                    <main className="lg:col-span-3 space-y-16">

                        {/* ================= COMPANIES ================= */}
                        <section>
                            <h2 className="mb-4 text-xl sm:text-2xl font-bold">
                                Companies{" "}
                                <span className="font-normal text-muted-foreground">
                                    ({initialLoading && !data
                                        ? "loading…"
                                        : data?.meta.total_companies ?? 0})
                                </span>
                            </h2>

                            {initialLoading && !data && <CompanySkeleton />}

                            {!initialLoading && data?.companies.length === 0 && (
                                <p className="text-muted-foreground">
                                    No companies found.
                                </p>
                            )}

                            {data?.companies.map(company => (
                                <CompanyRowCard
                                    key={company.id}
                                    company={company}
                                />
                            ))}

                            {/* Load more skeletons for companies */}
                            {loadMoreLoading && (
                                <div className="mt-4 space-y-4">
                                    {Array.from({ length: 2 }).map((_, i) => (
                                        <CompanyRowSkeleton key={`company-skeleton-${i}`} />
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* ================= BLOGS ================= */}
                        <section>
                            <h2 className="mb-4 text-xl sm:text-2xl font-bold">
                                Blogs{" "}
                                <span className="font-normal text-muted-foreground">
                                    ({initialLoading && !data
                                        ? "loading…"
                                        : data?.meta.total_blogs ?? 0})
                                </span>
                            </h2>

                            {initialLoading && !data && <BlogSkeleton />}

                            {!initialLoading && data?.blogs.length === 0 && (
                                <p className="text-muted-foreground">
                                    No blogs found.
                                </p>
                            )}

                            {data?.blogs.map(blog => (
                                <BlogCard
                                    key={blog.slug}
                                    blog={blog}
                                />
                            ))}

                            {/* Load more skeletons for blogs */}
                            {loadMoreLoading && (
                                <div className="mt-4 space-y-6">
                                    {Array.from({ length: 1 }).map((_, i) => (
                                        <BlogSkeletonItem key={`blog-skeleton-${i}`} />
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* ================= LOAD MORE ================= */}
                        {data && !initialLoading && hasMore && (
                            <div className="pt-10 text-center">
                                <button
                                    onClick={loadMore}
                                    disabled={loadMoreLoading}
                                    className="rounded-lg border px-8 py-3 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loadMoreLoading ? "Loading..." : "Load More"}
                                </button>
                            </div>
                        )}
                    </main>

                    {/* ───────── SIDEBAR (future use) ───────── */}
                    <aside className="hidden lg:block lg:col-span-1" />
                </div>
            </Section>
        </PageContentProvider>
    )
}

/* ───────────────────────── COMPANY ROW CARD ───────────────────────── */

function CompanyRowCard({ company }: { company: Company }) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-between border-b py-6 hover:bg-gray-50">

            {/* LEFT */}
            <div className="flex gap-4 sm:gap-6">
                {company.logo ? (
                    <Image
                        src={company.logo}
                        alt={company.name}
                        width={100}
                        height={100}
                        className="h-25 w-25 rounded-xl object-cover"
                        unoptimized
                    />
                ) : (
                    <div className="h-25 w-25 rounded-xl bg-gray-200" />
                )}

                <div className="space-y-1">
                    <Link
                        href={`/review/${company.slug}`}
                        className="text-base sm:text-lg font-semibold hover:underline"
                    >
                        {company.name}
                    </Link>

                    {company.tagline && (
                        <p className="text-sm text-muted-foreground">
                            {company.tagline}
                        </p>
                    )}

                    {(company.city || company.country) && (
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {[company.city, company.country]
                                .filter(Boolean)
                                .join(", ")}
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT */}
            <div className="sm:text-right">
                <TrustpilotRating
                    rating={company.rating_average}
                    reviewCount={company.rating_count}
                    starsize={14}
                />
                <div className="text-xs sm:text-sm text-muted-foreground">
                    ({company.rating_count} reviews)
                </div>
            </div>
        </div>
    )
}

/* ───────────────────────── BLOG CARD ───────────────────────── */

function BlogCard({ blog }: { blog: Blog }) {
    return (
        <Card className="mb-6 overflow-hidden">
            <div className="relative h-48 sm:h-56">
                <Image
                    src={
                        blog.image
                            ? blog.image
                            : "/images/placeholder.png"
                    }
                    alt={blog.title}
                    fill
                    className="object-cover"
                    unoptimized
                />
            </div>

            <div className="p-4 sm:p-6 space-y-3">
                <Badge className="text-xs">{blog.category}</Badge>

                <h3 className="text-lg sm:text-xl font-semibold">
                    <Link href={`/blog/${blog.slug}`}>
                        {blog.title}
                    </Link>
                </h3>

                <p className="text-sm sm:text-base text-muted-foreground">
                    {blog.excerpt}
                </p>
            </div>
        </Card>
    )
}

/* ───────────────────────── SKELETONS ───────────────────────── */

function CompanySkeleton() {
    return (
        <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
                <div
                    key={i}
                    className="h-24 w-full rounded bg-gray-200 animate-pulse"
                />
            ))}
        </div>
    )
}

function CompanyRowSkeleton() {
    return (
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-between border-b py-6">
            <div className="flex gap-4 sm:gap-6 flex-1">
                <div className="h-25 w-25 rounded-xl bg-gray-200 animate-pulse" />
                <div className="space-y-2 flex-1">
                    <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
            </div>
            <div className="sm:text-right">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
        </div>
    )
}

function BlogSkeleton() {
    return (
        <div className="space-y-6">
            {Array.from({ length: 2 }).map((_, i) => (
                <BlogSkeletonItem key={i} />
            ))}
        </div>
    )
}

function BlogSkeletonItem() {
    return (
        <Card className="mb-6 overflow-hidden">
            <div className="relative h-48 sm:h-56 bg-gray-200 animate-pulse" />
            <div className="p-4 sm:p-6 space-y-3">
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
                </div>
            </div>
        </Card>
    )
}