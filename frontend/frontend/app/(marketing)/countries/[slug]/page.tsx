// app/(marketing)/countries/[slug]/page.tsx
import { getPageMeta, defaultMeta } from '@/services/meta'
import { Metadata } from 'next'
import { notFound } from "next/navigation";

const VALID_COUNTRY_SLUGS = [
    "united-states", "australia", "canada", "uae", "uk", "south-africa",
    "bahamas", "new-zealand", "germany", "ireland", "portugal", "spain",
    "slovenia", "romania",
];

const COUNTRY_DISPLAY_NAMES: Record<string, string> = {
    "united-states": "United States", "australia": "Australia", "canada": "Canada",
    "uae": "United Arab Emirates", "uk": "United Kingdom", "south-africa": "South Africa",
    "bahamas": "The Bahamas", "new-zealand": "New Zealand", "germany": "Germany",
    "ireland": "Ireland", "portugal": "Portugal", "spain": "Spain",
    "slovenia": "Slovenia", "romania": "Romania",
};

function getCountryName(slug: string): string {
    return COUNTRY_DISPLAY_NAMES[slug] || slug
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
    
    if (!VALID_COUNTRY_SLUGS.includes(slug)) {
        return {
            title: 'Country Not Found | Migration Reviews',
            description: 'The requested country page could not be found.'
        }
    }
    
    const countryName = getCountryName(slug);
    
    // Get country-specific meta (if exists) and fallback to generic countries meta
    const [countryMeta, genericMeta] = await Promise.all([
        getPageMeta('countries', slug), // Country-specific
        getPageMeta('countries')         // Generic fallback
    ])
    
    const meta = countryMeta || genericMeta
    
    // Replace variables if needed (for generic meta with {{country}})
    const replaceVars = (text?: string) => {
        if (!text) return undefined;
        return text.replace(/{{country}}/g, countryName);
    }
    
    const title = replaceVars(meta?.title) || `Migration to ${countryName} | Migration Reviews`
    const description = replaceVars(meta?.description) || `Complete guide to migrating to ${countryName}. Find trusted migration consultants, visa requirements, and read authentic reviews.`
    const ogImage = meta?.ogImage || defaultMeta.countries?.ogImage
    
    return {
        title,
        description,
        keywords: meta?.keywords,
        openGraph: {
            title: replaceVars(meta?.ogTitle) || title,
            description: replaceVars(meta?.ogDescription) || description,
            images: ogImage ? [{ url: ogImage }] : [],
            type: (meta?.ogType || 'website') as 'article' | 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: replaceVars(meta?.twitterTitle) || replaceVars(meta?.ogTitle) || title,
            description: replaceVars(meta?.twitterDescription) || replaceVars(meta?.ogDescription) || description,
            images: meta?.twitterImage || meta?.ogImage || defaultMeta.countries?.twitterImage,
        },
        alternates: {
            canonical: meta?.canonical || `https://migrationreviews.com/countries/${slug}`,
        },
        robots: meta?.robots as Metadata['robots'],
    }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    
    if (!VALID_COUNTRY_SLUGS.includes(slug)) {
        notFound();
    }
    
    const countryName = getCountryName(slug);
    
    const PageContentProvider = (await import("@/providers/PageContentProvider")).PageContentProvider;
    const ClientPageWrapper = (await import("./ClientPageWrapper")).default;

    return (
        <PageContentProvider page="countries" country={slug}>
            <ClientPageWrapper countryName={countryName} />
        </PageContentProvider>
    );
}