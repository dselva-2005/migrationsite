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
    
    return {
        title: meta?.title || defaultMeta.visa?.title || 'Visa Services | Migration Reviews',
        description: meta?.description || defaultMeta.visa?.description || 'Explore visa options, requirements, and find trusted migration consultants for your visa needs. Work visas, student visas, and more.',
        keywords: meta?.keywords,
        openGraph: {
            title: meta?.ogTitle || meta?.title || defaultMeta.visa?.title,
            description: meta?.ogDescription || meta?.description || defaultMeta.visa?.description,
            images: meta?.ogImage ? [{ url: meta.ogImage }] : [],
            type: (meta?.ogType === 'article' ? 'article' : 'website') as 'article' | 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: meta?.twitterTitle || meta?.ogTitle || meta?.title || defaultMeta.visa?.title,
            description: meta?.twitterDescription || meta?.ogDescription || meta?.description || defaultMeta.visa?.description,
            images: meta?.twitterImage || meta?.ogImage,
        },
        alternates: {
            canonical: meta?.canonical,
        },
        robots: meta?.robots as Metadata['robots'],
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