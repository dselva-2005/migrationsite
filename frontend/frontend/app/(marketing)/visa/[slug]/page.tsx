// app/(marketing)/visa/[slug]/page.tsx
import { getPageMeta, defaultMeta } from '@/services/meta'
import { Metadata } from 'next'
import { notFound } from "next/navigation"
import { PageContentProvider } from "@/providers/PageContentProvider"
import Hero from "./hero"
import LeftSidebar from "./leftSidebar"
import RightContent from "./rightContent"
import { VISA_ROUTE_MAP } from "@/lib/visaRoutes"

function getVisaDisplayName(slug: string): string {
    return VISA_ROUTE_MAP[slug] || slug
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export async function generateMetadata({ 
    params 
}: { 
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params;
    
    if (!VISA_ROUTE_MAP[slug]) {
        return {
            title: 'Visa Type Not Found | Migration Reviews',
            description: 'The requested visa type could not be found.'
        }
    }
    
    const visaName = getVisaDisplayName(slug);
    
    // Get visa-specific meta and fallback to generic visa meta
    const [visaMeta, genericMeta] = await Promise.all([
        getPageMeta('visa', slug), // Specific meta for this visa type
        getPageMeta('visa')         // Generic visa meta fallback
    ])
    
    const meta = visaMeta || genericMeta
    
    // Replace variables in meta strings
    const replaceVars = (text?: string) => {
        if (!text) return undefined;
        return text
            .replace(/{{visa}}/g, visaName)
            .replace(/{{slug}}/g, slug);
    }
    
    const title = replaceVars(meta?.title) || `${visaName} Guide | Migration Reviews`
    const description = replaceVars(meta?.description) || `Complete guide to ${visaName}. Learn about requirements, application process, and find trusted migration consultants for your ${visaName} application.`
    const ogTitle = replaceVars(meta?.ogTitle) || title
    const ogDescription = replaceVars(meta?.ogDescription) || description
    const ogImage = meta?.ogImage || defaultMeta.visa?.ogImage
    const ogType = (meta?.ogType || defaultMeta.visa?.ogType || 'website') as 'article' | 'website'
    const twitterTitle = replaceVars(meta?.twitterTitle) || ogTitle
    const twitterDescription = replaceVars(meta?.twitterDescription) || ogDescription
    const twitterImage = meta?.twitterImage || meta?.ogImage || defaultMeta.visa?.twitterImage || defaultMeta.visa?.ogImage
    const canonical = meta?.canonical || `https://yourdomain.com/visa/${slug}`
    const robots = meta?.robots as Metadata['robots']
    
    return {
        title,
        description,
        keywords: meta?.keywords,
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
            canonical,
        },
        robots,
    }
}

export default async function Page({ 
    params 
}: { 
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    
    if (!VISA_ROUTE_MAP[slug]) {
        notFound();
    }

    return (
        <PageContentProvider page="visa" country={slug}>
            {/* HERO */}
            <Hero slug={slug} />

            {/* PAGE BODY */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 py-20 px-8">
                {/* LEFT SIDEBAR */}
                <aside className="lg:col-span-4">
                    <LeftSidebar />
                </aside>

                {/* RIGHT CONTENT */}
                <main className="lg:col-span-8">
                    <RightContent/>
                </main>
            </div>
        </PageContentProvider>
    )
}