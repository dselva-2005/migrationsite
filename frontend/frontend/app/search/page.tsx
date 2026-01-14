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
import publicApi from "@/lib/publicApi"

/* ───────────────────────── TYPES ───────────────────────── */

type Blog = {
    slug: string
    title: string
    excerpt: string
    image: string | null
    category: string
    author: string
    date: string
    views: number
    rating: number
    reviewCount: number
}

type Company = {
    id: number
    slug: string
    name: string
    tagline?: string
    rating_average: number
    rating_count: number
    city?: string
    country?: string
    logo?: string | null
}

type Meta = {
    page: number
    limit: number
    total_blogs: number
    total_companies: number
}

type FullSearchResponse = {
    query: string
    blogs: Blog[]
    companies: Company[]
    meta: Meta
}

/* ───────────────────────── PAGE ───────────────────────── */

export default function SearchResultsPage() {
    const searchParams = useSearchParams()
    const query = searchParams.get("q")?.trim() ?? ""

    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<FullSearchResponse | null>(null)
    const [page, setPage] = useState(1)

    useEffect(() => {
        let cancelled = false

        async function fetchSearch(reset: boolean) {
            try {
                setLoading(true)

                const res = await publicApi.get<FullSearchResponse>(
                    "/api/content/full-search/",
                    { params: { q: query, page } }
                )

                if (cancelled) return

                setData(prev =>
                    reset || !prev
                        ? res.data
                        : {
                              ...res.data,
                              companies: [
                                  ...prev.companies,
                                  ...res.data.companies,
                              ],
                              blogs: [...prev.blogs, ...res.data.blogs],
                          }
                )
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        if (query) fetchSearch(page === 1)
        else {
            setLoading(false)
            setData(null)
        }

        return () => {
            cancelled = true
        }
    }, [query, page])

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
                                    (
                                    {loading && !data
                                        ? "loading…"
                                        : data?.meta.total_companies ?? 0}
                                    )
                                </span>
                            </h2>

                            {loading && page === 1 && <CompanySkeleton />}

                            {!loading &&
                                data?.companies.length === 0 && (
                                    <p className="text-muted-foreground">
                                        No companies found.
                                    </p>
                                )}

                            {!loading &&
                                data?.companies.map(company => (
                                    <CompanyRowCard
                                        key={company.id}
                                        company={company}
                                    />
                                ))}
                        </section>

                        {/* ================= BLOGS ================= */}
                        <section>
                            <h2 className="mb-4 text-xl sm:text-2xl font-bold">
                                Blogs{" "}
                                <span className="font-normal text-muted-foreground">
                                    (
                                    {loading && !data
                                        ? "loading…"
                                        : data?.meta.total_blogs ?? 0}
                                    )
                                </span>
                            </h2>

                            {loading && page === 1 && <BlogSkeleton />}

                            {!loading &&
                                data?.blogs.length === 0 && (
                                    <p className="text-muted-foreground">
                                        No blogs found.
                                    </p>
                                )}

                            {!loading &&
                                data?.blogs.map(blog => (
                                    <BlogCard
                                        key={blog.slug}
                                        blog={blog}
                                    />
                                ))}
                        </section>

                        {/* ================= LOAD MORE ================= */}
                        {data &&
                            !loading &&
                            (data.companies.length <
                                data.meta.total_companies ||
                                data.blogs.length <
                                    data.meta.total_blogs) && (
                                <div className="pt-10 text-center">
                                    <button
                                        onClick={() =>
                                            setPage(p => p + 1)
                                        }
                                        className="rounded-lg border px-8 py-3 text-sm hover:bg-gray-100"
                                    >
                                        Load More
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
                            ? `http://localhost:8000${blog.image}`
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

function BlogSkeleton() {
    return (
        <div className="space-y-6">
            {Array.from({ length: 2 }).map((_, i) => (
                <div
                    key={i}
                    className="h-60 w-full rounded bg-gray-200 animate-pulse"
                />
            ))}
        </div>
    )
}
