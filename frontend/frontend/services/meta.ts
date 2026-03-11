// services/meta.ts
import { getServerApi } from "@/lib/serverApi"

export interface MetaData {
    title: string
    description: string
    keywords?: string[]
    ogTitle?: string
    ogDescription?: string
    ogImage?: string
    ogType?: string
    twitterTitle?: string
    twitterDescription?: string
    twitterImage?: string
    canonical?: string
    robots?: string
}

// Define the response type from the API
interface MetaResponse {
    [key: string]: MetaData
}

// Helper to convert image URLs to public URLs
function getPublicImageUrl(imagePath: string | null | undefined): string | null {
    if (!imagePath) return null
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://migrationreviews.com'
    
    // If it's already a full URL
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        // If it's the internal backend URL, replace it
        if (imagePath.includes('backend:8000')) {
            return imagePath.replace('http://backend:8000', baseUrl)
        }
        return imagePath
    }
    
    // If it's a relative path starting with /media, prepend base URL
    if (imagePath.startsWith('/media/')) {
        return `${baseUrl}${imagePath}`
    }
    
    // If it's any other relative path
    return `${baseUrl}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`
}

// Process meta data to ensure all image URLs are public
function processMetaImages(meta: MetaData | null): MetaData | null {
    if (!meta) return null
    
    return {
        ...meta,
        ogImage: getPublicImageUrl(meta.ogImage) || undefined,
        twitterImage: getPublicImageUrl(meta.twitterImage) || undefined,
    }
}

// Server-side only fetch for SSR pages
export async function getPageMeta(page: string, country?: string): Promise<MetaData | null> {
    try {
        const serverApi = getServerApi()
        const params = new URLSearchParams()
        if (country) {
            params.append('country', country)
        }
        
        const response = await serverApi.get<MetaResponse>(`/api/content/meta/?${params.toString()}`)
        
        const metaKey = `${page}.meta`
        const rawMeta = response.data[metaKey] || null
        
        // Process the meta to ensure public image URLs
        return processMetaImages(rawMeta)
    } catch (error) {
        console.error(`Failed to fetch meta for page ${page}:`, error)
        return null
    }
}

// Processed default fallback meta
export const defaultMeta: Record<string, MetaData> = {
    home: processMetaImages({
        title: "Migration Reviews | Trusted Reviews of Migration Companies",
        description: "Discover trusted migration reviews and compare migration companies to find the best service providers. Make informed decisions with verified migration company.",
        ogTitle: "Migration Reviews | Trusted Reviews of Migration Companies",
        ogDescription: "Discover trusted migration reviews and compare migration companies to find the best service providers. Make informed decisions with verified migration company.",
        ogImage: "https://migrationreviews.com/opengraph-image.png",
        ogType: "website",
        twitterTitle: "Migration Reviews | Trusted Reviews of Migration Companies",
        twitterDescription: "Discover trusted migration reviews and compare migration companies to find the best service providers.",
        twitterImage: "https://migrationreviews.com/opengraph-image.png",
    })!,
    about: processMetaImages({
        title: "About Us | Migration Reviews",
        description: "Learn about Migration Reviews - your trusted platform for finding and reviewing migration services worldwide.",
        ogTitle: "About Us | Migration Reviews",
        ogDescription: "Learn about Migration Reviews - your trusted platform for finding and reviewing migration services worldwide.",
        ogImage: "https://migrationreviews.com/opengraph-image.png",
        ogType: "website",
        twitterTitle: "About Us | Migration Reviews",
        twitterDescription: "Learn about Migration Reviews - your trusted platform for finding and reviewing migration services worldwide.",
        twitterImage: "https://migrationreviews.com/opengraph-image.png",
    })!,
    contact: processMetaImages({
        title: "Contact Us | Migration Reviews",
        description: "Get in touch with our team for support, inquiries, or partnerships. We're here to help with your migration journey.",
        ogTitle: "Contact Us | Migration Reviews",
        ogDescription: "Get in touch with our team for support, inquiries, or partnerships. We're here to help with your migration journey.",
        ogImage: "https://migrationreviews.com/opengraph-image.png",
        ogType: "website",
        twitterTitle: "Contact Us | Migration Reviews",
        twitterDescription: "Get in touch with our team for support, inquiries, or partnerships.",
        twitterImage: "https://migrationreviews.com/opengraph-image.png",
    })!,
    visa: processMetaImages({
        title: "Visa Services | Migration Reviews",
        description: "Explore visa options, requirements, and find trusted migration consultants for your visa needs. Work visas, student visas, and more.",
        ogTitle: "Visa Services | Migration Reviews",
        ogDescription: "Explore visa options, requirements, and find trusted migration consultants for your visa needs. Work visas, student visas, and more.",
        ogImage: "https://migrationreviews.com/opengraph-image.png",
        ogType: "website",
        twitterTitle: "Visa Services | Migration Reviews",
        twitterDescription: "Explore visa options, requirements, and find trusted migration consultants for your visa needs.",
        twitterImage: "https://migrationreviews.com/opengraph-image.png",
    })!,
    countries: processMetaImages({
        title: "Migration Destinations | Migration Reviews",
        description: "Compare migration programs, requirements, and find consultants by destination country. Canada, Australia, UK, USA, and more.",
        ogTitle: "Migration Destinations | Migration Reviews",
        ogDescription: "Compare migration programs, requirements, and find consultants by destination country. Canada, Australia, UK, USA, and more.",
        ogImage: "https://migrationreviews.com/opengraph-image.png",
        ogType: "website",
        twitterTitle: "Migration Destinations | Migration Reviews",
        twitterDescription: "Compare migration programs, requirements, and find consultants by destination country.",
        twitterImage: "https://migrationreviews.com/opengraph-image.png",
    })!,
    search: processMetaImages({
        title: "Search Results | Migration Reviews",
        description: "Search for migration services, consultants, and reviews. Find the right migration expert for your needs.",
        ogTitle: "Search Results | Migration Reviews",
        ogDescription: "Search for migration services, consultants, and reviews. Find the right migration expert for your needs.",
        ogImage: "https://migrationreviews.com/opengraph-image.png",
        ogType: "website",
        twitterTitle: "Search Results | Migration Reviews",
        twitterDescription: "Search for migration services, consultants, and reviews.",
        twitterImage: "https://migrationreviews.com/opengraph-image.png",
    })!,
}

// Helper function to get meta with fallback
export function getMetaWithFallback(page: string, customMeta?: Partial<MetaData>): MetaData {
    const baseMeta = defaultMeta[page] || defaultMeta.home
    
    if (!customMeta) return baseMeta
    
    // Merge custom meta with base, ensuring images are processed
    const merged = {
        ...baseMeta,
        ...customMeta,
        ogImage: customMeta.ogImage 
            ? getPublicImageUrl(customMeta.ogImage) || baseMeta.ogImage
            : baseMeta.ogImage,
        twitterImage: customMeta.twitterImage 
            ? getPublicImageUrl(customMeta.twitterImage) || baseMeta.twitterImage
            : baseMeta.twitterImage,
    }
    
    return merged as MetaData
}