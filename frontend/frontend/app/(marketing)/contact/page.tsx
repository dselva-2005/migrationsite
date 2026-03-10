// app/(marketing)/contact/page.tsx
import { getPageMeta, defaultMeta } from '@/services/meta'
import { Metadata } from 'next'
import { Section } from "@/components/Section"
import ContactQuickContactSection from "@/components/ContactQuickContactSection"
import { PageContentProvider } from "@/providers/PageContentProvider"
import ContactOfficesSection from "@/components/ContactOfficesSection"
import PageHero from "@/components/contactpageHero"

export async function generateMetadata(): Promise<Metadata> {
    const meta = await getPageMeta('contact')
    
    // Use meta if available, otherwise fall back to defaultMeta
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
            canonical: meta?.canonical || defaultMeta.contact?.canonical,
        },
        robots: (meta?.robots || defaultMeta.contact?.robots) as Metadata['robots'],
    }
}

export default function ContactPage() {
    return (
        <PageContentProvider page="contact">
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