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
                    getBlogPosts(1), // Explicitly fetch page 1
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

    // Load more posts - FIXED: Added skipCache: true
    const loadMore = useCallback(async () => {
        if (loadingMore || !hasMore) return

        setLoadingMore(true)
        try {
            const nextPage = currentPage + 1
            // IMPORTANT: Use skipCache to ensure fresh data for next pages
            const postsRes = await getBlogPosts(nextPage, { skipCache: true })
            
            setPosts(prev => [...prev, ...postsRes.results])
            setTotalCount(postsRes.count)
            setHasMore(postsRes.next !== null)
            setCurrentPage(nextPage)
        } catch (err) {
            console.error("Failed to load more posts:", err)
            // Optionally show a toast notification here
        } finally {
            setLoadingMore(false)
        }
    }, [currentPage, hasMore, loadingMore])

    return (
        <PageContentProvider page="blog">
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
                                    
                                    {/* Optional: Show post count */}
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
