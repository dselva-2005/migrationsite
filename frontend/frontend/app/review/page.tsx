"use client"

import { useEffect, useState } from "react"

import { CompanyReviewGrid } from "@/components/CompanyReviewGrid"
import { CompanyReviewGridSkeleton } from "@/components/company/CompanyReviewGridSkeleton"
import { Section } from "@/components/Section"
import { ReviewHero } from "@/components/review/ReviewHero"
import { ReviewPagination } from "@/components/company/ReviewPagination"
import { PageContentProvider } from "@/providers/PageContentProvider"
import { getCompanies } from "@/services/company"
import { Company } from "@/types/company"

function ReviewPageContent() {
    const [companies, setCompanies] = useState<Company[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true)

    const pageSize = 8

    useEffect(() => {
        let cancelled = false

        getCompanies(page, pageSize)
            .then((data) => {
                if (cancelled) return
                setCompanies(data.results)
                setTotal(data.count)
            })
            .catch((err) => {
                if (!cancelled) console.error(err)
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })

        return () => {
            cancelled = true
        }
    }, [page])

    return (
        <>
            <ReviewHero />

            <Section>
                {/* 👇 Skeleton only replaces grid content */}
                {loading ? (
                    <CompanyReviewGridSkeleton count={pageSize} />
                ) : (
                    <CompanyReviewGrid
                        companies={companies.map((c) => ({
                            id: String(c.id),
                            name: c.name,
                            slug: c.slug,
                            domain: c.slug,
                            imageUrl: c.logo ?? "/placeholder.png",
                            rating: Number(c.rating_average),
                            reviewCount: c.rating_count,
                        }))}
                    />
                )}

                <ReviewPagination
                    page={page}
                    pageSize={pageSize}
                    total={total}
                    onPageChange={(p) => {
                        if (p === page) return
                        setLoading(true)   // ✅ user-driven
                        setPage(p)
                    }}
                />
            </Section>
        </>
    )
}

export default function Review() {
    return (
        <PageContentProvider page="review">
            <ReviewPageContent />
        </PageContentProvider>
    )
}
