// app/listing/[slug]/page.tsx (server component wrapper)
import { getCompanyBySlugServer } from "@/services/company"
import { Metadata } from 'next'
import CompanyReviewClient from './CompanyReviewClient'

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

        return {
            title: `${company.name} Reviews & Ratings | Immigration Review`,
            description: `Read ${company.rating_count || 0} reviews for ${company.name}. Rating: ${company.rating_average || 0}/5.`,
            openGraph: {
                title: `${company.name} Reviews & Ratings`,
                description: company.description?.substring(0, 160),
                images: company.logo ? [{ url: company.logo }] : [],
            },
            twitter: {
                card: 'summary_large_image',
                title: `${company.name} Reviews & Ratings`,
                description: company.description?.substring(0, 160),
                images: company.logo ? [company.logo] : [],
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