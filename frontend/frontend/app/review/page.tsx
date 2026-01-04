"use client"

import { useEffect, useState } from "react"

import { CompanyReviewGrid } from "@/components/CompanyReviewGrid"
import { Section } from "@/components/Section"
import { ReviewHero } from "@/components/review/ReviewHero"
import { ReviewPagination } from "@/components/company/ReviewPagination"
import { PageContentProvider } from "@/providers/PageContentProvider"
import { getCompanies } from "@/services/company"
import { Company } from "@/types/company"

export default function Review() {
    const [companies, setCompanies] = useState<Company[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)

    const pageSize = 8

    useEffect(() => {
        let cancelled = false

        getCompanies(page, pageSize).then((data) => {
            if (cancelled) return
            setCompanies(data.results)
            setTotal(data.count)
        })

        return () => {
            cancelled = true
        }
    }, [page, pageSize])

    return (
        <PageContentProvider page="review">
            <ReviewHero />

            <Section>
                {companies.length === 0 ? (
                    <div className="py-20 text-center text-muted-foreground">
                        Loading companies…
                    </div>
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
                    onPageChange={setPage}
                />
            </Section>
        </PageContentProvider>
    )
}
