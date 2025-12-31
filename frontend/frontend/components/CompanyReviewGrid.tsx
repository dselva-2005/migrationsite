import { CompanyReviewCard } from "./CompanyReviewCard"

interface Company {
    id: string
    name: string
    domain: string
    slug: string
    imageUrl: string
    rating: number
    reviewCount: number
}

interface CompanyReviewGridProps {
    companies: Company[]
}

export function CompanyReviewGrid({
    companies,
}: CompanyReviewGridProps) {
    return (<>
        <div className="text-3xl pb-8 text-center font-bold tracking-tight sm:text-3xl md:text-3xl">Companies</div>
        <div className="grid p-4 max-w-7xl mx-auto gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {companies.map((company) => (
                <CompanyReviewCard
                    key={company.id}
                    {...company}
                />
            ))}
        </div>
    </>
    )
}
