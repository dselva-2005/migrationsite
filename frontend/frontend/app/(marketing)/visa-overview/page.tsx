// app/(marketing)/visa-overview/page.tsx
import { getPageMeta, defaultMeta } from '@/services/meta'
import { Metadata } from 'next'
import { PageContentProvider } from "@/providers/PageContentProvider"
import PageHeader from "@/components/visa/VisaOverviewHeader"
import WhatWeOfferSection from "@/components/visa/WhatWeOfferContent"
import { VisaServicesSection } from "@/components/VisaServicesSection"
import StatisticsSection from "@/components/visa/StatisticsSectionContent"
import WhyChooseUsSection from "@/components/WhyChooseUsSection"
import { Section } from "@/components/Section"
import Script from 'next/script'
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
    const meta = await getPageMeta('visa')
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
            canonical: meta?.canonical || 'https://migrationreviews.com/visa-overview/',
        },
        robots: (meta?.robots || defaultMeta.visa?.robots) as Metadata['robots'],
    }
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://migrationreviews.com/" },
    { "@type": "ListItem", "position": 2, "name": "Visa Services", "item": "https://migrationreviews.com/visa-overview/" }
  ]
}

export default function VisaPage() {
    return (
        <PageContentProvider page="visa-overview">
            <Script
                id="schema-breadcrumb-visa"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <h1 className="sr-only">Visa Services — Migration Reviews</h1>
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
