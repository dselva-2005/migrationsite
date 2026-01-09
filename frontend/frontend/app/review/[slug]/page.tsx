"use client"

import { useEffect, useState } from "react"
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

export default function CompanyReviewPage() {
    const { slug } = useParams<{ slug: string }>()

    const [company, setCompany] = useState<Company | null>(null)
    const [reviews, setReviews] = useState<Review[]>([])
    const [myReview, setMyReview] = useState<Review | null>(null)

    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let alive = true

        ;(async () => {
            setLoading(true)

            try {
                const [
                    companyData,
                    reviewData,
                    myReviewData,
                ] = await Promise.all([
                    getCompanyBySlug(slug),
                    getCompanyReviews(slug, 1),
                    getMyCompanyReview(slug),
                ])

                if (!alive) return

                setCompany(companyData)
                setReviews(reviewData.results)
                setMyReview(myReviewData)

                setPage(1)
                setHasMore(
                    reviewData.results.length < reviewData.count
                )
            } catch (error) {
                console.error("Failed to load company page", error)
            } finally {
                if (alive) setLoading(false)
            }
        })()

        return () => {
            alive = false
        }
    }, [slug])

    const loadMoreReviews = async () => {
        if (!hasMore) return

        const nextPage = page + 1
        const data = await getCompanyReviews(slug, nextPage)

        setReviews(prev => [...prev, ...data.results])
        setPage(nextPage)
        setHasMore(
            reviews.length + data.results.length < data.count
        )
    }

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
