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
    
    return {
        title: meta?.title || defaultMeta.contact?.title || 'Contact Us | Migration Reviews',
        description: meta?.description || defaultMeta.contact?.description || 'Get in touch with our team for support, inquiries, or partnerships. We\'re here to help with your migration journey.',
        keywords: meta?.keywords,
        openGraph: {
            title: meta?.ogTitle || meta?.title || defaultMeta.contact?.title,
            description: meta?.ogDescription || meta?.description || defaultMeta.contact?.description,
            images: meta?.ogImage ? [{ url: meta.ogImage }] : [],
            type: (meta?.ogType === 'article' ? 'article' : 'website') as 'article' | 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: meta?.twitterTitle || meta?.ogTitle || meta?.title || defaultMeta.contact?.title,
            description: meta?.twitterDescription || meta?.ogDescription || meta?.description || defaultMeta.contact?.description,
            images: meta?.twitterImage || meta?.ogImage,
        },
        alternates: {
            canonical: meta?.canonical,
        },
        robots: meta?.robots as Metadata['robots'],
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