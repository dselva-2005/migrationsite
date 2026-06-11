// app/(marketing)/about/page.tsx
import { getPageMeta, defaultMeta } from '@/services/meta'
import { Metadata } from 'next'
import AboutSection from "@/components/AboutSection";
import { PageContentProvider } from "@/providers/PageContentProvider";
import { Section } from "@/components/Section";
import WhyChooseSection from "@/components/WhyChooseSection";
import Script from 'next/script'
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
    const meta = await getPageMeta('about')
    const title = meta?.title || defaultMeta.about?.title || 'About Us | Migration Reviews'
    const description = meta?.description || defaultMeta.about?.description || 'Learn about Migration Reviews - your trusted platform for finding and reviewing migration services worldwide.'
    const ogTitle = meta?.ogTitle || meta?.title || defaultMeta.about?.ogTitle || defaultMeta.about?.title
    const ogDescription = meta?.ogDescription || meta?.description || defaultMeta.about?.ogDescription || defaultMeta.about?.description
    const ogImage = meta?.ogImage || defaultMeta.about?.ogImage
    const ogType = (meta?.ogType || defaultMeta.about?.ogType || 'website') as 'article' | 'website'
    const twitterTitle = meta?.twitterTitle || meta?.ogTitle || meta?.title || defaultMeta.about?.twitterTitle || defaultMeta.about?.ogTitle || defaultMeta.about?.title
    const twitterDescription = meta?.twitterDescription || meta?.ogDescription || meta?.description || defaultMeta.about?.twitterDescription || defaultMeta.about?.ogDescription || defaultMeta.about?.description
    const twitterImage = meta?.twitterImage || meta?.ogImage || defaultMeta.about?.twitterImage || defaultMeta.about?.ogImage

    return {
        title,
        description,
        keywords: meta?.keywords || defaultMeta.about?.keywords,
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
            canonical: meta?.canonical || 'https://migrationreviews.com/about/',
        },
        robots: (meta?.robots || defaultMeta.about?.robots) as Metadata['robots'],
    }
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://migrationreviews.com/" },
    { "@type": "ListItem", "position": 2, "name": "About Us", "item": "https://migrationreviews.com/about/" }
  ]
}

export default function About() {
    return (
        <PageContentProvider page="about">
            <Script
                id="schema-breadcrumb-about"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <h1 className="sr-only">About Migration Reviews</h1>
            <Section>
                <AboutSection />
            </Section>
            <Section>
                <WhyChooseSection />
            </Section>
        </PageContentProvider>
    )
}
