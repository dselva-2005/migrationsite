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
        
        return response.data[metaKey] || null
    } catch (error) {
        console.error(`Failed to fetch meta for page ${page}:`, error)
        return null
    }
}

// Default fallback meta - using existing metadata values
export const defaultMeta: Record<string, Partial<MetaData>> = {
    home: {
        title: "Migration Reviews | Trusted Reviews of Migration Companies",
        description: "Discover trusted migration reviews and compare migration companies to find the best service providers. Make informed decisions with verified migration company.",
        ogTitle: "Migration Reviews | Trusted Reviews of Migration Companies",
        ogDescription: "Discover trusted migration reviews and compare migration companies to find the best service providers. Make informed decisions with verified migration company.",
        ogImage: "https://migrationreviews.com/opengraph-image.png",
        ogType: "website",
        twitterTitle: "Migration Reviews | Trusted Reviews of Migration Companies",
        twitterDescription: "Discover trusted migration reviews and compare migration companies to find the best service providers.",
        twitterImage: "https://migrationreviews.com/opengraph-image.png",
    },
    about: {
        title: "About Us | Migration Reviews",
        description: "Learn about Migration Reviews - your trusted platform for finding and reviewing migration services worldwide.",
        ogTitle: "About Us | Migration Reviews",
        ogDescription: "Learn about Migration Reviews - your trusted platform for finding and reviewing migration services worldwide.",
        ogImage: "https://migrationreviews.com/opengraph-image.png",
        ogType: "website",
        twitterTitle: "About Us | Migration Reviews",
        twitterDescription: "Learn about Migration Reviews - your trusted platform for finding and reviewing migration services worldwide.",
        twitterImage: "https://migrationreviews.com/opengraph-image.png",
    },
    contact: {
        title: "Contact Us | Migration Reviews",
        description: "Get in touch with our team for support, inquiries, or partnerships. We're here to help with your migration journey.",
        ogTitle: "Contact Us | Migration Reviews",
        ogDescription: "Get in touch with our team for support, inquiries, or partnerships. We're here to help with your migration journey.",
        ogImage: "https://migrationreviews.com/opengraph-image.png",
        ogType: "website",
        twitterTitle: "Contact Us | Migration Reviews",
        twitterDescription: "Get in touch with our team for support, inquiries, or partnerships.",
        twitterImage: "https://migrationreviews.com/opengraph-image.png",
    },
    visa: {
        title: "Visa Services | Migration Reviews",
        description: "Explore visa options, requirements, and find trusted migration consultants for your visa needs. Work visas, student visas, and more.",
        ogTitle: "Visa Services | Migration Reviews",
        ogDescription: "Explore visa options, requirements, and find trusted migration consultants for your visa needs. Work visas, student visas, and more.",
        ogImage: "https://migrationreviews.com/opengraph-image.png",
        ogType: "website",
        twitterTitle: "Visa Services | Migration Reviews",
        twitterDescription: "Explore visa options, requirements, and find trusted migration consultants for your visa needs.",
        twitterImage: "https://migrationreviews.com/opengraph-image.png",
    },
    countries: {
        title: "Migration Destinations | Migration Reviews",
        description: "Compare migration programs, requirements, and find consultants by destination country. Canada, Australia, UK, USA, and more.",
        ogTitle: "Migration Destinations | Migration Reviews",
        ogDescription: "Compare migration programs, requirements, and find consultants by destination country. Canada, Australia, UK, USA, and more.",
        ogImage: "https://migrationreviews.com/opengraph-image.png",
        ogType: "website",
        twitterTitle: "Migration Destinations | Migration Reviews",
        twitterDescription: "Compare migration programs, requirements, and find consultants by destination country.",
        twitterImage: "https://migrationreviews.com/opengraph-image.png",
    },
    search: {
        title: "Search Results | Migration Reviews",
        description: "Search for migration services, consultants, and reviews. Find the right migration expert for your needs.",
        ogTitle: "Search Results | Migration Reviews",
        ogDescription: "Search for migration services, consultants, and reviews. Find the right migration expert for your needs.",
        ogImage: "https://migrationreviews.com/opengraph-image.png",
        ogType: "website",
        twitterTitle: "Search Results | Migration Reviews",
        twitterDescription: "Search for migration services, consultants, and reviews.",
        twitterImage: "https://migrationreviews.com/opengraph-image.png",
    },
}
