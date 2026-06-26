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
import Link from "next/link"

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
            <h1 className="sr-only">Verified Immigration Consultant Reviews — Find Trusted Migration Agents</h1>
            <ReviewHero />
            
            {/* SEO Content Block — Reviews Context */}
            <Section tone="neutral">
                <div className="max-w-4xl mx-auto border-t border-border/60 pt-10 pb-6 text-left">
                    <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                        Browse Verified Immigration Consultant Reviews
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        Below is our comprehensive directory of immigration consultants, migration agents, and visa lawyers worldwide. Each consultant profile includes verified reviews from past clients, success metrics, specialization details, and transparent pricing information. Use these reviews to compare consultants, evaluate track records, and make informed hiring decisions for your visa application.
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        All reviews on Migration Reviews come from verified past clients with real visa outcomes. We verify every reviewer's identity and application result before publishing their review. This means you're reading honest feedback from people who have actually worked with each consultant, not marketing claims or unverified testimonials. You can filter by visa type, country destination, consultant specialization, and rating to find the right match for your situation.
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        Whether you're planning an Australia skilled migration visa, Canadian Express Entry application, UK skilled worker visa, USA immigration, or migration to any other country, you'll find verified consultant reviews here. Read multiple reviews per consultant to identify patterns in communication quality, approval rates, timeline accuracy, and value for money. Use these insights to shortlist 2-3 consultants, then request consultations to make your final hiring decision with confidence.
                    </p>
                </div>
            </Section>

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
                            country: c.country,
                            city: c.city,
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
                        setLoading(true)
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