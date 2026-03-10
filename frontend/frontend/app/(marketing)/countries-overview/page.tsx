// app/(marketing)/countries/page.tsx
import { getPageMeta, defaultMeta } from '@/services/meta'
import { Metadata } from 'next'
import { PageContentProvider } from "@/providers/PageContentProvider"
import VisaCountriesSection from "./VisaCountriesSection"
import TravelVisaSection from "./TravelVisaSection"
import CountriesSection from "@/components/CountriesSection"
import CountriesPageTitle from "./CountriesPageTitle"
import { Section } from "@/components/Section"

export async function generateMetadata(): Promise<Metadata> {
    const meta = await getPageMeta('countries')
    
    return {
        title: meta?.title || defaultMeta.countries?.title || 'Migration Destinations | Migration Reviews',
        description: meta?.description || defaultMeta.countries?.description || 'Compare migration programs, requirements, and find consultants by destination country. Canada, Australia, UK, USA, and more.',
        keywords: meta?.keywords,
        openGraph: {
            title: meta?.ogTitle || meta?.title || defaultMeta.countries?.title,
            description: meta?.ogDescription || meta?.description || defaultMeta.countries?.description,
            images: meta?.ogImage ? [{ url: meta.ogImage }] : [],
            type: (meta?.ogType === 'article' ? 'article' : 'website') as 'article' | 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: meta?.twitterTitle || meta?.ogTitle || meta?.title || defaultMeta.countries?.title,
            description: meta?.twitterDescription || meta?.ogDescription || meta?.description || defaultMeta.countries?.description,
            images: meta?.twitterImage || meta?.ogImage,
        },
        alternates: {
            canonical: meta?.canonical,
        },
        robots: meta?.robots as Metadata['robots'],
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