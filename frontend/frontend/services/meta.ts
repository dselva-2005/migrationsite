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

// Default fallback meta
export const defaultMeta: Record<string, Partial<MetaData>> = {
    home: {
        title: 'Migration Reviews | Find Trusted Migration Services',
        description: 'Read authentic reviews about migration consultants, lawyers, and services. Make informed decisions for your migration journey.',
    },
    about: {
        title: 'About Us | Migration Reviews',
        description: 'Learn about Migration Reviews - your trusted platform for finding and reviewing migration services worldwide.',
    },
    contact: {
        title: 'Contact Us | Migration Reviews',
        description: 'Get in touch with our team for support, inquiries, or partnerships. We\'re here to help with your migration journey.',
    },
    visa: {
        title: 'Visa Services | Migration Reviews',
        description: 'Explore visa options, requirements, and find trusted migration consultants for your visa needs. Work visas, student visas, and more.',
    },
    countries: {
        title: 'Migration Destinations | Migration Reviews',
        description: 'Compare migration programs, requirements, and find consultants by destination country. Canada, Australia, UK, USA, and more.',
    },
    search: {
        title: 'Search Results | Migration Reviews',
        description: 'Search for migration services, consultants, and reviews. Find the right migration expert for your needs.',
    },
}