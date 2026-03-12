// app/page.tsx
import { getPageMeta, defaultMeta } from '@/services/meta'
import { Metadata } from 'next'
import HomeClient from './HomeClient'
import fs from 'fs';
import path from 'path';

export async function generateMetadata(): Promise<Metadata> {
    // Fetch meta for 'home' page from the 'meta' collection
    const meta = await getPageMeta('home')
    
    // Write debug info to file
    const debugInfo = {
        timestamp: new Date().toISOString(),
        metaExists: !!meta,
        metaData: meta,
        defaultTitle: defaultMeta.home?.title,
        finalTitle: meta?.title || defaultMeta.home?.title,
        environment: process.env.NODE_ENV
    }
    
    try {
        // Ensure directory exists
        const logDir = '/tmp/next-debug';
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
        
        // Write to file
        fs.appendFileSync(
            path.join(logDir, 'meta-debug.log'),
            JSON.stringify(debugInfo, null, 2) + '\n---\n'
        );
    } catch (error) {
        // Silently fail - don't break the app
        console.error('Failed to write debug log:', error);
    }
    
    // Use meta if available, otherwise fall back to defaultMeta
    const title = meta?.title || defaultMeta.home?.title || 'Migration Reviews | Find Trusted Migration Services'
    const description = meta?.description || defaultMeta.home?.description || 'Read authentic reviews about migration consultants, lawyers, and services. Make informed decisions for your migration journey.'
    const ogTitle = meta?.ogTitle || meta?.title || defaultMeta.home?.ogTitle || defaultMeta.home?.title
    const ogDescription = meta?.ogDescription || meta?.description || defaultMeta.home?.ogDescription || defaultMeta.home?.description
    const ogImage = meta?.ogImage || defaultMeta.home?.ogImage
    const ogType = (meta?.ogType || defaultMeta.home?.ogType || 'website') as 'article' | 'website'
    const twitterTitle = meta?.twitterTitle || meta?.ogTitle || meta?.title || defaultMeta.home?.twitterTitle || defaultMeta.home?.ogTitle || defaultMeta.home?.title
    const twitterDescription = meta?.twitterDescription || meta?.ogDescription || meta?.description || defaultMeta.home?.twitterDescription || defaultMeta.home?.ogDescription || defaultMeta.home?.description
    const twitterImage = meta?.twitterImage || meta?.ogImage || defaultMeta.home?.twitterImage || defaultMeta.home?.ogImage
    
    return {
        title,
        description,
        keywords: meta?.keywords || defaultMeta.home?.keywords,
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
            canonical: meta?.canonical || defaultMeta.home?.canonical,
        },
        robots: (meta?.robots || defaultMeta.home?.robots) as Metadata['robots'],
    }
}

export default function HomePage() {
    return <HomeClient />
}