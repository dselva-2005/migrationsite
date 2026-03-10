// app/blog/[slug]/page.tsx
import { getBlogPostServer, getBlogReviewsServer } from "@/services/blog"
import { Metadata } from 'next'
import SingleBlogClient from './SingleBlogClient'
import { BlogPost } from "@/types/blog"
import { Review } from "@/types/review"

export async function generateMetadata({ 
    params 
}: { 
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params
    
    try {
        const post = await getBlogPostServer(slug)
        
        return {
            title: `${post.title} | Immigration Review Blog`,
            description: post.excerpt || post.content.substring(0, 160),
            openGraph: {
                title: post.title,
                description: post.excerpt || post.content.substring(0, 160),
                images: post.image ? [{ url: post.image }] : [],
                type: 'article',
                publishedTime: post.date,
                authors: post.author ? [post.author] : [],
            },
            twitter: {
                card: 'summary_large_image',
                title: post.title,
                description: post.excerpt || post.content.substring(0, 160),
                images: post.image ? [post.image] : [],
            },
            alternates: {
                canonical: `https://yourdomain.com/blog/${slug}`,
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
    let error: string | null = null
    
    try {
        const [postData, reviewsData] = await Promise.all([
            getBlogPostServer(slug),
            getBlogReviewsServer(slug, 1, 4)
        ])
        post = postData
        initialReviews = reviewsData.results
    } catch (err) {
        error = err instanceof Error ? err.message : 'Failed to load blog post'
    }
    
    return (
        <SingleBlogClient 
            slug={slug}
            initialPost={post}
            initialReviews={initialReviews}
            error={error}
        />
    )
}