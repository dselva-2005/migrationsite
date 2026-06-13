// app/(marketing)/countries-overview/page.tsx
import { getPageMeta, defaultMeta } from '@/services/meta'
import { Metadata } from 'next'
import { PageContentProvider } from "@/providers/PageContentProvider"
import VisaCountriesSection from "./VisaCountriesSection"
import TravelVisaSection from "./TravelVisaSection"
import CountriesSection from "@/components/CountriesSection"
import CountriesPageTitle from "./CountriesPageTitle"
import { Section } from "@/components/Section"
import Script from 'next/script'
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
    const meta = await getPageMeta('countries')
    const title = meta?.title || defaultMeta.countries?.title || 'Migration Destinations | Migration Reviews'
    const description = meta?.description || defaultMeta.countries?.description || 'Compare migration programs, requirements, and find consultants by destination country. Canada, Australia, UK, USA, and more.'
    const ogTitle = meta?.ogTitle || meta?.title || defaultMeta.countries?.ogTitle || defaultMeta.countries?.title
    const ogDescription = meta?.ogDescription || meta?.description || defaultMeta.countries?.ogDescription || defaultMeta.countries?.description
    const ogImage = meta?.ogImage || defaultMeta.countries?.ogImage
    const ogType = (meta?.ogType || defaultMeta.countries?.ogType || 'website') as 'article' | 'website'
    const twitterTitle = meta?.twitterTitle || meta?.ogTitle || meta?.title || defaultMeta.countries?.twitterTitle || defaultMeta.countries?.ogTitle || defaultMeta.countries?.title
    const twitterDescription = meta?.twitterDescription || meta?.ogDescription || meta?.description || defaultMeta.countries?.twitterDescription || defaultMeta.countries?.ogDescription || defaultMeta.countries?.description
    const twitterImage = meta?.twitterImage || meta?.ogImage || defaultMeta.countries?.twitterImage || defaultMeta.countries?.ogImage

    return {
        title,
        description,
        keywords: meta?.keywords || defaultMeta.countries?.keywords,
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
            canonical: meta?.canonical || 'https://migrationreviews.com/countries-overview/',
        },
        robots: (meta?.robots || defaultMeta.countries?.robots) as Metadata['robots'],
    }
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://migrationreviews.com/" },
    { "@type": "ListItem", "position": 2, "name": "Migration Destinations", "item": "https://migrationreviews.com/countries-overview/" }
  ]
}

export default function Countries() {
    return (
        <PageContentProvider page="countries-overview">
            <Script
                id="schema-breadcrumb-countries"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <h1 className="sr-only">Migration Destinations — Countries Overview</h1>
            <CountriesPageTitle />
            <Section>
                <TravelVisaSection />
            </Section>
            <Section>
                <CountriesSection />
            </Section>
            <Section>
                <VisaCountriesSection />
            </Section>
        </PageContentProvider>
    )
}
