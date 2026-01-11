import { PageContentProvider } from "@/providers/PageContentProvider"
import PageHeader from "@/components/visa/VisaOverviewHeader"
import WhatWeOfferSection from "@/components/visa/WhatWeOfferContent"
import { VisaServicesSection } from "@/components/VisaServicesSection"
import StatisticsSection from "@/components/visa/StatisticsSectionContent"
import WhyChooseUsSection from "@/components/WhyChooseUsSection"
import { Section } from "@/components/Section"

export default function VisaPage() {
    return (
        <PageContentProvider page="visa-overview">
                <PageHeader />
            <Section>
                <WhatWeOfferSection />
            </Section>
            <Section>
                <VisaServicesSection />
            </Section>
            <Section>
                <StatisticsSection />
            </Section>
            <Section>
                <WhyChooseUsSection />
            </Section>
        </PageContentProvider>
    )
}
