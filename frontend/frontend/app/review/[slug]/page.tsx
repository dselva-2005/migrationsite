import { mockCompanyReviewData } from "@/lib/mock/company-review"
import { CompanyHeader } from "@/components/company/CompanyHeader"
import { RatingSummary } from "@/components/company/RatingSummary"
import { ReviewSection } from "@/components/company/ReviewSection"
import { mockCompany } from "@/lib/mock/mock-company"
import { Section } from "@/components/Section"

export default function CompanyReviewPage() {
    const data = mockCompanyReviewData

    return (
        <Section>
            <div className="mx-auto max-w-7xl px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <CompanyHeader company={mockCompany} />
                    <ReviewSection reviews={data.reviews} />
                </div>

                <div className="lg:col-span-1">
                    <RatingSummary company={data.company} />
                </div>
            </div>
        </Section>

    )
}
