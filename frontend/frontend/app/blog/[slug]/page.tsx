// app/blog/[slug]/page.tsx
import { getBlogPost, getBlogReviewsServer } from "@/services/blog"
import { Metadata } from 'next'
import SingleBlogClient from './SingleBlogClient'
import { BlogPost } from "@/types/blog"
import { Review } from "@/types/review"

// Helper function to convert backend URL to public URL
function getPublicImageUrl(imagePath: string | null | undefined): string | null {
    if (!imagePath) return null
    
    // If it's already a full URL with http/https
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

export async function generateMetadata({ 
    params 
}: { 
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params
    
    try {
        const post = await getBlogPost(slug)
        
        // Convert image URL to public URL
        const publicImageUrl = getPublicImageUrl(post.image)
        
        // Create image metadata only if we have a valid public URL
        const images = publicImageUrl ? [{
            url: publicImageUrl,
            width: 1200,
            height: 630,
            alt: post.title,
        }] : []

        return {
            title: `${post.title} | Migration Review Blog`,
            description: post.excerpt || post.content.substring(0, 160),
            openGraph: {
                title: post.title,
                description: post.excerpt || post.content.substring(0, 160),
                images: images.length > 0 ? images : undefined,
                type: 'article',
                publishedTime: post.date,
                authors: post.author ? [post.author] : [],
            },
            twitter: {
                card: 'summary_large_image',
                title: post.title,
                description: post.excerpt || post.content.substring(0, 160),
                images: publicImageUrl ? [publicImageUrl] : undefined,
            },
            alternates: {
                canonical: `https://migrationreviews.com/blog/${slug}`,
            }
        }
    } catch (error) {
        return {
            title: 'Blog Post Not Found | Immigration Review',
            description: 'The requested blog post could not be found.'
        }
    }
}

export default async function Page({ 
    params 
}: { 
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    
    // Properly typed initial state
    let post: BlogPost | null = null
    let initialReviews: Review[] = []
    
    try {
        const [postData, reviewsData] = await Promise.all([
            getBlogPost(slug),
            getBlogReviewsServer(slug, 1, 4)
        ])
        post = postData
        initialReviews = reviewsData.results
    } catch (err) {
        // Just log the error, don't pass it to client
        console.error('Failed to fetch blog data:', err)
        // post and initialReviews remain null/empty, client will handle
    }
    
    return (
        <SingleBlogClient 
            slug={slug}
            initialPost={post}
            initialReviews={initialReviews}
        />
    )
}