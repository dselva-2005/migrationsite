"use client"

import { useEffect, useState, useCallback } from "react"
import { BlogPost, BlogCategory } from "@/types/blog"
import { getBlogPosts, getBlogCategories, BlogListResponse } from "@/services/blog"
import { Section } from "@/components/Section"
import { BlogList } from "@/components/blog/BlogList"
import { BlogSidebar } from "@/components/blog/BlogSidebar"
import { PageContentProvider } from "@/providers/PageContentProvider"
import { BlogListSkeleton } from "@/components/blog/BlogListSkeleton"
import { BlogSidebarSkeleton } from "@/components/blog/BlogSidebarSkeleton"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [categories, setCategories] = useState<BlogCategory[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [hasMore, setHasMore] = useState(false)

    // Load initial data
    useEffect(() => {
        let cancelled = false

        async function loadInitial() {
            try {
                const [postsRes, categoriesRes] = await Promise.all([
                    getBlogPosts(1),
                    getBlogCategories(),
                ])

                if (cancelled) return

                setPosts(postsRes.results)
                setTotalCount(postsRes.count)
                setHasMore(postsRes.next !== null)
                setCategories(categoriesRes)
                setCurrentPage(1)
            } catch (err) {
                console.error(err)
                if (!cancelled) setError("Failed to load blog data")
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        loadInitial()

        return () => {
            cancelled = true
        }
    }, [])

    // Load more posts
    const loadMore = useCallback(async () => {
        if (loadingMore || !hasMore) return

        setLoadingMore(true)
        try {
            const nextPage = currentPage + 1
            const postsRes = await getBlogPosts(nextPage, { skipCache: true })
            
            setPosts(prev => [...prev, ...postsRes.results])
            setTotalCount(postsRes.count)
            setHasMore(postsRes.next !== null)
            setCurrentPage(nextPage)
        } catch (err) {
            console.error("Failed to load more posts:", err)
        } finally {
            setLoadingMore(false)
        }
    }, [currentPage, hasMore, loadingMore])

    return (
        <PageContentProvider page="blog">
            <h1 className="sr-only">Immigration Blog — Expert Guides, Visa Tips & Consultant Advice</h1>
            
            {/* SEO Content Block — Blog Intro */}
            <Section tone="neutral">
                <div className="max-w-4xl mx-auto mb-12 text-left">
                    <div className="border-b border-border/60 pb-8">
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4">
                            Immigration Blog & Resource Hub
                        </h2>
                        <p className="text-base leading-relaxed text-muted-foreground mb-4">
                            Welcome to the Migration Reviews blog—your comprehensive resource for immigration advice, visa guides, consultant selection tips, and global migration news. Whether you're planning your first visa application, evaluating immigration consultants, or staying updated on policy changes, our blog provides actionable insights backed by real data and expert experience.
                        </p>
                        <p className="text-base leading-relaxed text-muted-foreground mb-4">
                            Our articles cover the full immigration journey: visa eligibility assessment, step-by-step application guidance for Australia, Canada, UK, USA, and other destinations, how to identify trustworthy immigration consultants, red flags to watch for, cost breakdowns, timeline expectations, and emerging immigration trends. We publish weekly articles written by immigration experts and updated regularly to reflect policy changes.
                        </p>
                        <p className="text-base leading-relaxed text-muted-foreground">
                            Start exploring our blog below, or browse by category on the right. All articles include practical checklists, comparison tables, and links to verify information on official immigration authority websites.
                        </p>
                    </div>
                </div>
            </Section>

            <Section tone="base">
                {error ? (
                    <div className="py-16 text-center text-red-500">
                        {error}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
                        <div className="xl:col-span-8">
                            {loading ? (
                                <BlogListSkeleton />
                            ) : (
                                <>
                                    <BlogList posts={posts} />
                                    
                                    {/* Pagination / Load More */}
                                    {hasMore && (
                                        <div className="mt-12 flex justify-center">
                                            <Button
                                                onClick={loadMore}
                                                disabled={loadingMore}
                                                variant="outline"
                                                size="lg"
                                                className="min-w-[200px]"
                                            >
                                                {loadingMore ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Loading...
                                                    </>
                                                ) : (
                                                    "Load More Posts"
                                                )}
                                            </Button>
                                        </div>
                                    )}
                                    
                                    {/* Post count */}
                                    <div className="mt-4 text-center text-sm text-muted-foreground">
                                        Showing {posts.length} of {totalCount} posts
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="xl:col-span-4">
                            {loading ? (
                                <BlogSidebarSkeleton />
                            ) : (
                                <BlogSidebar categories={categories} />
                            )}
                        </div>
                    </div>
                )}
            </Section>
        </PageContentProvider>
    )
}