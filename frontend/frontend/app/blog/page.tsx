"use client"

import { useEffect, useState } from "react"
import { BlogPost, BlogCategory } from "@/types/blog"
import { getBlogPosts, getBlogCategories } from "@/services/blog"
import { Section } from "@/components/Section"
import { BlogList } from "@/components/blog/BlogList"
import { BlogSidebar } from "@/components/blog/BlogSidebar"
import { PageContentProvider } from "@/providers/PageContentProvider"
import { BlogListSkeleton } from "@/components/blog/BlogListSkeleton"
import { BlogSidebarSkeleton } from "@/components/blog/BlogSidebarSkeleton"

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [categories, setCategories] = useState<BlogCategory[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false

        async function load() {
            try {
                const [postsRes, categoriesRes] = await Promise.all([
                    getBlogPosts(),
                    getBlogCategories(),
                ])

                if (cancelled) return

                setPosts(postsRes.results)
                setCategories(categoriesRes)
            } catch (err) {
                console.error(err)
                if (!cancelled) setError("Failed to load blog data")
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        load()

        return () => {
            cancelled = true
        }
    }, [])

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
                                <BlogList posts={posts} />
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
