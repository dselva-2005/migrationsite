// app/(marketing)/about/page.tsx
import { getPageMeta, defaultMeta } from '@/services/meta'
import { Metadata } from 'next'
import AboutSection from "@/components/AboutSection";
import { PageContentProvider } from "@/providers/PageContentProvider";
import { Section } from "@/components/Section";
import WhyChooseSection from "@/components/WhyChooseSection";

export async function generateMetadata(): Promise<Metadata> {
    const meta = await getPageMeta('about')
    
    return {
        title: meta?.title || defaultMeta.about?.title || 'About Us | Migration Reviews',
        description: meta?.description || defaultMeta.about?.description || 'Learn about Migration Reviews - your trusted platform for finding and reviewing migration services worldwide.',
        keywords: meta?.keywords,
        openGraph: {
            title: meta?.ogTitle || meta?.title || defaultMeta.about?.title,
            description: meta?.ogDescription || meta?.description || defaultMeta.about?.description,
            images: meta?.ogImage ? [{ url: meta.ogImage }] : [],
            type: (meta?.ogType === 'article' ? 'article' : 'website') as 'article' | 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: meta?.twitterTitle || meta?.ogTitle || meta?.title || defaultMeta.about?.title,
            description: meta?.twitterDescription || meta?.ogDescription || meta?.description || defaultMeta.about?.description,
            images: meta?.twitterImage || meta?.ogImage,
        },
        alternates: {
            canonical: meta?.canonical,
        },
        robots: meta?.robots as Metadata['robots'],
    }
}

export default function About() {
    return (
        <PageContentProvider page="about">
            <Section>
                <AboutSection />
            </Section>
            <Section>
                <WhyChooseSection />
            </Section>
        </PageContentProvider>
    )
}