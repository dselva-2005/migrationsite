// app/listing/[slug]/page.tsx (server component wrapper)
import { getCompanyBySlugServer } from "@/services/company"
import { Metadata } from 'next'
import CompanyReviewClient from './CompanyReviewClient'

// Helper function to convert backend URL to public URL
function getPublicImageUrl(imagePath: string | null | undefined): string | null {
    if (!imagePath) return null
    
    // If it's already a full URL with http/https, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        // If it's the internal backend URL, replace it
        if (imagePath.includes('backend:8000')) {
            return imagePath.replace('http://backend:8000', process.env.NEXT_PUBLIC_BASE_URL || 'https://migrationreviews.com')
        }
        return imagePath
    }
    
    // If it's a relative path, prepend the base URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://migrationreviews.com'
    return `${baseUrl}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`
}

// Generate metadata on server
export async function generateMetadata({
    params
}: {
    params: Promise<{ slug: string }> | { slug: string }
}): Promise<Metadata> {
    // Await the params if it's a Promise (Next.js 15+)
    const { slug } = await params

    try {
        console.log('Fetching company with slug:', slug) // Add logging
        const company = await getCompanyBySlugServer(slug)
        
        // Convert logo URL to public URL
        const publicLogoUrl = getPublicImageUrl(company.logo)
        
        // Create image metadata only if we have a valid public URL
        const images = publicLogoUrl ? [{
            url: publicLogoUrl,
            width: 1200,
            height: 630,
            alt: company.name,
        }] : []

        return {
            title: `${company.name} Reviews & Ratings | Migration Review`,
            description: `Read ${company.rating_count || 0} reviews for ${company.name}. Rating: ${company.rating_average || 0}/5.`,
            openGraph: {
                title: `${company.name} Reviews & Ratings`,
                description: company.description?.substring(0, 160),
                images: images.length > 0 ? images : undefined,
            },
            twitter: {
                card: 'summary_large_image',
                title: `${company.name} Reviews & Ratings`,
                description: company.description?.substring(0, 160),
                images: publicLogoUrl ? [publicLogoUrl] : undefined,
            },
            alternates: {
                canonical: `https://migrationreviews.com/listing/${slug}/`,
            }
        }
    } catch (error) {
        console.error('Error generating metadata for slug:', slug, error)
        return {
            title: 'Company Not Found | Immigration Review',
            description: 'The requested company could not be found.'
        }
    }
}

// This stays as your client component
export default async function Page({
    params
}: {
    params: Promise<{ slug: string }> | { slug: string }
}) {
    // Await the params here too
    const { slug } = await params
    return <CompanyReviewClient slug={slug} />
}