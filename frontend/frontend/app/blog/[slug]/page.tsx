"use client"

import { useEffect, useState, useCallback } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"

import { Section } from "@/components/Section"
import { TrustpilotRating } from "@/components/TrustpilotRating"
import { AddReviewModal } from "@/components/review/AddReviewModal"
import { Badge } from "@/components/ui/badge"

import { BlogPost } from "@/types/blog"
import { Review } from "@/types/review"
import { getBlogPost } from "@/services/blog"
import { getBlogReviews } from "@/services/review"

// ------------------------------------
// Read-only star display
// ------------------------------------
function StarDisplay({
    rating,
    size = 18,
}: {
    rating: number
    size?: number
}) {
    return <TrustpilotRating rating={rating} starsize={size} />
}

export default function SingleBlog() {
    const pathname = usePathname()
    const slug = pathname?.split("/").filter(Boolean).pop()

    const [post, setPost] = useState<BlogPost | null>(null)
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [openModal, setOpenModal] = useState(false)

    // ------------------------------------
    // Fetch blog post
    // ------------------------------------
    useEffect(() => {
        if (!slug) return

        const fetchPost = async () => {
            setLoading(true)
            try {
                const data = await getBlogPost(slug)
                setPost(data)
            } catch (err) {
                console.error("Failed to fetch blog post:", err)
                setPost(null)
            } finally {
                setLoading(false)
            }
        }

        fetchPost()
    }, [slug])

    // ------------------------------------
    // Fetch top 4 reviews
    // ------------------------------------
    const loadReviews = useCallback(async () => {
        if (!slug) return
        try {
            const data = await getBlogReviews(slug, 1, 4)
            setReviews(data.results)
        } catch (err) {
            console.error("Failed to fetch reviews:", err)
        }
    }, [slug])

    useEffect(() => {
        loadReviews()
    }, [loadReviews])

    // ------------------------------------
    // Loading / Not Found
    // ------------------------------------
    if (loading) {
        return (
            <Section>
                <div className="container max-w-3xl py-12">
                    <p className="text-muted-foreground">Loading…</p>
                </div>
            </Section>
        )
    }

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
                {/* ---------------- Blog Content ---------------- */}
                <article className="xl:col-span-8 space-y-6">
                    <h1 className="text-3xl font-bold">{post.title}</h1>

                    <div className="flex items-center gap-2">
                        <StarDisplay rating={post.rating ?? 0} size={22} />
                        <span className="text-sm text-muted-foreground">
                            {post.reviewCount} reviews
                        </span>
                    </div>

                    {/* Featured Image */}
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
                        {post.author} ·{" "}
                        {new Date(post.date).toLocaleDateString()} ·{" "}
                        {post.views} views
                    </div>

                    <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </article>

                {/* ---------------- Sidebar ---------------- */}
                <aside className="xl:col-span-4 sticky top-24 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Latest Reviews</h2>
                        <button
                            onClick={() => setOpenModal(true)}
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
                                    <StarDisplay
                                        rating={review.rating}
                                        size={18}
                                    />
                                    <Badge variant="secondary">
                                        {review.author}
                                    </Badge>
                                </div>

                                <h3 className="font-medium">
                                    {review.title}
                                </h3>

                                <p className="text-sm text-muted-foreground">
                                    {review.body}
                                </p>

                                <div className="text-xs text-muted-foreground">
                                    {new Date(
                                        review.created_at
                                    ).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>

            {/* ---------------- Add Review Modal ---------------- */}
            {openModal && slug && (
                <AddReviewModal
                    slug={slug}
                    onClose={() => setOpenModal(false)}
                    onSuccess={() => {
                        loadReviews()
                        setOpenModal(false)
                    }}
                />
            )}
        </Section>
    )
}
