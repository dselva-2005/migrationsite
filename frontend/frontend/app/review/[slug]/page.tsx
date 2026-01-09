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

type Params = {
    slug: string
}

export default function CompanyReviewPage() {
    const { slug } = useParams<Params>()
    const { isLoggedIn, loading: authLoading } = useAuth()

    const mountedRef = useRef(true)

    const [company, setCompany] = useState<Company | null>(null)
    const [reviews, setReviews] = useState<Review[]>([])
    const [myReview, setMyReview] = useState<Review | null>(null)

    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(true)

    /* ---------------- Initial load (PUBLIC) ---------------- */

    useEffect(() => {
        mountedRef.current = true

        const loadPublicData = async () => {
            setLoading(true)

            try {
                const companyData = await getCompanyBySlug(slug)
                const reviewData = await getCompanyReviews(slug, 1)

                if (!mountedRef.current) return

                setCompany(companyData)
                setReviews(reviewData.results)
                setPage(1)
                setHasMore(
                    reviewData.results.length < reviewData.count
                )
            } catch (err) {
                console.error("Failed to load company page", err)
            } finally {
                if (mountedRef.current) {
                    setLoading(false)
                }
            }
        }

        loadPublicData()

        return () => {
            mountedRef.current = false
        }
    }, [slug])

    /* ---------------- Auth-only data ---------------- */

    useEffect(() => {
        if (authLoading || !isLoggedIn) {
            setMyReview(null)
            return
        }

        const loadMyReview = async () => {
            try {
                const data = await getMyCompanyReview(slug)
                if (mountedRef.current) {
                    setMyReview(data)
                }
            } catch {
                if (mountedRef.current) {
                    setMyReview(null)
                }
            }
        }

        loadMyReview()
    }, [slug, isLoggedIn, authLoading])

    /* ---------------- Pagination ---------------- */

    const loadMoreReviews = async () => {
        if (!hasMore) return

        const nextPage = page + 1
        const data = await getCompanyReviews(slug, nextPage)

        setReviews((prev) => [...prev, ...data.results])
        setPage(nextPage)
        setHasMore(
            reviews.length + data.results.length < data.count
        )
    }

    /* ---------------- Render ---------------- */

    if (loading) return <div>Loading...</div>
    if (!company) return <div>Company not found</div>

    return (
        <Section>
            <div className="mx-auto max-w-7xl px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <CompanyHeader
                        company={company}
                        myReview={myReview}
                    />

                    <ReviewSection
                        reviews={reviews}
                        loadMore={loadMoreReviews}
                    />
                </div>

                <div className="lg:col-span-1">
                    <RatingSummary company={company} />
                </div>
            </div>
        </Section>
    )
}
