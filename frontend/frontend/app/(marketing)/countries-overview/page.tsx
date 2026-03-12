// app/(marketing)/countries/page.tsx
import { getPageMeta, defaultMeta } from '@/services/meta'
import { Metadata } from 'next'
import { PageContentProvider } from "@/providers/PageContentProvider"
import VisaCountriesSection from "./VisaCountriesSection"
import TravelVisaSection from "./TravelVisaSection"
import CountriesSection from "@/components/CountriesSection"
import CountriesPageTitle from "./CountriesPageTitle"
import { Section } from "@/components/Section"
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
    const meta = await getPageMeta('countries')
    
    // Use meta if available, otherwise fall back to defaultMeta
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
            canonical: meta?.canonical || defaultMeta.countries?.canonical,
        },
        robots: (meta?.robots || defaultMeta.countries?.robots) as Metadata['robots'],
    }
}

/* =========================
   COUNTRIES PAGE
========================= */
export default function Countries() {
    return (
        // Wrap with PageContentProvider and pass page key as "countries-overview"
        <PageContentProvider page="countries-overview">
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