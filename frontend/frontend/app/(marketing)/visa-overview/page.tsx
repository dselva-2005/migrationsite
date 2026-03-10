// app/(marketing)/visa/page.tsx
import { getPageMeta, defaultMeta } from '@/services/meta'
import { Metadata } from 'next'
import { PageContentProvider } from "@/providers/PageContentProvider"
import PageHeader from "@/components/visa/VisaOverviewHeader"
import WhatWeOfferSection from "@/components/visa/WhatWeOfferContent"
import { VisaServicesSection } from "@/components/VisaServicesSection"
import StatisticsSection from "@/components/visa/StatisticsSectionContent"
import WhyChooseUsSection from "@/components/WhyChooseUsSection"
import { Section } from "@/components/Section"

export async function generateMetadata(): Promise<Metadata> {
    const meta = await getPageMeta('visa')
    
    // Use meta if available, otherwise fall back to defaultMeta
    const title = meta?.title || defaultMeta.visa?.title || 'Visa Services | Migration Reviews'
    const description = meta?.description || defaultMeta.visa?.description || 'Explore visa options, requirements, and find trusted migration consultants for your visa needs. Work visas, student visas, and more.'
    const ogTitle = meta?.ogTitle || meta?.title || defaultMeta.visa?.ogTitle || defaultMeta.visa?.title
    const ogDescription = meta?.ogDescription || meta?.description || defaultMeta.visa?.ogDescription || defaultMeta.visa?.description
    const ogImage = meta?.ogImage || defaultMeta.visa?.ogImage
    const ogType = (meta?.ogType || defaultMeta.visa?.ogType || 'website') as 'article' | 'website'
    const twitterTitle = meta?.twitterTitle || meta?.ogTitle || meta?.title || defaultMeta.visa?.twitterTitle || defaultMeta.visa?.ogTitle || defaultMeta.visa?.title
    const twitterDescription = meta?.twitterDescription || meta?.ogDescription || meta?.description || defaultMeta.visa?.twitterDescription || defaultMeta.visa?.ogDescription || defaultMeta.visa?.description
    const twitterImage = meta?.twitterImage || meta?.ogImage || defaultMeta.visa?.twitterImage || defaultMeta.visa?.ogImage
    
    return {
        title,
        description,
        keywords: meta?.keywords || defaultMeta.visa?.keywords,
        openGraph: {
            title: ogTitle,
            description: ogDescription,
            images: ogImage ? [{ url: ogImage }] : [],
            type: ogType,
        },
        twitter: {
            card: 'summary_large_image',
            title: twitterTitle,
            description: twitterDescription,
            images: twitterImage ? [twitterImage] : [],
        },
        alternates: {
            canonical: meta?.canonical || defaultMeta.visa?.canonical,
        },
        robots: (meta?.robots || defaultMeta.visa?.robots) as Metadata['robots'],
    }
}

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