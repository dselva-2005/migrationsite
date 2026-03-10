// app/page.tsx
import { getPageMeta, defaultMeta } from '@/services/meta'
import { Metadata } from 'next'
import HomeClient from './HomeClient'

export async function generateMetadata(): Promise<Metadata> {
    // Fetch meta for 'home' page from the 'meta' collection
    const meta = await getPageMeta('home')
    
    return {
        title: meta?.title || defaultMeta.home?.title || 'Migration Reviews | Find Trusted Migration Services',
        description: meta?.description || defaultMeta.home?.description || 'Read authentic reviews about migration consultants, lawyers, and services. Make informed decisions for your migration journey.',
        keywords: meta?.keywords,
        openGraph: {
            title: meta?.ogTitle || meta?.title || defaultMeta.home?.title,
            description: meta?.ogDescription || meta?.description || defaultMeta.home?.description,
            images: meta?.ogImage ? [{ url: meta.ogImage }] : [],
            type: (meta?.ogType === 'article' ? 'article' : 'website') as 'article' | 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: meta?.twitterTitle || meta?.ogTitle || meta?.title || defaultMeta.home?.title,
            description: meta?.twitterDescription || meta?.ogDescription || meta?.description || defaultMeta.home?.description,
            images: meta?.twitterImage || meta?.ogImage,
        },
        alternates: {
            canonical: meta?.canonical,
        },
        robots: meta?.robots as Metadata['robots'],
    }
}

export default function HomePage() {
    return <HomeClient />
}