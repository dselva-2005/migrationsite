// app/blog/[slug]/SingleBlogClient.tsx
"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation" // Add this
import { toast } from "sonner"

import { Section } from "@/components/Section"
import { TrustpilotRating } from "@/components/TrustpilotRating"
import { AddReviewModal } from "@/components/review/AddReviewModal"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

import { BlogPost } from "@/types/blog"
import { Review } from "@/types/review"
import { getBlogPost } from "@/services/blog"
import { getBlogReviews } from "@/services/review"
import { useAuth } from "@/providers/AuthProvider" // Add this

/* ---------------- Blog Skeletons ---------------- */

function BlogHeaderSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-40" />
        </div>
    )
}

function BlogImageSkeleton() {
    return (
        <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
            <Skeleton className="absolute inset-0" />
        </div>
    )
}

function BlogMetaSkeleton() {
    return <Skeleton className="h-4 w-64" />
}

function BlogContentSkeleton() {
    return (
        <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
            ))}
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
        </div>
    )
}

/* ---------------- Sidebar Skeletons ---------------- */

function ReviewCardSkeleton() {
    return (
        <div className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-1/2" />
        </div>
    )
}

function SidebarSkeleton() {
    return (
        <aside className="xl:col-span-4 sticky top-24 space-y-6">
            <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-20" />
            </div>

            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <ReviewCardSkeleton key={i} />
                ))}
            </div>
        </aside>
    )
}

function ShadowDOMRenderer({ html }: { html: string }) {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (containerRef.current && !containerRef.current.shadowRoot) {
            const shadow = containerRef.current.attachShadow({ mode: 'open' })
            const style = document.createElement('style')
            style.textContent = ``
            const content = document.createElement('div')
            content.innerHTML = html
            shadow.appendChild(style)
            shadow.appendChild(content)
        }
    }, [html])

    return <div ref={containerRef} className="w-full" />
}

function StarDisplay({ rating, size = 18 }: { rating: number; size?: number }) {
    return <TrustpilotRating rating={rating} starsize={size} />
}

interface SingleBlogClientProps {
    slug: string
    initialPost: BlogPost | null
    initialReviews: Review[]
}

export default function SingleBlogClient({ 
    slug, 
    initialPost, 
    initialReviews 
}: SingleBlogClientProps) {
    const router = useRouter()
    const { isLoggedIn, loading: authLoading } = useAuth()
    
    const [post, setPost] = useState<BlogPost | null>(initialPost)
    const [reviews, setReviews] = useState<Review[]>(initialReviews)
    const [loading, setLoading] = useState(!initialPost)
    const [openModal, setOpenModal] = useState(false)

    // Fetch blog post if not provided by server
    useEffect(() => {
        if (!slug) return
        if (initialPost) {
            setLoading(false)
            return
        }

        const fetchPost = async () => {
            setLoading(true)
            try {
                const data = await getBlogPost(slug)
                setPost(data)
            } catch (err) {
                console.error("Failed to fetch blog post:", err)
                toast.error("Failed to load blog post")
                setPost(null)
            } finally {
                setLoading(false)
            }
        }

        fetchPost()
    }, [slug, initialPost])

    // Load reviews
    const loadReviews = useCallback(async () => {
        if (!slug) return
        try {
            const data = await getBlogReviews(slug, 1, 4)
            setReviews(data.results)
        } catch (err) {
            console.error("Failed to fetch reviews:", err)
            toast.error("Failed to load reviews")
        }
    }, [slug])

    // Initial fetch for reviews if not provided by server
    useEffect(() => {
        if (!slug) return
        if (!initialReviews.length) {
            loadReviews()
        }
    }, [slug, initialReviews.length, loadReviews])

    // Handle add review click with auth check
    const handleAddReviewClick = () => {
        if (!isLoggedIn) {
            toast.error("Please login to add a review")
            router.push("/login")
            return
        }
        setOpenModal(true)
    }

    // Loading state
    if (loading || authLoading) {
        return (
            <Section>
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                    <article className="xl:col-span-8 space-y-6">
                        <BlogHeaderSkeleton />
                        <BlogImageSkeleton />
                        <BlogMetaSkeleton />
                        <BlogContentSkeleton />
                    </article>
                    <SidebarSkeleton />
                </div>
            </Section>
        )
    }

    // Not found
    if (!post) {
        return (
            <Section>
                <div className="container max-w-3xl py-12">
                    <p className="text-muted-foreground">Blog not found</p>
                </div>
            </Section>
        )
    }

    const imageSrc = post.image ?? "/images/placeholder.png"

    return (
        <Section>
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Blog Content */}
                <article className="xl:col-span-8 space-y-6">
                    <h1 className="text-3xl font-bold">{post.title}</h1>

                    <div className="flex items-center gap-2">
                        <StarDisplay rating={post.rating ?? 0} size={22} />
                        <span className="text-sm text-muted-foreground">
                            {post.reviewCount} reviews
                        </span>
                    </div>

                    <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg bg-muted">
                        <Image
                            src={imageSrc}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                            unoptimized
                        />
                    </div>

                    <div className="text-sm text-muted-foreground">
                        {new Date(post.date).toLocaleDateString()} ·{" "}
                        {post.views} views
                    </div>

                    <ShadowDOMRenderer html={post.content} />
                </article>

                {/* Sidebar */}
                <aside className="xl:col-span-4 sticky top-24 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Latest Reviews</h2>
                        <button
                            onClick={handleAddReviewClick}
                            className="text-sm text-primary hover:underline"
                        >
                            Add Review
                        </button>
                    </div>

                    {reviews.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            No reviews yet
                        </p>
                    )}

                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="border rounded-lg p-4 space-y-2"
                            >
                                <div className="flex items-center justify-between">
                                    <StarDisplay rating={review.rating} size={18} />
                                    <Badge variant="secondary">
                                        { review.author }
                                    </Badge>
                                </div>
                                <h3 className="font-medium">{review.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {review.body}
                                </p>
                                <div className="text-xs text-muted-foreground">
                                    {new Date(review.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>

            {/* Add Review Modal - only shown when logged in */}
            {openModal && slug && isLoggedIn && (
                <AddReviewModal
                    slug={slug}
                    onClose={() => setOpenModal(false)}
                    onSuccess={() => {
                        toast.success("Review submitted! Pending approval")
                        loadReviews()
                        setOpenModal(false)
                    }}
                />
            )}
        </Section>
    )
}