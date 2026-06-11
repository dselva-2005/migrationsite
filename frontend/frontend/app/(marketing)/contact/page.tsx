// app/(marketing)/contact/page.tsx
import { getPageMeta, defaultMeta } from '@/services/meta'
import { Metadata } from 'next'
import { Section } from "@/components/Section"
import ContactQuickContactSection from "@/components/ContactQuickContactSection"
import { PageContentProvider } from "@/providers/PageContentProvider"
import ContactOfficesSection from "@/components/ContactOfficesSection"
import PageHero from "@/components/contactpageHero"
import Script from 'next/script'
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
    const meta = await getPageMeta('contact')
    const title = meta?.title || defaultMeta.contact?.title || 'Contact Us | Migration Reviews'
    const description = meta?.description || defaultMeta.contact?.description || 'Get in touch with our team for support, inquiries, or partnerships. We\'re here to help with your migration journey.'
    const ogTitle = meta?.ogTitle || meta?.title || defaultMeta.contact?.ogTitle || defaultMeta.contact?.title
    const ogDescription = meta?.ogDescription || meta?.description || defaultMeta.contact?.ogDescription || defaultMeta.contact?.description
    const ogImage = meta?.ogImage || defaultMeta.contact?.ogImage
    const ogType = (meta?.ogType || defaultMeta.contact?.ogType || 'website') as 'article' | 'website'
    const twitterTitle = meta?.twitterTitle || meta?.ogTitle || meta?.title || defaultMeta.contact?.twitterTitle || defaultMeta.contact?.ogTitle || defaultMeta.contact?.title
    const twitterDescription = meta?.twitterDescription || meta?.ogDescription || meta?.description || defaultMeta.contact?.twitterDescription || defaultMeta.contact?.ogDescription || defaultMeta.contact?.description
    const twitterImage = meta?.twitterImage || meta?.ogImage || defaultMeta.contact?.twitterImage || defaultMeta.contact?.ogImage

    return {
        title,
        description,
        keywords: meta?.keywords || defaultMeta.contact?.keywords,
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
            canonical: meta?.canonical || 'https://migrationreviews.com/contact/',
        },
        robots: (meta?.robots || defaultMeta.contact?.robots) as Metadata['robots'],
    }
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://migrationreviews.com/" },
    { "@type": "ListItem", "position": 2, "name": "Contact", "item": "https://migrationreviews.com/contact/" }
  ]
}

export default function ContactPage() {
    return (
        <PageContentProvider page="contact">
            <Script
                id="schema-breadcrumb-contact"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <h1 className="sr-only">Contact Migration Reviews</h1>
            <>
                <PageHero />
                <Section tone="base">
                    <ContactQuickContactSection />
                </Section>
                <Section tone="base">
                    <ContactOfficesSection />
                </Section>
            </>
        </PageContentProvider>
    )
}
