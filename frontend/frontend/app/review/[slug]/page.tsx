"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"

import { getCompanyBySlug } from "@/services/company"
import {
    getCompanyReviews,
    getMyCompanyReview,
} from "@/services/review"

import { Company } from "@/types/company"
import { Review } from "@/types/review"

import { CompanyHeader } from "@/components/company/CompanyHeader"
import { RatingSummary } from "@/components/company/RatingSummary"
import { ReviewSection } from "@/components/company/ReviewSection"
import { Section } from "@/components/Section"

import { useAuth } from "@/providers/AuthProvider"
import CompanyDetails from "@/components/company/CompanyDetails"
import { Skeleton } from "@/components/ui/skeleton"

function CompanyHeaderSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-lg" />
                <div className="space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>
            <Skeleton className="h-10 w-32" />
        </div>
    )
}

function RatingSummarySkeleton() {
    return (
        <div className="space-y-4 rounded-lg border p-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-2/3" />
        </div>
    )
}

function ReviewSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
        </div>
    )
}

function ReviewSectionSkeleton() {
    return (
        <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
                <ReviewSkeleton key={i} />
            ))}
        </div>
    )
}

function CompanyDetailsSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
        </div>
    )
}


type Params = {
    slug: string
}

export default function CompanyReviewPage() {
    const { slug } = useParams<Params>()
    const { isLoggedIn, loading: authLoading } = useAuth()

    const mountedRef = useRef(true)

    // 🔹 Separate refs for mobile & desktop
    const mobileDetailsRef = useRef<HTMLDivElement | null>(null)
    const desktopDetailsRef = useRef<HTMLDivElement | null>(null)

    const [company, setCompany] = useState<Company | null>(null)
    const [reviews, setReviews] = useState<Review[]>([])
    const [myReview, setMyReview] = useState<Review | null>(null)

    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(true)

    /* ---------------- Scroll handler ---------------- */

    const scrollToCompanyDetails = () => {
        const isMobile =
            typeof window !== "undefined" &&
            window.matchMedia("(max-width: 1023px)").matches

        const target = isMobile
            ? mobileDetailsRef.current
            : desktopDetailsRef.current

        target?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        })
    }

    /* ---------------- Initial load ---------------- */

    useEffect(() => {
        mountedRef.current = true

        const load = async () => {
            setLoading(true)
            try {
                const companyData = await getCompanyBySlug(slug)
                const reviewData = await getCompanyReviews(slug, 1)

                if (!mountedRef.current) return

                setCompany(companyData)
                setReviews(reviewData.results)
                setHasMore(reviewData.results.length < reviewData.count)
            } catch (err) {
                console.error("Failed to load company page", err)
            } finally {
                if (mountedRef.current) setLoading(false)
            }
        }

        load()
        return () => {
            mountedRef.current = false
        }
    }, [slug])

    /* ---------------- Auth-only data ---------------- */

    useEffect(() => {
        if (!isLoggedIn || authLoading) {
            setMyReview(null)
            return
        }

        getMyCompanyReview(slug)
            .then(setMyReview)
            .catch(() => setMyReview(null))
    }, [slug, isLoggedIn, authLoading])

    /* ---------------- Pagination ---------------- */

    const loadMoreReviews = async () => {
        if (!hasMore) return

        const nextPage = page + 1
        const data = await getCompanyReviews(slug, nextPage)

        setReviews(prev => [...prev, ...data.results])
        setPage(nextPage)
        setHasMore(reviews.length + data.results.length < data.count)
    }

    /* ---------------- Render ---------------- */

    if (loading) {
        return (
            <Section>
                {/* ================= MOBILE SKELETON ================= */}
                <div className="lg:hidden max-w-7xl mx-auto px-4 py-8 space-y-6">
                    <CompanyHeaderSkeleton />
                    <RatingSummarySkeleton />
                    <ReviewSectionSkeleton />
                    <CompanyDetailsSkeleton />
                </div>

                {/* ================= DESKTOP SKELETON ================= */}
                <div className="hidden lg:grid max-w-7xl mx-auto px-4 py-8 grid-cols-3 gap-8">
                    {/* LEFT */}
                    <div className="col-span-2 space-y-6">
                        <CompanyHeaderSkeleton />
                        <ReviewSectionSkeleton />
                        <CompanyDetailsSkeleton />
                    </div>

                    {/* RIGHT */}
                    <div className="col-span-1">
                        <div className="sticky top-[120px]">
                            <RatingSummarySkeleton />
                        </div>
                    </div>
                </div>
            </Section>
        )
    }

    if (!company) return <div>Company not found</div>

    return (
        <Section>
            {/* ================= MOBILE LAYOUT ================= */}
            <div className="lg:hidden max-w-7xl mx-auto px-4 py-8 space-y-6">
                <CompanyHeader
                    company={company}
                    myReview={myReview}
                    onAboutClick={scrollToCompanyDetails}
                />

                {/* Summary BEFORE reviews on mobile */}
                <RatingSummary company={company} />

                <ReviewSection
                    reviews={reviews}
                    loadMore={loadMoreReviews}
                />

                {/* Scroll target (mobile) */}
                <div
                    ref={mobileDetailsRef}
                    className="scroll-mt-[120px]"
                >
                    <CompanyDetails company={company} />
                </div>
            </div>

            {/* ================= DESKTOP LAYOUT ================= */}
            <div className="hidden lg:grid max-w-7xl mx-auto px-4 py-8 grid-cols-3 gap-8">
                {/* LEFT COLUMN */}
                <div className="col-span-2 space-y-6">
                    <CompanyHeader
                        company={company}
                        myReview={myReview}
                        onAboutClick={scrollToCompanyDetails}
                    />

                    <ReviewSection
                        reviews={reviews}
                        loadMore={loadMoreReviews}
                    />

                    {/* Scroll target (desktop) */}
                    <div
                        ref={desktopDetailsRef}
                        className="scroll-mt-[120px]"
                    >
                        <CompanyDetails company={company} />
                    </div>
                </div>

                {/* RIGHT COLUMN (sticky summary) */}
                <div className="col-span-1">
                    <div className="sticky top-[120px]">
                        <RatingSummary company={company} />
                    </div>
                </div>
            </div>
        </Section>
    )
}
